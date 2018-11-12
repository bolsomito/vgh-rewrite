const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const emb = new Discord.RichEmbed();

exports.run = (client, guild) => {
    //
    snekfetch.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
    .set('Authorization', process.env.DISCORDBOTLIST)
    .send({ server_count: client.guilds.size })
    .then(console.log('DBL | 200 OK'))
    .catch(e => console.log('DBL | ERROR '+e));
    snekfetch.post(`https://botlist.space/api/bots/${client.user.id}`)
    .set('Authorization', process.env.BOTLISTSPACE)
    .send({ server_count: client.guilds.size })
    .then(console.log('BLS | 200 OK'))
    .catch(e => console.log('BLS | ERROR '+e));
    snekfetch.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
    .set('Authorization', process.env.DISCORDBOTS)
    .send({ server_count: client.guilds.size })
    .then(console.log('B.PW | 200 OK'))
    .catch(e => console.log('B.PW | ERROR '+e));
    //
    // client.guilds.get('427263651888627731').channels.get('427264021205483521').edit({ name: `• VGH: ${client.guilds.size} servers` });
    //
}