module.exports.step1 = async (event, context, callback) => {
    callback(null, 'step1');
}

module.exports.fooStep = async (event, context, callback) => {
    callback(null, 'fooStep');
}

module.exports.barStep = async (event, context, callback) => {
    callback(null, 'barStep');
}

module.exports.bazStep = async (event, context, callback) => {
    callback(null, 'bazStep');
}

module.exports.quuxStep = async (event, context, callback) => {
    callback(null, 'quuxStep');
}