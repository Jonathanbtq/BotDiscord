require('dotenv').config()
const axios = require('axios')
const { Configuration, OpenAIAPI } = require("openai");

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
    fetchData()
    setInterval(fetchData, 1800000);
})

const token = process.env.DISCORD_LOGIN
client.login(token)

const apiUrl = "https://lordblock.jonathanbotquin.fr/api";

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

const fetchData = async () => {
    const channelName = 'jonathan-dev'
    const guild = client.guilds.cache.first();
    const devChannel = guild.channels.cache.find(channel => channel.name === channelName);
    try{
        const response = await axios.get(`${apiUrl}/getNewCandidature`)
        if(response.data != false){
            if(response.data.length > 1){
                // devChannel.send('Nouvelles candidatures')
                response.data.forEach(candidature => {
                    devChannel.send(`${candidature.pseudo},  \n Lien : https://lordblock.jonathanbotquin.fr/candidature/${candidature.id}`)
                })
            }else{
                devChannel.send(`${response.data[0].pseudo},  \n Lien : https://lordblock.jonathanbotquin.fr/candidature/${response.data[0].id}`)
            }
        }
    }catch(err){
        console.log(err)
    }
}

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

/**
 * ChatGpt AI
 */
const Gpt_Api = process.env.GPT_API
const openai = new OpenAIAPI({
    key : Gpt_Api
})
// const openai = new OpenAIAPI(configuration)

// const channelName = 'jonathan-dev'
// const guild = client.guilds.cache.first();
// const devChannel = guild.channels.cache.find(channel => channel.name === channelName);

const prompt = 'Quelle est la capitale de la France ?';

openai.createCompletion({
    model: 'text-davinci-003', // Choisissez le moteur approprié
    prompt: prompt,
})
.then(response => {
    // devChannel.send(response.data.choices[0].text.trim())
    console.log(response.data.choices[0].text.trim());
})
.catch(error => {
    console.error(error);
});


/**
 * Météo
 */

const weatherApiKey = process.env.WEATHER_API_KEY

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("/meteo")) {
        const args = message.content.split(' ');
        if (args.length < 2) {
            message.reply("Utilisation : /meteo <ville>");
            return;
        }

        // Récupérez la ville à partir de la commande
        const ville = args.slice(1).join(' ');

        // Faites une requête à l'API météo
        try {
            const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${weatherApiKey}&units=metric`);
            const weatherData = weatherResponse.data;

            // Affichez les informations météo
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            message.reply(`Météo à ${ville} : Température actuelle : ${temp}°C, Description : ${description}`);
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des données météo.', error);
            message.reply('Impossible de récupérer les données météo pour cette ville.');
        }
    }
});