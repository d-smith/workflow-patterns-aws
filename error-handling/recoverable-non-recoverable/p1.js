var chance = require('chance').Chance();


class RecoverableError extends Error {
    constructor(...args) {
        super(...args)
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NonRecoverableError extends Error {
    constructor(...args) {
        super(...args)
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

const maybeThrow = () => {
    let recoverable = chance.bool({likelihood: 50});
    if (recoverable) {
        throw new RecoverableError();
    }

    let nonRecoverable = chance.bool({likelihood: 15});
    if(nonRecoverable) {
        throw new NonRecoverableError();
    }
};

module.exports.step1 = async (event, context, callback) => {
    event['step1Greeting'] = 'step 1 says hello';
    maybeThrow();
    callback(null, event);
}

module.exports.step2 = async (event, context, callback) => {
    event['step2Greeting'] = 'step 2 says yo';
    maybeThrow();
    callback(null, event);
}