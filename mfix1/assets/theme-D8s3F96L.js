/*!
 * TreDeSpace Web Viewer v0.0.126
 * Copyright (c) 2026 Vegar Ringdal. All rights reserved.
 *
 * Use of the hosted application is permitted as-is. Redistribution of this
 * code or a reconstructed form of it, publication of the model format or
 * derived tools to compete with the application, and use of this code or its
 * data for machine-learning training or text and data mining are not
 * permitted. Rights under mandatory law (incl. decompilation for
 * interoperability) are unaffected. See https://tredespace.com — LICENSE.
 */
var e=document.documentElement,t=document.getElementById(`themeIcon`),n=document.getElementById(`themeLabel`);function r(){return e.getAttribute(`data-theme`)===`light`?`light`:`dark`}function i(r){e.setAttribute(`data-theme`,r),t&&(t.textContent=r===`dark`?`☾`:`☀`),n&&(n.textContent=r)}function a(){let e=r()===`dark`?`light`:`dark`;i(e);try{sessionStorage.setItem(`tds-theme`,e)}catch{}return e}var o=null;try{o=sessionStorage.getItem(`tds-theme`)}catch{}i(o===`light`||o===`dark`?o:matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`),document.getElementById(`themeToggle`)?.addEventListener(`click`,()=>a());export{a as n,r as t};