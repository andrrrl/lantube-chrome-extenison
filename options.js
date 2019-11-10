// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('configDiv');


function constructOptions() {
    let inputText = document.createElement('input');
    inputText.type = 'text';
    chrome.storage.sync.get(['apiURL'], (result) => {
        document.getElementById('valorActual').innerText = result.apiURL;
        inputText.value = result.apiURL;
    });

    let button = document.createElement('button');
    button.innerText = 'Guardar'
    button.className = 'btn-lantube';
    button.addEventListener('click', (ev) => {
        ev.preventDefault();
        chrome.storage.sync.set({ apiURL: inputText.value }, () => {
            console.log('New API URL is ' + inputText.value);
            document.getElementById('valorActual').innerText = inputText.value;
        });
    });
    page.appendChild(inputText);
    page.appendChild(button);
}
constructOptions();
