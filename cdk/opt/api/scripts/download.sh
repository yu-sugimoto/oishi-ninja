#!/bin/bash
set -e

# .env ファイルを読み込む
export $(grep -v '^#' .env | xargs)

S3_APP_PATH='app'
S3_APP_FILE_NAME='api.zip'

if [ -z "$S3_BUCKET" ]; then
  echo "S3_BUCKET is not set"
  exit 1
fi

cd /home/ec2-user
aws s3 cp s3://$S3_BUCKET/$S3_APP_PATH/$S3_APP_FILE_NAME .
unzip -o $S3_APP_FILE_NAME
rm $S3_APP_FILE_NAME
