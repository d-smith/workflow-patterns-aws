
const AWS = require('aws-sdk');

const retrieve = async (event, context) => {

    let txnid = event.pathParameters.txnid;
    console.log(`retrieve data for transaction ${txnid}`);

    const docClient = new AWS.DynamoDB.DocumentClient();
    let params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            "TxnId": txnid
        },
        ConsistentRead: true
    };

    let rawData = await docClient.get(params).promise();

    return { statusCode: 200, body: `${JSON.stringify(rawData)}` };

};

module.exports = {
    retrieve
};