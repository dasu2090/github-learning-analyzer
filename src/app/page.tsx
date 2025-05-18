// src/app/page.tsx
'use client';

import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

export default function Page() {
  return (
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  );
}

function HomePage() {
  const { data: session } = useSession();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>GitHub 学習リポジトリ分析ツール</h1>
      {session ? (
        <>
          <p>こんにちは、{session.user?.name} さん</p>
          <button onClick={() => signOut()}>ログアウト</button>
        </>
      ) : (
        <>
          <p>ログインして始めましょう</p>
          <button onClick={() => signIn('github')}>GitHubでログイン</button>
        </>
      )}
    </main>
  );
}
