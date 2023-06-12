const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: 'Em iu',
            singer: 'Andree Right Hand',
            path: './assets/music/Em iu.mp3',
            image: './assets/img/emiu.jpeg'
        },
        {
            name: 'Nhac Anh',
            singer: 'Andree Right Hand',
            path: './assets/music/Nhacanh.mp3',
            image: './assets/img/nhacanh.jpeg'
        },
        {
            name: 'Nghe Nhu Tinh Yeu',
            singer: 'MCK',
            path: './assets/music/nghenhutinhyeu.mp3',
            image: './assets/img/nghenhutinhyeu.jpeg'
        },
        {
            name: 'Tai vi sao',
            singer: 'MCK',
            path: './assets/music/taivisao.mp3',
            image: './assets/img/taivisao.jpeg'
        },
        {
            name: 'Soda',
            singer: 'MCK',
            path: './assets/music/soda.mp3',
            image: './assets/img/soda.jpeg'
        },
        {
            name: 'Making My Way',
            singer: 'Son Tung MTP',
            path: './assets/music/makingmyway.mp3',
            image: './assets/img/sontung.jpeg'
        },
        {
            name: 'Ghe iu dau cua em oi',
            singer: 'Tlinh',
            path: './assets/music/gheiudau.mp3',
            image: './assets/img/tlinh.jpeg'
        },
        {
            name: 'Than mat',
            singer: 'Gill',
            path: './assets/music/thanmat.mp3',
            image: './assets/img/thanmat.jpeg'
        },
        {
            name: 'Mat xanh',
            singer: 'Gill, Tlinh',
            path: './assets/music/matxanh.mp3',
            image: './assets/img/matxanh.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
        </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth 

            //xu ly khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
            
        //khi song play
        audio.onplay = function () {
                _this.isPlaying = true
                player.classList.add('playing')
            }

        //khi song pause
        audio.onpause = function () {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            //khi bai hat play
            audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                    cdThumbAnimate.play()
                } 
            }

            //xu ly khi tua
            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime 
            }
        
        //xy ly phong to thu nho Cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //xu ly khi next bai
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //xu ly khi prev
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }
        //xu ly khi random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        // xu ly next song khi audio het bai
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // xu ly nhac khi repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        //xu ly khi click vao bai hat
        playlist.onclick = function(e) {

            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }   
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        //dinh nghia cac thuoc tinh cho object
        this.defineProperties()

        //lang nghe va xu ly cac su kien
        this.handleEvents()

        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        //render playlist
        this.render()
    }
}
app.start()




const songs = [
    {
        name: 'Em iu',
        singer: 'Andree Right Hand',
        path: './assets/music/Em iu.mp3',
        image: './assets/img/emiu.jpeg'
    },
    {
        name: 'Nhac Anh',
        singer: 'Andree Right Hand',
        path: './assets/music/Nhacanh.mp3',
        image: './assets/img/nhacanh.jpeg'
    },
    {
        name: 'Nghe Nhu Tinh Yeu',
        singer: 'MCK',
        path: './assets/music/nghenhutinhyeu.mp3',
        image: './assets/img/nghenhutinhyeu.jpeg'
    },
    {
        name: 'Tai vi sao',
        singer: 'MCK',
        path: './assets/music/taivisao.mp3',
        image: './assets/img/taivisao.jpeg'
    },
    {
        name: 'Soda',
        singer: 'MCK',
        path: './assets/music/soda.mp3',
        image: './assets/img/soda.jpeg'
    },
    {
        name: 'Making My Way',
        singer: 'Son Tung MTP',
        path: './assets/music/makingmyway.mp3',
        image: './assets/img/sontung.jpeg'
    },
    {
        name: 'Ghe iu dau cua em oi',
        singer: 'Tlinh',
        path: './assets/music/gheiudau.mp3',
        image: './assets/img/tlinh.jpeg'
    },
    {
        name: 'Than mat',
        singer: 'Gill',
        path: './assets/music/thanmat.mp3',
        image: './assets/img/thanmat.jpeg'
    },
    {
        name: 'Mat xanh',
        singer: 'Gill, Tlinh',
        path: './assets/music/matxanh.mp3',
        image: './assets/img/matxanh.jpg'
    }
]