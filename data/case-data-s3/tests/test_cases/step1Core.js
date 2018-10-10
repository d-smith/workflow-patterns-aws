const expect = require('chai').expect;
const step1Core = require('../../casedata').step1Core;



var mochaAsync = (fn) => {
    return async (done) => {
        try {
            await fn();
            done();
        } catch (err) {
            done(err);
        }
    };
};

describe(`when we invoke step1Core`, async () => {
    it(`writes the metavar input as a state machine variable`, async () => {
        let event = {
            caseData: {
                processInput: {
                    metavar: 'foo'
                }
            },
            processData: 'txn-xxx'
        };
        
        let context = {};
  
        console.log('call step1Core');
        let result = await step1Core(event, context);
        console.log('step1core done', result);        
        expect(result.stateMachineData.metavar).to.equal('foo');
    })
})