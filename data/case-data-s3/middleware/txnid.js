const middy = require('middy');
var Chance = require('chance'),
    chance = new Chance();

module.exports = () => {
    

      return ({
          before: (handler,next) => {
              if(handler.context) {
                handler.context.txnId = chance.guid({version: 4});
              }
              next();
          }
      });
}