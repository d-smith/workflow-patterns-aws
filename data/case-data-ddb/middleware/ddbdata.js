const AWS = require('aws-sdk');


const middy = require('middy');


const defaultPredicate = (o) => true;

module.exports = ({readPredicate}) => {
    

      return ({
          before: async (handler, next) => {
              if(handler.event) {
                  console.log('do ddbdata before stuff');
                  let txnId = handler.event.processData;
                  if(!txnId) {
                      console.log('No txnId - cannot read associated s3 data');
                      return;
                  }

                  console.log(`ddbdata before - read case data for txn ${txnId}`);
                  if(!readPredicate) {
                      console.log('No read predicate specified');
                      readPredicate = defaultPredicate;
                  }
                
                  console.log('ddbdata before - read ddb data');
                  const docClient = new AWS.DynamoDB.DocumentClient();
                  let params = {
                    TableName: process.env.DYNAMODB_TABLE,
                    Key: {
                        "TxnId": txnId
                    }
                  };

                  let rawData = await docClient.get(params).promise();
                  console.log(`raw data is ${JSON.stringify(rawData)}`);
                  itemData = rawData['Item'];
                  delete itemData.TxnId
                  console.log('ddbdata before - set data as casedata property on event');
                  handler.event.caseData = itemData;
                  
              };
          },

          after: async (handler, next) => {
            if(handler.response) {
                console.log('ddbdata do after stuff');
                console.log(`ddbdata after - response: ${JSON.stringify(handler.response)}`);

                const {caseData, stateMachineData} = handler.response;
                //let caseData = handler.response.caseData;
                if(caseData == undefined) {
                    console.log('ddbdata after - No caseData in response to write');
                } else {
                    //let key = handler.response.processData;
                    let key = stateMachineData.processData;
                    console.log(`write step output to ddbdata with key ${key}`);

                    const docClient = new AWS.DynamoDB.DocumentClient();
                    let params = {
                        TableName: process.env.DYNAMODB_TABLE,
                        Item: {
                            TxnId: key,
                            processDate: caseData
                        }
                    };

                    let response = await docClient.put(params).promise();
                    console.log(`put response: ${JSON.stringify(response)}`);
                    //const S3 = new AWS.S3(); //Instantiate just in time to -- needed by mocking framework
                    //await s3utils.writeBodyObj(S3, key, caseData);
                    
                    //Remove case data from response as we keep it in s3 not with the step functions instance
                    delete handler.response.caseData;

                    //Move state machine data properties directly to statemachine data
                    for(var k in stateMachineData) {
                        let val = stateMachineData[k]
                        handler.response[k] = val;
                    }
                    delete handler.response.stateMachineData;
                }
            };
          }

      });
}