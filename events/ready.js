const {Events} = require('discord.js')

module.exports = {
 name: Events.ClientReady, 
 //propriedade once tem um valor booleano que especifíca se o evento deve ser executado somente uma vez
 once: true, 
 execute(client){
    console.log(`Pronto! Conectado com ${client.user.tag}`)
 }   
}