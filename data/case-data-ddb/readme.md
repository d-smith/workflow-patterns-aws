# case-data-ddb

Stick yer case data in ddb - work in progress

```console
curl -d '{"metavar":"baz"}' -H 'x-api-key:xxx' -H 'Content-Type: application/json' https://xxx.execute-api.us-west-2.amazonaws.com/dev/create

curl -H 'x-api-key:xxx' https://xxx.execute-api.us-west-2.amazonaws.com/dev/casedata/{txnid}
```

This assumes the use of the transaction id and ddbdata middlewares - transaction id assigns a unique transaction id for the instantiation of the state machine, and ddbdata stores and retrieves data using DynamoDB and puts it on context for state machine lambdas.

The basic contract is the lambda returns an object tuple - the first property is an object representing the data produced by the state machine step output, and the second is an object containing workflow relevant data to be stored on the state machine instance and potentially referenced for branching and other decisions.

The object propertied used by the return should be caseData and stateMachineData as [object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) is used in the middleware to unpack the values. 