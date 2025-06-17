const fs = require("fs");
const path = require("path");
require('dotenv').config()
const { Bot, Keyboard, Context, GrammyError, HttpError, MEMORY_STORE } = require("grammy")
const bot = new Bot(process.env.TOKEN)
const { json } = require("stream/consumers");
const ADMIN_ID = process.env.ADMIN_ID
const CREATOR_ID = process.env.CREATOR_ID
const { limit } = require("@grammyjs/ratelimiter");
const configPath = path.join(__dirname, "config.json");







bot.use(limit({
    timeFrame: 10000,
    limit: 2,
    onLimitExceeded: async (ctx) => {
        await ctx.reply("Ты заебёшь эту кнопку дрочить. Через 10 секунд пробуй")
    
    },
    keyGenerator: (ctx) => {
        return ctx.from.id.toString()
    }
    
}))


bot.command("start", async (ctx) => {
    await ctx.reply("Привет! Для получения пака, нажми кнопку ниже.", {
        reply_markup: {
            keyboard: [
                [{ text: "Получить пак" }]
            ],
            one_time_keyboard: false, 
            resize_keyboard: true 
        }
    });
});


bot.command("getmyid", async (ctx) => {
    await ctx.reply(ctx.from.id)
})




bot.hears("Получить пак", async (ctx) => {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const pass = await bot.api.getChatMember("@OGsmoggy", ctx.from.id)
    if (pass.status === 'left') {
        await ctx.reply("Подпишись")
    } else if (pass.status === 'member' || pass.status === 'administrator' || pass.status === 'creator') {
        await ctx.reply(config.pack_message)
    }
})




bot.command("setpack", async (ctx) => {
    if(ctx.from.id != ADMIN_ID && ctx.from.id != CREATOR_ID ) {
        return await ctx.reply("У вас нет права на выполнение данной команды")
    } 

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    let packItem = ctx.match
    config.pack_message = packItem
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    await ctx.reply("Всё заебок")
})



bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    bot.api.sendMessage(5077230164, ctx.update.update_id)
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
      bot.api.sendMessage(5077230164, e.description)
      
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
      bot.api.sendMessage(5077230164, e)
    } else {
      console.error("Unknown error:", e);
      bot.api.sendMessage(5077230164, ctx.update.e)
    }
  });





console.log("Бот стартовал успешно")

bot.start()