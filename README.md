# Oishi-Ninja

留学生向けの国別レシピサイト

# プロジェクトの構成

各プロジェクトの詳細はディレクトリ内を確認。

- `api/` : APIサーバー
- `client/` : クライアントサイド

## API サーバー

Python の Flask を使って API サーバーを構築します。

## クライアントサイド

Vue を使ってクライアントサイドを構築します。

# AWS上のRDSに接続する方法

RDS に対してローカルからアクセスする場合は、ポートフォワーディングを使用してトンネリングを行う必要がある。

次の手順でポートフォワーディングを行う。

1. AWS CLI のインストール
2. 認証情報の設定
3. SSM セッションマネージャーの設定
4. 接続先の確認
5. ポートフォワーディングの実行
6. PostgreSQL の疎通確認

## AWS CLI のインストール

### macOS

1. AWS CLI をダウンロードしてインストール。
   ```bash
   % curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   % sudo installer -pkg AWSCLIV2.pkg -target /
   ```
2. インストール後にバージョンを確認。
   ```bash
   % aws --version
   ```

### Linux

1. AWS CLI をダウンロードしてインストール。
   ```bash
   $ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   $ unzip awscliv2.zip
   $ sudo ./aws/install
   ```
2. インストール後にバージョンを確認。
   ```bash
   $ aws --version
   ```

### Windows

1. [AWS CLI インストーラー](https://awscli.amazonaws.com/AWSCLIV2.msi) をダウンロードして実行。
2. インストール後にバージョンを確認。
   ```powershell
   > aws --version
   ```

---

## 認証情報の設定

IAMで対象のサービスに対して十分な権限がある前提とする。次の手順で問題がある場合はAWSアカウント管理者に問い合わせる。

### アクセスキーの取得

アクセスキーとシークレットキーを取得する。

1. [AWS マネジメントコンソール](https://aws.amazon.com/jp/console/) にログインする。
2. 右上のアカウント名またはアイコンをクリックして、ドロップダウンメニューを開く。
3. 「セキュリティ認証情報」をクリックして、セキュリティ認証情報を開く。
4. アクセスキーのセクションで「アクセスキーの作成」をクリックして、アクセスキーとシークレットキーを取得する。
5. コマンドラインインターフェイス (CLI) で認証情報を設定する。
6. .csv ファイルをダウンロードして、認証情報を確認する。

### 認証情報の設定

1. AWS CLI で認証情報を設定する。
   ```bash
   aws configure
   ```
   以下のプロンプトに応答して設定を完了する。
   ```
   AWS Access Key ID [None]: <アクセスキー>
   AWS Secret Access Key [None]: <シークレットキー>
   Default region name [None]: <リージョン名> (例: ap-northeast-1)
   Default output format [None]: json
   ```
2. 設定内容を確認する。
   ```bash
   cat ~/.aws/credentials
   ```

---

## SSM セッションマネージャーの設定

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

## 接続先の確認

### EC2 インスタンスの ID の確認

EC2 インスタンスIDの例: `i-xxxxxxxxxxxxxxxxx`

1. [AWS マネジメントコンソール](https://aws.amazon.com/jp/console/)にログイン。
2. EC2 サービスページを開く。
3. インスタンス一覧から対象のインスタンスを選択。
4. インスタンスの詳細ページの URL に含まれるインスタンス ID を確認。

### RDS エンドポイントの確認

RDS エンドポイントの例: `database-1.xxxxxxxxxxxxx.ap-northeast-1.rds.amazonaws.com`

1. [AWS マネジメントコンソール](https://aws.amazon.com/jp/console/)にログイン。
2. RDS サービスページを開く。
3. インスタンス一覧から対象のインスタンスを選択。
4. インスタンスの詳細ページのエンドポイントを確認。

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
