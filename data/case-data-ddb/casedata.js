

const stubbed = async (event, context) => {
    return 'all work and no play makes Jack a dull boy';
}

module.exports.step1 = stubbed;
module.exports.fooStep = stubbed;
module.exports.barStep = stubbed;
module.exports.step1 = bazStep;
module.exports.step1 = quuxStep;