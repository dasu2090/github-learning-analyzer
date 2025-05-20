✅ Phase 1：GitHub OAuth 認証の実装

## 🎯 目的

ユーザーが自分の GitHub アカウントを使ってログインできるようにし、本人確認とGitHub連携のベースを作る。この認証は、後続のGitHub API呼び出し（リポジトリ分析など）のために必要。

### 🏗️ 技術構成

| 項目 | 内容 |
| ---- | ---- |
| フレームワーク | Next.js（App Router 構成、src/app/ を使用） |
| 認証ライブラリ | next-auth（v4以降、App Router対応） |
| 認証プロバイダー | GitHub（OAuth アプリによるログイン） |
| 環境変数 | .env.local にクライアントID・シークレット・URL・シークレットキーを定義 |

### 🔧 実装手順（まとめ）

#### 1. GitHub OAuth App を作成（https://github.com/settings/developers）

- アプリ名：Learning Repo Tracker
- Callback URL：http://localhost:3000/api/auth/callback/github
- 取得項目：プロフィール、メールアドレス

取得した以下の値を .env.local に設定：

```
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=yyyyy
NEXTAUTH_SECRET=適当なランダム文字列
NEXTAUTH_URL=http://localhost:3000
```

#### 2. APIルートの作成（NextAuth.js）

ファイル：src/app/api/auth/[...nextauth]/route.ts

```ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
```

#### 3. UI側の設定（ログインUIの構築）

ファイル：src/app/page.tsx

```ts
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
```

### ✅ 動作確認ポイント

チェック項目
- GitHubログインボタンが表示されるか
- GitHubの認可画面が表示されるか
- ログイン成功後にユーザー名が表示されるか
- ログアウト機能が正常に動作するか

### ✨ このフェーズの成果
- GitHubユーザーが安全にログイン可能な状態になった
- アプリ側でセッション情報を保持できるようになった
- 次のフェーズ（GitHub APIによるデータ取得）に進むための「認証トークンの土台」が完成した
