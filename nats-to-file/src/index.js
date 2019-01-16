
const channel = 'foobar'
const util = require('util')
const fs = require('fs')
const stan = require('node-nats-streaming').connect('test-cluster', 'webot-scrape')

stan.on('connect', () => {
    // Subscriber can specify how many existing messages to get.
    var opts = stan.subscriptionOptions().setStartWithLastReceived();
    var subscription = stan.subscribe(channel, opts);
    subscription.on('message', function (msg) {
        console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData());

        const filename = util.format('../dist/data/%d.json', msg.getSequence())
        fs.writeFileSync(filename, msg.getData(), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
})

stan.on('close', async function () {
    await bot.stop()
    process.exit()
});
