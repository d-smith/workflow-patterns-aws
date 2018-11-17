const AWS = require('aws-sdk');
const stepFunctions = new AWS.StepFunctions();


const middy = require('middy');
const { jsonBodyParser, validator, httpErrorHandler } = require('middy/middlewares')
const txnid = require('./middleware/txnid');



const startProcess = async (processInput) => {

    var params = {
        stateMachineArn: process.env.STEP_FN_ARN,
        input: processInput
    }

    console.log(`start process execution - stateMachineArn ${process.env.STEP_FN_ARN}`);
    let result = await stepFunctions.startExecution(params).promise();
    return result;
}

const createCore = async (event, context) => {
    console.log(`create called with context ${JSON.stringify(context)}`);
    console.log(`input payload is ${JSON.stringify(event['body'])}`);

    

    let processInput = {};
    processInput['processData'] = context.txnId;

    let result = await startProcess(JSON.stringify(processInput));
    console.log(`start process response is ${JSON.stringify(result)}`);
    
    let responseBody = {
        transactionId: context.txnId
    };

    return {statusCode: 200, body: JSON.stringify(responseBody)};
};


const inputSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            required: ['metavar'],
            properties: {
                metavar: { type: 'string', minLength: 1 }
            }
        }
    }
}

module.exports.create = middy(createCore)
    .use(jsonBodyParser())
    .use(validator({ inputSchema }))
    .use(txnid())
    .use(httpErrorHandler());