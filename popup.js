'use strict';

let page = document.getElementById('videos');
let lista = document.createElement('ol');

function constructOptions(apiURL, videos) {

    for (let video of videos) {

        let title = document.createElement('li');
        let order = document.createElement('b');
        let play = document.createElement('a');

        let videoTitle = video.videoInfo ? video.videoInfo.title : video.title;
        let videoId = video.videoInfo ? video.videoInfo.videoId : video.videoId;

        title.innerText = videoTitle;
        title.id = videoId;

        order.innerText = video.order;

        play.innerText = '▶'; // ‣
        play.addEventListener('click', function () {
            let self = this;
            let playVideo = confirm(`¿Reproducir ${videoTitle}?`);
            if (playVideo) {
                fetch(`${apiURL}api/player/stop`).then((stopped) => {
                    if (stopped.ok) {
                        fetch(`${apiURL}api/player/${videoId}/play`).then((response) => {
                            if (response.ok) {
                                response.json().then(playing => {
                                    self.classList.add('playing');
                                    console.log(playing);
                                });
                            }
                        });
                    }
                });
            }
        });
        lista.appendChild(title);
        title.prepend(play);
        title.prepend(order);
    }
    page.appendChild(lista);

    document.getElementById('stop').addEventListener('click', (event) => {
        fetch(`${apiURL}api/player/stop`).then((stopped) => {
            if (stopped.ok) {
                fetch(`${apiURL}api/player/stats`).then((stats) => {
                    if (stats.ok) {
                        stats.json().then(st => {
                            let playing = document.getElementById(st.videoId);
                            playing.classList.remove('playing');
                        });
                    }
                });
            }
        });
    });
    document.getElementById('pause').addEventListener('click', (event) => {
        fetch(`${apiURL}api/player/pause`).then((paused) => {
            if (paused.ok) {
                console.log({ paused });
                paused.json().then(result => {
                    console.log({ result });

                    fetch(`${apiURL}api/player/stats`).then((stats) => {
                        if (stats.ok) {
                            stats.json().then(st => {
                                let pause = document.getElementById('pause');
                                let playing = document.getElementById(st.videoId);
                                if (pause.classList.contains('paused')) {
                                    pause.classList.remove('paused');
                                    playing.classList.add('playing');
                                } else {
                                    pause.classList.add('paused');
                                    playing.classList.remove('playing');
                                }
                            })
                        }
                    });



                });

            }
        });
    });
    document.getElementById('volDown').addEventListener('click', (event) => {
        fetch(`${apiURL}api/player/volume/down`).then((vol) => {
            if (vol.ok) {

            }
        });
    });
    document.getElementById('volUp').addEventListener('click', (event) => {
        fetch(`${apiURL}api/player/volume/up`).then((vol) => {
            if (vol.ok) {

            }
        });
    });
}


chrome.storage.sync.get(['apiURL'], (result) => {
    fetch(`${result.apiURL}api/player/stats`).then((stats) => {
        if (stats.ok) {
            stats.json().then(st => {

                let playlist = document.getElementById('playlist');
                if (st.playlist) {
                    playlist.classList.add('playlist');
                } else {
                    playlist.classList.remove('playlist');
                }

                // PAUSE
                if (st.status === 'paused') {
                    let pause = document.getElementById('pause');
                    pause.classList.add('paused');
                }
                fetch(`${result.apiURL}api/videos`).then((response) => {
                    if (response.ok) {
                        response.json().then(videos => {
                            if (videos.length > 0) {
                                constructOptions(result.apiURL, videos.reverse());
                                // CURRENT
                                if (st.status === 'playing') {
                                    let playing = document.getElementById(st.videoId);
                                    playing.classList.add('playing');
                                    let pause = document.getElementById('pause');
                                    pause.classList.remove('paused');
                                }
                            } else {
                                document.getElementById('videos').innerHTML = '<h4>No hay videos en la lista</h4>';
                            }
                        });
                    }
                });
            });
        }
    });
    return true;
});
