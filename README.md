# 嘘つきクイズタワー

問題文や選択肢がときどき嘘をつく、ブラウザ完結型のクイズゲームです。

## 遊び方

`index.html` をブラウザで開くとすぐに遊べます。

- 全8問のタワー形式
- 問題文が本当とは限らない
- ヒント使用回数と正解数を記録
- クリア後に結果を表示

## GitHub Pagesで公開する方法

1. このフォルダをGitHubリポジトリにpushします。
2. GitHubのリポジトリ画面で `Settings` を開きます。
3. `Pages` を開きます。
4. `Build and deployment` の `Source` を `Deploy from a branch` にします。
5. `Branch` を `main`、フォルダを `/root` にして保存します。
6. 表示されたURLにアクセスすると公開ページを確認できます。

## ファイル構成

- `index.html`: 画面構造
- `style.css`: 見た目とレスポンシブ対応
- `script.js`: クイズ進行、採点、ヒント、結果表示
