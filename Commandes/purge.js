module.exports = {
  name: "purge",
  description: "Supprime tous les membres du groupe sauf les admins",
  usage: "",
  async execute(client, message, args) {
    if (!message.isGroup) {
      return client.sendMessage(message.chat, { text: "Cette commande doit être utilisée dans un groupe !" }, { quoted: message });
    }

    // Message d'initiation stylisé
    const purgeMsg = `╭━━━〔 *🧨 ɪɴɪᴛɪᴀᴛɪɴɢ ᴘᴜʀɢᴇ* 〕━━━◆
┃
┃ 👁️ *Analyse du groupe lancée...*
┃ ⚠️ _Aucune échappatoire, aucune pitié._
┃ 🔥 *Opération commandée par* _NDA x SONA_
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆`;

    await client.sendMessage(message.chat, { text: purgeMsg }, { quoted: message });

    // Récupération des infos du groupe
    const groupMetadata = await client.groupMetadata(message.chat);
    const admins = groupMetadata.participants.filter(p => p.admin);
    const adminIds = admins.map(a => a.id);

    // Filtrer les membres non-admins
    const toKick = groupMetadata.participants
      .filter(member => !adminIds.includes(member.id))
      .map(member => member.id);

    if (toKick.length === 0) {
      return client.sendMessage(message.chat, { text: "Il n'y a aucun membre à supprimer (hors admins) !" }, { quoted: message });
    }

    let success = 0;
    for (const userId of toKick) {
      try {
        await client.groupParticipantsUpdate(message.chat, [userId], "remove");
        success++;
        await new Promise(res => setTimeout(res, 400));
      } catch (err) {
        // On ignore les erreurs pour les membres impossibles à retirer
      }
    }

    return client.sendMessage(
      message.chat,
      { text: `✔️ ${success} membres ont été supprimés du groupe (hors admins).` },
      { quoted: message }
    );
  }
};
