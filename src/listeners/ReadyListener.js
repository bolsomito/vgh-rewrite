const { EventListener } = require('../structures')

module.exports = class ReadyListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready']
  }

  onReady () {
    if (process.env.PRESENCE_MESSAGE) this.user.setPresence({ game: { name: process.env.PLAYING, type: 'WATCHING', url: 'https://twitch.tv/pillgp' } })
    else this.user.setPresence({ game: { name: `${process.env.PREFIX}help`, type: 'WATCHING', url: 'https://twitch.tv/pillgp' } })
  }
}
