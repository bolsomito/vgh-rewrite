require('moment')

const CLIENT_OPTIONS = {
  'fetchAllMembers': true,
  'enableEveryone': false
}

const { VGH } = require('./src')
const client = new VGH(CLIENT_OPTIONS)
client.login().then(() => client.log('Logged in successfully!', 'Discord')).catch(e => client.logError(e))
