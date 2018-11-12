const { Command, Embed } = require('../../structures')
const { Constants } = require('../../utils')

const prefixRegex = (prefix) => new RegExp(`^(?:${prefix})?(.+)`)

module.exports = class Help extends Command {
  constructor (client) {
    super(client)
    this.name = 'help'
    this.aliases = ['commands', 'ajuda']
    this.category = 'info'
  }

  async run (message, args, commandStrings) {
    const embed = new Embed(message.author)
    const validCommands = this.client.commands.filter(c => !c.hidden)
    const validStrings = this.client.strings.commands
    const prefix = process.env.PREFIX
    let cmd = args[0]

    if (cmd) {
      const regexMatch = cmd.match(prefixRegex(prefix))
      cmd = regexMatch && regexMatch[1]
      const command = cmd.split(' ').reduce((o, ca) => {
        const arr = (Array.isArray(o) && o) || (o && o.subcommands)
        if (!arr) return o
        return arr.find(c => c.name === ca || c.aliases.includes(ca))
      }, validCommands)
      if (command) {
        const description = [
          validStrings[command.name]._description ? validStrings[command.name]._description : commandStrings.noDescription,
          '',
          validStrings[command.name]._usage ? `\`${prefix}${command.name} ${validStrings[command.name]._usage}\`` : `\`${prefix}${command.name}\``
        ]

        if (command.aliases.length > 0) description.push(`**${commandStrings.aliases}:** ${command.aliases.map(a => `\`${a}\``).join(', ')}`)
        if (command.subcommands.length > 0) description.push(`**${commandStrings.subcommands}:** ${command.subcommands.map(a => `\`${a.name}\``).join(', ')}`)

        embed.setTitle(command.name)
          .setDescription(description.join('\n'))
      } else {
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(commandStrings.commandNotFound)
      }
    } else {
      const infoCommands = validCommands.filter(c => c.category === 'info').map(c => `\`${c.name}\``).sort((a, b) => a.localeCompare(b)).join('**, **')
      embed.setAuthor(commandStrings.listTitle, this.client.user.displayAvatarURL)
        .setDescription([
          `**${commandStrings.info}**`,
          `${infoCommands}`
        ].join('\n'))
    }
    message.channel.send(embed)
  }
}
