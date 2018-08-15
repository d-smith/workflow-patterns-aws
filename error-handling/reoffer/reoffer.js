module.exports.step1 = async (event, context, callback) => {
    callback(null, 'step 1 says hello');
}

module.exports.step2 = async (event, context, callback) => {
    callback(null, 'step 2 says yo');
}