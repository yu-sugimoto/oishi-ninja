#!/bin/bash

set -e

# .env ファイルの読み込み
if [[ -f .env ]]; then
  echo ".env ファイルを読み込んでいます..."
  set -o allexport
  source .env
  set +o allexport
fi

BUCKET_NAME=${1:-$CLIENT_S3_BUCKET}
DISTRIBUTION_ID=${2:-$CLIENT_CLOUDFRONT_DISTRIBUTION}
AWS_PROFILE=${3:-$AWS_PROFILE}

# 必須引数のチェック
if [ -z "$BUCKET_NAME" ]; then
  echo "[ERROR] バケット名が指定されていません。引数または環境変数 CLIENT_S3_BUCKET を設定してください。"
  exit 1
fi

if [ -z "$DISTRIBUTION_ID" ]; then
  echo "[ERROR] CloudFrontディストリビューションIDが指定されていません。引数または環境変数 CLIENT_CLOUDFRONT_DISTRIBUTION を設定してください。"
  exit 1
fi

AWS_PROFILE_OPTION=""
if [[ -n "$AWS_PROFILE" ]]; then
  AWS_PROFILE_OPTION="--profile $AWS_PROFILE"
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
aws s3 ls $AWS_PROFILE_OPTION > /dev/null 2>&1 || {
  echo "[ERROR] S3へのアクセス権がありません。";
  exit 1;
}

# バケットの存在確認
log "S3バケット \"$BUCKET_NAME\" の存在確認中..."
aws s3 ls "s3://$BUCKET_NAME" $AWS_PROFILE_OPTION > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "[ERROR] バケット \"$BUCKET_NAME\" が存在しません。"
  exit 1
fi

# Viteプロジェクトのビルド
log "Viteプロジェクトをビルド中..."
npm run build || { echo "[ERROR] ビルドに失敗しました。"; exit 1; }

# ファイルのアップロード
log "ビルドされたファイルをバケット \"$BUCKET_NAME\" にアップロード中..."
aws s3 sync ./dist "s3://$BUCKET_NAME" $AWS_PROFILE_OPTION || {
  echo "[ERROR] ファイルのアップロードに失敗しました。";
  exit 1;
}

log "ファイルのアップロードが完了しました。"

# CloudFrontキャッシュの削除
log "CloudFrontディストリビューション \"$DISTRIBUTION_ID\" のキャッシュを削除中..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' --output text \
  $AWS_PROFILE_OPTION \
  )

if [ $? -ne 0 ]; then
  echo "[ERROR] CloudFrontのキャッシュ削除に失敗しました。"
  exit 1
fi

log "キャッシュ削除がリクエストされました (Invalidation ID: $INVALIDATION_ID)。"

# 終了メッセージ
log "全ての手順が正常に完了しました。"
