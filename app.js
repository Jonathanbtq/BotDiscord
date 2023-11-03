require('dotenv').config()
const axios = require('axios')

const { Client, GatewayIntentBits } = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
})

client.on("ready", () => {
    console.log("Bot Prêt a discuter")
})

const token = process.env.DISCORD_LOGIN
client.login(token)

const apiUrl = "https://lordblock.jonathanbotquin.fr/api"; // L'URL de votre API Symfony

client.login(token);

client.on("messageCreate", async message => {
    if (message.content === "/Candidatureinfo") {
        try {
            const response = await axios.get(`${apiUrl}/candidatureget`);
            const data = response.data;
            data.forEach(candidature => {
                const dateStr = candidature.date
                const candidatureDate = new Date(dateStr);
                if (!isNaN(candidatureDate.getTime())) {
                    // La conversion en objet Date a réussi
                    const formattedDate = candidatureDate.toISOString().replace('T', ' ').substring(0, 19)
                    message.reply(`Candidature de : ${candidature.pseudo}, ${formattedDate}, ${candidature.status} \n Lien : https://lordblock.jonathanbotquin.fr/candidature/${candidature.id}`);
                }else{
                    message.reply(`Candidature de : ${candidature.pseudo}, ${candidatureDate}, ${candidature.status} \n Lien : https://lordblock.jonathanbotquin.fr/candidature/${candidature.id}`);
                }
            });
        } catch (error) {
            console.error(error);
            message.reply("Une erreur s'est produite lors de la récupération des données de l'API 2.");
        }
    }
});

client.on("messageCreate", async message => {
    if (message.content.startsWith("/CandidatureBy")) {
        // Divisez le message en mots
        const args = message.content.split("_");
        
        // Les paramètres sont dans args[1], args[2], etc.
        const parametre1 = args[1];
        try {

            const response = await axios.get(`${apiUrl}/candidatureby/${parametre1}`);
            const data = response.data[0];
            message.reply(`Candidature de : ${data.pseudo}, ${data.status} \n Lien : https://lordblock.jonathanbotquin.fr/candidature/${data.id}`);
        } catch (error) {
            console.error(error);
            message.reply("Une erreur s'est produite lors de la récupération des données de l'API 2.");
        }
    }
});

client.on("messageCreate", async (message) => {
    if(message.content === "/hello"){
        try{
            const response = await axios.get(`${apiUrl}/hello`);
            const data = response.data;
            const messageFromAPI = data.message;
            message.reply(messageFromAPI);
        }catch(err){
            console.error(err);
        }
        
    }
})

client.on("messageCreate", message => {
    // console.log(message);
    if(message.content === "test"){
        message.reply("Présent")
    }

    if(message.content === "/YukiSlow"){
        message.reply("YukiSlow est connu pour des faits de prise d'otage.");
    }

    if(message.content === "/reponsedemrbot"){
        message.reply("D'abord si tu veux pas finir avec une trentaine de commandes contenant les preuves de la sequestration que tu fait sur plus de 6 individu chut !.");
    }
})

client.on("guildMemberAdd", (member) => {
    const pseudo = member.user.username;
    const channelName = 'général'
    const WelcomeChannel = member.guild.channels.cache.find(channel => channel.name === channelName)

    if(WelcomeChannel){
        const message = `Bienvenue sur le serveur ${pseudo}`
        member.guild.systemChannel.send(message)
    }
})