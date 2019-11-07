// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ apiURL: 'http://localhost:3000/' }, () => {
    chrome.storage.sync.get(['apiURL'], (result) => {
      console.log(`API URL is ${result.apiURL}`);
    });
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'www.youtube.com' },
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'developer.chrome.com' },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ sender });
  // console.log({ request });
  chrome.storage.sync.get(['apiURL'], (result) => {
    fetch(`${result.apiURL}api/videos/add/${request.ytid}`).then((response) => {
      if (response.ok) {
        sendResponse(response);
        console.log({ response });
      } else {
        console.log({ error });
      }
    }).catch(error => console.log(error));
    return true;
  });

});