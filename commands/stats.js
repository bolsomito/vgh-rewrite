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
    if(args[0] === '-nospeed') {
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
    } else {
        let speed = require('speedtest-net')({maxTime: 5000});
        msg.channel.send('<a:loading_gears:422883735906549774> | Waiting for SpeedTest results').then(async function(m) {
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
            await speed.on('error', error => {
                embed.addBlankField();
                embed.addField('SpeedTest Errored', '```'+error+'```');
                m.delete();
                msg.channel.send({embed});
            });
            await speed.on('data', data => {
                embed.addBlankField();
                embed.addField(`SpeedTest results \`(Powered by ${data.server.sponsor})\``, `\`\`\`md\n[Ping]: ${data.server.ping} ms\n[Download]: ${data.speeds.download} mb/s\n[Upload]: ${data.speeds.upload} mb/s\`\`\``);
                m.delete();
                msg.channel.send({embed});
            });
        }).catch(err => console.log(err));
    }
}

exports.command = {
    name: "stats",
    fullCmd: process.env.PREFIX+"stats",
    description: "Shows stats about myself",
    hidden: false
}