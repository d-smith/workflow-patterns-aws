const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const stepFunctions = new AWS.StepFunctions();


const middy = require('middy');
const txnid = require('./middleware/txnid');

const writeBodyObj = require('./s3utils').writeBodyObj;


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

    let inputPayload = event['body'];
    if (inputPayload == undefined) {
        inputPayload = '{}';
    }

    console.log(`input payload is ${JSON.stringify(inputPayload)}`);

    let inputObj = JSON.parse(inputPayload);
    let processData = {};
    processData['processInput'] = inputObj;

    try {
        await writeBodyObj(S3, context.txnId, processData);
    } catch (theError) {
        console.log(JSON.stringify(theError));
        callback(null, { statusCode: 500, body: 'Error capturing process input' });
        return;
    }

    let processInput = {};
    processInput['processData'] = context.txnId;

    let result = await startProcess(JSON.stringify(processInput));
    console.log(`start process response is ${JSON.stringify(result)}`);
    callback(null, {
        statusCode: 200
    });
};

module.exports.create = middy(createCore).use(txnid());