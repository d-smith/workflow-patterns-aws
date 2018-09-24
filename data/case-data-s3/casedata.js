const AWS = require('aws-sdk');
const S3 = new AWS.S3();



const writeBodyObj = require('./s3utils').writeBodyObj;
const readInputDataJSON = require('./s3utils').readInputDataJSON;




module.exports.step1 = async (event, context, callback) => {
    let key = event['processData'];
    console.log(`process data via key ${key}`);

    let processData = await readInputDataJSON(S3, key, (x) => { return true; });
    console.log(`input: ${JSON.stringify(processData)}`);

    //Add this steps data to the s3 object
    processData['step1'] = 'Step 1 data';
    await writeBodyObj(S3, key, processData);

    let stateMachineData = {};
    stateMachineData['processData'] = key;
    stateMachineData['metavar'] = processData.processInput.metavar;

    callback(null, stateMachineData);
};

const doStep = async (key, stepName, stepOutput, callback) => {
    console.log(`process data via key ${key}`);

    let processData = await readInputDataJSON(S3, key, (x) => { return true; });
    console.log(`input: ${JSON.stringify(processData)}`);

    console.log('write step output');
    processData[stepName] = stepOutput;
    await writeBodyObj(S3, key, processData);

    let stateMachineData = {};
    stateMachineData['processData'] = key;

    console.log('callback with state machine data');
    callback(null, stateMachineData);
}

module.exports.fooStep = async (event, context, callback) => {
    console.log('fooStep');
    await doStep(event['processData'], 'fooStep', 'foo', callback);
}

module.exports.barStep = async (event, context, callback) => {
    console.log('barStep');
    await doStep(event['processData'], 'barStep', 'bar', callback);
};

module.exports.bazStep = async (event, context, callback) => {
    console.log('bazStep');
    await doStep(event['processData'], 'bazStep', 'baz', callback);
};

module.exports.quuxStep = async (event, context, callback) => {
    await doStep(event['processData'], 'quuxStep', 'quux', callback);
};

