# Oishi Ninja CDK Project

このプロジェクトは、AWS CDKを使用してデプロイされるOishi Ninjaアプリケーションのインフラストラクチャを管理します。

## クローンとセットアップ

まず、リポジトリをクローンします。

```sh
git clone https://github.com/study-basic/oishi-ninja.git
cd oishi-ninja/cdk
```

次に、必要な依存関係をインストールします。

```sh
npm install
```

## AWS 設定

AWS CLIを使用してAWSアカウントを設定します。以下のコマンドを実行して、AWS CLIを設定してください。

```sh
aws configure
```

プロンプトに従って、AWSアクセスキー、シークレットキー、デフォルトリージョン、および出力フォーマットを入力します。

## デプロイ手順

以下のコマンドを実行して、CDKスタックをデプロイします。

```sh
cdk bootstrap
cdk deploy
```

## その他のコマンド

スタックを削除するには、以下のコマンドを使用します。

```sh
cdk destroy
```

CDKアプリケーションの変更をプレビューするには、以下のコマンドを使用します。

```sh
cdk diff
```

## 参考資料

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
