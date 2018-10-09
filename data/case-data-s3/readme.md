# case-data-s3

This illustrates the [case data](http://www.workflowpatterns.com/patterns/data/visibility/wdp5.php) pattern where we stick all the case data into an s3 object.

A couple things to note about Step Functions:

* The max amount of state data that can be associated with a state machine instance is 32 KB
* There is no protection of that data using KMS

Storing the data in an s3 object avoids the size limitation and allows the use of KMS SSE. One potential downside is there's a chance of reading stale data between steps -- this can be mitigated by including a guard predicate and retry logic for handling inconsistent reads.

Other upsides to keeping state data in s3:

* Full control over encryption of data, e.g. KMS SSE CMK.
* Plug into full s3 ecosystem - trigger processing via s3 events, analytics via glue/athena/redshit/emr etc etc
* Leverage multi-region replication
* Build process repair and restart capabilities
* Plug into s3 object lifecycle management (move to glacier, retention and deletion policies, etc)

## notes

This uses middy middlewares - some provided by the framework, and one written to
inject a transaction id.

Note that the middy JSON body formatter expects the content type header to be exactly 'Content-Type'.

Sample:

```console
curl -d '{"metavar":"baz"}' -H 'x-api-key:xxx' -H 'Content-Type: application/json' https://xxx.execute-api.us-west-2.amazonaws.com/dev/create

curl -H 'x-api-key:xxx' https://xxx.execute-api.us-west-2.amazonaws.com/dev/casedata/{txnid}
```