setTimeout(() => {

    function addLantubeButtons() {

        let buttons = [];

        // Select the node that will be observed for mutations
        const targetNode = document.getElementById('contents');

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: false };

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    Array.from(document.getElementsByClassName('btn-lantube')).map(x => x.remove());
                    addLantubeButtons();
                }
                else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Later, you can stop observing
        // observer.disconnect();


        document.querySelectorAll('a[id=video-title],span[id=video-title],a[id=wc-endpoint]').forEach((item, key) => {

            function addVideo() {
                let ytid = item.href.trim().replace(/&list=(.*)/, '').replace(/http(s?):\/\/(w{3}?)(\.?)youtube\.com\/watch\?v=/, '');
                console.log(ytid);

                if (confirm('¿Agregar a Lantube?')) {

                    chrome.runtime.sendMessage({ ytid }, function (response) {
                        console.log(response);
                        buttons[key].innerText = '✔';
                        buttons[key].classList.remove('btn-lantube');
                        buttons[key].className = 'btn-lantube-added';
                        buttons[key].removeEventListener('click', addVideo, false);

                    });

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

}, 3000);