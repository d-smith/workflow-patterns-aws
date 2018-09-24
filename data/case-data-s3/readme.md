# case-data-s3

This illustrates the [case data](http://www.workflowpatterns.com/patterns/data/visibility/wdp5.php) pattern where we stick all the case data into an s3 object.

## notes

This uses middy middlewares - some provided by the framework, and one written to
inject a transaction id.

Note that the middy JSON body formatter expects the content type header to be exactly 'Content-Type'.

Sample:

```console
curl -d '{"metavar":"baz"}' -H 'x-api-key:xxx' -H 'Content-Type: application/json' https://xxx.execute-api.us-west-2.amazonaws.com/dev/create
```