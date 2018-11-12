const AWS = require('aws-sdk');
var proxy = require('proxy-agent');    
AWS.config.update({
    httpOptions: { agent: proxy(process.env.HTTPS_PROXY) }
});

var stepfunctions = new AWS.StepFunctions();

const makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

const hasData = (o) => {
    return Object.keys(o).length > 0;
};

const checkInputs = () => {
    let STEP_ARN=process.env.STEP_ARN;
    if(STEP_ARN == undefined) {
        console.log('STEP_ARN environment variable must be defined');
        process.exit(1);
    }

    args = process.argv.slice(2);
    if(args.length != 1) {
        console.log('Usage: node worker.js ok|fail');
        process.exit(1);
    }

    if(args[0] != 'ok' && args[0] != 'fail') {
        console.log('Usage: node worker.js ok|fail');
        process.exit(1);
    }

    return {
        stepArn: STEP_ARN,
        action: args[0]
    };
}

const doAction = async (ctx) => {
    const workerName = 'worker-' + makeid();

    let params = {
        activityArn: ctx.stepArn,
        workerName: workerName
    };

    let activityData = await stepfunctions.getActivityTask(params).promise();
    if(!hasData(activityData)) {
        console.log('no data to process');
        return;
    }

    taskToken = activityData['taskToken'];
    taskInput = activityData['input'];

    if(ctx.action == 'ok') {
        console.log('send task success');
        let myOutput = {m1: 'all ok'};
        await stepfunctions.sendTaskSuccess(
            {
                output: JSON.stringify(myOutput),
                taskToken: taskToken
            }
        ).promise();
    } else {
        console.log('send task failure');
        await stepfunctions.sendTaskFailure(
            {
                taskToken: taskToken,
                cause: 'unlock item',
                error: 'Reoffer.Unlock'
            }
        ).promise();
    }

}

const main = async () => {
    let ctx = checkInputs();
    console.log(ctx);
    await doAction(ctx);
}

main();