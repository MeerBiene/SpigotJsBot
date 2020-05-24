module.exports = async (client, message) => {

    if (!message.guild) return

    if (message.author.bot) return


    const Prefix = client.config.prefix


    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.channel.send(embeds.embed(`My prefix on this guild is \`${Prefix}\`\n\nFor more information do \`${Prefix}help\``))
            .then(msg => { msg.delete(msgdel).catch(error => {}) });
    }


    if (message.content.indexOf(Prefix) !== 0) return;


    const args = message.content.slice(Prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();


    if (message.guild && !message.member) await message.guild.fetchMember(message.author);


    const level = 1


    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if (!cmd) return;


    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send(embeds.warning("This command is unavailable via private message. Please run this command in a guild."));

    try {
        cmd.run(client, message, args, level);
        message.delete(20).catch(error => {});
    } catch (e) {
        console.error(e)
    }

}