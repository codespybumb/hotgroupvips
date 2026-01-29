import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot("SEU_TOKEN_AQUI", {
  polling: true,
});

console.log("BOT SUBIU");

bot.on("message", (msg) => {
  console.log("Mensagem recebida:", msg.text);
  bot.sendMessage(msg.chat.id, "🔥 Bot está vivo!");
});
