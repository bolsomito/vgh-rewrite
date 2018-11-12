const { EventListener } = require('../structures')

module.exports = class GuildListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['guildCreate', 'guildDelete']
  }

  onGuildCreate (guild) {
    this.log(`Joined guild ${guild.name}, with ${guild.members.size} members`, 'Guilds')
  }

  onGuildDelete (guild) {
    this.log(`Left guild ${guild.name}, with ${guild.members.size} members`, 'Guilds')
  }
}
