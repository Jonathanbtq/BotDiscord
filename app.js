require('dotenv').config()
const axios = require('axios');

const { Client, GatewayIntentBits } = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on("ready", () => {
    console.log("Bot Prêt a discuter")
})

const token = process.env.DISCORD_LOGIN
client.login(token)

client.on("messageCreate", message => {
    console.log(message);
    if(message.content === "test"){
        message.reply("Présent")
    }

    if(message.content === "/YukiSlow"){
        message.reply("<@" + YukiSlow + "> est connu pour des faits de prise d'otage.");
    }
})

client.on("messageCreate", async message => {
    if (message.content === "/getCandidatures") {
        try {
            const response = await axios.get('https://lordblock.jonathanbotquin.fr/api/candidatureget');
            const data = response.data;

            // Traitez les données obtenues de l'API comme vous le souhaitez
            console.log(data);

            // Répondez à l'utilisateur Discord avec les données
            message.reply(`Données de l'API : ${JSON.stringify(data)}`);
        } catch (error) {
            console.error(error);
            message.reply('Une erreur s\'est produite lors de la récupération des données de l\'API.');
        }
    }
});