const Discord = require('discord.js');
const client = new Discord.Client();

const fetch = require('node-fetch');
var URL = 'https://cjp.vercel.app/api/';

client.on('ready', () => {
  console.log(`${client.user.tag}にログインしました`);
  client.user.setActivity()
});

async function convertCjp(text) {
  try {
    const data = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify({
        data: text
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    return (await data.json()).data
  } catch {
    return text
  }
}

const convertKbn = require('./convertKbn');

const nomlish = require('nomlish');

client.on('message', async msg => {
  let cjp = false,
    kbn = false,
    nml = false;

  if (msg.content.match(/cjp>/)) {
    cjp = true;
    msg.content = msg.content.replace(/cjp>|cjp> /g, "")
  }
  if (msg.content.match(/kbn>/)) {
    kbn = true;
    msg.content = msg.content.replace(/kbn>|kbn> /g, "")
  }
  if (msg.content.match(/nml>/)) {
    nml = true;
    msg.content = msg.content.replace(/nml>|nml> /g, "")
  }

  if (msg.author.bot) return
  if (msg.attachments.size > 0) return
  for (const [, role] of (await msg.guild.roles.fetch()).cache) {

    if (role.name === '怪レい日本语' || cjp) {
      for (const [id, ] of (await role.members)) {
        if (msg.author.id === id) {
          const sendText = await convertCjp(msg.content);
          const username = await convertCjp((msg.member.nickname || msg.author.username));
          const avatarURL = msg.author.avatarURL()
          const webhook = await (async () => {
            for (const [, webhook] of (await msg.channel.fetchWebhooks())) {
              if (webhook.name === '怪レい日本语') return webhook
            }
          })() || await msg.channel.createWebhook('怪レい日本语')
          await webhook.send(sendText, {
            username,
            avatarURL
          })
          try {
            await msg.delete()
          } catch (e) {}

          // Submarin
          if (msg.guild.id === '702430385916608592') {
            await client.channels.cache.get('747087748535681074')
              .send(msg.content.replace('@', '＠'))
          }

          // 携帯bot墓場
          if (msg.guild.id === '769902624291553341') {
            await client.channels.cache.get('807516484548689930')
              .send(msg.content.replace('@', '＠'))
          }
          break;
        }
      }
    }
    if (role.name === '古文' || kbn) {
      for (const [id] of await role.members) {
        if (msg.author.id === id) {
          const sendText = convertKbn(msg.content)
          const username = convertKbn((msg.member.nickname || msg.author.username))
          const avatarURL = msg.author.avatarURL()
          const webhook =
            (await (async () => {
              for (const [,
                  webhook
                ] of await msg.channel.fetchWebhooks()) {
                if (webhook.name === '古文') return webhook
              }
            })()) || (await msg.channel.createWebhook('古文'))
          await webhook.send(sendText, {
            username,
            avatarURL
          })
          try {
            await msg.delete()
          } catch (e) {}

          // Submarin
          if (msg.guild.id === '702430385916608592') {
            await client.channels.cache
              .get('747087748535681074')
              .send(msg.content.replace('@', '＠'))
          }

          break;
        }
      }
    }
    if (role.name === 'ノムリッシュ' || nml) {
      for (const [id] of await role.members) {
        if (msg.author.id === id) {
          const sendText = (await nomlish.translate(msg.content))
            .replace('アット、、、、マーーーーーーーーーーク', '@')
            .replace('識別コード【ａｔ：Ｍａｒｋ】', '@')
            .replace('†', '@')
          const username = (await nomlish.translate((msg.member.nickname || msg.author.username)))
          const avatarURL = msg.author.avatarURL()
          const webhook =
            (await (async () => {
              for (const [,
                  webhook
                ] of await msg.channel.fetchWebhooks()) {
                if (webhook.name === 'ノムリッシュ')
                  return webhook
              }
            })()) ||
            (await msg.channel.createWebhook('ノムリッシュ'))
          await webhook.send(sendText, {
            username,
            avatarURL
          })
          try {
            await msg.delete()
          } catch (e) {}

          // Submarin
          if (msg.guild.id === '702430385916608592') {
            await client.channels.cache
              .get('747087748535681074')
              .send(msg.content.replace('@', '＠'))
          }

          break;
        }
      }
    }
    return;
  }
})

client.login();