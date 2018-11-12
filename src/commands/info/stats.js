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

/*
const Discord = require('discord.js');
const info = require('systeminformation');
const os = require('os');
const request = require('request-promise');
const moment = require('moment');
function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); 
    var hours   = Math.floor(sec_num / 3600);
    var days   = Math.floor(hours / 24);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+'h '+minutes+'m '+seconds+'s';
        days >= 1 ? time = days+" day(s) " : time = time
    return time;
};

exports.run = (client, msg, args) => {
    let members = 0;
    client.guilds.forEach(g => members+=g.memberCount);
    let embed = new Discord.RichEmbed();
        msg.channel.send('<a:loading_gears:422883735906549774>').then(async function(m) {
            await embed.setAuthor('Video Game Helper Statistics', client.user.avatarURL, 'http://vgh.ftp.sh');
            // await request.get('https://api.github.com/repos/pillgp/video-game-helper/commits/master', {headers: { 'User-Agent': 'PillGP' }}).then(body => {
            //     let b = JSON.parse(body);
            //     embed.addField(`Last Github Commit (\`${moment(Date.parse(b.commit.committer.date)).format('DD/MM/YYYY @ HH:MM')}\``, `${b.commit.message}`)
            // });
            await embed.setColor("#75C0AC");
            await embed.addBlankField();
            await info.mem(function (mem) { embed.addField('Total Memory Usage', formatBytes(mem.used), true); });
            await embed.addField('Node.JS Memory Usage', formatBytes(process.memoryUsage().heapUsed), true);
            await embed.addField('Node.JS Version', process.version, true);
            await embed.addField('Discord.JS Version', `v${require('discord.js').version}`, true);
            await embed.addField('System Uptime', (Math.floor(os.uptime())+'').toHHMMSS(), true);
            await embed.addField('Process Uptime', (Math.floor(process.uptime())+'').toHHMMSS(), true);
            await embed.addField('Server Count', client.guilds.size, true);
            await embed.addField('Channel Count', client.channels.size, true);
            await embed.addField('Member Count', members, true);
            m.delete();
            msg.channel.send({embed});
        });
    }
}

exports.command = {
    name: "stats",
    fullCmd: process.env.PREFIX+"stats",
    description: "Shows stats about myself",
    hidden: false
}
*/
