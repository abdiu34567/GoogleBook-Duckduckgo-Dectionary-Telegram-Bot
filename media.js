function editme(ido,messageID,photo,caption,keyboards) {

      var media = {
        type: "photo",
        media: photo,
        caption: caption,
        parse_mode: "HTML"
      }
      Bot.editMessageMedia(ido, messageID, media, keyboards);
  
}

function editvoice(ido,messageID,audio,caption,keyboards) {

      var media = {
        type: "audio",
        media: audio,
        caption: caption,
        parse_mode: "HTML"
      }
      Bot.editMessageMedia(ido, messageID, media, keyboards);
  
}
