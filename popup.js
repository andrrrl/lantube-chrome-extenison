// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });
let page = document.getElementById('videos');
let lista = document.createElement('ol');

function constructOptions(apiURL, videos) {
    for (let video of videos) {
        let title = document.createElement('li');
        title.innerText = video.videoInfo.title;
        let play = document.createElement('a');
        play.innerText = '▶'; // ‣
        play.addEventListener('click', function () {
            let playVideo = confirm(`¿Reproducir ${video.videoInfo.title}?`);
            if (playVideo) {
                fetch(`${apiURL}api/player/stop`).then((stopped) => {
                    if (stopped.ok) {
                        fetch(`${apiURL}api/player/${video.videoInfo.videoId}/play`).then((response) => {
                            if (response.ok) {
                                response.json().then(playing => console.log(playing));
                            }
                        });
                    }
                });
            }
        });
        lista.appendChild(title);
        title.appendChild(play);
    }
    page.appendChild(lista);

    document.getElementById('stop').addEventListener('click', (event) => {
        fetch(`${apiURL}api/player/stop`).then((stopped) => {
            if (stopped.ok) {
                let pause = document.getElementById('pause');
                pause.innerText = '▮▮';
            }
        });
    });
    document.getElementById('pause').addEventListener('click', (event) => {
        fetch(`${apiURL}api/player/pause`).then((paused) => {
            if (paused.ok) {
                paused.json().then(playing => {
                    let pause = document.getElementById('pause');
                    if (pause.innerText === '▮▮') {
                        pause.innerText = '▶';
                    } else {
                        pause.innerText = '▮▮';
                    }
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
                if (st.status === 'paused') {
                    let pause = document.getElementById('pause');
                    pause.innerText = '▶';
                }
                fetch(`${result.apiURL}api/videos`).then((response) => {
                    if (response.ok) {
                        response.json().then(videos => {
                            constructOptions(result.apiURL, videos);
                        });
                    }
                });
            });
        }
    });
    return true;
});

// chrome.runtime.sendMessage({ ytid }, function (response) {
//   console.log(response);
//   buttons[key].innerText = '✔';
//   buttons[key].classList.remove('btn-lantube');
//   buttons[key].className = 'btn-lantube-added';
//   buttons[key].removeEventListener('click', addVideo, false);

// });