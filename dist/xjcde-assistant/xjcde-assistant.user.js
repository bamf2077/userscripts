// ==UserScript==
// @name            新疆建设人才培训网小助手
// @namespace       franciszhao
// @version         1.1.0
// @description     什么刷课？我不是！我没有！别瞎说！
// @author          Francis Zhao <francis@n2o.io>
// @homepageURL     http://www.xjcde.com/
// @supportURL      https://n2o.io/go?page=userscripts
// @license         MIT
// @match           *://*.xjcde.com/student/watch-package/*
// @match           *://*.xjcde.com/student/watch-resource/*
// @run-at          document-end
// @grant           GM.notification
// @grant           GM.openInTab
// @grant           GM.xmlHttpRequest
// @grant           window.close
// ==/UserScript==

function getServiceData() {
  const matches = location.pathname.match(/watch-\w+\/(\d+)/);
  const data = {
    learnPackageId: matches !== null ? matches[1] : null,
    sectionId: document.querySelector('#section-id').value,
    trainingId: document.querySelector('#training-id').value,
    resourceId: document.querySelector('#resourceId').value,
    historyId: document.querySelector('#historyId').value,
  };

  return data;
}

function getSectionList() {
  const list = [];
  const anchorList = document.querySelectorAll('div[class*="panel-body-"] a');
  anchorList.forEach((anchor) => {
    const matches = anchor.getAttribute('href').match(/watch-\w+\/\d+\/(\d+)/);
    if (matches !== null) {
      list.push(matches[1]);
    }
  });

  return list;
}

function hackPlayer() {
  const player = document.querySelector('.prism-player');
  if (player !== null) {
    const video = player.querySelector('video');
    if (video !== null) {
      // 尝试播放
      video.play();

      // 添加默认控件
      video.setAttribute('controls', '');

      // 开始播放处理
      const playingHandler = function () {
        // 直接播完
        video.currentTime = video.duration;

        // 设置播放速度 16x
        if (typeof video.playbackRate === 'number') {
          video.playbackRate = 16;
        }

        // 移除开始播放事件监听
        video.removeEventListener('playing', playingHandler);

        // 添加自定义控件
        addControls();
      };

      // 添加开始播放事件监听
      video.addEventListener('playing', playingHandler);
    }

    // 隐藏播放器控件
    const content = `
      .prism-player .prism-loading,
      .prism-player .prism-volume-control,
      .prism-player .prism-controlbar {
        display: none !important;
      }
    `;

    const style = document.createElement('style');
    style.innerHTML = content;
    document.head.appendChild(style);
  }
}

function addControls() {
  const panel = document.querySelector('.control-pane .tab-pane');
  if (panel !== null) {
    const sectionList = getSectionList();
    const sectionId = getServiceData().sectionId;

    const indexCurrent = sectionList.indexOf(sectionId);
    const indexNext = indexCurrent + 1;

    if (indexNext < sectionList.length) {
      const div = document.createElement('div');
      div.classList.add('col-md-12');

      const goToNext = function () {
        const url = location.href.replace(sectionId, sectionList[indexNext]);
        location.assign(url);
      };

      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add('btn', 'btn-success', 'btn-lg');
      button.innerHTML = '学习完成！开始下一节 >';
      button.addEventListener('click', goToNext);

      div.appendChild(button);
      panel.appendChild(div);
    }
  }
}

function postData(input, init) {
  const _init = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  };

  return fetch(input, Object.assign(_init, init))
    .then((response) => {
      // 判断 HTTP 状态码是否在 200 - 299 之间
      if (response.ok) {
        // 判断 HTTP 响应头内容类型是否为 JSON
        const contentType = response.headers.get('content-type');
        if (
          typeof contentType === 'string' &&
          contentType.toLowerCase().includes('application/json')
        ) {
          return response.json();
          /*
            {
              result: 'success',
              generatedId: 0,
              messageInfo: null,
              object: 100,
            }
           */
        } else {
          throw new TypeError();
        }
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    })
    .catch((error) => console.error('Error:', error));
}

// eslint-disable-next-line no-unused-vars
function updateProgress() {
  const apiList = [
    'http://hmonline.xjcde.com/student/set-training-hist',
    'http://hmonline.xjcde.com/student/set-training-hist-cur',
  ];

  const data = Object.assign(
    { lastWatch: document.querySelector('.prism-player video').duration },
    getServiceData(),
  );

  const init = { body: JSON.stringify(data) };

  apiList.forEach((api) => {
    postData(api, init).then((data) => {
      if (data && data.result === 'success') {
        //
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('hacked!');

  hackPlayer();
  // updateProgress();
});
