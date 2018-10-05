
const AWS = require('aws-sdk');

const retrieve = async (event, context, callback) => {

    let txnid = event.pathParameters.txnid;
    console.log(`retrieve data for transaction ${txnid}`);

    const S3 = new AWS.S3();
    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: txnid
    };

    try {
        let s3response = await S3.getObject(params).promise();
        console.log(s3response);
        callback(null, {statusCode: 200, body: s3response['Body'].toString()});
    } catch(theError) {
        console.log(theError, theError.stack);
        callback(null, {statusCode: 400, body: theError.message});
    }


};

module.exports = {
    retrieve
};