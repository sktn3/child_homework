#!/bin/sh


UPLOAD_FILE1=sansu1.html
UPLOAD_FILE1js=sansu1.js
UPLOAD_FILE2=sansu1.es5.html
UPLOAD_FILE2js=sansu1.es5.js

BUCKET_NAME=kaoru3work
#PUBLIC_POLICY_FILE=./public_policy.json

cd $(cd $(dirname $0) && pwd)

# html
sed s/${UPLOAD_FILE1js}/${UPLOAD_FILE2js}/ ../${UPLOAD_FILE1} > ../${UPLOAD_FILE2}

# babel es6 -> es5
../node_modules/babel-cli/bin/babel.js ../${UPLOAD_FILE1js} --out-file ../${UPLOAD_FILE2js}

## upload in.html
aws s3 cp ../${UPLOAD_FILE1} s3://${BUCKET_NAME}/${UPLOAD_FILE1}
aws s3 cp ../${UPLOAD_FILE1js} s3://${BUCKET_NAME}/${UPLOAD_FILE1js}
aws s3 cp ../${UPLOAD_FILE2} s3://${BUCKET_NAME}/${UPLOAD_FILE2}
aws s3 cp ../${UPLOAD_FILE2js} s3://${BUCKET_NAME}/${UPLOAD_FILE2js}

#aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy ${PUBLIC_POLICY_FILE}
