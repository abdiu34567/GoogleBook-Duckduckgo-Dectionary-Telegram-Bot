function Mytext(id, text, msg_id, username, contents) {

  if (text == "/start") {
    Bot.sendText(id, `👤 <b>Welcome</b>\n\n<code>🔌 This bot developed from Google Book, DuckDuckGo & Dictionary Api</code>\n\n<i>🔭 capable of finding any book from internet & dictionary words in greater capablity</i>`, begin);

    var Id = user_data.createTextFinder(id);
    var user = Id.findNext();

    //if user not found then register user
    if (!user) {
      const last_row = users.getLastRow();
      return user_data.getCell(last_row + 1, 1).setValue(id);
    }
  } else {

    var Id = user_data.createTextFinder(id);
    var row = Id.findNext().getRow();
    if (user_data.getCell(row, 2).getValue() == "on") {


      Bot.sendPhoto(id, `AgACAgQAAxkBAAIFZ2IBB6PLdWwpOVg7wlXIPOKqhHQWAAIvuTEbLW8JUJmfLLt6QxpSAQADAgADcwADIwQ`, '<b>✅Processing ... ➡️</b>', {
        "inline_keyboard": [
          [{ "text": "Next ➡️", "callback_data": 'next,1' }, { "text": "❌ Exit", "callback_data": "exit" }]
        ]
      });
      //20% to load
      editme(id, msg_id + 1, `AgACAgQAAxkBAAIFZ2IBB6PLdWwpOVg7wlXIPOKqhHQWAAIvuTEbLW8JUJmfLLt6QxpSAQADAgADcwADIwQ`, `<b>✅Processing ... ➡️ ${20}%</b>`, {
        "inline_keyboard": [
          [{ "text": "Next ➡️", "callback_data": 'next,1' }, { "text": "❌ Exit", "callback_data": "exit" }]
        ]
      });
      const books = UrlFetchApp.fetch(`https://www.googleapis.com/books/v1/volumes?q=${text}&key=AIzaSyARWN-E4fPF-Qqva71wyLelQtO51Ysb81Y&country=DE`);

      var result = JSON.parse(books).items;
      var totalItems = JSON.parse(books).totalItems;
      if (Number(totalItems) == 0) { return Bot.sendText(id, `❌ <i>No book found</i>`) }
      //80% to load
      editme(id, msg_id + 1, `AgACAgQAAxkBAAIFZ2IBB6PLdWwpOVg7wlXIPOKqhHQWAAIvuTEbLW8JUJmfLLt6QxpSAQADAgADcwADIwQ`, `<b>✅Processing ... ➡️ ${80}%</b>`, {
        "inline_keyboard": [
          [{ "text": "Next ➡️", "callback_data": 'next,1' }, { "text": "❌ Exit", "callback_data": "exit" }]
        ]
      });

      var photo = result[0].volumeInfo.previewLink;
      var title = result[0].volumeInfo.title;
      var subtitle = result[0].volumeInfo.subtitle;
      var authors = result[0].volumeInfo.authors;
      var selfLink = result[0].volumeInfo.previewLink;
      var date = result[0].volumeInfo.publishedDate;

      var caption = `📚 <b>🎖 Title : </b><code>${title}</code>\n<b>🎗 Sub Title : </b><code>${subtitle}</code>\n<b>🧓 Authors : </b><code>${authors}</code>\n<b>⏰ Published Date : </b><code>${date}</code>\n<b>📡 Self Link : </b><a>${selfLink}</a>`;


      editme(id, msg_id + 1, photo, caption, {
        "inline_keyboard": [
          [{
            "text": "Next ➡️",
            "callback_data": 'next,1'
          }, {
            "text": "❌ Exit",
            "callback_data": "exit"
          }]
        ]
      });

      return user_data.getCell(row, 4).setValue(text);


    }


    else if (user_data.getCell(row, 3).getValue() == "on") {

      var query = text.toLowerCase();
      try {
        //if the query doesn't exist 
        const dict = UrlFetchApp.fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
        var to_json = JSON.parse(dict);
      } catch (err) {
        return Bot.sendText(id, `❌ <b>Exception : </b><i>either connection or word error</i>`);
      }


      // const origin = to_json[0].origin;
      // const audio = to_json[0].phonetics[0].audio;
       const audio = "https://api.dictionaryapi.dev/media/pronunciations/en/"+ query+"-us.mp3"

      var string = "🎵 ";

      keyboards.inline_keyboard[0].push({ "text": "NEXT ➡️", "callback_data": `next,${0}` }, {
        "text": "❌ Exit",
        "callback_data": "exit"
      });

      for (i = 0; i < to_json.length; i++) {
        var meanings = to_json[i].meanings.length;

        for (j = 0; j < meanings; j++) {
          // var defnitions = to_json[i].meanings[j].definitions.length;
          var partOfSpeech = to_json[i].meanings[j].partOfSpeech;

          var definition = to_json[i].meanings[j].definitions[0].definition;
          var example = to_json[i].meanings[j].definitions[0].example;
          var synonomy = to_json[i].meanings[j].definitions[0].synonyms;
          var antonyms = to_json[i].meanings[j].definitions[0].antonyms;

          string = `${string}<b>PartOfSpeech : </b>\n<code>${partOfSpeech}</code>\n\n<b>Definition : </b>\n<code>${definition}</code>\n<b>Example : </b>\n<code>${example}</code>\n<b>Synonomy : </b>\n<code>${synonomy}</code>\n<b>Antonyms : </b>\n<code>${antonyms}</code>`;

          // if string is longer cause error from telegram and if substring reduce part of tag there will be an error 
          if (string.length > 1020) {
            string = `🎵 <b>PartOfSpeech : </b>\n<code>${partOfSpeech}</code>\n\n<b>Definition : </b>\n<code>${definition}</code>\n<b>Example : </b>\n<code>${example}</code>`;
          }
        }

      }


      Bot.sendAudio(id, audio, string, keyboards);
      return user_data.getCell(row, 4).setValue(text);


    }

    else if (user_data.getCell(row, 5).getValue() == "on") {

      try {
        //if the query doesn't exist 
        const web = UrlFetchApp.fetch(`https://api.duckduckgo.com/?q=${text}&format=json`);
        var to_json = JSON.parse(web);
      } catch (err) {
        return Bot.sendText(id, `❌ <b>Exception : </b><i>either connection or word error</i>`);
      }

      var string = "";
      var data = to_json.RelatedTopics;
      for (i = 0; i < data.length; i++) {
        if (data[i].Result) {
          var lenth = data[i].Result.length;
          if (lenth <= 5) {
            string = string + data[i].FirstURL + "\n" + "<code>" + data[i].Text + "</code>\n\n";
          }
        } else {
          var topics = data[i].Topics.length;
          for (j = 0; j < topics; j++) {
            if (topics <= 5) {
              string = string + data[i].Topics[j].FirstURL + "\n" + "<code>" + data[i].Topics[j].Text + "</code>\n\n";
            }
          }

        }

      }
      if (string == "") {
        return Bot.sendText(id, `<b>0 Web Pages Found </b> `, {
          "inline_keyboard": [
            [ { "text": "❌ Exit", "callback_data": "exit" }]
          ]
        });
      }
      return Bot.sendText(id, `<b>Web Pages\n✅Processing ... ➡️</b>\n +${string} `, {
        "inline_keyboard": [
          [{ "text": "❌ Exit", "callback_data": "exit" }]
        ]
      });
    }

  }

}


