// ==UserScript==
// @name         Microsoft Rewards
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cn.bing.com/search*
// @icon         https://cn.bing.com/sa/simg/favicon-trans-bg-blue-mg-png.png
// @grant        none
// ==/UserScript==

;(() => {
  ;('use strict')

  // 生成随机整数（含最小值，含最大值）
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.innerText = '开始任务'
  button.style.setProperty('z-index', '9000')
  button.style.setProperty('position', 'fixed')
  button.style.setProperty('right', '40px')
  button.style.setProperty('top', '120px')
  button.style.setProperty('width', 'max(30vh, 200px)')
  button.style.setProperty('height', 'max(20vh, 120px)')
  button.style.setProperty('border', 'none')
  button.style.setProperty('border-radius', '8px')
  button.style.setProperty('background-color', 'rgb(0 0 0 / 0.5)')
  button.style.setProperty('backdrop-filter', 'blur(8px)')
  button.style.setProperty('font-size', '24px')
  button.style.setProperty('color', 'rgb(255 255 255)')
  button.style.setProperty('cursor', 'pointer')

  /**
   * 按钮点击处理
   *
   * @param {'desktop'|'mobile'} platform
   * @param {[number,number]} delay
   */
  const clickHandler = (platform, delay) => {
    const searchInputEl = document.querySelector('#sb_form_q'),
      searchSubmitEl = document.querySelector('#sb_form_go')

    if (searchInputEl && searchSubmitEl) {
      const queryList = [],
        queryPrefixList = []

      queryPrefixList.push(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13)

      for (const prefix of queryPrefixList) {
        for (let i = 1; i < 12; i += 1) {
          queryList.push(`明日方舟 ${prefix}-${i}`)
        }
      }

      const presets = [
        // Microsoft Rewards Activities
        // prettier-ignore
        ['Bing Homepage quiz', 'dinner recipes', 'Lionel Messi', '巴辛吉', '巴仙吉犬', '必应首页小测试', '花椰菜 健康 好处', '关 颖珊 真相', '沙拉三明治', '食谱', '苏格拉底', '天气', '威尼斯'],
        // Solar Terms 二十四节气
        // prettier-ignore
        ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'],
        // Holidays (CN)
        // prettier-ignore
        ['元旦','除夕','春节','元宵节','妇女节,','清明节','劳动节','青年节','儿童节','端午节','建党节','建军节','中元节','教师节','中秋节','国庆节','重阳节'],
      ]

      presets.forEach((group) => group.map((item) => queryList.push(item)))

      const simulateSearchAction = (query) => {
        searchInputEl.focus()
        searchInputEl.value = query
        searchSubmitEl.click()
        console.log(`Searching: ${query}`)
      }

      const randomIndex = Math.floor(Math.random() * queryList.length)
      simulateSearchAction(queryList[randomIndex])

      //       const isArrayInteger =
      //             Array.isArray(delay) && delay.every((item) => Number.isInteger(item)),
      //             getRandomDelay = () => {
      //               return isArrayInteger
      //                 ? getRandomIntInclusive(delay[0], delay[1])
      //               : getRandomIntInclusive(1, 4);
      //             };

      //       queryList.forEach((query, index) => {
      //         const timer = setTimeout(() => {
      //           simulateSearchAction(query);
      //           clearInterval(timer);
      //         }, getRandomDelay * 1000);
      //       });
    } else {
      alert('Input element `#sb_form_q` not found!')
    }
  }

  button.addEventListener('click', () => {
    clickHandler()
  })

  document.body.append(button)
})()
