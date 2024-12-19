#!/bin/bash

set -e

# .env ファイルの読み込み
if [[ -f .env ]]; then
  echo "[INFO] .env ファイルを読み込んでいます..."
  set -o allexport
  source .env
  set +o allexport
else
  echo "[WARNING] .env ファイルが見つかりません。環境変数を直接設定してください。"
fi

SOURCE_PATH="./data/out/recipes"
BUCKET_NAME=${1:-$API_S3_BUCKET}
DEST_PATH="${2:-data/recipes}"
AWS_PROFILE=${3:-$AWS_PROFILE}

AWS_PROFILE_OPTION=""
if [[ -n "$AWS_PROFILE" ]]; then
  AWS_PROFILE_OPTION="--profile $AWS_PROFILE"
fi

# ログ出力用の関数
log() {
  echo "[INFO] $1"
}

error() {
  echo "[ERROR] $1" >&2
  exit 1
}

# 入力のバリデーション
if [[ -z "$BUCKET_NAME" ]]; then
  error "S3バケット名が指定されていません。第1引数で指定するか、.envファイルにAPI_S3_BUCKETを設定してください。"
fi

if [[ ! -d "$SOURCE_PATH" ]]; then
  error "ソースディレクトリ $SOURCE_PATH が存在しません。"
fi

log "アップロード先バケット: $BUCKET_NAME"
log "アップロード先パス: s3://$BUCKET_NAME/$DEST_PATH"
log "AWS プロファイル: ${AWS_PROFILE:-デフォルトプロファイル}"

# ファイルのアップロード
log "ファイルをバケットにアップロードしています..."
if aws s3 sync "$SOURCE_PATH" "s3://$BUCKET_NAME/$DEST_PATH" $AWS_PROFILE_OPTION; then
  log "ファイルのアップロードが完了しました。"
else
  error "ファイルのアップロード中にエラーが発生しました。"
fi
