if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");


const Discord = require("discord.js");
const {
    promisify
} = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");


const client = new Discord.Client();

client.config = require("./config.js");

client.commands = new Enmap();
client.aliases = new Enmap();


const init = async () => {

    async function loadCommand(category, commandName) {
        try {
            let name = category.toUpperCase()

            const props = require(`./commands/${category}/${commandName}`);
            if (props.init) {
                props.init(client);
            }
            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }

    async function load(category) {
        let name = category.toUpperCase()
        const cmdFilesFun = await readdir(`./commands/${category}/`);
        let amount = cmdFilesFun.length

        cmdFilesFun.forEach(f => {
            if (!f.endsWith(".js")) return;
            const response = loadCommand(category, f);
            if (response) console.log("Loaded: " + f)
        });
    }



    var categorys = [
        'system'
    ]

    categorys.forEach(c => {
        load(c);

    })




    const evtFiles = await readdir("./events/");
    let amount = evtFiles.length

    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];

        const event = require(`./events/${file}`);

        client.on(eventName, event.bind(null, client));
    });






    client.on('raw', packet => {
        // We don't want this to run on unrelated packets
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE', 'VOICE_STATE_UPDATE'].includes(packet.t)) return;
        // Grab the channel to check the message from
        if (packet.t === 'VOICE_STATE_UPDATE') {

            let user = packet.d.user_id
            let guild = packet.d.guild_id
            let channel = packet.d.channel_id
            const voiceuserobject = {
                user: user,
                guild: guild,
                channel: channel
            }

            client.emit('voiceactivity', voiceuserobject)

        } else {
            const channel = client.channels.get(packet.d.channel_id);
            // There's no need to emit if the message is cached, because the event will fire anyway for that
            if (channel.messages.has(packet.d.message_id)) return;
            // Since we have confirmed the message is not cached, let's fetch it
            channel.fetchMessage(packet.d.message_id).then(message => {
                // Emojis can have identifiers of name:id format, so we have to account for that case as well
                const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                // This gives us the reaction we need to emit the event properly, in top of the message object
                const reaction = message.reactions.get(emoji);
                // Adds the currently reacting user to the reaction's users collection.
                if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
                // Check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
                }
            });
        }


    });


    // Here we login the client.
    client.login(client.config.token);
    console.log(`The bot is started and ready to go.`)



    // End top-level async/await function.
};

init();