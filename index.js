const commands = require('./index')

client.on('message', async message => {
  if (!message.body.startsWith('!')) return

  const args = message.body.slice(1).split(' ')
  const commandName = args.shift().toLowerCase()

  const command = commands.get(commandName)
  if (!command) return

  await command.execute(message, client)
})
