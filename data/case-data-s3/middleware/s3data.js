const AWS = require('aws-sdk');


const middy = require('middy');
const s3utils = require('../s3utils');


const defaultPredicate = (o) => true;

module.exports = ({readPredicate}) => {
    

      return ({
          before: async (handler, next) => {
              if(handler.event) {
                  console.log('do before stuff');
                  let txnId = handler.event.processData;
                  if(!txnId) {
                      console.log('No txnId - cannot read associated s3 data');
                      return;
                  }
                  console.log(`before - read case data for txn ${txnId}`);
                  if(!readPredicate) {
                      console.log('No read predicate specified');
                      readPredicate = defaultPredicate;
                  }
                
                  console.log('before - read s3 data');
                  const S3 = new AWS.S3(); //Instantiate just in time to -- needed by mocking framework
                  let processData = await s3utils.readInputDataJSON(S3, txnId, readPredicate);
                  console.log('before - set data as casedata property on event');
                  handler.event.caseData = processData;
                  
              };
          },

          after: async (handler, next) => {
            if(handler.response) {
                console.log('do after stuff');
                console.log(`after - response: ${JSON.stringify(handler.response)}`);

                let caseData = handler.response.caseData;
                if(caseData == undefined) {
                    console.log('after - No caseData in response to write');
                } else {
                    console.log('after - placeholder ... write case data');

                    //Remove case data from response
                    delete handler.response.caseData;
                }


            };
          }

      });
}