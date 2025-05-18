'use client';

import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { fetchContributionCalendar } from '@/lib/github';
import ContributionHeatmap from '@/components/ContributionHeatmap';

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
  const [contributions, setContributions] = useState<any>(null); // ← state追加

  // リポジトリ取得
  useEffect(() => {
    if (session?.accessToken) {
      fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRepos(data);
        });
    }
  }, [session]);

  // 🆕 コントリビューションカレンダー取得
  useEffect(() => {
    if (session?.accessToken) {
      fetchContributionCalendar(session.accessToken).then((calendar) => {
        console.log('Contributions:', calendar); // ← 確認用ログ
        setContributions(calendar); // ← stateに保存
      });
    }
  }, [session]);

  if (!session) {
    return (
      <main>
        <p>ログインしてGitHubリポジトリを分析しましょう</p>
        <button onClick={() => signIn('github')}>GitHubでログイン</button>
      </main>
    );
  }

  return (
    <main>
      <p>{session.user?.name} さんのリポジトリ一覧：</p>
      <button onClick={() => signOut()}>ログアウト</button>

      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
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
    </main>
  );
}
