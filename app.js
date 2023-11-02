require('dotenv').config()
const axios = require('axios')

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

const apiUrl = "https://lordblock.jonathanbotquin.fr/api/candidatureget"; // L'URL de votre API Symfony

client.login(token);

client.on("messageCreate", async message => {
    if (message.content === "/Candidatureinfo") {
        try {
            const response = await axios.get(apiUrl);
            const data = response.data;
            data.forEach(candidature => {
                message.reply(`Candidature de : ${candidature.pseudo}, ${candidature.text}, ${candidature.date}, ${candidature.status} \n Lien : https://lordblock.jonathanbotquin.fr/candidature/${candidature.id}`);
            });
            message.reply(data.message);
        } catch (error) {
            console.error(error);
            message.reply("Une erreur s'est produite lors de la récupération des données de l'API 2.");
        }
    }
});

// client.on("messageCreate", message => {
//     // console.log(message);
//     if(message.content === "test"){
//         message.reply("Présent")
//     }

//     if(message.content === "/YukiSlow"){
//         message.reply("<@" + YukiSlow + "> est connu pour des faits de prise d'otage.");
//     }
// })

// client.on("messageCreate", async message => {
//     if (message.content === "/getCandidatures") {
//         try {
//             const response = await axios.get('https://lordblock.jonathanbotquin.fr/api/candidatureget');
//             const data = response.data;

//             const candidaturesFormatted = data.map(candidature => `ID: ${candidature.id}`);

//             // Répondez à l'utilisateur Discord avec les données formatées
//             message.reply(`Candidatures de l'API :\n${candidaturesFormatted.join('\n')}`);
//         } catch (error) {
//             console.error(error);
//         }
//     }
// });

// getData()
// async function getData(){
//     try {
//         await axios.get('https://lordblock.jonathanbotquin.fr/api')
//             .then(res => {
//                 const data = res.data
//                 console.log(data)
//             })
//         // if(response.ok){
//         //     const data = await response.json()

//         //     const candidaturesFormatted = data.map(candidature =>  `ID: ${candidature.id}`)
//         //     console.log(data);
//         // }
//     } catch (error) {
//         console.error(error);
//     }
// }
// const https = require('https');

// const instance = axios.create({
//     httpsAgent: new https.Agent({ rejectUnauthorized: false })
// });

// getData2()
// async function getData2(){
//     try {
//         await instance.get('https://lordblock.jonathanbotquin.fr/api')
//             .then(res => {
//                 console.log(res)
//                 const data = res.data.json()
//                 console.log(data)
//             })
//         // if(response.ok){
//         //     const data = await response.json()

//         //     const candidaturesFormatted = data.map(candidature =>  `ID: ${candidature.id}`)
//         //     console.log(data);
//         // }
//     } catch (error) {
//         console.error(error);
//     }
// }