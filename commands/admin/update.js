const { MessageEmbed } = require("discord.js");
const { embedData } = require("../../infos.json");

module.exports = {
    name: "update",
    aliases: ["u","rinfos"],
    category: "admin",
    description: "Met à jour les messages du channel 'infos'",
    guildOnly: true,
    adminPermission: true,
    run: async (client, message, args) => {
        if (message.author.tag === "BlackPisces#2032") {
            const channel = message.guild.channels.cache.find(channel => channel.name === "infos");

            embedData.forEach( data => {
                const embed = new MessageEmbed()

                embed.setColor(data.color)
                embed.setTitle(data.text.title)
                embed.setDescription(data.text.desc)

                if (data.text.fields) {
                    data.text.fields.forEach(field => embed.addField(field.key, field.value, field.inline));
                }

                if (data.text.footer) {
                    embed.setFooter(data.text.footer)
                    embed.setTimestamp();
                }

                console.log(embed);

                channel.messages.fetch(data.id)
                    .then(mes => mes.edit("", embed))
                    .then(mes => {
                        if(data.reactions) data.reactions.forEach(reaction => mes.react(reaction.emote))
                    })
                    .catch(e => console.log(e));
            });

            try {
                await message.delete();
            } catch (e) {
                console.log(e);
            }
        }
    }
}
