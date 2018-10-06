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

describe(`when we invoke step1`, async () => {
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

        var callbackErr, callbackData;
        const callback = (err, data) => {
            callbackErr = err;
            callbackData = data;
        }

        await step1Core(event, context, callback);
        
        expect(callbackErr).to.be.null;
        expect(callbackData.stateMachineData.metavar).to.equal('foo');
    })
})