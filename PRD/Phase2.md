✅ Phase 2：GitHub API によるデータ取得と表示

## 🎯 目的

ログインした GitHub ユーザーの パブリックリポジトリ一覧を取得し、アプリ内で可視化する。
このフェーズでは、ユーザーの GitHub アカウントから「どんな学習をしてきたのか」を知るためのベースとなるデータを取得します。

### 🏗️ 技術構成（このフェーズ）

| 項目 | 内容 |
| ---- | ---- |
| データ取得方法 | GitHub REST API（https://api.github.com/user/repos） |
| 認証方法 | NextAuthで取得したアクセストークンを使ったAPIリクエスト |
| 使用ライブラリ | next-auth, fetch, useEffect, useSession |
| 表示形式 | クライアント上にリポジトリ一覧をテーブル or カードで表示 |

### 🔧 実装ステップ

#### ① アクセストークンを取得するカスタム hook を追加

ファイル：src/lib/github.ts

```ts
export async function fetchUserRepos(accessToken: string) {
  const res = await fetch('https://api.github.com/user/repos?per_page=100', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!res.ok) {
    throw new Error('GitHub APIからリポジトリを取得できませんでした。');
  }

  return await res.json();
}
```

#### ② page.tsx にデータ取得と表示処理を追加

```ts
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
```

#### ③ next-auth 設定でトークンをセッションに追加する

ファイル：src/app/api/auth/[...nextauth]/route.ts

```
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### ✅ 動作確認ポイント

- GitHub ログイン後に、ユーザー名とともにリポジトリ一覧が表示される
- 各リポジトリ名に GitHub ページへのリンクが貼られている
- ログアウトボタンでセッションを終了できる

### ✨ このフェーズで得られる成果

- 認証済みユーザーのリポジトリ一覧を取得し、アプリで表示できる
- 次のステップ（学習用リポジトリの抽出、分析）へ進む準備が整う
