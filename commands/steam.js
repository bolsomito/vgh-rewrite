const Discord = require('discord.js');
const SteamApi = require('steamapi');
const steam = new SteamApi(process.env.STEAM)
const moment = require('moment');

function yn(t) {
    if(t === 'true') return 'Yes';
    else if(t === 'false') return 'No';
}

function qd(qr, daysSince) {
    if(qr <= 0) return 'No ['+qr+']';
    else if(qr >= 1) return 'Yes ['+qr+']\nDays since last ban: '+daysSince;
}

function stat(id) {
    if(id === 0) return 'offline';
    else if(id === 1) return 'online';
    else if(id === 2) return 'busy';
    else if(id === 3) return 'away';
    else if(id === 4) return 'snoozing';
    else if(id === 5) return 'looking to trade';
    else if(id === 6) return 'looking to play';
}

function stat2(id) {
    if(id === 1) return 'Private';
    else if(id === 2) return 'Friends Only';
    else if(id === 3) return 'Public';
}

function doSteamSearch(steam, embed, msg, id) {
    steam.getUserSummary(id).then(async function(s) {
        console.log(s);
        await msg.channel.startTyping();
        await embed.setColor('#1272A4');
        await embed.setAuthor('Stats about '+s.nickname+' ['+s.steamID+']', s.avatar.medium, s.url);
        await embed.setThumbnail(s.avatar.large);
        if(s.visibilityState == 3) {
            await steam.getUserBadges(id).then(async function (badges) {
                await embed.addField('Level '+badges.playerLevel, '**'+badges.playerXP+'** XP, needs **'+badges.playerNextLevelXP+'** more XP to reach level **'+(badges.playerLevel+1)+'**');    
            });
            await embed.addField('User status', 'Currently **'+stat(s.personaState)+'**\nProfile visibility: **'+stat2(s.visibilityState)+'**');
            await steam.getUserRecentGames(id).then(async function(g) {
                await embed.addField('Recently Played', '**'+g[0].name+'**\nIn the last two weeks: **'+Math.round((g[0].playTime2 / 60) * 10) / 10+' hours**\nTotal time: **'+Math.round((g[0].playTime / 60) * 10) / 10+' hours**');
            });
            await embed.addField('Member since', '**'+moment.unix(s.created).format('YYYY-MM-DD, HH:MM')+'**');
            await embed.addField('Last time seen', '**'+moment.unix(s.lastLogOff).format('YYYY-MM-DD, HH:MM')+'**');
            await steam.getUserBans(id).then(async function(b) {
                await embed.addField('Bans', 'Has community bans? **'+yn(b.communityBanned.toString())+'**\nHas VAC bans? **'+yn(b.vacBanned.toString())+'** [**'+b.vacBans+'**]\nHas game bans? **'+qd(b.gameBans, b.daysSinceLastBan)+'**');
            });
        }
        await embed.addField('User status', 'Currently **'+stat(s.personaState)+'**\nProfile visibility: **'+stat2(s.visibilityState)+'**');
        await embed.setFooter(msg.author.tag, msg.author.avatarURL);
        await embed.setImage('https://badges.steamprofile.com/profile/default/steam/'+id+'.png');
        await msg.channel.stopTyping();
        await msg.channel.send({embed:embed})
    }).catch(async function(err) {
        await msg.channel.startTyping();
        await emb.addField('An error has occured', err);
        await emb.setColor('#F03A17');
        await emb.setFooter(msg.author.tag, msg.author.avatarURL);
        await msg.channel.stopTyping();
        await msg.channel.send({embed:emb});
    });
}


exports.run = (client, msg, args) => {
    const query = args.join(" ");
    const emb = new Discord.RichEmbed();
    if(query.startsWith('-player')) {
        steamId = query.replace('-player', '').trim();
        if(!steamId[0]) {
            msg.channel.startTyping();
            emb.setColor('#F03A17');
            emb.addField('You need to define a Steam ID', 'Usage: `'+process.env.PREFIX+'steam -player [steam id or steamcommunity link]`');
            emb.setFooter(msg.author.tag, msg.author.avatarURL);
            msg.channel.stopTyping();
            msg.channel.send({embed:emb});
        } else if(!isNaN(steamId)) {
            doSteamSearch(steam, emb, msg, steamId);
        } else if(isNaN(steamId)) {
            if(steamId.includes('steamcommunity.com/id/')) {
                if(steamId.startsWith('http')) {
                    sId = steamId.replace('http://', 'https://');
                    steam.resolve(sId).then(id => {
                        doSteamSearch(steam, emb, msg, id);
                    });
                } else {
                    steam.resolve(steamId).then(id => {
                        doSteamSearch(steam, emb, msg, id);
                    });
                }
            } else if(steamId.includes('steamcommunity.com/profiles/')) {
                if(steamId.startsWith('http')) {
                    sId = steamId.replace('http://', 'https://');
                    steam.resolve(sId).then(id => {
                        doSteamSearch(steam, emb, msg, id);
                    });
                } else {
                    steam.resolve(steamId).then(id => {
                        doSteamSearch(steam, emb, msg, id);
                    });
                }
            }
        }
    } else if(!args[0]) {
        msg.channel.startTyping();
        emb.setColor('#1272A4');
        emb.setAuthor('Steam Commands', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2000px-Steam_icon_logo.svg.png');
        emb.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2000px-Steam_icon_logo.svg.png');
        emb.addField('`-player`', "Search for a player's stats\nUsage: `"+process.env.PREFIX+"steam -player [steam id or steamcommunity link]`");
        emb.setFooter(msg.author.tag, msg.author.avatarURL);
        msg.channel.stopTyping();
        msg.channel.send({embed:emb});
    }
}

exports.command = {
    name: 'steam',
    fullCmd: process.env.PREFIX+'steam',
    description: 'Shows stats on the Steam platform',
    hidden: false
}