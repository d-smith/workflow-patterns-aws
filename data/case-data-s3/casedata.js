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

    let inputPayload = event['body'];
    if (inputPayload == undefined) {
        inputPayload = '{}';
    }

    console.log(`input payload is ${JSON.stringify(inputPayload)}`);

    

    let inputObj = JSON.parse(inputPayload);
    let processData = {};
    processData['processInput'] = inputObj;

    let params = {
        Body: JSON.stringify(processData),
        Key: context.txnId,
        ServerSideEncryption: "AES256",
        Bucket: process.env.BUCKET_NAME
    };

    try {
        let response = await S3.putObject(params).promise();
        console.log(response);
    } catch(theError) {
        console.log(JSON.stringify(theError));
        callback(null, {statusCode: 500, body: 'Error capturing process input'});
        return;
    }

    processInput = {};
    processInput['processData'] = context.txnId;

    let result = await startProcess(JSON.stringify(processInput));
    console.log(`start process response is ${JSON.stringify(result)}`);
    callback(null, {
        statusCode: 200
    });
};

class S3DataPreconditionError extends Error {
    constructor(...args) {
        super(...args)
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}


const readInputDataJSON = async (key, predicate) => {
    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
    };

    let s3response = await S3.getObject(params).promise();
    console.log(s3response);

    inputJSON = JSON.parse(s3response['Body'].toString());
    if(predicate(inputJSON)) {
        return inputJSON;
    }

    console.log(`consistency predicate failed`);
    
    throw new S3DataPreconditionError(`Unable to satisfy consistency predicate`);
}

const writeBodyObj = async(key, body) => {
    let putParams = {
        Body: JSON.stringify(body),
        Key: key,
        ServerSideEncryption: "AES256",
        Bucket: process.env.BUCKET_NAME
    };

    let s3response = await S3.putObject(putParams).promise();
    console.log(s3response);
    return s3response;
}

module.exports.step1 = async (event, context, callback) => {
    let key = event['processData'];
    console.log(`process data via key ${key}`);

    let processData = await readInputDataJSON(key, (x) => {return true;});
    console.log(`input: ${JSON.stringify(processData)}`);

    //Add this steps data to the s3 object
    processData['step1'] = 'Step 1 data';
    await writeBodyObj(key, processData);

    let stateMachineData = {};
    stateMachineData['processData'] = key;
    stateMachineData['metavar'] = processData.processInput.metavar;

    callback(null, stateMachineData);
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