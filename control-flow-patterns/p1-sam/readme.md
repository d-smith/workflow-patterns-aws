
Install the SAM CLI: 

conda create -n aws
source activate aws
# p1-sam

Installed aws-sam-cli, etc
Installed home brew, SAM


https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html


```console
sam package --template-file template.yml --output-template-file packaged.yaml --s3-bucket sampack-97068
sam deploy --template-file ./packaged.yaml --stack-name mystack --capabilities CAPABILITY_IAM
aws cloudformation delete-stack --stack-name mystack
```