'use client';

import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

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
    </main>
  );
}
