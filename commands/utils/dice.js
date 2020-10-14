module.exports = {
    name: "dice",
    aliases: ["roll", "rando"],
    category: "utils",
    description: "Choisi un nombre aléatoire entre <min> et <max>. Valeur par défaut : min = 1 et max = 10",
    usage: "<max> <min>",
    run: async (client, message, args) => {
        const max = args[0] || 10;
        const min = args[1] || 1;

        const random = Math.floor(Math.random() * ((max - 0) - (min - 0) +1)) + (min - 0);
        return message.reply(random);
    }
}
