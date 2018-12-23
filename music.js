const musicInfo = [];
let playList = [];

function addSongFromField(event) {
  event.preventDefault();

  const info = $('#musicField').eq(0).val();

  musicInfo.push(info);
  renderList();
  $('#musicField').eq(0).val('');
}

$('#addButton').click(addSongFromField);
$('#musicField').keyup(function(event) {
  if (event.which == 13) { // User presses Enter
    addSongFromField(event);
  }
});

function renderList() {
  const $list = $('.info').eq(0);

  $list.empty();

  for (const info of musicInfo) {
    if(info) {
      const $item = $('<li class="list-group-item">').text(info);
      $list.append($item);
    }
  }
}

$('#getPlaylistBtn').click(function(event) {

  //let requestUrls = musicInfo.map(req => 'https://itunes.apple.com/search?term=' + req + '&limit=30');
  
  $.when(
    $.each(musicInfo, function(index, value) {    
      $.ajax({
        url: 'https://itunes.apple.com/search?term=' + value + '&limit=30',
        dataType: 'json',
        success: function(data) {
          $.each(data.results, function(index, value){
            playList.push(value);
          })
        }
      })
    })
  ).then(function() {
    playList.sort((a, b) => Math.random() - 0.5);    
  }).then(function() {
    if(playList.length == 0) {
      $(".play").append("<h1>No matches. Try again.</h1>");
      return;
    }
    playList = playList.slice(0, 30);
    console.log(playList)
  }).then(function(){
    $.each(playList, function(index, value){
      $(".play").append("<div class='row'><div class='col-md-2'><img src='" + value.artworkUrl100 + "' alt='" + value.trackName + "' /></div><div class='col-md-6'><h3>" 
        + value.trackName + "</h3><h4>"
        + value.artistName + "</h4><p>"
        + value.collectionName + "</p></div><div class='col-md-2 playSound btn'>Play<audio src='" + value.previewUrl + "'></audio></div></div>");
    })
  }).then(function(){
    $('.playSound').click(function(event) {
      console.log(event.target.querySelector('audio'));
      $(this).find('audio').trigger("play");
    })
  })

});


/*
  value.artistName,
  value.trackName,
  value.collectionName, //album
  value.previewUrl, //track
  value.artworkUrl100, //img
  value.primaryGenreName //
*/