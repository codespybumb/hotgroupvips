import TelegramBot from "node-telegram-bot-api"

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

const GROUP_ID = process.env.GROUP_ID // -100xxxxxxxxx

console.log("🤖 BOT ATIVO")

bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id
  const userId = msg.from.id

  try {
    await bot.sendMessage(chatId, "⏳ Liberando acesso VIP...")

    await bot.addChatMember(GROUP_ID, userId)

    await bot.sendMessage(chatId, "✅ Acesso VIP liberado com sucesso!")
  } catch (err) {
    console.error("ERRO AO LIBERAR:", err)

    await bot.sendMessage(
      chatId,
      "❌ Não consegui te adicionar.\n\n👉 Verifique se o bot é admin do grupo."
    )
  }
})
