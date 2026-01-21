require('dotenv').config()
const fs = require('fs')
const path = require('path')

const PREFIX = '🌹'

// Charger les commandes
const commands = new Map()
const files = fs
  .readdirSync(path.join(__dirname, 'Commandes'))
  .filter(f => f.endsWith('.js'))

for (const file of files) {
  const cmd = require(`./Commandes/${file}`)
  commands.set(cmd.name, cmd)
}

console.log(`✅ ${commands.size} commandes chargées`)

// Lancer Baileys
const startBot = require('./talkdrive')
startBot({ commands, PREFIX })
