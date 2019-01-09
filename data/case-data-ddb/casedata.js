const middy = require('middy');
const ddbdata = require('./middleware/ddbdata');

const makeNamedStep = (name) => {
    return async (event, context) => {
        //Case data via middleware
        console.log(name);

        //Add step output to case data.
        let caseData = event.caseData;
        caseData[name] = name + ' output'; //step output

        //Return case data and state machine data
        let stateMachineData = {
            processData: event['processData']
        };
        return { caseData, stateMachineData };
    };
}

const step1Core = async (event, context) => {
    console.log(`step 1 event: ${JSON.stringify(event)}`);

    //Add step output to case data.
    let caseData = event.caseData || {};
    caseData['step1'] = 'Step 1 output';

    //Return case data and state machine data
    let stateMachineData = {
        processData: event['processData'],
        metavar: caseData.processInput.metavar
    };

    return { caseData, stateMachineData };
}

module.exports.step1
    = middy(step1Core)
        .use(ddbdata({ readPredicate: (o) => true }));

module.exports.fooStep
    = middy(makeNamedStep('foo'))
        .use(ddbdata({ readPredicate: (o) => true }));

module.exports.barStep
    = middy(makeNamedStep('bar'))
        .use(ddbdata({ readPredicate: (o) => true }));

module.exports.bazStep
    = middy(makeNamedStep('baz'))
        .use(ddbdata({ readPredicate: (o) => true }));

module.exports.quuxStep
    = middy(makeNamedStep('quux'))
        .use(ddbdata({ readPredicate: (o) => true }));
