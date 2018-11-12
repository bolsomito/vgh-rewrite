const Discord = require('discord.js');
const fs = require('fs');
const commands = [];
fs.readdir('./commands/', (err, files) => {
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    jsfile.forEach((f, i) => {
        let jsCmd = require(`./${f}`).command;
        let jsName = jsCmd.name;
        let jsFull = jsCmd.fullCmd;
        let jsDesc = jsCmd.description;
        let jsHidden = jsCmd.hidden;
        if(jsHidden == true) return;
        else if(jsHidden == false) {
            commands.push([jsName, jsFull, jsDesc]);
        }
    })
});

exports.run = (client, msg) => {
    const emb = new Discord.RichEmbed();
    msg.channel.startTyping();
    emb.setColor('#2040ff');
    emb.setAuthor(client.user.tag+' Commands', client.user.avatarURL, 'http://vgh.ftp.sh');
    emb.addField('Command List', commands.map(c => c[1]+'** ➤ '+c[2]+'**'));
    emb.addBlankField();
    emb.addField('Useful Links', 'Join my Support Server: [https://discord.gg/pzb5J8j](https://discord.gg/pzb5J8j)\nInvite me to your server: [http://link.utiliboat.party/l64ne](http://link.utiliboat.party/l64ne)\nGithub repository: [https://github.com/PillGP/video-game-helper](https://github.com/PillGP/video-game-helper)\nMy website: [http://vghelper.tk](http://vghelper.tk)\nDonate so that I can stay online 24/7: [https://ko-fi.com/pillgp](https://ko-fi.com/pillgp)');
    emb.addBlankField();
    emb.addField('Official Partners', 'TUNADOS: <https://discord.gg/zeDjtMY>');
    emb.setFooter(msg.author.tag, msg.author.avatarURL);
    msg.channel.stopTyping();
    msg.channel.send({embed:emb});
}

exports.command = {
    name: "help",
    fullCmd: process.env.PREFIX+"help",
    description: "Shows the help menu",
    hidden: false
}
