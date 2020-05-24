const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {

    if (!message.member.hasPermission(`ADMINISTRATOR`)) return





    let embed = new Discord.RichEmbed()
        .setThumbnail(client.user.avatarURL)
        .setTitle(`${message.guild.me.displayName}  -  Command List \n`)
        .addField(`!reactor`, "> Sends a reactionmessage into the current channel (requires admin) ")
        .setColor("#2C2F33")


    message.channel.send(embed).then(msg => {
        msg.delete(30000).catch(error => {})
    })








};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "STAFF"
};

exports.help = {
    name: "help",
    category: "System",
    description: "Display available commands and their usage.",
    usage: `help`
};