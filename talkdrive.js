const {
  default: makeWASocket,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys')

module.exports = async ({ commands, PREFIX }) => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')

  const sock = makeWASocket({ auth: state })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    if (!text || !text.startsWith(PREFIX)) return

    const args = text.slice(PREFIX.length).trim().split(/\s+/)
    const name = args.shift().toLowerCase()

    const command = commands.get(name)
    if (!command) return

    await command.execute({ sock, message: msg, args })
  })
  }
