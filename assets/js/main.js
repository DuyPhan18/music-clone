const heading = document.querySelector('header h2');
const cdImg = document.querySelector('.cd-img');
const audio = document.querySelector('#audio');
const playBtn = document.querySelector('.toggle-btn');
const player = document.querySelector('.player')
const progress = document.querySelector('.progress')
const preBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')
const randomBtn = document.querySelector('.suffle-btn');
const repeatBtn = document.querySelector('.repeat-btn');
const playlist = document.querySelector('.playlist');

const PLAYER_STORAGE_KEY = 'D-PLAY'
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name:"FOREVER 1",
            artist:"Girls' Generation",
            path:"./assets/music/song1.mp3",
            img:"./assets/img/song1.jpg"
        },
        {
            name:"Last Goodbye",
            artist:"AKMU",
            path:"./assets/music/song2.mp3",
            img:"./assets/img/song2.jpg"
        },
        {
            name:"Through The Night",
            artist:"IU",
            path:"./assets/music/song3.mp3",
            img:"./assets/img/song3.jpg"
        },
        {
            name:"Something just like this",
            artist:"The Chainsmokers & Coldplay",
            path:"./assets/music/song4.mp3",
            img:"./assets/img/song4.jpg"
        },
        {
            name:"Last Goodbye",
            artist:"AKMU",
            path:"./assets/music/song2.mp3",
            img:"./assets/img/song2.jpg"
        },
        {
            name:"Through The Night",
            artist:"IU",
            path:"./assets/music/song3.mp3",
            img:"./assets/img/song3.jpg"
        },
        {
            name:"Pink Venom",
            artist:"BLACKPINK",
            path:"./assets/music/song5.mp3",
            img:"./assets/img/song5.jpg"
        },
        {
            name:"Last Goodbye",
            artist:"AKMU",
            path:"./assets/music/song2.mp3",
            img:"./assets/img/song2.jpg"
        },
        {
            name:"Through The Night",
            artist:"IU",
            path:"./assets/music/song3.mp3",
            img:"./assets/img/song3.jpg"
        },
        {
            name:"Something just like this",
            artist:"The Chainsmokers & Coldplay",
            path:"./assets/music/song4.mp3",
            img:"./assets/img/song4.jpg"
        },
    ],
    setConfig : function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, this.config)
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}"data-index = ${index}>
                <div class="thumb" 
                    style="background-image: url('${song.img}');"> </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.artist}</p>
                </div>
                <div class="option">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                </div>
            </div>`
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const cd = document.querySelector('.cd');
        const _this = this;
        //xu ly quay cd
        const cdImgAnimate = cdImg.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10 sec
            iterations: Infinity,
        })
        cdImgAnimate.pause()
        //xu ly thu nho anh
        const cdWidth = cd.offsetWidth;
        document.onscroll = function(){
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - Math.round(scrollY);
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / scrollY;
        }

        //xu ly nut play
         playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
         }
        //khi song duoc  play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            cdImgAnimate.play()
        }
        //khi song pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdImgAnimate.pause()
        }   
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
           const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
        }
        //khi tua nhac
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //khi khiprev khi prev song
        preBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.preSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        //khi random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        
        }
        //xu ly next sau khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click();
            }
        }

        repeatBtn.onclick= function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)') 

            if(songNode || e.target.closest('.option')){
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('.option')){

                }
            }
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdImg.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src=this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    preSong: function(){
        this.currentIndex--
        if(this.currentIndex <0 ){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },
    randomSong : function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong();
    },
    scrollToActiveSong : function(){
        setTimeout(() => {
            document.querySelector('.song.active').scrollIntoView({
                behavior : 'smooth',
                block: 'center',
                }
            )
        }, 100)
    },

    start: function() {
        //Dinh nghia thuoc tin cho obj
        this.defineProperties()
        //lang nge xuw ly su kien
        this.handleEvents()
        this.loadCurrentSong()
        //render dand sasch bai hat
        this.render()
    }
}
app.start()