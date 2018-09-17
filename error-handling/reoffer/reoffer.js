module.exports.step1 = async (event, context, callback) => {
    console.log(`context: ${JSON.stringify(context)}`);
    console.log(`event: ${JSON.stringify(event)}`);
    callback(null, 'step 1 says hello');
}

module.exports.step2 = async (event, context, callback) => {
    callback(null, 'step 2 says yo');
}