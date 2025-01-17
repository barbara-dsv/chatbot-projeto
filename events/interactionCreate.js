const {Events, MessageFlags} = require('discord.js')

module.exports = {
    //propriedade name declara para qual evento esse arquivo é 
    name: Events.InteractionCreate,
    async execute(interaction){
         // Verifica se a interação é um comando de chat
        if (!interaction.isChatInputCommand()) return;
        //recupera o comando correspondente ao nome do comando executado da coleção de comandos 
        const command = interaction.client.commands.get(interaction.commandName)
        //Verifica se o comando foi encontrado na coleção.
        if (!command){
            console.error(`No command matching ${interaction.commandName} was found.`)
            return;
        }
        // Executa o comando e trata erros com try-catch
        try{
            await command.execute(interaction)
        } catch (error){
            console.log(error)
            //verifica se a interação foi respondido ou se uma resposta está pendente 
            if(interaction.replied || interaction.deferred){
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral})
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            }
        }
        console.log(interaction);
    }
}