const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const stepFunctions = new AWS.StepFunctions();

const middy = require('middy');
const txnid = require('./middleware/txnid');


const startProcess = async (processInput) => {

    var params = {
        stateMachineArn: process.env.STEP_FN_ARN,
        input: processInput
    }

    console.log(`start process execution - stateMachineArn ${process.env.STEP_FN_ARN}`);
    let result = await stepFunctions.startExecution(params).promise();
    console.log(`startProcess return ${result}`);
    return result;
}



const createCore = async (event, context, callback) => {
    console.log(`create called with context ${JSON.stringify(context)}`);

    let result = await startProcess();
    callback(null, {
        statusCode: 200
    });
};

module.exports.step1 = async (event, context, callback) => {
    callback(null, 'step1');
};

module.exports.fooStep = async (event, context, callback) => {
    callback(null, 'fooStep');
}

module.exports.barStep = async (event, context, callback) => {
    callback(null, 'barStep');
};

module.exports.bazStep = async (event, context, callback) => {
    callback(null, 'bazStep');
};

module.exports.quuxStep = async (event, context, callback) => {
    callback(null, 'quuxStep');
};

module.exports.create = middy(createCore).use(txnid());