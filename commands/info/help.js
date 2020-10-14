const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
	name: "help",
    aliases: ["h"],
    category: "info",
    description: "Liste toutes les commandes, ou les infos d'une en particulier",
    usage: "[command | alias]",
	guildOnly: true,
    run: async (client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message);
        }
    }
}

function getAll(client, message) {
    const embed = new MessageEmbed()
        .setColor("DARK_BLUE")

    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join("\n");
    }

    const info = client.categories
		.filter(cat => {
			if (message.member.manageable) return cat !== "admin";
			else return true;
		})
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `Pas d'infos sur la commande **${input.toLowerCase()}** ou vous n'avez pas les droits`;

	console.log(cmd.adminPermission);
	console.log(message.member.manageable);
	console.log(cmd.adminPermission && (!message.member.manageable ^ cmd.adminPermission));

    if (!cmd || (cmd.adminPermission && (!message.member.manageable ^ cmd.adminPermission))) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    if (cmd.name) info = `**Nom**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = requis, [] = optionel`);
    }

    return message.channel.send(embed.setColor("GREYPLE").setDescription(info));
}
