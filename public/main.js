
// This socket is running on the frontend
var socket = io();
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
let progressBar = document.getElementById("slider");
let physicalProgress = document.querySelector(".progress");
let playButton = document.getElementById("play");
let pauseButton = document.getElementById("pause");

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
    console.log("fdsfs");
})

pauseButton.addEventListener('click', () => {
    socket.emit('pause', "pausing");
})

// We can now listen for any events that are received
// from the server
socket.on('timing', (data) => {
    player.seekTo(data);
})

socket.on('play', (data) => {
    player.playVideo();
})

socket.on('pause', (data) => {
    player.pauseVideo();
})