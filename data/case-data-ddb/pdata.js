
const AWS = require('aws-sdk');

const retrieve = async (event, context) => {

    let txnid = event.pathParameters.txnid;
    console.log(`retrieve data for transaction ${txnid}`);

    
    return {statusCode: 200, body: 'uh-huh'};

};

module.exports = {
    retrieve
};