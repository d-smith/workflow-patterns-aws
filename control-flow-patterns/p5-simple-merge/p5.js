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

module.exports.foo2 = async (event, context, callback) => {
    callback(null, 'foo2');
}

module.exports.bar2 = async (event, context, callback) => {
    callback(null, 'bar2');
}

module.exports.baz2 = async (event, context, callback) => {
    callback(null, 'baz2');
}

module.exports.quuxStep = async (event, context, callback) => {
    callback(null, 'quuxStep');
}

module.exports.lastStep = async (event, context, callback) => {
    callback(null, 'lastStep');
}