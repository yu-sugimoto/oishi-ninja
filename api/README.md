# Oishi-Ninja API

Python の Flask を使って API サーバーを構築します。

pyenv を使って環境構築します。

# ローカルでの開発

## AWS CLI のインストール

### macOS

1. AWS CLI をダウンロードしてインストール。
   ```bash
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /
   ```
2. インストール後にバージョンを確認。
   ```bash
   aws --version
   ```

### Linux

1. AWS CLI をダウンロードしてインストール。
   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```
2. インストール後にバージョンを確認。
   ```bash
   aws --version
   ```

### Windows

1. [AWS CLI インストーラー](https://awscli.amazonaws.com/AWSCLIV2.msi) をダウンロードして実行。
2. インストール後にバージョンを確認。
   ```powershell
   aws --version
   ```

---

## 認証情報の取得


### ログイン
[AWS マネジメントコンソール](https://aws.amazon.com/jp/console/) にログインする。

### セキュリティクレデンシャルページを開く
1. 右上のアカウント名またはアイコンをクリックする。
2. メニューから「マイセキュリティクレデンシャル」を選択する。

### 認証情報の確認
- **アクセスキー**: 「アクセスキー（アクセスキー ID とシークレットアクセスキー）」セクションで自分のアクセスキーを確認できる。
- **パスワードポリシー**: 「パスワード」セクションで自分のパスワードポリシーを確認できる。

---

## 認証情報の設定

1. AWS アカウントの IAM ユーザーを作成し、アクセスキーとシークレットキーを取得。
2. AWS CLI で認証情報を設定。
   ```bash
   aws configure
   ```
   以下のプロンプトに応答して設定を完了。
   ```
   AWS Access Key ID [None]: <アクセスキー>
   AWS Secret Access Key [None]: <シークレットキー>
   Default region name [None]: <リージョン名> (例: ap-northeast-1)
   Default output format [None]: json
   ```

3. 設定内容を確認。
   ```bash
   cat ~/.aws/credentials
   ```

---

## SSM セッションマネージャーのインストール

### macOS

1. Session Manager プラグインをインストール。
   ```bash
   curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/mac/session-manager-plugin.pkg" -o "session-manager-plugin.pkg"
   sudo installer -pkg session-manager-plugin.pkg -target /
   ```
2. バージョンを確認。
   ```bash
   session-manager-plugin --version
   ```

### Linux

1. Session Manager プラグインをインストール。
   ```bash
   curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm" -o "session-manager-plugin.rpm"
   sudo yum install -y session-manager-plugin.rpm
   ```
2. バージョンを確認。
   ```bash
   session-manager-plugin --version
   ```

### Windows

1. [Session Manager プラグイン](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) をダウンロードしてインストール。
2. バージョンを確認。
   ```powershell
   session-manager-plugin --version
   ```

---

## データベースエンドポイントの確認

### 1. AWS マネジメントコンソールにログイン
- [AWS マネジメントコンソール](https://aws.amazon.com/jp/console/) にアクセスし、IAM ユーザーまたはルートユーザーでログインする。

### 2. RDS サービスページを開く
- コンソール画面の上部にある検索バーに「RDS」と入力して選択。

### 3. データベース一覧を表示
- 左側のメニューから「データベース」をクリック。

### 4. 確認したいデータベースを選択
- 一覧から該当のデータベースをクリックして詳細画面を開く。

### 5. エンドポイントの確認
- 「データベースの接続」セクションを探す。
- 「エンドポイント」と「ポート」を確認できる。
  - エンドポイント: `<database-endpoint>`
  - ポート: 通常は `5432` (PostgreSQL) または `3306` (MySQL)。

### 6. エンドポイント情報をコピー
- エンドポイントをコピーして、CLI やクライアントソフトでの接続設定に使用する。

---

### EC2 インスタンスの ID の確認

1. AWS マネジメントコンソールにログイン。
2. EC2 サービスページを開く。
3. インスタンス一覧から対象のインスタンスを選択。
4. インスタンスの詳細ページの URL に含まれるインスタンス ID を確認。

---

## ポートフォワーディングの実行

1. プロキシとして使用する EC2 インスタンスにポートフォワーディングを開始。
   ```bash
   aws ssm start-session \
       --target "i-xxxxxxxxxxxxxxxxx" \
       --document-name "AWS-StartPortForwardingSessionToRemoteHost" \
       --parameters '{"host":["<RDSエンドポイント>"],"portNumber":["5432"],"localPortNumber":["5432"]}'
   ```
   - `i-xxxxxxxxxxxxxxxxx`: EC2 インスタンスの ID。
   - `<RDSエンドポイント>`: RDS のエンドポイント。
   - `5432`: PostgreSQL のポート番号（必要に応じて変更）。

2. トンネリングが成功したらローカルマシンのポートを使用して接続可能。

---

## PostgreSQL の疎通確認

1. PostgreSQL に接続。
   ```bash
   psql -h 127.0.0.1 -p 5432 -U <ユーザー名> -d <データベース名>
   ```
2. 接続が成功した場合、PostgreSQL のプロンプトが表示される。

   例:
   ```
   psql (13.3)
   Type "help" for help.

   <データベース名>=>
   ```

---
