exports.run = (client) => {
    console.log('Preparing...');
    client.user.setActivity(process.env.PLAYING, {type: 'WATCHING'});
    // client.guilds.get('427263651888627731').channels.get('427264021205483521').edit({ name: `• VGH: ${client.guilds.size} servers` });
    console.log('Loading users... '+client.users.size+'\nLoading channels... '+client.channels.size+'\nLoading servers... '+client.guilds.size+'\n'+client.user.id+' is successfully online!');
}
