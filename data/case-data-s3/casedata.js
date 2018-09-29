const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const chance = require('chance').Chance();

const writeBodyObj = require('./s3utils').writeBodyObj;
const readInputDataJSON = require('./s3utils').readInputDataJSON;

const middy = require('middy');
const s3data = require('./middleware/s3data');

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

const doStep = async (key, stepName, stepOutput, dataPredicate, callback) => {
    console.log(`process data via key ${key}`);

    let processData = await readInputDataJSON(S3, key, dataPredicate);
    console.log(`input: ${JSON.stringify(processData)}`);

    console.log('write step output');
    processData[stepName] = stepOutput;
    await writeBodyObj(S3, key, processData);

    let stateMachineData = {};
    stateMachineData['processData'] = key;

    console.log('callback with state machine data');
    callback(null, stateMachineData);
}

const step1DataPresent = (x) => {
    return chance.bool({likelihood: 35});
}

module.exports.fooStep = async (event, context, callback) => {
    console.log('fooStep');
    await doStep(event['processData'], 'fooStep', 'foo', step1DataPresent, callback);
}

const barStepCore = async (event, context, callback) => {
    //Case data via middleware
    console.log('barStep');
    console.log(`case data: ${JSON.stringify(event.caseData)}`);

    let caseData = event.caseData;
    caseData['barStep'] = 'bar'; //Bar step output

    //For now write data
    let key = event['processData'];
    console.log('write step output');
    await writeBodyObj(S3, key, caseData);

    //Put the step data and case data in callback context
    callback(null, {caseData: caseData, processData:key });
    
    //await doStep(event['processData'], 'barStep', 'bar', step1DataPresent, callback);
};

module.exports.barStep 
    = middy(barStepCore)
        .use(s3data({inputPredicate:step1DataPresent}));

module.exports.bazStep = async (event, context, callback) => {
    console.log('bazStep');
    await doStep(event['processData'], 'bazStep', 'baz', step1DataPresent, callback);
};

const quuxDataPredicate = async (data) => {
    return (data['step1'] != undefined && 
        (data['fooStep'] != undefined || data['barStep'] || data['bazStep']));
};

module.exports.quuxStep = async (event, context,  callback) => {
    await doStep(event['processData'], 'quuxStep', 'quux', quuxDataPredicate, callback);
};

