const AWS = require('aws-sdk');


const middy = require('middy');
const s3utils = require('../s3utils');


const defaultPredicate = (o) => true;

module.exports = ({readPredicate}) => {
    

      return ({
          before: async (handler, next) => {
              if(handler.event) {
                  console.log('do s3data before stuff');
                  let txnId = handler.event.processData;
                  if(!txnId) {
                      console.log('No txnId - cannot read associated s3 data');
                      return;
                  }

                  console.log(`s3data before - read case data for txn ${txnId}`);
                  if(!readPredicate) {
                      console.log('No read predicate specified');
                      readPredicate = defaultPredicate;
                  }
                
                  console.log('s3data before - read s3 data');
                  const S3 = new AWS.S3(); //Instantiate just in time to -- needed by mocking framework
                  let caseData = await s3utils.readInputDataJSON(S3, txnId, readPredicate);
                  console.log('s3data before - set data as casedata property on event');
                  handler.event.caseData = caseData;
                  
              };
          },

          after: async (handler, next) => {
            if(handler.response) {
                console.log('s3data do after stuff');
                console.log(`s3data after - response: ${JSON.stringify(handler.response)}`);

                const {caseData, stateMachineData} = handler.response;
                //let caseData = handler.response.caseData;
                if(caseData == undefined) {
                    console.log('s3data after - No caseData in response to write');
                } else {
                    //let key = handler.response.processData;
                    let key = stateMachineData.processData;
                    console.log(`write step output to s3 with key ${key}`);
                    const S3 = new AWS.S3(); //Instantiate just in time to -- needed by mocking framework
                    await s3utils.writeBodyObj(S3, key, caseData);
                    
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