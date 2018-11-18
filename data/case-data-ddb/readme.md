# case-data-ddb

Stick yer case data in ddb - work in progress

```console
curl -d '{"metavar":"baz"}' -H 'x-api-key:xxx' -H 'Content-Type: application/json' https://xxx.execute-api.us-west-2.amazonaws.com/dev/create

curl -H 'x-api-key:xxx' https://xxx.execute-api.us-west-2.amazonaws.com/dev/casedata/{txnid}
```