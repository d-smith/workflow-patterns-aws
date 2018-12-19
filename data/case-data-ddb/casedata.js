const middy = require('middy');
const ddbdata = require('./middleware/ddbdata');

const stubbed = async (event, context) => {
    return 'all work and no play makes Jack a dull boy';
}

module.exports.fooStep = stubbed;
module.exports.barStep = stubbed;
module.exports.bazStep = stubbed;
module.exports.quuxStep = stubbed;

const step1Core = async (event, context) => {
    console.log(`step 1 event: ${JSON.stringify(event)}`);
    
    //Add step output to case data.
    let caseData = event.caseData || {};
    caseData['step1'] = 'Step 1 output';

    //Return case data and state machine data
    let stateMachineData = {
        processData: event['processData'],
        //metavar: caseData.processInput.metavar
    };

    return { caseData, stateMachineData };
}

module.exports.step1
    = middy(step1Core)
        .use(ddbdata({ readPredicate: (o) => true }));