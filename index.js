const readline = require('readline')
const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("./config.js")
const json = require('./package.json')
console.log("MacroJS by " + json.author)
console.info("Version - " + json.version + ' (' + json.vtype + ')')

var date = new Date
const startTime = date.getHours() + ":" + date.getMinutes()
var workTime
var now
var status
var dguild
var Time = {}
var token
function disconnect() {
    client.destroy().then(console.info("Соединение закрыто"))
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if(config.token == null) {
    rl.question("Введите токен ", (answer) => {
        token = answer
        console.info("Новый токен - ${token}")
    })
} else token = config.token
function idleconnect(client) {
    console.log("Автозапуск")
    client.on('ready', function() {client.user.setStatus('idle')})
    console.warn("Работа в автоматическом режиме")
}
if(process.argv.length > 2) {
    if(process.argv[2] == "autorun") {
        if(typeof config.admin != 'undefined') {
            admin = config.admin
            client.login(token).then(console.info("Соединение установлено"))
            idleconnect(client)
        }
    } else if(process.argv.length > 3 && process.argv[3] == "autorun") {
        admin = process.argv[2]
        client.login(token).then(console.info("Соединение установлено"))
        idleconnect(client)
    } else console.info("Текущий администратор - " + admin)
} else if(typeof config.admin != 'undefined') {
    admin = config.admin
} else admin = 0
rl.on('line', (input) => {
    if(input=="help") {
        console.info("admin - изменить или посмотреть администратора\nconnect - установить соединение\ndisconnect - закрыть соединение\nshutdown - выключить программу\nstatus - показать или изменить статус")
    } else if(input.substring(0,5)=="admin") {
        if(input.length==5) {
            console.info("Текущий администратор - ${admin}")
        } else {
            admin=input.substring(6)
            console.info("Администратор изменён на ${admin}")
        }
    } else if(input=="connect") {
        if (admin != 0) {
            client.login(token).then(console.info("Соединение установлено"))
        } else console.warn("Администратор не задан")
    } else if (input=="disconnect") {
        client.destroy().then(console.info("Соединение закрыто"))
        client.user.presence.status = "offline"
    } else if (input=="shutdown") {
        console.warn("Выключение")
        rl.close()
        return 0
    } else if(input.substring(0,6)=="status") {
        if(input.length==6) {
            now = new Date
            workTime = now - date
            Time.hours = workTime/3600000
            Time.minutes = (Time.hours - Math.floor(Time.hours)) * 60
            Time.seconds = (Time.minutes - Math.floor(Time.minutes)) * 60
            console.info("Время запуска - "+startTime+"\nВремя работы - "+Math.floor(Time.hours)+":"+Math.floor(Time.minutes)+":"+Math.floor(Time.seconds)+"\nТокен - "+token+"\nТекущий администратор - "+admin)
            try {status = client.user.presence.status}
            catch(e) {status = "нет данных"}
            console.info("Клиент - "+status)
        } else client.user.setStatus(input.substring(7))
    } else if(input.substring(0,3)=="say") {
        if(input.length>3) {
            dguild.defaultChannel.send(input.substring(4))
        }
    } else if(input.substring(0,5)=="token") {
        if(input.length==5) {
            console.info("Токен - "+token)
        } else token = input.substring(6)
    } else console.warn("Неизвестная комманда")
})

client.on('message', (message)=> {
    if(message.content == "Пинг") {
        dguild = message.guild
        message.channel.send("Понг").then(console.debug(date.getHours() + ":" + date.getMinutes() + " - " + "Проверка соединения"))
    } else if (message.content == "На каком ты канале?") {
        message.channel.send("Я на канале " + message.channel).then(console.debug(date.getHours() + ":" + date.getMinutes() + " - " + "Проверка местоположения"))
    } else if (message.content == "Кто я?") {
        message.channel.send("Вы " + message.author).then(console.debug(date.getHours() + ":" + date.getMinutes() + " - " + "Проверка индентификации пользателя"))
    } else if (message.content == "Шалом") {
        message.channel.send({files: ['https://cdn.discordapp.com/attachments/311550153183985665/493824563608551445/156a65287b328c76c70cd350752f540a_2.png']})
    } else if (message.content == "Выключись.") {
        console.info("Просьба выключения от пользователя " + message.author.username)
        if (message.author.username == admin) {
            message.channel.send("Выключаюсь по просьбе " + message.author.username).then(console.warn(date.getHours() + ":" + date.getMinutes() + " - " + "Выключение по просьбе администратора"))
            setTimeout(disconnect, 3000)
            rl.close()
            return 0
        } else message.channel.send("Неть").then(console.warn(date.getHours() + ":" + date.getMinutes() + " - " + "Просьба выключения отклонена"))
    } else if (message.content == "Отключись.") {
        if (message.author.username == admin) {
            message.channel.send("Пока, я в офлайн.").then(console.warn(date.getHours() + ":" + date.getMinutes() + " - " + "Отключение от сети"))
            setTimeout(disconnect, 3000)
            client.user.presence.status = "offline"
        } else message.channel.send("Не-а").then(console.warn(date.getHours() + ":" + date.getMinutes() + " - " + "Просьба отключения отклонена"))
    }
})