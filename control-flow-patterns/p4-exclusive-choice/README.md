# p4-exclusive-choice

The [exclusive choice](http://www.workflowpatterns.com/patterns/control/basic/wcp4.php) pattern

Drive the execution via the values of the metavar input, e.g.

```console
curl -d '{"metavar":"foo"}' -H 'x-api-key:xxx' https://xxx.execute-api.us-east-1.amazonaws.com/dev/create
```
