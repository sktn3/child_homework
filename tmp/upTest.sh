#!/bin/sh


UPLOAD_FILE=sansu1test.html

BUCKET_NAME=kaoru3work
#PUBLIC_POLICY_FILE=./public_policy.json

cd $(cd $(dirname $0) && pwd)

## upload in.html
aws s3 cp ../${UPLOAD_FILE} s3://${BUCKET_NAME}/${UPLOAD_FILE}

#aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy ${PUBLIC_POLICY_FILE}
