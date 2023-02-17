// import data from '/data/music.json' assert { type: 'json' };
// console.log(data);

var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {

      var status = xhr.status;

      if (status == 200) {
          callback(null, xhr.response);
      } else {
          callback(status);
      }
  };
  xhr.send();
};

getJSON('/wtr/data/music.json',  function(err, data) {

    if (err != null) {
        console.error(err);
    } else {
     
      var source = document.getElementById("entry-template").innerHTML;
      var template = Handlebars.compile(source);
      var context = data;
      console.log(context);
      var html = template(context);
      var target = document.querySelector(".playlist-wrapper");
      target.insertAdjacentHTML("beforeend", html);

      // var audioPlayer = document.querySelector('.water-audio-player');
      var playListItems = document.querySelectorAll('.playlist-item');
      var playerImage = document.querySelector('.water-player-artist-image');
      var playerTrackName = document.querySelector('.player-track-name');
      var playerArtistName = document.querySelector('.player-artist-name');

      // console.log(audioPlayer);
      console.log(playListItems);

      // audio

      const audioPlayer = document.querySelector(".audio-player");
      const firstTrack = data.tracks[0].songlink;

      console.log(firstTrack);

      let audio = new Audio(
          firstTrack
      );

      setTimeout(function(){
          playerImage.setAttribute('src', data.tracks[0].ArtistImage);
          playerImage.classList.remove('none');
          playerTrackName.innerHTML = data.tracks[0].songTitle;
          playerArtistName.innerHTML = data.tracks[0].ArtistName;
      }, 5000);

      //toggle between playing and pausing on button click
      const playBtn = audioPlayer.querySelector(".controls .toggle-play");
      console.dir(audio);

      playListItems.forEach(element => {
          var artistName = element.dataset.artist;
          var songTitle = element.dataset.songtitle;
          var songLink = element.dataset.song;
          var artistImage = element.dataset.pic;

          console.log(artistName, songTitle, songLink, artistImage);

          element.addEventListener('click', function(){
              playListItems.forEach(element =>{
                  element.classList.remove('play');
                  element.classList.add('not-playing');
              })
              // track.setAttribute('src', songLink);
              audio.pause();
              audio = new Audio(songLink);
              console.dir(audio);
              audio.play();
              playBtn.classList.remove("play");
              playBtn.classList.add("pause");
              this.classList.remove('not-playing');
              this.classList.add('play');
              playerImage.setAttribute('src', artistImage);
              playerTrackName.innerHTML = songTitle;
              playerArtistName.innerHTML = artistName;

              audio.addEventListener(
                  "loadeddata",
                  () => {
                    audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
                      audio.duration
                    );
                    audio.volume = .75;
                  },
                  false
                );
          });
      });


      audio.addEventListener(
        "loadeddata",
        () => {
          audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
            audio.duration
          );
          audio.volume = .75;
        },
        false
      );

      //click on timeline to skip around
      const timeline = audioPlayer.querySelector(".timeline");
      timeline.addEventListener("click", e => {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
        audio.currentTime = timeToSeek;
      }, false);

      //click volume slider to change volume
      const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
      volumeSlider.addEventListener('click', e => {
        const sliderWidth = window.getComputedStyle(volumeSlider).width;
        const newVolume = e.offsetX / parseInt(sliderWidth);
        audio.volume = newVolume;
        audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
      }, false)

      //check audio percentage and update time accordingly
      setInterval(() => {
        const progressBar = audioPlayer.querySelector(".progress");
        progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
        audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
          audio.currentTime
        );
      }, 500);

      playBtn.addEventListener(
        "click",
        () => {
          if (audio.paused) {
            playBtn.classList.remove("play");
            playBtn.classList.add("pause");
            audio.play();
          } else {
            playBtn.classList.remove("pause");
            playBtn.classList.add("play");
            audio.pause();
          }
        },
        false
      );

      audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
        const volumeEl = audioPlayer.querySelector(".volume-container .volume");
        audio.muted = !audio.muted;
        if (audio.muted) {
          volumeEl.classList.remove("icono-volumeMedium");
          volumeEl.classList.add("icono-volumeMute");
        } else {
          volumeEl.classList.add("icono-volumeMedium");
          volumeEl.classList.remove("icono-volumeMute");
        }
      });

      //turn 128 seconds into 2:08
      function getTimeCodeFromNum(num) {
        let seconds = parseInt(num);
        let minutes = parseInt(seconds / 60);
        seconds -= minutes * 60;
        const hours = parseInt(minutes / 60);
        minutes -= hours * 60;

        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(
          seconds % 60
        ).padStart(2, 0)}`;
      }


    }
});


