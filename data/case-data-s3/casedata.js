const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const chance = require('chance').Chance();

const writeBodyObj = require('./s3utils').writeBodyObj;
const readInputDataJSON = require('./s3utils').readInputDataJSON;

const middy = require('middy');
const s3data = require('./middleware/s3data');

const step1Core = async (event, context, callback) => {
    //Case data via middleware
    console.log('step1');

    //Add step output to case data.
    let caseData = event.caseData;
    caseData['step1'] = 'Step 1 output';

    //Invoke callback with case data and state machine data
    let stateMachineData = {
        processData: event['processData'],
        metavar: caseData.processInput.metavar
    };
    callback(null, { caseData, stateMachineData });
};

module.exports.step1
    = middy(step1Core)
        .use(s3data({ readPredicate: (o) => true }));

const step1DataPresent = (x) => {
    return chance.bool({ likelihood: 35 });
};

const fooStepCore = async (event, context, callback) => {
    //Case data via middleware
    console.log('fooStep');

    //Add step output to case data.
    let caseData = event.caseData;
    caseData['fooStep'] = 'foo'; //step output

    //Invoke callback with case data and state machine data
    let stateMachineData = {
        processData: event['processData']
    };
    callback(null, { caseData, stateMachineData });
}

const barStepCore = async (event, context, callback) => {
    //Case data via middleware
    console.log('barStep');

    //Add step output to case data.
    let caseData = event.caseData;
    caseData['barStep'] = 'bar'; //step output

    //Invoke callback with case data and state machine data
    let stateMachineData = {
        processData: event['processData']
    };
    callback(null, { caseData, stateMachineData });
};

const bazStepCore = async (event, context, callback) => {
    //Case data via middleware
    console.log('bazStep');

    //Add step output to case data.
    let caseData = event.caseData;
    caseData['bazStep'] = 'baz'; //step output

    //Invoke callback with case data and state machine data
    let stateMachineData = {
        processData: event['processData']
    };
    callback(null, { caseData, stateMachineData });
};

module.exports.barStep
    = middy(barStepCore)
        .use(s3data({ inputPredicate: step1DataPresent }));

module.exports.fooStep
    = middy(fooStepCore)
        .use(s3data({ inputPredicate: step1DataPresent }));

module.exports.bazStep
    = middy(bazStepCore)
        .use(s3data({ inputPredicate: step1DataPresent }));


const quuxDataPredicate = async (data) => {
    return (data['step1'] != undefined &&
        (data['fooStep'] != undefined || data['barStep'] || data['bazStep']));
};


const quuxStepCore = async (event, context, callback) => {
    //Case data via middleware
    console.log('quuxStep');

    //Add step output to case data.
    let caseData = event.caseData;
    caseData['quuxStep'] = 'quux'; //Bar step output

    //Invoke callback with case data and state machine data
    let stateMachineData = {
        processData: event['processData']
    };
    callback(null, { caseData, stateMachineData });
};

module.exports.quuxStep
    = middy(quuxStepCore)
        .use(s3data({ inputPredicate: quuxDataPredicate }))

module.exports.step1Core = step1Core;