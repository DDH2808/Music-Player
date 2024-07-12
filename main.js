// bind querySelector
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// storage key
const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

// define variables
const playlist = $('.playlist')
const playingSongName = $('.playing-song-name')
const playingSongArtist = $('.playing-song-artist')
const cd = $('.cd');
const cdThumbnail = $('.cd-thumbnail')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn  = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const shuffleBtn = $('.btn-shuffle')
const song = $$('.song')
var shuffleArray = []


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    configs: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
      {
          name: "Nơi này có anh",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song1.mp3",
          image: "./assets/img/song1.jpg"
      },
      {
          name: "Âm thầm bên em",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song2.mp3",
          image: "./assets/img/song2.jpg"
      },
      {
          name: "Chúng ta của hiện tại",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song3.mp3",
          image: "./assets/img/song3.jpg"
      },
      {
          name: "Muộn rồi mà sao còn",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song4.mp3",
          image: "./assets/img/song4.jpg"
      },
      {
          name: "Em của ngày hôm qua",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song5.mp3",
          image: "./assets/img/song5.jpg"
      },
      {
          name: "Hãy trao cho anh",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song6.mp3",
          image: "./assets/img/song6.jpg"
      },
      {
          name: "Chắc ai đó sẽ về",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song7.mp3",
          image: "./assets/img/song7.jpg"
      },
      {
          name: "Anh sai rồi",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song8.mp3",
          image: "./assets/img/song8.jpg"
      },
      {
          name: "Khuôn Mặt Đáng Thương",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song9.mp3",
          image: "./assets/img/song9.jpg"
      },
      {
          name: "Có chắc yêu là đây",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/song10.mp3",
          image: "./assets/img/song10.jpg"
      }
  ],

    // set config for app
    setConfig: function(key, value) {
        this.configs[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.configs))
    },
    
    // render songs in above array to html
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="song-contain">
                    <div class="song-img" style="background-image: url('${song.image}')" alt="" class="song-image"></div>
                    <div class="song-text">
                        <h5 class="song-name">${song.name}</h5>
                        <p class="song-artist">${song.singer}</p>
                    </div>
                </div>

                <div class="song-contain song-select">
                    <div class="select">
                        <i class="song-favorite-${index} btn song-favorite fa-regular fa-heart" onclick="handleFavorite(event)"></i>
                        <i class="btn song-remove-${index} fa-solid fa-xmark" onclick="handleRemove(event)"></i>
                    </div>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        // play button
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function() {
            app.isPlaying = true
            playBtn.classList.add('song-playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function() {
            app.isPlaying = false
            playBtn.classList.remove('song-playing')
            cdThumbAnimate.pause()
        }

        document.onscroll = function () {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const newCdWidth = cdWidth - scrollTop;
    
          cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
          cd.style.opacity = newCdWidth / cdWidth;
        };

        // rotate cd
        const cdThumbAnimate = cdThumbnail.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        // track song progress
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // seek 
        progress.oninput = function(e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // next button
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.nextSong()
            }
            audio.play()
        }

        // previous button
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.prevSong()
            }
            audio.play()
        }

        // repeat button
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        // shuffle button
        shuffleBtn.onclick = function(e) {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            shuffleBtn.classList.toggle('active', app.isRandom)
        }

        // next song when ended
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // click playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            var songs = $$('.song')
            songs[app.currentIndex].classList.remove('active')
            

            if (songNode || e.target.closest('.option')) {
                // Clicked on a song
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    songs[app.currentIndex].classList.add('active')
                    app.loadCurrentSong();
                    audio.play();
                }
            }   
        }
    },


    // load current song based on current index
    loadCurrentSong: function() {
        playingSongName.textContent = this.currentSong.name
        playingSongArtist.textContent = this.currentSong.singer
        cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    // load all configs of app
    loadConfig: function() {
        this.isRandom = this.configs.isRandom
        this.isRepeat = this.configs.isRepeat

        if (app.isRepeat) {
            repeatBtn.classList.add('active')
        }

        if (app.isRandom) {
            shuffleBtn.classList.add('active')
        }
    },

    // handle nextSong event
    nextSong: function() {
        let songs = $$('.song')
        songs[this.currentIndex].classList.remove('active')

        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        songs[this.currentIndex].classList.add('active')
        this.loadCurrentSong()
    },

    // handle prevSong event
    prevSong: function() {
        let songs = $$('.song')
        songs[this.currentIndex].classList.remove('active')

        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        songs[this.currentIndex].classList.add('active')
        this.loadCurrentSong()
    },

    // handle randomSong event using fisher-Yates (aka Knuth) Shuffle algorithm
    randomSong: function() {
        let songs = $$('.song')
        songs[this.currentIndex].classList.remove('active')
        // If all songs have been played, reshuffle the array
        if (shuffleArray.length === 0) {
            shuffleArray = [...this.songs]; // Copy the songs array
            for (let i = shuffleArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]]; // Swap elements
            }
        }

        // Get the next song from the shuffled array
        const nextSong = shuffleArray.pop();

        // Update the current index and load the song
        this.currentIndex = this.songs.indexOf(nextSong);
        songs[this.currentIndex].classList.add('active')
        this.loadCurrentSong();
    },

    // handle events when starting app
    start: function() {
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    }
}

// handle event when clicking favorite (heart) icon
function handleFavorite(event) {
    event.stopPropagation()
    const songElement = event.target.closest('.song')
    const dataIndex = songElement.dataset.index;
    const favBtn = $(`.song-favorite-${dataIndex}`)

    if (!app.songs[dataIndex].isFavorite) {
        favBtn.classList.replace("fa-regular", "fa-solid")
        app.songs[dataIndex].isFavorite = true;
    } else {
        favBtn.classList.replace("fa-solid", "fa-regular")
        app.songs[dataIndex].isFavorite = false;
    }
}

// handle event when clicking remove (delete) icon
function handleRemove(event) {
    event.stopPropagation()
    const songElement = event.target.closest('.song')
    const dataIndex = songElement.dataset.index;
    const removeBtn = $(`.song-remove-${dataIndex}`)

    const removeSong = removeBtn.closest('.song')
    app.songs.splice(removeSong, 1)
    removeSong.style.display = 'none'
}

// starto
app.start()