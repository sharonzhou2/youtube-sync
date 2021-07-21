
// This socket is running on the frontend
var socket = io();
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
let progressBar = document.getElementById("slider");
let physicalProgress = document.querySelector(".progress");
let playButton = document.getElementById("play");
let pauseButton = document.getElementById("pause");
let navbar = document.getElementById("youtube-nav");
let searchBar = document.getElementById("search");
let submitBtn = document.getElementById("submit");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
    height: '480',
    width: '854',
    videoId: 'rcnLTnGGBU0',
    playerVars: {
        'playsinline': 1
    },
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
    });
}
  
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
    setInterval(changeProgressBar, 500);
    // setTimeout(stopVideo, 6000);
    done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}

// Change the progression of the progress bar
// let newInterval = setInterval(changeProgressBar, 1000);

// Grab the progress bar from the element


function changeProgressBar() {

    let totalTime = player.getDuration();
    let currentPercentProgress = (player.getCurrentTime()/totalTime) * 100;
    // console.log(currentPercentProgress);
    // progressBar.style.width = currentPercentProgress + '%';
    progressBar.value = currentPercentProgress;
    // socket.emit('timing', currentPercentProgress);
}

// This allows the client on the frontend to emit the data b
// back to the server

slider.addEventListener('click', (e) => {
    let percentage = slider.value;
    let videoTime = (percentage * player.getDuration()) / 100;

    socket.emit('timing', videoTime);
    console.log(videoTime);
    
})

playButton.addEventListener('click', () => {
    socket.emit('play', "playing");
    
})

pauseButton.addEventListener('click', () => {
    socket.emit('pause', "pausing");
})


/////////////////////////////////////////////
// Toggling between dark-mode and lightmode
let moonStars = document.getElementById("moon");
let whiteTheme = true;
moonStars.addEventListener('click', toggleTheme);
function toggleTheme() {
    let background = document.body;
    background.classList.toggle("dark-theme");
    searchBar.classList.toggle("dark-theme");
    
    navbar.classList.toggle("bg-dark-custom");
    navbar.classList.toggle("navbar-dark");

    // Check what the current theme is
    if (background.classList.contains("dark-theme")) {
        whiteTheme = false;
        submitBtn.classList.remove("btn-outline-dark");
        submitBtn.classList.add("btn-outline-light");
    } else {
        whiteTheme = true;
        submitBtn.classList.remove("btn-outline-light");
        submitBtn.classList.add("btn-outline-dark");
    }
}

/////////////////////////////////////////////
// Submitting a new video to watch
window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        changeVideo();
    }
});
submitBtn.addEventListener('click', changeVideo);

function changeVideo() {
    let youtubeLink = searchBar.value;
    searchBar.value = "";
    let videoid = youtubeLink.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if (videoid === null) {
        console.log("The youtube url is not valid.");
        searchBar.classList.add("is-invalid");
    } else {
        if (searchBar.classList.contains("is-invalid")) {
            searchBar.classList.remove("is-invalid");
        }
        searchBar.classList.add("is-valid");
        socket.emit('change', videoid[1]);
    }
}

// We can now listen for any events that are received
// from the server
socket.on('timing', (data) => {
    player.seekTo(data);
})

socket.on('play', (data) => {
    player.playVideo();
})

socket.on('pause', (data) => {
    console.log("fdsfs");
    player.pauseVideo();
})

socket.on('change', (data) => {
    player.loadVideoById(data, 0);
})
