#!/bin/bash

set -e

# .env ファイルの読み込み
if [[ -f .env ]]; then
  echo ".env ファイルを読み込んでいます..."
  set -o allexport
  source .env
  set +o allexport
fi

BUCKET_NAME=${1:-$ASSETS_S3_BUCKET}
DISTRIBUTION_ID=${2:-$ASSETS_CLOUDFRONT_DISTRIBUTION}
SOURCE_PATH=${2:-$ASSETS_SOURCE_PATH}
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

# ログ出力用の関数
log() {
  echo "[INFO] $1"
}

# ディレクトリの移動
cd $SOURCE_PATH

log "ファイルをバケットにアップロードしています..."

if aws s3 sync . "s3://$BUCKET_NAME" --profile "$AWS_PROFILE"; then
  log "ファイルのアップロードが完了しました。"
else
  echo "[ERROR] ファイルのアップロード中にエラーが発生しました。"
  exit 1
fi

# CloudFrontキャッシュの無効化
log "CloudFrontキャッシュを無効化しています..."

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

log "全ての処理が正常に完了しました。"

# 終了ステータス
exit 0
