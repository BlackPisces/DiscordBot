const { Client, Collection } = require("discord.js");
const { prefix, token } = require("./config.json");
const { embedData } = require("./infos.json");
const fs = require("fs");

const client = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        activity: {
            name: "Game&Dev",
            type: "WATCHING"
        }
    });
});

client.on("message", async message => {
    //  We retrun when the message don't start with the prefix or it's not a user who send it
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //  We get the arguments and the command from the message, and return if there is nothing
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    //  We check if the command exist, else we return
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (!command) return;

    //  We check if the command can be used on DMs
    if (command.guildOnly && message.channel.type === 'dm') {
    	return message.reply(`Cette commande ne s'exécute que sur le serveur`);
    }

    //  We check if the command use arguments
    if (command.args && !args.length) {
		return message.channel.send(`Cette commande nécessite des arguments, ${message.author} ! Check la commande !help pour plus d'infos`);
	}

    //  We check if the member has the right to use this command
    if (!message.guild && command.adminPermission && !message.member.manageable) {
    	return message.reply(`Vous n'avez pas les droits pour exécuter cette commande`);
    }

    command.run(client, message, args);
});

client.on("messageReactionAdd", async (reaction, user) => reactionUpdate(reaction, user, true));

client.on("messageReactionRemove", async (reaction, user) => reactionUpdate(reaction, user, false));

client.login(token);

async function reactionUpdate(reaction, user, addrole) {
    //  When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		//  If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			//  Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

    if (user.bot) return;

    if (!reaction.message.guild) {
        return;
    }
    else {
        const channel = reaction.message.channel;

        //  We only want to check for the channel "infos"
        if (!channel.name === "infos") return;

        const member_roles = reaction.message.guild.member(user).roles;
        const server_roles = reaction.message.guild.roles.cache;

        try {
            if (addrole) member_roles.add(server_roles.find(role => role.name === findRole(reaction)));
            else member_roles.remove(server_roles.find(role => role.name === findRole(reaction)));
        } catch (e) {
            console.log(e);
        }
    }
}

function findRole(reaction) {
    const emoji = embedData.find(data => reaction.message.id === data.id).reactions.find(data => reaction.emoji.name === data.emote);

    if (emoji) return emoji.role;
    else return reaction.emoji.name;
}
