'use client';

import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { fetchContributionCalendar } from '@/lib/github';
import ContributionHeatmap from '@/components/ContributionHeatmap';
import dynamic from 'next/dynamic';

// 🔽 Dynamic import
const LanguageChart = dynamic(() => import('@/components/LanguageChart'), { ssr: false });

export default function Page() {
  return (
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  );
}

function HomePage() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any>(null);
  const [languageStats, setLanguageStats] = useState<any>(null);

  // 🔽 リポジトリ一覧取得（publicのみフィルタ）
  useEffect(() => {
    if (session?.accessToken) {
      fetch('https://api.github.com/user/repos?per_page=100&visibility=public', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const publicRepos = data.filter((repo: any) => !repo.private);
            setRepos(publicRepos);
          } else {
            console.error('Unexpected repo data:', data);
          }
        });
    }
  }, [session]);

  // 🔽 使用言語取得と割合計算
  useEffect(() => {
    if (session?.accessToken && repos.length > 0) {
      import('@/lib/github').then(({ fetchLanguagesForAllRepos }) => {
        fetchLanguagesForAllRepos(session.accessToken, repos).then((languageMap) => {
          const total = Object.values(languageMap).reduce((sum, v) => sum + v, 0);

            const percentages = Object.entries(languageMap).reduce((acc: any[], [lang, bytes]) => {
              const percentage = (bytes as number) / total * 100;
              if (percentage < 1) {
                const other = acc.find((a) => a.language === 'Other');
                if (other) {
                  other.percentage += percentage;
                } else {
                  acc.push({ language: 'Other', percentage });
                }
              } else {
                acc.push({ language: lang, percentage });
              }
              return acc;
            }, []).map(item => ({
              language: item.language,
              percentage: item.percentage.toFixed(2),
            }));

          setLanguageStats(percentages);
        });
      });
    }
  }, [session, repos]);

  // 🔽 コントリビューションカレンダー取得
  useEffect(() => {
    if (session?.accessToken) {
      fetchContributionCalendar(session.accessToken).then((calendar) => {
        console.log('Contributions:', calendar);
        setContributions(calendar);
      });
    }
  }, [session]);

  // 🔽 未ログイン時
  if (!session) {
    return (
      <main className="p-4">
        <p>ログインしてGitHubリポジトリを分析しましょう</p>
        <button onClick={() => signIn('github')} className="mt-2 bg-black text-white px-4 py-2 rounded">
          GitHubでログイン
        </button>
      </main>
    );
  }

  // 🔽 ログイン後の画面
  return (
    <main className="p-4">
      <p className="text-lg font-semibold mb-2">{session.user?.name} さんのパブリックリポジトリ一覧：</p>
      <button onClick={() => signOut()} className="mb-4 bg-gray-200 px-3 py-1 rounded">
        ログアウト
      </button>

      <ul className="list-disc pl-5 mb-6">
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {repo.name}
            </a>{' '}
            - {repo.description}
          </li>
        ))}
      </ul>

      {contributions && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-2">1年間の貢献ヒートマップ</h2>
          <ContributionHeatmap contributions={contributions} />
        </section>
      )}

      {languageStats && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-2">使用言語の割合</h2>
          <LanguageChart data={languageStats} />
        </section>
      )}
    </main>
  );
}
