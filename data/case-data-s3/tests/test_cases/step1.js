const expect = require('chai').expect;
const sinon = require('sinon');

var AWS = require('aws-sdk-mock');

const step1 = require('../../casedata').step1;


describe(`when we invoke step1`,  () => {
    const txnid = 'txn-xxx';
    let event = {
        processData: txnid
    };

    AWS.mock("S3", "getObject", Promise.resolve({ Body: Buffer.from('{"processInput":{"metavar":"foo"}}') }));
    

    it(`writes the metavar input as a state machine variable`,  (done) => {
        process.env.BUCKET_NAME = 'step1bucket';

        let putSpy = sinon.spy((params, callback) => {
            console.log(params.Body, 'type is', typeof params.Body);
            let parsedBody = JSON.parse(params.Body);
            try {
                expect(params.Key).equals(txnid);
                expect(parsedBody.processInput.metavar).equals('foo');
                expect(parsedBody.step1).equals('Step 1 output');
            } catch(e) {
                done(e);
                return;
            }

            callback(null, 'putObject response');
        });

        AWS.mock("S3", "putObject", putSpy);

        step1(event, {}, (err,data)=>{
            console.log('callback err', err); 
            try {
                expect(err).to.be.null
                expect(data.processData).equal(txnid);
                expect(data.metavar).equal('foo');
                done();
            } catch(e) {
                done(e);
            }
        })
          
           

        
    });
});