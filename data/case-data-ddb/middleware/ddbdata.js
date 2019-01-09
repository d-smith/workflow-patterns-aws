const AWS = require('aws-sdk');
const middy = require('middy');

module.exports = () => {
    

      return {
          before: async (handler, next) => {
              if(handler.event) {
                  console.log('do ddbdata before stuff');
                  let txnId = handler.event.processData;
                  if(!txnId) {
                      console.log('No txnId - cannot read associated s3 data');
                      return;
                  }

                  console.log(`ddbdata before - read case data for txn ${txnId}`);                
                  const docClient = new AWS.DynamoDB.DocumentClient();
                  let params = {
                    TableName: process.env.DYNAMODB_TABLE,
                    Key: {
                        "TxnId": txnId
                    }, 
                    ConsistentRead:true
                  };

                  let rawData = await docClient.get(params).promise();
                  console.log(`raw data is ${JSON.stringify(rawData)}`);
                  let itemData = rawData['Item'];
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
                    console.log(`write step output to ddbdata with key ${key} and caseData ${JSON.stringify(caseData)}`);

                    let item = {};
                    item['TxnId'] = key;
                    Object.keys(caseData).forEach((x) => {
                        item[x] = caseData[x];
                    });

                    const docClient = new AWS.DynamoDB.DocumentClient();
                    let params = {
                        TableName: process.env.DYNAMODB_TABLE,
                        Item: item
                    };

                    let response = await docClient.put(params).promise();
                   
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

      };
}