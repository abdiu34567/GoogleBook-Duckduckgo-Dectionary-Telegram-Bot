function callbacks(contents) {
  var ido = contents.callback_query.from.id;
  var dota = contents.callback_query.data;
  var cbq = contents.callback_query.id;
  var messageID = contents.callback_query.message.message_id;
  var userName = contents.callback_query.from.username;
  var texto = contents.callback_query.message.text;

  var Id = user_data.createTextFinder(ido);
  var row = Id.findNext().getRow();

  if (dota == "book") {

    Bot.sendText(ido, `<i>Type a name of a book you like to search</i>`,);

    user_data.getCell(row, 2).setValue("on");
    user_data.getCell(row, 3).clear();
    return user_data.getCell(row, 5).clear();


  } else if (dota == "dictionary") {

    Bot.sendText(ido, `<i>Type a word to see a meaning,synonomy,antonomy ...</i>`,);

    user_data.getCell(row, 3).setValue("on");
    user_data.getCell(row, 5).clear();
    return user_data.getCell(row, 2).clear();


  } else if (dota == "web") {

    Bot.sendText(ido, `<i>Search a web page you like ...</i>`,);

    user_data.getCell(row, 5).setValue("on");
    user_data.getCell(row, 2).clear();
    return user_data.getCell(row, 3).clear();

  }



  else if (dota == "exit") {

    Bot.deleteText(ido, messageID);
    return Bot.sendText(ido, `👤 <b>Welcome</b>\n\n<code>🔌 This bot developed from Google Book, DuckDuckGo & Dictionary Api</code>\n\n<i>🔭 capable of finding any book from internet & dictionary words in greater capablity</i>`, begin);

  } else if (dota.split(",")) {

    var sp1 = dota.split(",")[0];
    var sp2 = dota.split(",")[1];
    var sp2_num = Number(sp2);
    if (sp1 == "next") {

      var to_num = Number(sp2) + 1;
    } else {
      var to_num = Number(sp2) - 1;
      if (to_num < 0) { to_num = 0; }

    }

    const query = user_data.getCell(row, 4).getValue();

    if (user_data.getCell(row, 2).getValue() == "on") {

      const books = UrlFetchApp.fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyARWN-E4fPF-Qqva71wyLelQtO51Ysb81Y&country=DE`);

      var result = JSON.parse(books).items;

      var photo = result[sp2_num].volumeInfo.previewLink;
      var title = result[sp2_num].volumeInfo.title;
      var subtitle = result[sp2_num].volumeInfo.subtitle;
      var authors = result[sp2_num].volumeInfo.authors;
      var selfLink = result[sp2_num].volumeInfo.previewLink;
      var date = result[sp2_num].volumeInfo.publishedDate;


      var caption = `📚 <b>🎖 Title : </b><code>${title}</code>\n<b>🎗 Sub Title : </b><code>${subtitle}</code>\n<b>🧓 Authors : </b><code>${authors}</code>\n<b>⏰ Published Date : </b><code>${date}</code>\n<b>📡 Self Link : </b><a>${selfLink}</a>`;

      keyboards.inline_keyboard[0].push({ "text": "⬅️ PRE", "callback_data": `prev,${to_num}` },
        { "text": "NEXT ➡️", "callback_data": `next,${to_num}` }, {
        "text": "❌ Exit",
        "callback_data": "exit"
      });

      return editme(ido, messageID, photo, caption, keyboards)

    }
    else if (user_data.getCell(row, 3).getValue() == "on") {

      try {
        //if the query doesn't exist 
        const dict = UrlFetchApp.fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
        var to_json = JSON.parse(dict);
      } catch (err) {
        return Bot.sendText(ido, `❌ <b>Exception : </b><i>either connection or word error</i>`);
      }

      const origin = to_json[0].origin;

      const audio = to_json[0].phonetics[0].audio;

      var string = '🎵 ';
      var percent = 0;

      //if the next increment will be greater than number of our array then go back to 0
      if (to_num > to_json.length) { to_num = 0 }
      keyboards.inline_keyboard[0].push({ "text": "⬅️ PREVIOUS", "callback_data": `prev,${to_num}` },
        { "text": "NEXT ➡️", "callback_data": `next,${to_num}` }, {
        "text": "❌ Exit",
        "callback_data": "exit"
      });

      for (i = 0; i < to_json.length; i++) {
        var meanings = to_json[i].meanings.length;

        for (j = 0; j < meanings; j++) {
          // var defnitions = to_json[i].meanings[j].definitions.length;
          var partOfSpeech = to_json[i].meanings[j].partOfSpeech;
          var percent = percent + 20;
          editvoice(ido, messageID, "https:" + audio, `<b>✅Processing ... ➡️</b> ${percent}%`, keyboards);

          //some of the values are undefined
          try {
            var definition = to_json[i].meanings[j].definitions[to_num].definition;
            var example = to_json[i].meanings[j].definitions[to_num].example;
            var synonomy = to_json[i].meanings[j].definitions[to_num].synonyms;
            var antonyms = to_json[i].meanings[j].definitions[to_num].antonyms;
          } catch (err) { }

          string = `${string}<b>PartOfSpeech : </b>\n <code>${partOfSpeech}</code>\n\n<b>Definition : </b>\n<code>${definition}</code>\n<b>Example : </b>\n<code>${example}</code>\n<b>Synonomy : </b>\n<code>${synonomy}</code>\n<b>Antonyms : </b>\n<code>${antonyms}</code>\n\n`;

          // if string is longer cause error from telegram and if substring reduce part of tag there will be an error 
          if (string.length > 1020) {
            string = `🎵 <b>PartOfSpeech : </b>\n<code>${partOfSpeech}</code>\n\n<b>Definition : </b>\n<code>${definition}</code>\n<b>Example : </b>\n<code>${example}</code>`;
          }
        }

      }

      return editvoice(ido, messageID, "https:" + audio, string, keyboards);


    }


  }


}
