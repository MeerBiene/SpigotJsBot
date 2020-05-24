module.exports = async (client, messageReaction, user) => {

    if (!messageReaction) return

    if (!messageReaction.message) return

    if (messageReaction.message.channel.type === "dm") return

    if (messageReaction.message.id !== client.config.reactionmessage) return

    if (user.bot) return

    let reac = messageReaction.emoji.name
    let userinio = user.id

    function roleadder(user, roleid) {

        let role = messageReaction.message.guild.roles.get(roleid)

        let member = messageReaction.message.guild.members.get(user.id)

        member.removeRole(role);

    }

    if (userinio === client.user.id) return

    if (reac === "🏓") {

        roleadder(user, client.config.pingrole)

    } else if (reac === "🇩🇪") {

        roleadder(user, client.config.germanrole)

    } else if (reac === "🇺🇸") {

        roleadder(user, client.config.englishrole)

    }


}