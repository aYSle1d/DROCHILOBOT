const fs = require("fs");
const path = require("path");
require('dotenv').config()
const { Bot, Keyboard, Context, GrammyError, HttpError, MEMORY_STORE } = require("grammy")
const bot = new Bot(process.env.TOKEN)
const { json } = require("stream/consumers");
const SMOGGY_ID = process.env.SMOGGY_ID
const SOULJA_ID = process.env.SOULJA_ID
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
    await ctx.reply("*Привет\\, я бот Адского дрочилы\\,* созданный для [smoggy](https://t.me/OGsmoggy) и [17\\.souljia](https://t.me/soulja17_bs)\\. " +
        "У меня ты можешь скачать драм киты\\, серум банки\\, пресеты и всякие прикольчики из видосов\\.", {
        parse_mode: 'MarkdownV2',
        link_preview_options: { is_disabled: true },
        reply_markup: {
            keyboard: [
                [{ text: "Получить драмкит от SMOGGY"},
                {text: "Получить пресеты из видео"}]
            ],
            one_time_keyboard: false, 
            resize_keyboard: true 
        }
    });
});


bot.command("getmyid", async (ctx) => {
    await ctx.reply(ctx.from.id)
})




bot.hears("Получить драмкит от SMOGGY", async (ctx) => {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const pass1 = await bot.api.getChatMember("@OGsmoggy", ctx.from.id)
    if (pass1.status === 'left') {
        await ctx.reply("АНТОН СТОЙ! ты не подписался 😡. Для получения контента нужно подписаться на телеграм канал smoggy")
    } else if (pass1.status === 'member' || pass1.status === 'administrator' || pass1.status === 'creator') {
        await ctx.reply(config.pack_message1)
    }
})


bot.hears("Получить пресеты из видео", async (ctx) => {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const pass1 = await bot.api.getChatMember("@OGsmoggy", ctx.from.id)
    const pass2 = await bot.api.getChatMember("@soulja17_bs", ctx.from.id)
    if (pass1.status === 'left' || pass2.status === "left") {
        await ctx.reply("АНТОН СТОЙ! ты не подписался 😡. Для получения контента нужно подписаться на оба телеграм канала")
    } else if (pass1.status === 'member' || pass1.status === 'administrator' || pass1.status === 'creator' || pass2.status === 'member' || pass2.status === 'administrator' || pass2.status === 'creator') {
        await ctx.reply(config.pack_message2)
    }
})



bot.command("setpack1", async (ctx) => {
    if(ctx.from.id != SMOGGY_ID && ctx.from.id != CREATOR_ID && ctx.from.id != SOULJA_ID ) {
        return await ctx.reply("У вас нет права на выполнение данной команды")
    } 

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    let packItem = ctx.match
    config.pack_message1 = packItem
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    await ctx.reply("Всё заебок")
})



bot.command("setpack2", async (ctx) => {
    if(ctx.from.id != SMOGGY_ID && ctx.from.id != CREATOR_ID && ctx.from.id != SOULJA_ID ) {
        return await ctx.reply("У вас нет права на выполнение данной команды")
    } 

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    let packItem = ctx.match
    config.pack_message2 = packItem
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