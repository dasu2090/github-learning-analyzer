This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


「GitHub学習リポジトリ分析ツール」
このツールの魅力

1. 「自分の学習はコードで証明できる」

- 日々の学習成果（コミット）をGitHubから自動取得
- コードを使った「ポートフォリオ型学習記録」ができる
- GitHub Contribution風の可視化でやる気アップ

2. 学習リポジトリを“タグ”で分類

- たとえば「React学習」「AWS資格」「LeetCode」など
- 学習テーマごとに進捗を確認可能
- 同じテーマのリポジトリを横断して分析できる

3. リポジトリごとのメモ（日記）機能

- 今日は何を学んだのか、何に詰まったのかを記録
- 後から振り返って学習ログとして活用できる

4. 使用言語・技術スタックの可視化

- 自分がどんな技術にどれだけ触れてきたか一目でわかる
- 成長の傾向や偏りを分析できる

5. GitHubと連携するだけで自動化

- 手動入力が少ない
- リポジトリを登録すれば後はコミットや更新を自動取得

ターゲットユーザー
| タイプ | 利用目的 |
| ---- | ---- |
| エンジニア志望の学習者 | 自己学習の記録と可視化、就活ポートフォリオに |
| 若手エンジニア | 資格取得や技術習得の進捗管理に |
| 学習コミュニティの運営者 | 参加者の活動分析やフィードバックに |
| 転職活動中の人 | “成果物”＋“取り組み履歴”の両面提示ができる |


類似サービスとの違い

| サービス | 特徴 |
| ---- | ---- |
| GitHubの標準Contribution Graph | 全リポジトリ対象。目的や内容がわからない |
| Qiita/Zennなどの技術記事 | まとめに強いが、日々の活動ログとしては弱い |
| NotionやGoogle Docs | 手動記録。コード連携や分析ができない |
| 本ツール | コード学習の活動記録 × 自動可視化 × メモによる内省 |


技術的におもしろいポイント

- GitHub API活用による「行動ログの収集」
- タグやメモなどメタデータの追加で学習を文脈化
- グラフやチャートでのデータビジュアライズ（Recharts, Chart.jsなど）
- Supabase/FirebaseなどクラウドDBの活用
- Next.jsなどのモダンフロントでのMVP構築

全体像を一文でまとめると？

「自分のGitHubリポジトリを学習ログとして再定義し、成長を“見える化”できるセルフラーニングダッシュボード」


