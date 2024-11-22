#!/bin/bash

# 設定
# .envファイルの読み込み
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 必須環境変数のチェック
if [ -z "$API_INSTANCE_ID" ] || [ -z "$API_REGION" ] || [ -z "$API_APP_NAME" ]; then
  echo "エラー: 必須環境変数(API_INSTANCE_ID, API_REGION, API_APP_NAME)が設定されていません。" >&2
  exit 1
fi

# 環境変数から設定を取得
INSTANCE_ID=$API_INSTANCE_ID
REGION=$API_REGION
APP_NAME=$API_APP_NAME
APP_DIR="/var/www/$APP_NAME"
ZIP_FILE="$APP_NAME.zip"
REMOTE_ZIP="/tmp/$ZIP_FILE"
SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"

# AWS CLIプロファイル設定
AWS_PROFILE_OPTION=""
if [ -n "$AWS_PROFILE" ]; then
  AWS_PROFILE_OPTION="--profile $AWS_PROFILE"
fi

# ローカルの不要ファイルの削除
echo "古い一時ファイルを削除しています..."
rm -f $ZIP_FILE

# ソースコードの圧縮
echo "ソースコードを圧縮しています..."
zip -r $ZIP_FILE . -x "*.git*" "*.venv*" "*.DS_Store*" "__pycache__/*"

# SSMセッションでファイルアップロード
echo "SSMセッションを使ってファイルをアップロードしています..."
aws $AWS_PROFILE_OPTION ssm start-session --target $INSTANCE_ID --region $REGION << EOF
cat > $REMOTE_ZIP << 'EOT'
$(base64 $ZIP_FILE)
EOT
base64 -d $REMOTE_ZIP > $REMOTE_ZIP
EOF

# デプロイ用のスクリプトをSSMで実行
echo "EC2でデプロイ用スクリプトを実行しています..."
aws $AWS_PROFILE_OPTION ssm send-command \
  --instance-ids "$INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=[
    "set -e",
    "echo デプロイ処理を開始します...",
    "sudo mkdir -p '"$APP_DIR"'",
    "sudo chown $USER:$USER '"$APP_DIR"'",
    "unzip -o '"$REMOTE_ZIP"' -d '"$APP_DIR"'",
    "rm '"$REMOTE_ZIP"'",
    "cd '"$APP_DIR"'",
    "poetry install --no-dev",
    "poetry run flask db upgrade",
    "if [ ! -f '"$SERVICE_FILE"' ]; then",
    "  echo systemdサービスを作成しています...",
    "  sudo bash -c \"cat > '"$SERVICE_FILE"'\" << EOL",
    "[Unit]",
    "Description='"$APP_NAME"' Service",
    "After=network.target",
    "[Service]",
    "User=$USER",
    "WorkingDirectory='"$APP_DIR"'",
    "ExecStart=/usr/local/bin/poetry run flask run --host=0.0.0.0 --port=5000",
    "Restart=always",
    "[Install]",
    "WantedBy=multi-user.target",
    "EOL",
    "fi",
    "sudo systemctl daemon-reload",
    "sudo systemctl enable '"$APP_NAME"'",
    "sudo systemctl restart '"$APP_NAME"'",
    "echo デプロイ処理が正常に完了しました！"
  ]' \
  --region $REGION

# ローカルの一時ファイル削除
echo "ローカルの一時ファイルを削除しています..."
rm -f $ZIP_FILE

echo "デプロイが完了しました！"
