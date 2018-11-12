module.exports.step1 = async (event, context) => {
    console.log(`context: ${JSON.stringify(context)}`);
    console.log(`event: ${JSON.stringify(event)}`);
    return 'step 1 says hello';
}

module.exports.step2 = async (event, context) => {
    return 'step 2 says yo';
}