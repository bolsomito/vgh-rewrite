const { Command, Embed } = require('../../structures')
const moment = require('moment')
const os = require('os')

module.exports = class Stats extends Command {
  constructor (client) {
    super(client)
    this.name = 'stats'
    this.category = 'info'
  }

  async run (message, args, strings) {
    const embed = new Embed(message.author)
    const memory = process.memoryUsage()
    embed.setAuthor(strings.statistics.replace('{0}', this.client.user.username), this.client.user.avatarURL)
      .addField(strings.totalUsableMemory, this.formatBytes(os.totalmem()), true)
      .addField(strings.nodeMemoryUsage, this.formatBytes(memory.heapUsed), true)
      .addField(strings.nodeJsVersion, process.version, true)
      .addField(strings.discordJsVersion, `v${require('discord.js').version}`, true)
      .addField(strings.systemUptime, moment.duration(os.uptime() * 1000).format('d[d] h[h] m[m] s[s]'), true)
      .addField(strings.processUptime, moment.duration(process.uptime() * 1000).format('d[d] h[h] m[m] s[s]'), true)
      .addField(strings.servers, this.client.guilds.size, true)
      .addField(strings.channels, this.client.channels.size, true)
      .addField(strings.users, this.client.users.size, true)
    message.channel.send(embed)
  }

  formatBytes (a, b) {
    if (a === 0) return '0 Bytes'
    var c = 1024
    var d = b || 2
    var e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var f = Math.floor(Math.log(a) / Math.log(c))
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
  }
}
