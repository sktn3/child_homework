#!/bin/sh


#echo $(cd $(dirname $0) && pwd)
cd $(cd $(dirname $0) && pwd)
aws s3 cp s3://kaoru3works/sansu1.html ../
