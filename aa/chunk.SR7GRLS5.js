import{a as p,b as w,c as T,f as y}from"./chunk.K5OJMX56.js";import{b as A}from"./chunk.32AVIKSE.js";import{d as c}from"./chunk.3N2YFPE7.js";function g(t,e){t.registerDisconnectCallback(e)}var o="HASH_RENDER_EVENT";function h(){p(o)}function v(t,e){g(t,()=>w(o,t)),T(o,t,e)}var b="[a-zA-Z0-9\\_\\-\\:]+",r="\\/";function m(t){return t.substring(1,t.length)}function l(t){return!!(t&&typeof t=="string"&&t[0]===":")}function d(t){let e=t.split("/"),n=[];return e.forEach((i,s)=>{s===e.length-1&&i===""&&t[t.length-1]===r||n.push({staticType:!l(i),variable:l(i)?m(i):null,regex:l(i)?b:i})}),n}function E(t,e){let n="";return t.forEach((i,s)=>{t.length>1&&s===0||t.length===1?n="^"+i.regex:i.regex===r?n=n+i.regex:n=n+r+i.regex,!e&&t.length-1===s&&(n=n+"($|/$)")}),n}var _=function(t="",e=window.location.hash){if(!t&&(e===""||e==="#"))return!0;e.indexOf("?")!==-1&&(e=e.split("?")[0]);let n=!1;t[t.length-1]==="*"&&(t=t.substring(0,t.length-1),n=!0);let i=d(t),s=E(i,n),f=new RegExp(s);return f.test(e)},C=function(t="",e,n){return _(t)?A(e(),n):""};function a(){let t=window.location.hash,e=!1,n=function(){e?e=!1:y().then(i=>{i?(t=window.location.hash,h()):(e=!0,window.location.hash=t)})};globalThis.__simple_html_router||(globalThis.__simple_html_router=!0,window.addEventListener("hashchange",n))}a();var u={home:{path:"",href:"#",title:"Home",load:()=>import("./_dist_/routes/home.js"),html:c` <home-route></home-route> `,isNav:!0},settings:{path:"#settings",href:"#settings",title:"Settings",load:()=>import("./_dist_/routes/settings.js"),html:c` <settings-route></settings-route> `,isNav:!0},login:{path:"#login",href:"#login",title:"Auth",load:()=>import("./_dist_/routes/login.js"),html:c` <login-route></login-route>`,isNav:!1},unknown:{path:"unknown",href:"unknown",title:"Unknown",isNav:!1},child:{path:"#child/*",href:"#child/",title:"ChildRoute",isNav:!0,children:{subHome:{path:"#child/",href:"#child/",title:"SubHome",isNav:!0},subSettings:{path:"#child/settings",href:"#child/settings",title:"Sub Settings",isNav:!0},protected:{path:"#child/protected",href:"#child/protected",title:"sub Protected",isNav:!0}}}};function D(t){if(t==="main")return Object.keys(u).map(e=>u[e]);{let e=u.child.children;return Object.keys(e).map(n=>e[n])}}export{u as a,D as b,v as c,C as d};
