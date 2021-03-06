const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`${client.user.tag}にログインしました`);
  client.user.setActivity()
});

const converter = {
  cjp: require('cjp').generate,
  kbn: require('./convertKbn'),
  nml: require('nomlish').translate,
  mhr: require('genhera').generate
}

async function convert(id, msg) {
  flag[id] = !0
  const sendText = (await converter[id](msg.content))
    .replace('アット、、、、マーーーーーーーーーーク', '@')
    .replace('識別コード【ａｔ：Ｍａｒｋ】', '@')
    .replace('†', '@')

  if (!sendText) return
  const username = await converter[id]((msg.member.nickname || msg.author.username));
  const avatarURL = msg.author.avatarURL()
  const webhook = await (async () => {
    for (const [, webhook] of (await msg.channel.fetchWebhooks())) {
      if (webhook.name === '変換Bot') return webhook
    }
  })() || await msg.channel.createWebhook('変換Bot')
  await webhook.send(sendText, {
    username,
    avatarURL
  })
  try {
    await msg.delete()
  } catch (e) {}

  // テストサーバー
  if (msg.guild.id === '604496683581177872') {
    await client.channels.cache.get('813712452910579752')
      .send(msg.content.replace('@', '＠'))
  }

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
  return;
}

async function convertAll(msg) {
  flag.all = !0
  let sendText
  try {
    sendText = (await converter.mhr(await converter.cjp(await converter.kbn(await converter.nml(msg.content)))))
      .replace('アット、、、、マーーーーーーーーーーク', '@')
      .replace('識別コード【ａｔ：Ｍａｒｋ】', '@')
      .replace('†', '@')

  } catch (error) {
    sendText = (await converter.mhr(await converter.cjp(await converter.kbn(msg.content))))
      .replace('アット、、、、マーーーーーーーーーーク', '@')
      .replace('識別コード【ａｔ：Ｍａｒｋ】', '@')
      .replace('†', '@')
  }

  if (!sendText) return
  let username
  try {
    username = (await converter.mhr(await converter.cjp(await converter.kbn(await converter.nml((msg.member.nickname || msg.author.username))))));
  } catch (error) {
    username = (await converter.mhr(await converter.cjp(await converter.kbn((msg.member.nickname || msg.author.username)))));
  }
  const avatarURL = msg.author.avatarURL()
  const webhook = await (async () => {
    for (const [, webhook] of (await msg.channel.fetchWebhooks())) {
      if (webhook.name === '変換Bot') return webhook
    }
  })() || await msg.channel.createWebhook('変換Bot')
  await webhook.send(sendText, {
    username,
    avatarURL
  })
  try {
    await msg.delete()
  } catch (e) {}

  // テストサーバー
  if (msg.guild.id === '604496683581177872') {
    await client.channels.cache.get('813712452910579752')
      .send(msg.content.replace('@', '＠'))
  }

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
  return;
}

async function noConvert(msg) {
  msg.content = msg.content.replace(/ncv>|ncv> /g, "")
  const sendText = msg.content
  if (!sendText) return
  const username = (msg.member.nickname || msg.author.username)
  const avatarURL = msg.author.avatarURL()
  const webhook = await (async () => {
    for (const [, webhook] of (await msg.channel.fetchWebhooks())) {
      if (webhook.name === '変換Bot') return webhook
    }
  })() || await msg.channel.createWebhook('変換Bot')
  await webhook.send(sendText, {
    username,
    avatarURL
  })
  try {
    await msg.delete()
  } catch (e) {}
  return;
}


let flag;

client.on('message', async msg => {

  if (msg.author.bot || msg.attachments.size > 0) return
  if (msg.content.match(/ncv>/)){await noConvert(msg);return}

  flag = {
    all: !1,
    cjp: !1,
    kbn: !1,
    nml: !1,
    mhr: !1
  }

  msg.content.match(/all>/) && (flag.all = !0, msg.content = msg.content.replace(/all>|all> /g, ""))
  msg.content.match(/cjp>/) && (flag.cjp = !0, msg.content = msg.content.replace(/cjp>|cjp> /g, ""))
  msg.content.match(/kbn>/) && (flag.kbn = !0, msg.content = msg.content.replace(/kbn>|kbn> /g, ""))
  msg.content.match(/nml>|nmr>/) && (flag.nml = !0, msg.content = msg.content.replace(/nml>|nml> /g, ""))
  msg.content.match(/mhr>/) && (flag.mhr = !0, msg.content = msg.content.replace(/mhr>|mhr> /g, ""))

  if (flag.all || flag.cjp || flag.kbn || flag.nml || flag.mhr) {
    flag.all && (await convertAll(msg))
    flag.cjp && (await convert('cjp', msg))
    flag.kbn && (await convert('kbn', msg))
    flag.nml && (await convert('nml', msg))
    flag.mhr && (await convert('mhr', msg))
  } else {
    for (const [, role] of (await msg.guild.roles.fetch()).cache) {
      if (role.name === 'ノムリッシュ')
        for (const [id, ] of (role.members)) msg.author.id === id && (await convert("nml", msg))
      if (role.name === '怪レい日本语')
        for (const [id, ] of (role.members)) msg.author.id === id && (await convert("cjp", msg))
      if (role.name === '古文')
        for (const [id, ] of (role.members)) msg.author.id === id && (await convert("kbn", msg))
      if (role.name === 'メンヘラ')
        for (const [id, ] of (role.members)) msg.author.id === id && (await convert("mhr", msg))
    }
  }
})

client.login();