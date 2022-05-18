//Bot token from Bot father
const token = '2062707519:AAEy2FK9Z3433Cj3DNixHvSAozGK4JSfynM'
const ssId = '1uCqZ_xPPq2L0G6HzibIP7xyftIIvzNz8of7BbKQVghY'
Bot.url = Bot.url + token

Bot.webAppUrl =
  'https://script.google.com/macros/s/AKfycbzhQILPFvp4hmNyvZybCrf6JVvaOPe0Y5wizlBXbohZLiIhtFrgnPG15IctJYHLKuG1/exec'

var users = SpreadsheetApp.openById(ssId).getSheetByName('Users')
var user_data = users.getRange('A1:ZZZ200000000')

const me = '1173180004'

function setWebHook() {
  Bot.setWebHook()
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents)
  try {
    if (contents.callback_query) {
      try {
        callbacks(contents)
      } catch (err) {
        Bot.sendText(me, err)
      }
    } else {
      var text = contents.message.text
      var name = contents.message.from.first_name
      var id = contents.message.from.id
      var username = contents.message.from.username
      var msg_id = contents.message.message_id
      var date = contents.message.date

      try {
        Mytext(id, text, msg_id, username, contents)
      } catch (err) {
        Bot.sendText(me, err)
      }
    }
  } catch (err) {
    Bot.sendText(me, err)
  }
}
