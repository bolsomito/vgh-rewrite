const request = require('request');
const cheerio = require('cheerio');
const Discord = require('discord.js');
const API = require('lol-stats-api-module');
const api = new API({
    key: process.env.RGAPI,
    region: 'euw'
});
 
const rotation = [];
const regions = ['EUW', 'EUNE', 'BR', 'JP', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'PBE', 'TR', 'RU'];
function emoji(emo) {
    delete require.cache[require.resolve(`../resources/emoji.js`)];
    let emojia = require("../resources/emoji.js");
    if (emojia[emo] === undefined) return "🅱";
    return emojia[emo];
}

exports.run = (client, msg, args) => {
    const emb = new Discord.RichEmbed();
    const lol = args.join(" ");
    if(lol.startsWith("-rotation")) {
        request('http://leagueoflegends.wikia.com/wiki/Free_champion_rotation', async function (error, response, html) {
            if(error) {
                await msg.channel.startTyping();
                await emb.setColor('#F03A17');
                await emb.addField("Error while fetching this week's rotation", "Probably it's the API's fault.\nError: `"+error+"`");
                await emb.setFooter(msg.author.avatarURL, msg.author.tag);
                await msg.channel.stopTyping();
                await msg.channel.send({embed:emb});
            } else if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                let obj = require('../resources/lol.json').data;
                let allchamps = Object.keys(obj).map(function(key) {
                    return obj[key];
                });
                await $('.champion-icon').each(async function (i, element) {
                        let champ = element.attribs["data-champion"];
                        let c = allchamps.find(x=>x.name == champ)
                        let role = c? c.tags? c.tags[0]:"Specialist":"Specialist";
                        await rotation.push([emoji(role),champ]);
                });
            }
                await msg.channel.startTyping();
                await emb.setColor('#064955')
                await emb.setAuthor('League of Legends', 'https://vignette1.wikia.nocookie.net/leagueoflegends/images/1/12/League_of_Legends_Icon.png/revision/latest?cb=20150402234343', 'http://leagueoflegends.wikia.com/wiki/League_of_Legends_Wiki');
                await emb.setThumbnail("https://vignette1.wikia.nocookie.net/leagueoflegends/images/1/12/League_of_Legends_Icon.png/revision/latest?cb=20150402234343");
                await emb.setDescription('Weekly Champion Rotation');
                await emb.addField("₪₪₪₪₪₪₪₪₪₪₪", `${rotation[0][0]}  ${rotation[0][1]}\n${rotation[2][0]}  ${rotation[2][1]}\n${rotation[4][0]}  ${rotation[4][1]}\n${rotation[6][0]}  ${rotation[6][1]}\n${rotation[8][0]}  ${rotation[8][1]}\n${rotation[10][0]}  ${rotation[10][1]}\n${rotation[12][0]}  ${rotation[12][1]}`, true);
                await emb.addField("₪₪₪₪₪₪₪₪₪₪₪", `${rotation[14][0]}  ${rotation[14][1]}\n${rotation[16][0]}  ${rotation[16][1]}\n${rotation[18][0]}  ${rotation[18][1]}\n${rotation[20][0]}  ${rotation[20][1]}\n${rotation[22][0]}  ${rotation[22][1]}\n${rotation[24][0]}  ${rotation[24][1]}\n${rotation[26][0]}  ${rotation[26][1]}`, true);
                await emb.setFooter(msg.author.tag, msg.author.avatarURL);
                await msg.channel.stopTyping();
                await msg.channel.send({embed:emb});
        });
    } else if(lol.startsWith('-player')) {
        playerdata = lol.replace('-player', '').trim();
        playerData = playerdata.split(" ");
        if(!playerData[0]) {
            msg.channel.startTyping();
            emb.setColor('#F03A17');
            emb.addField('Region not defined', 'Valid regions: `euw, eune, br, kr, jp, na, pbe, lan, las, oce, tr, ru`');
            emb.setFooter(msg.author.tag, msg.author.avatarURL);
            msg.channel.stopTyping();
            msg.channel.send({embed:emb});
        } else if(!regions.includes(playerData[0].toUpperCase())) {
            msg.channel.startTyping();
            emb.setColor('#F03A17');
            emb.addField('Invalid region', 'Valid regions: `euw, eune, br, kr, jp, na, pbe, lan, las, oce, tr, ru`');
            emb.setFooter(msg.author.tag, msg.author.avatarURL);
            msg.channel.stopTyping();
            msg.channel.send({embed:emb});
        } else if(!playerData[1]) {
            msg.channel.startTyping();
            emb.setColor('#F03A17');
            emb.addField('Username not defined', 'Try again with a valid username');
            emb.setFooter(msg.author.tag, msg.author.avatarURL);
            msg.channel.stopTyping();
            msg.channel.send({embed:emb});
        } else if(regions.includes(playerData[0].toUpperCase())) {
            platf = playerData[0];
            plat = platf.toLowerCase();
            player = playerdata.replace(platf, '').trim();
            summoner = { name: player };
            playerNoSpaces = player.replace(/\s+/g, '+').trim();
            api.getSummoner({name: player, region: plat}, async function (err, data) {
                if(err) {
                    await msg.channel.startTyping();
                    await emb.addField('An error has occured', err);
                    await emb.setColor('#F03A17');
                    await emb.setFooter(msg.author.tag, msg.author.avatarURL);
                    await msg.channel.stopTyping();
                    await msg.channel.send({embed:emb});
                    return;
                }
                if(err) console.log(err);
                await msg.channel.startTyping();
                await emb.setColor('#064955');
                await emb.setAuthor('Summoner Info', 'https://vignette1.wikia.nocookie.net/leagueoflegends/images/1/12/League_of_Legends_Icon.png/revision/latest?cb=20150402234343');
                await emb.setDescription("Info about: [" + data.name + "](" + "http://" + plat + ".op.gg/summoner/userName=" + playerNoSpaces + ")");
                await emb.setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + '8.2.1' + "/img/profileicon/" + data.profileIconId + ".png");
                await emb.addField('Summoner Level', data.summonerLevel, true);
                await emb.addField('Summoner ID', data.id, true);
                await emb.addField('Account ID', data.accountId, true);
                await emb.addField('Icon ID', data.profileIconId, true);
                await emb.setFooter(msg.author.tag, msg.author.avatarURL);
                await msg.channel.stopTyping();
                await msg.channel.send({embed:emb});
            });
        }
    } else if(!args[0]) {
        msg.channel.startTyping();
        emb.setColor('#064955');
        emb.setAuthor('League of Legends Commands', 'https://vignette1.wikia.nocookie.net/leagueoflegends/images/1/12/League_of_Legends_Icon.png/revision/latest?cb=20150402234343', 'https://leagueoflegends.com');
        emb.setThumbnail('https://vignette1.wikia.nocookie.net/leagueoflegends/images/1/12/League_of_Legends_Icon.png/revision/latest?cb=20150402234343');
        emb.addField('`-rotation`', "See the Weekly Champion Rotation\nUsage: `"+process.env.PREFIX+"lol -rotation`");
        emb.addField('`-player`', "See a player's statistics\nUsage: `"+process.env.PREFIX+"lol -player [region] [username]`\n\nValid regions: `euw, eune, br, kr, jp, na, pbe, lan, las, oce, tr, ru`");
        emb.setFooter(msg.author.tag, msg.author.avatarURL);
        msg.channel.stopTyping();
        msg.channel.send({embed:emb});
    }
}

exports.command = {
    name: "lol",
    fullCmd: process.env.PREFIX+"lol",
    description: "Shows stats in League of Legends",
    hidden: false
}