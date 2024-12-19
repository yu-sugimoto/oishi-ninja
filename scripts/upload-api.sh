#!/bin/bash

set -e

# .env ファイルの読み込み
if [[ -f .env ]]; then
  echo ".env ファイルを読み込んでいます..."
  set -o allexport
  source .env
  set +o allexport
fi

S3_BUCKET=${1:-$API_S3_BUCKET}
S3_PATH=${2:-$API_S3_APP_PATH}
AWS_PROFILE=${3:-$AWS_PROFILE}

TARGET_DIR="api"
ZIP_FILE="api.zip"

log() {
  echo "[INFO] $1"
}

if [ -z "$API_S3_BUCKET" ]; then
  echo "Error: API_S3_BUCKET is not set in .env or as an argument."
  echo "例: export API_S3_BUCKET=my-bucket-name"
  exit 1
fi

if [ -z "$S3_PATH" ]; then
  echo "Error: API_S3_APP_PATH is not set in .env or as an argument."
  echo "例: export API_S3_APP_PATH=path/to/upload/"
  exit 1
fi

AWS_PROFILE_OPTION=""
if [[ -n "$AWS_PROFILE" ]]; then
  AWS_PROFILE_OPTION="--profile $AWS_PROFILE"
fi

# 不要なファイルを除外して圧縮
log "圧縮中: $TARGET_DIR -> $ZIP_FILE"
zip -r $ZIP_FILE $TARGET_DIR \
  -x "$TARGET_DIR/node_modules/*" \
  -x "$TARGET_DIR/__pycache__/*" \
  -x "$TARGET_DIR/*.pyc" \
  -x "$TARGET_DIR/*.log"

# S3 にアップロード
log "S3 にアップロード中: s3://$S3_BUCKET/$S3_PATH/$ZIP_FILE"
aws s3 cp $ZIP_FILE s3://$S3_BUCKET/$S3_PATH/$ZIP_FILE $AWS_PROFILE_OPTION

# アップロード成功時のメッセージ
log "アップロード完了: s3://$S3_BUCKET/$S3_PATH/$ZIP_FILE"

# ローカルの ZIP ファイルを削除
log "ローカルの ZIP ファイルを削除: $ZIP_FILE"
rm $ZIP_FILE
