module.exports = {
    name: "reserve",
    aliases: ["r"],
    category: "admin",
    description: "Réserve un message par le bot",
    guildOnly: true,
    adminPermission: true,
    run: async (client, message, args) => {
        try {
            await message.channel.send(`*reserved*`);
            await message.delete();
        } catch (e) {
            console.log(e);
        }
    }
}
