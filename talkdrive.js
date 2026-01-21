const {
  default: makeWASocket,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys')
const readline = require('readline')

async function startBot({ commands, PREFIX }) {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')

  const sock = makeWASocket({
    auth: state
  })

  sock.ev.on('creds.update', saveCreds)

  // 👉 DEMANDE DU NUMÉRO
  if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question('📱 Entre ton numéro WhatsApp (ex: 509xxxxxxxx) : ', async (number) => {
      rl.close()
      const code = await sock.requestPairingCode(number.trim())
      console.log(`\n🔑 CODE DE CONNEXION : ${code}\n`)
      console.log('➡ Va sur WhatsApp > Appareils connectés > Connecter avec un numéro')
    })
  }

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0]
    if (!message.message) return

    const text =
      message.message.conversation ||
      message.message.extendedTextMessage?.text

    if (!text || !text.startsWith(PREFIX)) return

    const args = text.slice(PREFIX.length).trim().split(/\s+/)
    const commandName = args.shift().toLowerCase()

    const command = commands.get(commandName)
    if (!command) return

    await command.execute({ sock, message, args })
  })
}

module.exports = startBot
