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
                      next();
                      return;
                  }
                  console.log(`read case data for txn ${txnId}`);
                  if(!readPredicate) {
                      console.log('No read predicate specified');
                      readPredicate = defaultPredicate;
                  }
                
                  console.log('read s3 data');
                  const S3 = new AWS.S3(); //Instantiate just in time to -- needed by mocking framework
                  let processData = await s3utils.readInputDataJSON(S3, txnId, readPredicate);
                  console.log('set data as casedata property on event');
                  handler.event.caseData = processData;
                  
              };
              next();
          },

          after: async (handler, next) => {
            if(handler.context) {
                console.log('do after stuff');
            };
            next();
          }

      });
}