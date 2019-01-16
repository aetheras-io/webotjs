const channel = 'foobar'
const { Wechaty } = require('wechaty')
const bot = new Wechaty()
const stan = require('node-nats-streaming').connect('test-cluster', 'webot');
stan.on('connect', () => {

  bot.on('scan', onScan)
  bot.on('login', onLogin)
  bot.on('logout', onLogout)
  bot.on('message', onMessage)
  bot.start()
    .then(() => console.log('Bot Started.'))
    .catch(e => console.error(e))
})

stan.on('close', async function () {
  await bot.stop()
  process.exit()
});

function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console
  console.log('Scan to Login')
  //generate a link to scan
  // const qrcodeImageUrl = [
  //   'https://api.qrserver.com/v1/create-qr-code/?data=',
  //   encodeURIComponent(qrcode),
  // ].join('')

  // console.log(qrcodeImageUrl)
}

function onLogin(user) {
  console.log(`${user} logged in`)
}

function onLogout(user) {
  console.log(`${user} logged out`)
}

async function onMessage(msg) {
  console.log('=================')
  console.log(msg.payload)
  console.log('=================')

  stan.publish(channel, JSON.stringify(msg.payload, null, 2), function (err, guid) {
    if (err) {
      console.log('publish failed: ' + err);
    } else {
      console.log('published message with guid: ' + guid);
    }
  });
}


