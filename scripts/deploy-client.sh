#!/bin/bash

# 引数または環境変数からバケット名とAWSプロファイルを取得
BUCKET_NAME=${1:-$CLIENT_S3_BUCKET}
AWS_PROFILE=${2:-$AWS_PROFILE}

# 必須引数のチェック
if [ -z "$BUCKET_NAME" ]; then
  echo "[ERROR] バケット名が指定されていません。引数または環境変数 CLIENT_S3_BUCKET を設定してください。"
  exit 1
fi

if [ -z "$AWS_PROFILE" ]; then
  echo "[ERROR] AWSプロファイルが指定されていません。引数または環境変数 AWS_PROFILE を設定してください。"
  exit 1
fi

# ログ出力用の関数
log() {
  echo "[INFO] $1"
}

# ディレクトリの移動
cd ./client

# npmとnodeのバージョン確認
log "npmのバージョン確認中..."
npm --version || { echo "[ERROR] npm がインストールされていません。"; exit 1; }

log "Node.jsのバージョン確認中..."
node --version || { echo "[ERROR] Node.js がインストールされていません。"; exit 1; }

# AWS CLIの確認
log "AWS CLIのバージョン確認中..."
aws --version || { echo "[ERROR] AWS CLI がインストールされていません。"; exit 1; }

# S3へのアクセス権確認
log "AWS CLI の権限確認中 (プロファイル: $AWS_PROFILE)..."
aws s3 ls --profile "$AWS_PROFILE" > /dev/null 2>&1 || {
  echo "[ERROR] S3へのアクセス権がありません。";
  exit 1;
}

# バケットの存在確認
log "S3バケット \"$BUCKET_NAME\" の存在確認中..."
aws s3 ls "s3://$BUCKET_NAME" --profile "$AWS_PROFILE" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "[ERROR] バケット \"$BUCKET_NAME\" が存在しません。"
  exit 1
fi

# Viteプロジェクトのビルド
log "Viteプロジェクトをビルド中..."
npm run build || { echo "[ERROR] ビルドに失敗しました。"; exit 1; }

# ファイルのアップロード
log "ビルドされたファイルをバケット \"$BUCKET_NAME\" にアップロード中..."
aws s3 sync ./dist "s3://$BUCKET_NAME" --profile "$AWS_PROFILE" || { echo "[ERROR] ファイルのアップロードに失敗しました。"; exit 1; }

log "ファイルのアップロードが完了しました。"

# 終了メッセージ
log "全ての手順が正常に完了しました。"
