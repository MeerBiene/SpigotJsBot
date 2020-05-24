const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {

    if (!message.member.hasPermission(`ADMINISTRATOR`)) return message.channel.send(`You have no permission to use this command!`).then(msg => {
        msg.delete(30000).catch(error => {})
    })


    let embed = new Discord.RichEmbed()
        .setTitle('Reaction Roles')
        .setThumbnail(client.user.avatarURL)
        .setDescription(`React with: \n\n🏓 - to get the extra ping role.\n🇩🇪 - to get the german role. \n🇺🇸 - to get the english role.`)
        .setColor("BLUE")

    message.channel.send(embed).then(async msg => {
        await msg.react("🏓")
        await msg.react("🇩🇪")
        await msg.react("🇺🇸")
    })


};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "ADMIN"
};

exports.help = {
    name: "reactor",
    category: "System",
    description: "Send the reaction message.",
    usage: `Reactor in the channel.`
};