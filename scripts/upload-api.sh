#!/bin/bash

# エラー時にスクリプトを終了
set -e

# .env ファイルの読み込み
if [[ -f .env ]]; then
  echo ".env ファイルを読み込んでいます..."
  set -o allexport
  source .env
  set +o allexport
fi

S3_BUCKET=$API_S3_BUCKET_NAME
S3_PATH=$API_S3_APP_PATH

# 必要な環境変数の確認
if [[ -z "$S3_BUCKET" || -z "$S3_PATH" ]]; then
  echo "環境変数 S3_BUCKET または S3_PATH が設定されていません。"
  echo "例: export S3_BUCKET=my-bucket-name"
  echo "例: export S3_PATH=path/to/upload/"
  exit 1
fi

# AWS プロファイルの指定 (オプション)
AWS_PROFILE_OPTION=""
if [[ -n "$AWS_PROFILE" ]]; then
  AWS_PROFILE_OPTION="--profile $AWS_PROFILE"
fi

# 圧縮対象のディレクトリ
TARGET_DIR="api"
ZIP_FILE="api.zip"

# 不要なファイルを除外して圧縮
echo "圧縮中: $TARGET_DIR -> $ZIP_FILE"
zip -r $ZIP_FILE $TARGET_DIR \
  -x "$TARGET_DIR/node_modules/*" \
  -x "$TARGET_DIR/__pycache__/*" \
  -x "$TARGET_DIR/*.pyc" \
  -x "$TARGET_DIR/*.log"

# S3 にアップロード
echo "S3 にアップロード中: s3://$S3_BUCKET/$S3_PATH/$ZIP_FILE"
aws s3 cp $ZIP_FILE s3://$S3_BUCKET/$S3_PATH/$ZIP_FILE $AWS_PROFILE_OPTION

# アップロード成功時のメッセージ
echo "アップロード完了: s3://$S3_BUCKET/$S3_PATH/$ZIP_FILE"

# ローカルの ZIP ファイルを削除
echo "ローカルの ZIP ファイルを削除: $ZIP_FILE"
rm $ZIP_FILE
