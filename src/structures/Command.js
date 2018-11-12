module.exports = class Command {
  constructor (client, parentCommand) {
    this.client = client

    this.name = 'command'
    this.aliases = []

    this.hidden = false

    this.subcommands = []

    this.parentCommand = parentCommand

    this.developerOnly = false

    this.clearWhenFulfilled = false

    this.silent = false
  }

  canRun () {
    return true
  }

  canLoad () {
    return true
  }

  _run (msg, args, user, strings, commandStrings, usedPrefix) {
    if (this.developerOnly && !this.silent && !this.client.botOwners.includes(msg.author.id)) return msg.channel.send(':-1: - NEED_OWNER').then(m => m.delete(5000))
    args = args.join(' ').replace(/--clear/g, '').replace(/-c/g, '').split(' ')
    if (args.length > 0) {
      let subcommand = this.subcommands.find(c => c.name.toLowerCase() === args[0] || c.aliases.includes(args[0]))
      if (subcommand && subcommand.canRun(msg, args.slice(1))) {
        if (this.clearWhenFulfilled || msg.content.includes('--clear') || msg.content.includes('-c')) msg.delete()
        return subcommand.run(msg, args.slice(1), user, strings, commandStrings, usedPrefix)
      }
    }
    if (this.clearWhenFulfilled || msg.content.includes('--clear') || msg.content.includes('-c')) msg.delete()
    return this.run(msg, args, user, strings, commandStrings, usedPrefix)
  }

  run () {}
}
