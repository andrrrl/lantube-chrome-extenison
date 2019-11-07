setTimeout(() => {
    let buttons = [];

    let itemCount = document.querySelectorAll('a[id=video-title]').length;

    // function nodeInsertedCallback(event) {
    //     setTimeout(() => {
    //         let eventItemCount = document.querySelectorAll('a[id=video-title]').length;
    //         console.log({ eventItemCount });
    //         if (itemCount < eventItemCount) {
    //             console.log({ event });
    //             document.querySelectorAll('.btn-lantube').forEach((item) => item.remove());
    //             addLantubeButtons();
    //             eventItemCount = 0;
    //         }
    //     }, 4000)
    // };

    function addLantubeButtons() {

        document.querySelectorAll('a[id=video-title]').forEach((item, key) => {

            function addVideo() {
                let ytid = item.href.trim().replace(/http(s?):\/\/(w{3}?)(\.?)youtube\.com\/watch\?v=/, '');
                console.log(ytid);

                if (confirm('¿Agregar a Lantube?')) {

                    chrome.runtime.sendMessage({ ytid }, function (response) {
                        console.log(response);
                        buttons[key].innerText = '✔';
                        buttons[key].classList.remove('btn-lantube');
                        buttons[key].className = 'btn-lantube-added';
                        buttons[key].removeEventListener('click', addVideo, false);

                    });

                    // buttons[key].innerText = '✕';
                    // buttons[key].classList.remove('btn-lantube');
                    // buttons[key].className = 'btn-lantube-disabled';
                    // buttons[key].removeEventListener('click', addVideo, false);
                }
            }

            buttons[key] = document.createElement('button');
            buttons[key].className = 'btn-lantube';
            buttons[key].dataset.url = item.href;
            buttons[key].innerText = '+';
            buttons[key].setAttribute('title', 'Agregar a Lantube');

            buttons[key].addEventListener('click', addVideo, false);
            item.parentNode.append(buttons[key]);
        });
    }

    addLantubeButtons();

}, 2000);