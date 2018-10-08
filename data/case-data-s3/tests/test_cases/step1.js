const expect = require('chai').expect;

var AWS = require('aws-sdk-mock');

const step1 = require('../../casedata').step1;


describe(`when we invoke step1`,  () => {
    let event = {
        processData: 'txn-xxx'
    };

    AWS.mock("S3", "getObject", Promise.resolve({ Body: Buffer.from('{"processInput":{"metavar":"foo"}}') }));
    AWS.mock("S3", "putObject", "stuff");

    it(`writes the metavar input as a state machine variable`,  (done) => {
        process.env.BUCKET_NAME = 'step1bucket';

        step1(event, {}, (err,data)=>{
            console.log('callback err', err); 
            try {
                expect(err).to.be.null
                expect(data.processData).equal('txn-xxx');
                expect(data.metavar).equal('foo');
                done();
            } catch(e) {
                done(e);
            }
        })
          
           

        
    });
});