const { Events, MessageFlags } = require('discord.js')

module.exports = {
    //propriedade name declara para qual evento esse arquivo é 
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Verifica se a interação é um comando de chat
        if (!interaction.isChatInputCommand()) return;
        //recupera o comando correspondente ao nome do comando executado da coleção de comandos 
        const command = interaction.client.commands.get(interaction.commandName)
        //Verifica se o comando foi encontrado na coleção.
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`)
            return;
        }

        const { cooldowns } = interaction.client

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();//registro de data e hora atual.
        const timestamps = cooldowns.get(command.data.name);//coleção de IDs de usuário e data e hora do comando 
        const cooldownAmount = (command.data.cooldown || 3) * 1000;   //O cooldown especificado para o comando, convertido em milissegundos para cálculo direto. Se nenhum for especificado, o padrão será três segundos.

        //com a coleção de ID do usuário como chave, usa o get() nela para obter o valor e soma  a ele o cooldownAmount variável para obter o registro de data e hora de expiração correto e verificar se ele expirou ou não.
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000)
                return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral });
            }
        }
        //execute a função após um período de tempo especificado e remove o timeout
        timestamps.set(interaction.user.id, now)
        //entrada do usuário é excluída após o tempo de espera do comando expirar para ele
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)


        // Executa o comando e trata erros com try-catch
        try {
            await command.execute(interaction)
        } catch (error) {
            console.log(error)
            //verifica se a interação foi respondido ou se uma resposta está pendente 
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            }
        }
        console.log(interaction);
    }
}