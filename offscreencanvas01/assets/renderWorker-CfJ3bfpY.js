/*!
 * TreDeSpace Web Viewer v0.0.130
 * Copyright (c) 2026 Vegar Ringdal. All rights reserved.
 *
 * Use of the hosted application is permitted as-is. Redistribution of this
 * code or a reconstructed form of it, publication of the model format or
 * derived tools to compete with the application, and use of this code or its
 * data for machine-learning training or text and data mining are not
 * permitted. Rights under mandatory law (incl. decompilation for
 * interoperability) are unaffected. See https://tredespace.com — LICENSE.
 */
(function(){
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/
let e=Symbol(`Comlink.proxy`),t=Symbol(`Comlink.endpoint`),n=Symbol(`Comlink.releaseProxy`),r=Symbol(`Comlink.finalizer`),i=Symbol(`Comlink.thrown`),a=e=>typeof e==`object`&&!!e||typeof e==`function`,o=new Map([[`proxy`,{canHandle:t=>a(t)&&t[e],serialize(e){let{port1:t,port2:n}=new MessageChannel;return c(e,t),[n,[n]]},deserialize(e){return e.start(),d(e)}}],[`throw`,{canHandle:e=>a(e)&&i in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(Error(e.value.message),e.value):e.value}}]]);function s(e,t){for(let n of e)if(t===n||n===`*`||n instanceof RegExp&&n.test(t))return!0;return!1}function c(e,t=globalThis,n=[`*`]){t.addEventListener(`message`,function a(o){if(!o||!o.data)return;if(!s(n,o.origin)){console.warn(`Invalid origin '${o.origin}' for comlink proxy`);return}let{id:l,type:d,path:f}=Object.assign({path:[]},o.data),p=(o.data.argumentList||[]).map(T),m;try{let t=f.slice(0,-1).reduce((e,t)=>e[t],e),n=f.reduce((e,t)=>e[t],e);switch(d){case`GET`:m=n;break;case`SET`:t[f.slice(-1)[0]]=T(o.data.value),m=!0;break;case`APPLY`:m=n.apply(t,p);break;case`CONSTRUCT`:m=C(new n(...p));break;case`ENDPOINT`:{let{port1:t,port2:n}=new MessageChannel;c(e,n),m=S(t,[t])}break;case`RELEASE`:m=void 0;break;default:return}}catch(e){m={value:e,[i]:0}}Promise.resolve(m).catch(e=>({value:e,[i]:0})).then(n=>{let[i,o]=w(n);t.postMessage(Object.assign(Object.assign({},i),{id:l}),o),d===`RELEASE`&&(t.removeEventListener(`message`,a),u(t),r in e&&typeof e[r]==`function`&&e[r]())}).catch(e=>{let[n,r]=w({value:TypeError(`Unserializable return value`),[i]:0});t.postMessage(Object.assign(Object.assign({},n),{id:l}),r)})}),t.start&&t.start()}function l(e){return e.constructor.name===`MessagePort`}function u(e){l(e)&&e.close()}function d(e,t){let n=new Map;return e.addEventListener(`message`,function(e){let{data:t}=e;if(!t||!t.id)return;let r=n.get(t.id);if(r)try{r(t)}finally{n.delete(t.id)}}),v(e,n,[],t)}function f(e){if(e)throw Error(`Proxy has been released and is not useable`)}function p(e){return E(e,new Map,{type:`RELEASE`}).then(()=>{u(e)})}let m=new WeakMap,h=`FinalizationRegistry`in globalThis&&new FinalizationRegistry(e=>{let t=(m.get(e)||0)-1;m.set(e,t),t===0&&p(e)});function g(e,t){let n=(m.get(t)||0)+1;m.set(t,n),h&&h.register(e,t,e)}function _(e){h&&h.unregister(e)}function v(e,r,i=[],a=function(){}){let o=!1,s=new Proxy(a,{get(t,a){if(f(o),a===n)return()=>{_(s),p(e),r.clear(),o=!0};if(a===`then`){if(i.length===0)return{then:()=>s};let t=E(e,r,{type:`GET`,path:i.map(e=>e.toString())}).then(T);return t.then.bind(t)}return v(e,r,[...i,a])},set(t,n,a){f(o);let[s,c]=w(a);return E(e,r,{type:`SET`,path:[...i,n].map(e=>e.toString()),value:s},c).then(T)},apply(n,a,s){f(o);let c=i[i.length-1];if(c===t)return E(e,r,{type:`ENDPOINT`}).then(T);if(c===`bind`)return v(e,r,i.slice(0,-1));let[l,u]=b(s);return E(e,r,{type:`APPLY`,path:i.map(e=>e.toString()),argumentList:l},u).then(T)},construct(t,n){f(o);let[a,s]=b(n);return E(e,r,{type:`CONSTRUCT`,path:i.map(e=>e.toString()),argumentList:a},s).then(T)}});return g(s,e),s}function y(e){return Array.prototype.concat.apply([],e)}function b(e){let t=e.map(w);return[t.map(e=>e[0]),y(t.map(e=>e[1]))]}let x=new WeakMap;function S(e,t){return x.set(e,t),e}function C(t){return Object.assign(t,{[e]:!0})}function w(e){for(let[t,n]of o)if(n.canHandle(e)){let[r,i]=n.serialize(e);return[{type:`HANDLER`,name:t,value:r},i]}return[{type:`RAW`,value:e},x.get(e)||[]]}function T(e){switch(e.type){case`HANDLER`:return o.get(e.name).deserialize(e.value);case`RAW`:return e.value}}function E(e,t,n,r){return new Promise(i=>{let a=D();t.set(a,i),e.start&&e.start(),e.postMessage(Object.assign({id:a},n),r)})}function D(){return[,,,,].fill(0).map(()=>Math.floor(Math.random()*(2**53-1)).toString(16)).join(`-`)}function O(e,t,n,r,i,a){let o=[(r+.5)/t*2-1,1-(i+.5)/n*2,a,1],s=new Float64Array(4);for(let t=0;t<4;t++)s[t]=e[t]*o[0]+e[4+t]*o[1]+e[8+t]*o[2]+e[12+t]*o[3];return Math.abs(s[3])<1e-12?null:[s[0]/s[3],s[1]/s[3],s[2]/s[3]]}function k(e,t,n){let r=A(e.vp);if(!r)return null;let i=O(r,e.w,e.h,t,n,1),a=O(r,e.w,e.h,t,n,.001);if(!i||!a)return null;let o=[a[0]-i[0],a[1]-i[1],a[2]-i[2]],s=Math.hypot(...o)||1;return{origin:i,dir:[o[0]/s,o[1]/s,o[2]/s]}}function A(e){let t=new Float32Array(16);t[0]=e[5]*e[10]*e[15]-e[5]*e[11]*e[14]-e[9]*e[6]*e[15]+e[9]*e[7]*e[14]+e[13]*e[6]*e[11]-e[13]*e[7]*e[10],t[4]=-e[4]*e[10]*e[15]+e[4]*e[11]*e[14]+e[8]*e[6]*e[15]-e[8]*e[7]*e[14]-e[12]*e[6]*e[11]+e[12]*e[7]*e[10],t[8]=e[4]*e[9]*e[15]-e[4]*e[11]*e[13]-e[8]*e[5]*e[15]+e[8]*e[7]*e[13]+e[12]*e[5]*e[11]-e[12]*e[7]*e[9],t[12]=-e[4]*e[9]*e[14]+e[4]*e[10]*e[13]+e[8]*e[5]*e[14]-e[8]*e[6]*e[13]-e[12]*e[5]*e[10]+e[12]*e[6]*e[9],t[1]=-e[1]*e[10]*e[15]+e[1]*e[11]*e[14]+e[9]*e[2]*e[15]-e[9]*e[3]*e[14]-e[13]*e[2]*e[11]+e[13]*e[3]*e[10],t[5]=e[0]*e[10]*e[15]-e[0]*e[11]*e[14]-e[8]*e[2]*e[15]+e[8]*e[3]*e[14]+e[12]*e[2]*e[11]-e[12]*e[3]*e[10],t[9]=-e[0]*e[9]*e[15]+e[0]*e[11]*e[13]+e[8]*e[1]*e[15]-e[8]*e[3]*e[13]-e[12]*e[1]*e[11]+e[12]*e[3]*e[9],t[13]=e[0]*e[9]*e[14]-e[0]*e[10]*e[13]-e[8]*e[1]*e[14]+e[8]*e[2]*e[13]+e[12]*e[1]*e[10]-e[12]*e[2]*e[9],t[2]=e[1]*e[6]*e[15]-e[1]*e[7]*e[14]-e[5]*e[2]*e[15]+e[5]*e[3]*e[14]+e[13]*e[2]*e[7]-e[13]*e[3]*e[6],t[6]=-e[0]*e[6]*e[15]+e[0]*e[7]*e[14]+e[4]*e[2]*e[15]-e[4]*e[3]*e[14]-e[12]*e[2]*e[7]+e[12]*e[3]*e[6],t[10]=e[0]*e[5]*e[15]-e[0]*e[7]*e[13]-e[4]*e[1]*e[15]+e[4]*e[3]*e[13]+e[12]*e[1]*e[7]-e[12]*e[3]*e[5],t[14]=-e[0]*e[5]*e[14]+e[0]*e[6]*e[13]+e[4]*e[1]*e[14]-e[4]*e[2]*e[13]-e[12]*e[1]*e[6]+e[12]*e[2]*e[5],t[3]=-e[1]*e[6]*e[11]+e[1]*e[7]*e[10]+e[5]*e[2]*e[11]-e[5]*e[3]*e[10]-e[9]*e[2]*e[7]+e[9]*e[3]*e[6],t[7]=e[0]*e[6]*e[11]-e[0]*e[7]*e[10]-e[4]*e[2]*e[11]+e[4]*e[3]*e[10]+e[8]*e[2]*e[7]-e[8]*e[3]*e[6],t[11]=-e[0]*e[5]*e[11]+e[0]*e[7]*e[9]+e[4]*e[1]*e[11]-e[4]*e[3]*e[9]-e[8]*e[1]*e[7]+e[8]*e[3]*e[5],t[15]=e[0]*e[5]*e[10]-e[0]*e[6]*e[9]-e[4]*e[1]*e[10]+e[4]*e[2]*e[9]+e[8]*e[1]*e[6]-e[8]*e[2]*e[5];let n=e[0]*t[0]+e[1]*t[4]+e[2]*t[8]+e[3]*t[12];if(Math.abs(n)<1e-30)return null;for(let e=0;e<16;e++)t[e]/=n;return t}function j(e,t,n,r){let i=e[0]*r[0]+e[4]*r[1]+e[8]*r[2]+e[12],a=e[1]*r[0]+e[5]*r[1]+e[9]*r[2]+e[13],o=e[3]*r[0]+e[7]*r[1]+e[11]*r[2]+e[15];return o<=1e-6?null:[(i/o+1)*.5*t,(1-a/o)*.5*n]}let M={viewProj:0,origin:16,darkFloor:19,eye:20,flags:24,light:28,ambient:32,headlight:36,selColor:40,backdrop:44};function N(e){let t={depth32float:4,rgba8unorm:4,bgra8unorm:4,r32float:4,r32uint:4,rg8unorm:2,rgba16float:8},n=e.size,r=1,i=1;if(Symbol.iterator in n){let e=[...n];r=e[0]??1,i=e[1]??1}else r=n.width,i=n.height??1;let a=r*i*(t[e.format]??4)*(e.sampleCount??1);return(e.mipLevelCount??1)>1&&(a=Math.ceil(a*4/3)),a}function P(e,t,n){let r=e.createBuffer.bind(e);e.createBuffer=e=>{let n=r(e);t(e.size);let i=n.destroy.bind(n),a=!0;return n.destroy=()=>{a&&(a=!1,t(-e.size)),i()},n};let i=e.createTexture.bind(e);e.createTexture=e=>{let t=i(e),r=N(e);n(r);let a=t.destroy.bind(t),o=!0;return t.destroy=()=>{o&&(o=!1,n(-r)),a()},t}}let F=Math.PI/180,I=.003,L=.002,R=89*F,z=89.99*F;var B=class{target=new Float32Array([0,0,0]);azimuth=.6;elevation=.5;orbitDistance=10;fovY=55*F;ortho=!1;orthoNear=-1;orthoFar=1e3;navMode=`fly`;keyPanSens=1;lastInputT=0;pointerActive=!1;onMoveKey=null;onOrbitIntent=null;padMove=[0,0];padLook=[0,0];flySpeed=6;flyShift=18;walkSpeed=4;walkShift=10;orbitSens=1;panSens=1;tAz=.6;tEl=.5;tDist=10;touches=new Map;claimed=new Set;dragButton=-1;orbitDX=0;orbitDY=0;panDX=0;panDY=0;wheel=0;keys=new Set;anim=null;lastView=new Float32Array(16);lastP00=1;lastP11=1;orthoHalfH=1;get near(){return Math.max(this.orbitDistance*8e-5,.001)}get focusDist(){return Math.max(this.orbitDistance,this.near)}forward(){let e=Math.cos(this.elevation),t=Math.sin(this.elevation);return[e*Math.cos(this.azimuth),e*Math.sin(this.azimuth),t]}eye(){let e=this.forward();return[this.target[0]-e[0]*this.orbitDistance,this.target[1]-e[1]*this.orbitDistance,this.target[2]-e[2]*this.orbitDistance]}axes(){let e=this.forward(),t=Math.hypot(e[0],e[1])||1,n=[-e[1]/t,e[0]/t,0];return{f:e,right:n,up:[e[1]*n[2]-e[2]*n[1],e[2]*n[0]-e[0]*n[2],e[0]*n[1]-e[1]*n[0]]}}setView(e,t){this.azimuth=this.tAz=e,this.elevation=this.tEl=t}fit(e,t){for(let n=0;n<3;n++)this.target[n]=(e[n]+t[n])/2;let n=Math.max(.5*Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]),.01);this.orbitDistance=this.tDist=n*1.3/Math.tan(this.fovY/2),this.anim=null}setPose(e,t,n,r){this.target.set(e),this.setView(t,n),this.orbitDistance=this.tDist=Math.max(r,.05),this.anim=null}dolly(e,t,n){this.anim={start:performance.now(),smoothTime:Math.max(n,.01),sTarget:this.target.slice(),sDist:this.orbitDistance,sAz:this.azimuth,sEl:this.elevation,eTarget:new Float32Array(e),eDist:Math.max(t,.05),eAz:this.azimuth,eEl:Math.min(z,Math.max(-z,this.elevation))}}snapView(e,t,n){if(this.dolly([this.target[0],this.target[1],this.target[2]],this.orbitDistance,n),this.anim){let n=Math.atan2(Math.sin(e-this.azimuth),Math.cos(e-this.azimuth));this.anim.eAz=this.azimuth+n,this.anim.eEl=Math.min(z,Math.max(-z,t))}}rePivot(e){this.onOrbitIntent?.();let t=this.eye(),n=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],r=Math.hypot(n[0],n[1],n[2]);if(!(r<1e-4)&&(this.dolly(e,r,.25),this.anim)){let e=Math.atan2(n[1],n[0]),t=Math.atan2(Math.sin(e-this.azimuth),Math.cos(e-this.azimuth));this.anim.eAz=this.azimuth+t,this.anim.eEl=Math.min(z,Math.max(-z,Math.asin(n[2]/r)))}}flyTo(e){this.onOrbitIntent?.(),this.dolly(e,Math.max(this.orbitDistance*.15,.5),.6)}goToPose(e,t,n,r,i=.5){if(this.dolly(e,Math.max(r,.05),i),this.anim){let e=Math.atan2(Math.sin(t-this.azimuth),Math.cos(t-this.azimuth));this.anim.eAz=this.azimuth+e,this.anim.eEl=Math.min(z,Math.max(-z,n))}}update(e){let t=Math.min(e,.033),n=this.keys.has(`shift`)?5:1,{f:r,right:i,up:a}=this.axes();if((this.orbitDX!==0||this.orbitDY!==0||this.panDX!==0||this.panDY!==0||this.wheel!==0||this.padMove[0]!==0||this.padMove[1]!==0||this.padLook[0]!==0||this.padLook[1]!==0||[`w`,`a`,`s`,`d`,`q`,`e`].some(e=>this.keys.has(e)))&&(this.anim=null,this.lastInputT=performance.now()),this.wheel!==0){let e=Math.min(.9,Math.max(-.9,this.wheel*1*.1));this.tDist=Math.max(this.tDist*(1-e),.1),this.wheel=0}if(this.padLook[0]!==0||this.padLook[1]!==0){let e=2.2;this.tAz-=this.padLook[0]*e*t*this.orbitSens,this.tEl=Math.min(R,Math.max(-R,this.tEl-this.padLook[1]*e*t*this.orbitSens))}if((this.orbitDX!==0||this.orbitDY!==0)&&(this.tAz-=this.orbitDX*I*this.orbitSens,this.tEl=Math.min(R,Math.max(-R,this.tEl-this.orbitDY*I*this.orbitSens)),this.orbitDX=this.orbitDY=0),this.panDX!==0||this.panDY!==0){let e=.5+Math.min(1,Math.max(0,this.orbitDistance/1e3))*49.5,t=this.panDX*L*this.panSens*e,n=this.panDY*L*this.panSens*e;for(let e=0;e<3;e++)this.target[e]+=i[e]*t+a[e]*n;this.panDX=this.panDY=0}let o=0,s=0;if(this.keys.has(`arrowright`)&&(o+=1),this.keys.has(`arrowleft`)&&--o,this.keys.has(`arrowup`)&&(s+=1),this.keys.has(`arrowdown`)&&--s,o!==0||s!==0){let e=Math.max(this.orbitDistance,.1)*.8*t*this.keyPanSens;for(let t=0;t<3;t++)this.target[t]+=(i[t]*o+a[t]*s)*e}let c=this.navMode===`orbit`,l=this.navMode===`walk`,u=l?this.walkSpeed:this.flySpeed,d=l?this.walkShift:this.flyShift,f=this.keys.has(`shift`)?d:u,p=[0,0,0],m=(e,t)=>{p[0]+=e[0]*t,p[1]+=e[1]*t,p[2]+=e[2]*t};if(this.ortho){let e=Math.max(1-1*t*Math.min(n,5),.1);!c&&(this.keys.has(`w`)||this.padMove[1]>.3)&&(this.tDist=Math.max(this.tDist*e,.1)),!c&&(this.keys.has(`s`)||this.padMove[1]<-.3)&&(this.tDist=Math.min(this.tDist/e,1e7))}else if(!c){let e=Math.hypot(r[0],r[1])||1,t=l?[r[0]/e,r[1]/e,0]:r;this.keys.has(`w`)&&m(t,1),this.keys.has(`s`)&&m(t,-1),this.padMove[1]!==0&&m(t,this.padMove[1])}c||(this.keys.has(`a`)&&m(i,1),this.keys.has(`d`)&&m(i,-1),this.padMove[0]!==0&&m(i,-this.padMove[0]),this.keys.has(`e`)&&(p[2]+=1),this.keys.has(`q`)&&--p[2]);let h=Math.hypot(p[0],p[1],p[2]);if(h>1e-6){let e=f*t/Math.max(h,1);if(this.ortho)for(let t=0;t<3;t++)this.target[t]+=p[t]*e;else{let t=.001,n=this.eye();this.orbitDistance=this.tDist=t;for(let i=0;i<3;i++)this.target[i]=n[i]+p[i]*e+r[i]*t}}if(this.anim){let e=this.anim,t=Math.min(1,(performance.now()-e.start)/1e3/e.smoothTime),n=t*t*(3-2*t);for(let t=0;t<3;t++)this.target[t]=e.sTarget[t]+(e.eTarget[t]-e.sTarget[t])*n;let r=e.eAz-e.sAz;r-=Math.round(r/(2*Math.PI))*2*Math.PI,this.azimuth=this.tAz=e.sAz+r*n,this.elevation=this.tEl=e.sEl+(e.eEl-e.sEl)*n,this.orbitDistance=this.tDist=e.sDist+(e.eDist-e.sDist)*n,t>=1&&(this.anim=null);return}let g=1-Math.exp(-10*t),_=(e,t)=>Math.abs(t-e)<1e-5?t:e+(t-e)*g;this.azimuth=_(this.azimuth,this.tAz),this.elevation=_(this.elevation,this.tEl),this.orbitDistance=_(this.orbitDistance,this.tDist)}get animating(){return this.anim!==null}settled(e=3e3){if(!this.anim)return Promise.resolve();let t=performance.now();return new Promise(n=>{let r=()=>{if(!this.anim||performance.now()-t>e){n();return}requestAnimationFrame(r)};requestAnimationFrame(r)})}viewProj(e){return this.buildViewProj(e,0,0,0,!0)}viewProjRelative(e,t){return this.buildViewProj(e,t[0],t[1],t[2],!1)}buildViewProj(e,t,n,r,i){let[a,o,s]=this.eye(),c=a-t,l=o-n,u=s-r,d=this.forward(),f=d[1],p=-d[0],m=Math.hypot(f,p)||1;f/=m,p/=m;let h=p*d[2],g=-f*d[2],_=f*d[1]-p*d[0],v=[f,h,-d[0],0,p,g,-d[1],0,0,_,-d[2],0,-(f*c+p*l),-(h*c+g*l+_*u),d[0]*c+d[1]*l+d[2]*u,1];i&&this.lastView.set(v);let y=Array(16).fill(0);if(this.ortho){let t=this.focusDist*Math.tan(this.fovY/2),n=t*e;this.orthoHalfH=t;let r=this.orthoNear,i=Math.max(this.orthoFar,r+.01);y[0]=1/n,y[5]=1/t,y[10]=1/(i-r),y[14]=i/(i-r),y[15]=1,this.lastP00=y[0],this.lastP11=y[5]}else{let t=1/Math.tan(this.fovY/2);y[0]=t/e,y[5]=t,y[11]=-1,y[14]=this.near,this.lastP00=y[0],this.lastP11=t,this.orthoHalfH=0}let b=new Float32Array(16);for(let e=0;e<4;e++)for(let t=0;t<4;t++){let n=0;for(let r=0;r<4;r++)n+=y[r*4+t]*v[e*4+r];b[e*4+t]=n}return b}get spaceHeld(){return this.keys.has(` `)}claimPointer(e){this.touches.delete(e),this.claimed.add(e)}releasePointer(e){this.claimed.delete(e)}handleInput(e,t){let n=this.touches,r=()=>{let e=[...n.values()];return{cx:(e[0].x+e[1].x)/2,cy:(e[0].y+e[1].y)/2,d:Math.hypot(e[0].x-e[1].x,e[0].y-e[1].y)}};switch(e.kind){case`pointerdown`:if(this.pointerActive=!0,e.pointerType===`touch`){n.set(e.pointerId,{x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,dragging:!1});return}if(e.button===0&&this.keys.has(` `)){t(e.offsetX,e.offsetY,!0);return}if(e.alt&&e.button===0){t(e.offsetX,e.offsetY,!1);return}this.dragButton=e.button;return;case`pointerup`:case`pointercancel`:n.delete(e.pointerId),this.claimed.delete(e.pointerId),e.pointerType!==`touch`&&(this.dragButton=-1),this.pointerActive=n.size>0||this.dragButton!==-1;return;case`pointermove`:if(e.pointerType===`touch`){let t=n.get(e.pointerId);if(!t||this.claimed.size>0)return;if(n.size===1){if(!t.dragging){if(Math.hypot(e.clientX-t.x0,e.clientY-t.y0)<=10)return;t.dragging=!0,t.x=e.clientX,t.y=e.clientY;return}this.orbitDX+=e.clientX-t.x,this.orbitDY+=e.clientY-t.y,t.x=e.clientX,t.y=e.clientY}else if(n.size===2){let n=r();t.x=e.clientX,t.y=e.clientY;let i=r();this.panDX+=i.cx-n.cx,this.panDY+=i.cy-n.cy,this.wheel+=(i.d-n.d)/60}else t.x=e.clientX,t.y=e.clientY;return}this.dragButton===0?(this.orbitDX+=e.movementX,this.orbitDY+=e.movementY):(this.dragButton===2||this.dragButton===1)&&(this.panDX+=e.movementX,this.panDY+=e.movementY);return;case`wheel`:this.onOrbitIntent?.(),this.wheel+=e.deltaMode===0?-e.deltaY/100:-e.deltaY;return;case`keydown`:{if(e.key===` `){this.keys.add(` `);return}let t=e.key.toLowerCase();(`wasdqe`.includes(t)||t===`shift`||t.startsWith(`arrow`))&&(this.keys.add(t),`wasdqe`.includes(t)&&this.onMoveKey?.());return}case`keyup`:this.keys.delete(e.key.toLowerCase());return;case`blur`:this.keys.clear();return}}attach(e,t){e.style.touchAction=`none`,e.addEventListener(`pointerdown`,n=>{n.pointerType!==`touch`&&n.button===0&&(this.spaceHeld||n.altKey)?n.preventDefault():e.setPointerCapture(n.pointerId),this.handleInput(te(`pointerdown`,n),t)});let n=e=>n=>this.handleInput(te(e,n),t);e.addEventListener(`pointerup`,n(`pointerup`)),e.addEventListener(`pointercancel`,n(`pointercancel`)),e.addEventListener(`pointermove`,e=>this.handleInput(te(`pointermove`,e),t)),e.addEventListener(`wheel`,e=>{e.preventDefault(),this.handleInput({kind:`wheel`,deltaY:e.deltaY,deltaMode:e.deltaMode,ctrl:e.ctrlKey,shift:e.shiftKey},t)},{passive:!1}),e.addEventListener(`contextmenu`,e=>e.preventDefault()),window.addEventListener(`keydown`,e=>{ee(e)||((e.key===` `||e.key.toLowerCase().startsWith(`arrow`))&&e.preventDefault(),this.handleInput(ne(`keydown`,e),t))}),window.addEventListener(`keyup`,e=>this.handleInput(ne(`keyup`,e),t)),window.addEventListener(`blur`,()=>this.handleInput({kind:`blur`},t))}};function ee(e){let t=e.target;return t instanceof HTMLElement&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.tagName===`SELECT`||t.isContentEditable)}function te(e,t){return{kind:e,pointerId:t.pointerId,pointerType:t.pointerType,button:t.button,buttons:t.buttons,clientX:t.clientX,clientY:t.clientY,offsetX:t.offsetX,offsetY:t.offsetY,movementX:t.movementX,movementY:t.movementY,alt:t.altKey,ctrl:t.ctrlKey,shift:t.shiftKey,meta:t.metaKey,detail:t.detail}}function ne(e,t){return{kind:e,key:t.key,code:t.code,repeat:t.repeat}}let re=null;function ie(){if(re===null){let e=navigator.userAgent;re=/Android|iPhone|iPod/i.test(e)||/Macintosh/.test(e)&&navigator.maxTouchPoints>1}return re}let V=2048,ae=`
// Logical view of one packed 36-byte cull record (see load_meshlet): a WGSL
// struct binding would pad vec3f fields to a 48-byte stride, so the buffer is
// bound as raw words and decoded per meshlet.
struct MeshletCull {
  center: vec3f,
  radius: f32,
  axis: vec3f,   // s8 snorm in the record — NOT renormalized (meshopt s8 test)
  cutoff: f32,   // >= 1 means degenerate (skip cone test)
  index_count: u32,
  first_index: u32,
  cg: u32,
  base_vertex: u32, // global first vertex of the meshlet (u16 local indices)
};
const MESHLET_WORDS = 9u;

struct CullParams {
  planes: array<vec4f, 6>,
  view: mat4x4f,
  eye: vec4f,
  p00: f32,
  p11: f32,
  znear: f32,
  mip_count: f32,
  pyramid_size: vec2f,
  px_cut: f32,       // cull meshlets whose projected radius < this (0 = off)
  protect_dist: f32, // never px-cut meshlets closer than this
  viewport_h: f32,
  is_ortho: u32,     // 1 = orthographic (p00/p11 are 1/half_w, 1/half_h)
  ortho_near: f32,   // ortho view-depth slab for HZB depth reconstruction
  ortho_far: f32,
  sort_mode: u32,    // 1 = route transparent meshlets to the sorted blend list
  sort_far: f32,     // perspective sort-key range end (view depth from the eye)
  new_cap: u32,      // max meshlets pass 2 may newly draw in one frame (0 = no cap)
  pad1: f32,
};

@group(0) @binding(0) var<storage, read> meshlets: array<u32>;

fn load_meshlet(i: u32) -> MeshletCull {
  let o = i * MESHLET_WORDS;
  var m: MeshletCull;
  m.center = vec3f(bitcast<f32>(meshlets[o]), bitcast<f32>(meshlets[o + 1u]), bitcast<f32>(meshlets[o + 2u]));
  m.radius = bitcast<f32>(meshlets[o + 3u]);
  let cone = unpack4x8snorm(meshlets[o + 4u]); // [axis.xyz, cutoff]
  m.axis = cone.xyz;
  m.cutoff = cone.w;
  m.index_count = meshlets[o + 5u];
  m.first_index = meshlets[o + 6u];
  m.cg = meshlets[o + 7u];
  m.base_vertex = meshlets[o + 8u];
  return m;
}
@group(0) @binding(3) var<storage, read_write> vis: array<u32>;
// meshlet_info words (item id at word 7) + per-item [flags, color, tidx]:
// hidden items are culled here so they cost nothing downstream.
// IMPORTANT: both cull passes evaluate this identically (two-pass rule).
@group(0) @binding(4) var<storage, read> info_words: array<u32>;
struct ItemStateCull {
  flags: u32,
  color: u32,
  tidx: u32, // 0 = identity, else index into transforms_cull
};
@group(0) @binding(5) var<storage, read> item_states_cull: array<ItemStateCull>;
@group(0) @binding(6) var<storage, read> transforms_cull: array<mat4x4f>;
// same per-model uniform the render shaders bind: live gizmo-drag matrix
// applied to SELECTED items (info.y = active) — mirrors the mesh shader
struct ModelUniCull {
  info: vec4u,
  global: mat4x4f,
};
@group(0) @binding(7) var<uniform> model_uni_cull: ModelUniCull;
@group(1) @binding(0) var<uniform> params: CullParams;

// Sorted blend list inputs: cooked colour-group colours (baked alpha), the
// candidate list [meshlet, bucket] pairs and the sort state — SORT_BUCKETS
// histogram words (exclusive bases after the scan) and the candidate count
// (sortScanWgsl / sortScatterWgsl).
const SORT_BUCKETS = ${V}u;
@group(0) @binding(8) var<storage, read> cg_colors_cull: array<vec4f>;
@group(0) @binding(9) var<storage, read_write> cand: array<u32>;
@group(0) @binding(10) var<storage, read_write> sort_state: array<atomic<u32>>;

// Mirror of the scene shader's item_opacity < 1: an explicit opacity override
// wins, else a colour override's alpha, else the baked colour-group alpha.
// (Effective opacity 0 never gets here — item_hidden culls it first.)
fn meshlet_transparent(i: u32) -> bool {
  let st = item_states_cull[info_words[i * 8u + 7u]];
  if ((st.flags & 64u) != 0u) { return ((st.flags >> 25u) & 127u) < 100u; }
  if ((st.flags & 16u) != 0u) { return ((st.color >> 24u) & 255u) < 255u; }
  return cg_colors_cull[info_words[i * 8u + 3u]].w < 1.0;
}

// Depth bucket of the (transformed) bounding-sphere centre: bucket 0 is the
// farthest and draws first. Perspective: log-mapped view depth between the
// near plane and sort_far, so a bucket spans a fixed fraction of the distance
// wherever the meshlet sits; ortho: linear over the depth slab. Both cull
// passes bucket with the same params, so the list is consistent per frame.
fn sort_bucket(center: vec3f) -> u32 {
  let d = -(params.view * vec4f(center, 1.0)).z;
  var t: f32;
  if (params.is_ortho == 1u) {
    t = (d - params.ortho_near) / max(params.ortho_far - params.ortho_near, 1e-6);
  } else {
    t = log2(max(d, params.znear) / params.znear) / log2(max(params.sort_far / params.znear, 2.0));
  }
  return u32((1.0 - clamp(t, 0.0, 1.0)) * f32(SORT_BUCKETS - 1u) + 0.5);
}

fn emit_transparent(m: MeshletCull, i: u32) {
  let b = sort_bucket(m.center);
  let c = atomicAdd(&sort_state[SORT_BUCKETS], 1u);
  cand[c * 2u] = i;
  cand[c * 2u + 1u] = b;
  atomicAdd(&sort_state[b], 1u);
}

fn emit(m: MeshletCull, i: u32) {
  if (params.sort_mode == 1u && meshlet_transparent(i)) {
    emit_transparent(m, i);
  } else {
    emit_opaque(m, i);
  }
}

// Invisible as the user sees it — the hide flag, an explicit opacity override
// of 0, or a colour override with alpha 0 (the explicit override wins, like
// the scene shader's item_opacity). Such an item must cost nothing: not
// rasterized, not blended — and, writing no depth, it would punch a hole in
// the HZB that un-occludes everything behind it. The opacity-0 arm is for
// state saved before opacity 0 became the hide flag; nothing writes one now
// (withOpacityOverride). Mirrors isEffectivelyHidden (dbState.ts) and the
// snap shader's is_invisible.
fn item_hidden(i: u32) -> bool {
  let st = item_states_cull[info_words[i * 8u + 7u]];
  if ((st.flags & 1u) != 0u) { return true; }
  if ((st.flags & 64u) != 0u) { return ((st.flags >> 25u) & 127u) == 0u; }
  return (st.flags & 16u) != 0u && ((st.color >> 24u) & 255u) == 0u;
}

fn item_transform(i: u32) -> u32 {
  return item_states_cull[info_words[i * 8u + 7u]].tidx;
}

fn item_live(i: u32) -> bool {
  return model_uni_cull.info.y == 1u &&
    (item_states_cull[info_words[i * 8u + 7u]].flags & 4u) != 0u;
}

// mirror of the fragment clip (native cull.slang does the same): meshlets
// whose bounding sphere is entirely on the cut side never rasterize
struct ClipShapeCull {
  inv_transform: mat4x4f,
  params0: vec4f,
  params1: vec4f,
  kind_flags: vec4u,
};
struct ClipDataCull {
  planes: array<vec4f, 8>,
  plane_mask: vec4u,
  shapes: array<ClipShapeCull, 8>, // slot 0 = default box, 1..7 = user shapes
};
@group(1) @binding(3) var<uniform> cclip: ClipDataCull;

fn clip_culled(center: vec3f, radius: f32) -> bool {
  let mask = cclip.plane_mask.x;
  for (var i = 0u; i < 8u; i++) {
    if ((mask & (1u << i)) != 0u &&
        dot(cclip.planes[i].xyz, center) + cclip.planes[i].w < -radius) {
      return true; // sphere fully behind an enabled plane
    }
  }
  // Shapes (slot 0 = the default box) — must match the fragment semantics
  // (native cull.slang), evaluated conservatively on the bounding sphere:
  //   holes: a sphere entirely INSIDE an inverted shape is fully discarded
  //   keeps: cull only when entirely outside EVERY keep volume (union-of-keeps)
  // The box inv_transform is rotation+translation only (clipPack.ts), so the
  // world-space radius is valid in box-local units.
  var any_keep = false;
  var maybe_inside = false;
  for (var si = 0u; si < 8u; si++) {
    let cs = cclip.shapes[si];
    if (cs.kind_flags.x == 0u) { continue; }
    if (cs.kind_flags.y != 0u) { // hole: cull when the sphere is fully inside
      var entirely_inside = false;
      if (cs.kind_flags.x == 1u) { // box: shrunk-AABB test in box-local space
        let local = (cs.inv_transform * vec4f(center, 1.0)).xyz;
        entirely_inside = all(local >= cs.params0.xyz + vec3f(radius)) &&
                          all(local <= cs.params1.xyz - vec3f(radius));
      } else if (cs.kind_flags.x == 2u) { // sphere-in-sphere
        let d = center - cs.params0.xyz;
        let rr = cs.params0.w - radius;
        entirely_inside = rr > 0.0 && dot(d, d) < rr * rr;
      } else { // cylinder: axial slab + shrunk radial distance
        let rel = center - cs.params0.xyz;
        let t = dot(rel, cs.params1.xyz);
        let radial = rel - t * cs.params1.xyz;
        let rr = cs.params0.w - radius;
        entirely_inside = rr > 0.0 && t >= radius && t <= cs.params1.w - radius &&
                          dot(radial, radial) < rr * rr;
      }
      if (entirely_inside) { return true; } // fully carved away by the hole
      continue;
    }
    any_keep = true;
    var entirely_outside = false;
    if (cs.kind_flags.x == 1u) { // box: expanded-AABB test in box-local space
      let local = (cs.inv_transform * vec4f(center, 1.0)).xyz;
      entirely_outside = any(local < cs.params0.xyz - vec3f(radius)) ||
                         any(local > cs.params1.xyz + vec3f(radius));
    } else if (cs.kind_flags.x == 2u) { // sphere-sphere
      let d = center - cs.params0.xyz;
      let rr = cs.params0.w + radius;
      entirely_outside = dot(d, d) > rr * rr;
    } else { // cylinder: each condition alone proves the sphere fully outside
      let rel = center - cs.params0.xyz;
      let t = dot(rel, cs.params1.xyz);
      let radial = rel - t * cs.params1.xyz;
      let rr = cs.params0.w + radius;
      entirely_outside = t < -radius || t > cs.params1.w + radius ||
                         dot(radial, radial) > rr * rr;
    }
    if (!entirely_outside) { maybe_inside = true; }
  }
  if (any_keep && !maybe_inside) { return true; } // outside every keep volume
  return false;
}

// skip_cone: transformed meshlets skip the cone test — the cone is in the
// untransformed frame (same rule as native cull.slang).
fn frustum_cone_visible(m: MeshletCull, skip_cone: bool) -> bool {
  for (var p = 0u; p < 6u; p++) {
    if (dot(params.planes[p].xyz, m.center) + params.planes[p].w < -m.radius) {
      return false;
    }
  }
  if (m.cutoff < 1.0 && !skip_cone) {
    // meshopt cone test, apex-free conservative form (niagara): the cluster
    // faces entirely away when the view ray to its bounding sphere lies
    // inside the normal cone — the +radius term absorbs the dropped apex
    let to_c = m.center - params.eye.xyz;
    if (dot(to_c, m.axis) >= m.cutoff * length(to_c) + m.radius) {
      return false;
    }
  }
  if (params.px_cut > 0.0) {
    let dist = distance(m.center, params.eye.xyz);
    if (dist - m.radius > params.protect_dist) {
      // ortho: projected size is distance-independent (p11 = 1/half_h)
      var rpx: f32;
      if (params.is_ortho == 1u) {
        rpx = m.radius * params.p11 * params.viewport_h * 0.5;
      } else {
        rpx = m.radius * params.p11 / max(dist, 1e-6) * params.viewport_h * 0.5;
      }
      if (rpx < params.px_cut) { return false; }
    }
  }
  return true;
}

`;function oe(e,t){let n=t?`
struct DrawArgs {
  vertex_count: u32,
  instance_count: atomic<u32>,
  first_vertex: u32,
  first_instance: u32,
};
@group(0) @binding(1) var<storage, read_write> vis_list: array<u32>;
@group(0) @binding(2) var<storage, read_write> args: DrawArgs;

fn emit_opaque(m: MeshletCull, i: u32) {
  vis_list[atomicAdd(&args.instance_count, 1u)] = i;
}

fn stamp_args(gid: vec3u) {
  if (gid.x == 0u) { args.vertex_count = 372u; }
}
`:`
@group(0) @binding(1) var<storage, read_write> records: array<u32>;
@group(0) @binding(2) var<storage, read_write> draw_count: atomic<u32>;

fn emit_opaque(m: MeshletCull, i: u32) {
  let slot = atomicAdd(&draw_count, 1u) * 5u;
  records[slot + 0u] = m.index_count;
  records[slot + 1u] = 1u;
  records[slot + 2u] = m.first_index;
  records[slot + 3u] = m.base_vertex;
  // firstInstance = 2 x meshlet index: the render shader reads the meshlet
  // from instance_index >> 1 and the blend pass's facing half from bit 0
  // (the sorted transparent records draw two instances per meshlet)
  records[slot + 4u] = i * 2u;
}
`,r=e?`
@group(1) @binding(1) var hzb: texture_2d<f32>;
// per-frame budget for NEWLY visible meshlets, shared by every model's pass-2
// dispatch and cleared before the pass (see new_cap)
@group(1) @binding(2) var<storage, read_write> new_budget: atomic<u32>;

// Conservative screen-space AABB of a view-space sphere (niagara's
// projectSphere). c.z is positive distance in front of the camera.
// Returns false when the sphere clips the near region (treat as visible).
fn project_sphere(c: vec3f, r: f32, aabb: ptr<function, vec4f>) -> bool {
  if (c.z < r + params.znear) { return false; }
  let cx = -vec2f(c.x, c.z);
  let vx = vec2f(sqrt(dot(cx, cx) - r * r), r);
  let minx = mat2x2f(vx.x, vx.y, -vx.y, vx.x) * cx;
  let maxx = mat2x2f(vx.x, -vx.y, vx.y, vx.x) * cx;
  let cy = -vec2f(c.y, c.z);
  let vy = vec2f(sqrt(dot(cy, cy) - r * r), r);
  let miny = mat2x2f(vy.x, vy.y, -vy.y, vy.x) * cy;
  let maxy = mat2x2f(vy.x, -vy.y, vy.y, vy.x) * cy;
  var box = vec4f(
    minx.x / minx.y * params.p00, miny.x / miny.y * params.p11,
    maxx.x / maxx.y * params.p00, maxy.x / maxy.y * params.p11,
  );
  box = box.xwzy * vec4f(0.5, -0.5, 0.5, -0.5) + vec4f(0.5); // clip -> uv
  *aabb = box;
  return true;
}

/** Draw a meshlet that was NOT visible last frame, charging it to this
 *  frame's budget. Over budget it is skipped and reported as not drawn — the
 *  caller then leaves its visibility bit clear. new_cap 0 = no budget.
 *
 *  The counter is charged even with the cap off: a frame where pass 2 finds
 *  NOTHING new is the fixed point of the two-pass occlusion, and that — not a
 *  frame count — is what takes the renderer idle (renderer.ts settle window). */
fn emit_new(m: MeshletCull, i: u32) -> bool {
  let charged = atomicAdd(&new_budget, 1u);
  if (params.new_cap > 0u && charged >= params.new_cap) {
    return false;
  }
  emit(m, i);
  return true;
}

fn occlusion_visible(m: MeshletCull) -> bool {
  let cv = (params.view * vec4f(m.center, 1.0)).xyz;
  let c = vec3f(cv.x, cv.y, -cv.z); // view looks down -Z; flip to +Z forward
  var aabb = vec4f(0.0);
  var sphere_depth_ortho = 0.0;
  if (params.is_ortho == 1u) {
    // ortho projection of a sphere is exact: constant scale, linear depth
    let uv = vec2f(c.x * params.p00, c.y * params.p11) * vec2f(0.5, -0.5) + vec2f(0.5);
    let ext = vec2f(m.radius * params.p00, m.radius * params.p11) * 0.5;
    aabb = vec4f(uv - ext, uv + ext);
    sphere_depth_ortho =
      (params.ortho_far - (c.z - m.radius)) / max(params.ortho_far - params.ortho_near, 1e-4);
  } else if (!project_sphere(c, m.radius, &aabb)) {
    return true;
  }

  let w = (aabb.z - aabb.x) * params.pyramid_size.x;
  let h = (aabb.w - aabb.y) * params.pyramid_size.y;
  let level = u32(clamp(floor(log2(max(max(w, h), 1.0))), 0.0, params.mip_count - 1.0));
  let dims = textureDimensions(hzb, level);
  let maxc = dims - 1u;
  let fdims = vec2f(dims);
  let a = min(vec2u(clamp(aabb.xy, vec2f(0.0), vec2f(1.0)) * fdims), maxc);
  let b = min(vec2u(clamp(aabb.zw, vec2f(0.0), vec2f(1.0)) * fdims), maxc);
  // min over the 4 corner texels = farthest occluder depth (reversed-Z)
  let d = min(
    min(textureLoad(hzb, a, level).x, textureLoad(hzb, vec2u(b.x, a.y), level).x),
    min(textureLoad(hzb, vec2u(a.x, b.y), level).x, textureLoad(hzb, b, level).x),
  );
  var sphere_depth: f32;
  if (params.is_ortho == 1u) {
    sphere_depth = sphere_depth_ortho;
  } else {
    sphere_depth = params.znear / (c.z - m.radius); // nearest point of sphere
  }
  return sphere_depth >= d;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  STAMP
  let i = gid.x;
  if (i >= arrayLength(&meshlets) / MESHLET_WORDS) { return; }
  if (item_hidden(i)) {
    vis[i] = 0u;
    return;
  }
  var m = load_meshlet(i);
  let tid = item_transform(i);
  if (tid != 0u) {
    m.center = (transforms_cull[tid] * vec4f(m.center, 1.0)).xyz;
  }
  let live = item_live(i);
  if (live) {
    m.center = (model_uni_cull.global * vec4f(m.center, 1.0)).xyz;
  }
  if (clip_culled(m.center, m.radius)) {
    vis[i] = 0u;
    return;
  }
  // transformed meshlets skip the HZB test: the pyramid holds last frame's
  // depths at the OLD position — testing the moved center against it would
  // wrongly occlude (same rule as native cull.slang)
  let moved = tid != 0u || live;
  let visible = frustum_cone_visible(m, moved) && (moved || occlusion_visible(m));
  var drawn = vis[i] == 1u; // already drawn in pass 1, never charged again
  if (visible && !drawn) { drawn = emit_new(m, i); }
  // a meshlet the budget turned away stays "not yet drawn", so the next frame
  // retests it against a HZB that now holds what DID get drawn — most of the
  // backlog is genuinely occluded by then instead of arriving all at once
  vis[i] = select(0u, 1u, visible && drawn);
}
`:`
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  STAMP
  let i = gid.x;
  if (i >= arrayLength(&meshlets) / MESHLET_WORDS) { return; }
  if (vis[i] == 0u) { return; }
  if (item_hidden(i)) { return; }
  var m = load_meshlet(i);
  // committed item transform: move the bounding sphere to the transformed
  // position so frustum/clip tests use the right location (native cull.slang)
  let tid = item_transform(i);
  if (tid != 0u) {
    m.center = (transforms_cull[tid] * vec4f(m.center, 1.0)).xyz;
  }
  // live gizmo-drag preview on top (selected items only, like the VS)
  let live = item_live(i);
  if (live) {
    m.center = (model_uni_cull.global * vec4f(m.center, 1.0)).xyz;
  }
  if (clip_culled(m.center, m.radius)) { return; }
  if (frustum_cone_visible(m, tid != 0u || live)) { emit(m, i); }
}
`;return(ae+n+r).replaceAll(`STAMP`,t?`stamp_args(gid);`:``)}function se(){return`
const SORT_BUCKETS = ${V}u;
const SCAN_THREADS = 256u;
const PER_THREAD = SORT_BUCKETS / SCAN_THREADS;
@group(0) @binding(0) var<storage, read_write> sort_state: array<u32>;
@group(0) @binding(1) var<storage, read_write> t_slot: array<u32>;
@group(0) @binding(2) var<storage, read_write> dispatch_args: array<u32>;
var<workgroup> partial: array<u32, SCAN_THREADS>;

@compute @workgroup_size(256)
fn main(@builtin(local_invocation_id) lid: vec3u) {
  let t = lid.x;
  var sum = 0u;
  for (var k = 0u; k < PER_THREAD; k++) { sum += sort_state[t * PER_THREAD + k]; }
  partial[t] = sum;
  workgroupBarrier();
  if (t == 0u) {
    var run = 0u;
    for (var j = 0u; j < SCAN_THREADS; j++) {
      let v = partial[j];
      partial[j] = run;
      run += v;
    }
    let n = sort_state[SORT_BUCKETS];
    dispatch_args[0] = (n + 63u) / 64u;
    dispatch_args[1] = 1u;
    dispatch_args[2] = 1u;
    t_slot[0] = 372u;
    t_slot[1] = n * 2u;
    t_slot[2] = 0u;
    t_slot[3] = 0u;
    t_slot[4] = n;
  }
  workgroupBarrier();
  var base = partial[t];
  for (var k = 0u; k < PER_THREAD; k++) {
    let idx = t * PER_THREAD + k;
    let v = sort_state[idx];
    sort_state[idx] = base;
    base += v;
  }
}
`}function ce(e){return`
const SORT_BUCKETS = ${V}u;
@group(0) @binding(0) var<storage, read> cand: array<u32>;
@group(0) @binding(1) var<storage, read_write> sort_state: array<atomic<u32>>;
@group(0) @binding(2) var<storage, read_write> out: array<u32>;
${e?``:`@group(0) @binding(3) var<storage, read> meshlets: array<u32>;`}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let g = gid.x;
  if (g >= atomicLoad(&sort_state[SORT_BUCKETS])) { return; }
  let i = cand[g * 2u];
  let b = cand[g * 2u + 1u];
  let dst = atomicAdd(&sort_state[b], 1u);
${e?`  out[dst * 2u] = i;
  out[dst * 2u + 1u] = i | 0x80000000u;`:`  let o = i * 9u;
  let slot = dst * 5u;
  out[slot + 0u] = meshlets[o + 5u];
  out[slot + 1u] = 2u;
  out[slot + 2u] = meshlets[o + 6u];
  out[slot + 3u] = meshlets[o + 8u];
  out[slot + 4u] = i * 2u;`}
}
`}function le(e){return`
@group(0) @binding(0) var src: ${e?`texture_multisampled_2d<f32>`:`texture_2d<f32>`};
@group(0) @binding(1) var dst: texture_storage_2d<r32float, write>;

fn src_min(c: vec2u) -> f32 {
${e?`  var d = 1.0;
  for (var s = 0u; s < textureNumSamples(src); s++) {
    d = min(d, textureLoad(src, c, i32(s)).x);
  }
  return d;`:`  return textureLoad(src, c, 0).x;`}
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let dsize = textureDimensions(dst);
  if (gid.x >= dsize.x || gid.y >= dsize.y) { return; }
  let ssize = textureDimensions(src);
  let base = gid.xy * 2u;
  let nx = select(2u, 3u, (ssize.x & 1u) == 1u);
  let ny = select(2u, 3u, (ssize.y & 1u) == 1u);
  var d = 1.0;
  for (var y = 0u; y < ny; y++) {
    for (var x = 0u; x < nx; x++) {
      d = min(d, src_min(min(base + vec2u(x, y), ssize - 1u)));
    }
  }
  textureStore(dst, gid.xy, vec4f(d, 0.0, 0.0, 0.0));
}
`}function ue(e,t){return t===1?{buf:e.recordBuf1,offset:e.countOffset1,vpBind:e.vpGeoBind1}:t===2?{buf:e.recordBuf2,offset:e.countOffset2,vpBind:e.vpGeoBind2}:{buf:e.recordBufT,offset:e.countOffsetT+16,vpBind:e.vpGeoBindT}}function de(e,t){return t===3?e.countOffsetT:ue(e,t).offset}function fe(e,t,n,r,i,a,o){for(let s of r===`full`?[1]:[1,2,3])if(r===`mdi`){e.setPipeline(i);for(let r of t){if(r.dead||r.meshletCount===0)continue;e.setBindGroup(0,r.renderBind,[o]),e.setVertexBuffer(0,r.vertexBuf),e.setIndexBuffer(r.indexBuf,`uint16`);let{buf:t,offset:i}=ue(r,s);e.multiDrawIndexedIndirect(t,0,r.meshletCount,n,i)}}else{e.setPipeline(a);for(let i of t)i.dead||i.meshletCount===0||(e.setBindGroup(0,i.renderBind,[o]),r===`vp`?(e.setBindGroup(1,ue(i,s).vpBind),e.drawIndirect(n,de(i,s))):(e.setBindGroup(1,i.vpGeoBindFull),e.drawIndirect(i.fullArgsBuf,0)))}}function pe(e,t=!1){let n=e.info;return{vendor:n.vendor,architecture:n.architecture,device:n.device,description:n.description,isFallback:!!n.isFallbackAdapter||t}}let me=[`cull 1`,`scene 1`,`hzb`,`cull 2`,`sort`,`scene 2`,`blend`,`ao`,`post`,`outline`,`cube`,`item pick`];var he=class{supported=!1;enabled=!1;times=[];totalMs=0;device=null;querySet=null;resolveBuf=null;readBuf=null;inFlight=!1;encoded=[];attach(e,t){this.device=e,this.supported=t}ensure(){if(!this.enabled||!this.supported||!this.device)return!1;if(!this.querySet){let e=me.length*2;this.querySet=this.device.createQuerySet({type:`timestamp`,count:e}),this.resolveBuf=this.device.createBuffer({label:`tsResolveBuf`,size:e*8,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),this.readBuf=this.device.createBuffer({label:`tsReadBuf`,size:e*8,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}return!0}writes(e){if(this.ensure())return this.encoded.push(e),{querySet:this.querySet,beginningOfPassWriteIndex:e*2,endOfPassWriteIndex:e*2+1}}span(e,t){if(this.ensure())return t===`begin`?{querySet:this.querySet,beginningOfPassWriteIndex:e*2}:(this.encoded.push(e),{querySet:this.querySet,endOfPassWriteIndex:e*2+1})}resolve(e){let t=new Set(this.encoded);if(this.encoded.length=0,!this.enabled||!this.querySet||this.inFlight)return null;let n=me.length*2;return e.resolveQuerySet(this.querySet,0,n,this.resolveBuf,0),e.copyBufferToBuffer(this.resolveBuf,0,this.readBuf,0,n*8),this.inFlight=!0,()=>{this.readBuf.mapAsync(GPUMapMode.READ).then(()=>{let e=new BigUint64Array(this.readBuf.getMappedRange().slice(0));this.readBuf.unmap();let n=0;this.times=me.map((r,i)=>{let a=e[i*2],o=e[i*2+1],s=t.has(i)&&o>a?Number(o-a)/1e6:0,c=this.times[i]?.ms,l=s<1e3?s:c??0;return n+=l,{label:r,ms:(c??l)*.8+l*.2}}),this.totalMs+=n}).catch(()=>void 0).finally(()=>{this.inFlight=!1})}}};let ge=`struct Frame {
  // CAMERA-RELATIVE: clip = view_proj * (world_abs - origin). Everything the
  // vertex stage interpolates (world, eye) is in that rebased space too —
  // f32 resolves ~1 mm at 10 km from the true origin, which speckles distant
  // geometry through both z-fighting and the derivative face normal.
  view_proj: mat4x4f,
  // xyz: the frame's rebase origin (the camera position, rounded); w unused
  // xyz = rebase origin; w = dark-colour lift floor (unlit luma, 0 = off)
  origin: vec4f,
  // eye in REBASED space (= absolute eye - origin)
  eye: vec4f,
  // x: 1 = per-meshlet debug colors; y: suppress selection tint on overrides;
  // z: bit0 = blend transparency mode, bit1 = this is the blend pass,
  //    bit2 = Background mode (the blend pass renders solid, faded),
  //    bit3 = the blend pass draws the cull's sorted transparent list, two
  //           instances per meshlet (facing split: back faces, then front);
  // w: frame counter (alpha-hash seed)
  flags: vec4u,
  // xyz: directional headlight (surface -> light), used when w == 1 (ortho).
  // Perspective (w == 0) lights from the eye point like the native headlight.
  light: vec4f,
  ambient: vec4f, // rgb = ambient color, a = intensity
  headlight: vec4f, // rgb = headlight color, a = intensity
  sel_color: vec4f, // selection highlight (rgb) + blend amount (a)
  backdrop: vec4f, // rgb = canvas background; a = Background-mode fade amount
};`,_e=`struct ItemState {
  flags: u32, // bit 2 = selected, bit 4 = has color override
  color: u32, // packed RGBA8 override
  tidx: u32,  // committed transform slot; 0 = identity
};

@group(0) @binding(3) var<storage, read> item_states: array<ItemState>;
// optional authored normals: one u32 per GLOBAL vertex (2x snorm16 octahedral,
// see cook.ts); bound to a 1-word dummy when the model has none
// (model_uni.info.z = 0)
@group(0) @binding(7) var<storage, read> vertex_normals: array<u32>;

fn oct_decode(e: vec2f) -> vec3f {
  var n = vec3f(e, 1.0 - abs(e.x) - abs(e.y));
  if (n.z < 0.0) {
    let s = select(vec2f(-1.0), vec2f(1.0), n.xy >= vec2f(0.0));
    n = vec3f((vec2f(1.0) - abs(n.yx)) * s, n.z);
  }
  return normalize(n);
}
// per-model uniform: info.x = item_base (global id offset), info.y = live
// selection transform active; global = the live gizmo-drag group matrix,
// applied on top of committed transforms to SELECTED items only (native
// mesh.slang model_global — whole-selection drag with one UBO write).
struct ModelUni {
  info: vec4u,
  global: mat4x4f,
};
@group(0) @binding(4) var<uniform> model_uni: ModelUni;
// committed item transforms (renderer-global pool, slot 0 = identity)
@group(0) @binding(6) var<storage, read> transforms: array<mat4x4f>;

// committed item transform (native mesh.slang: pos = T * pos) with the live
// gizmo-drag preview on top (selected items only, native model_global);
// absolute space in, absolute space out
fn apply_item_transform(p: vec3f, tid: u32, live: bool) -> vec3f {
  var q = p;
  if (tid != 0u) {
    q = (transforms[tid] * vec4f(q, 1.0)).xyz;
  }
  if (live) {
    q = (model_uni.global * vec4f(q, 1.0)).xyz;
  }
  return q;
}

// Midpoint of the cooked u16 position range: aabb_min + Q_MID * aabb_scale is
// the meshlet's AABB centre (the blend pass's facing reference).
const Q_MID = 32767.5;

// stochastic transparency (native mesh.slang alpha_hash): different pixels
// discard each frame; TAA accumulates the result into smooth opacity
fn alpha_hash(pix: vec2u, frame: u32) -> f32 {
  var n = (pix.x * 1973u) + (pix.y * 9277u) + (frame * 26699u);
  n = (n << 13u) ^ n;
  n = n * (n * n * 15731u + 789221u) + 1376312589u;
  return f32(n & 0x7FFFFFFFu) / f32(0x7FFFFFFFu);
}

fn item_opacity(item: u32, base_a: f32) -> f32 {
  let st = item_states[item];
  if ((st.flags & 64u) != 0u) { // explicit opacity override wins
    return f32((st.flags >> 25u) & 127u) / 100.0;
  }
  if ((st.flags & 16u) != 0u) { // color override carries its own alpha
    return f32((st.color >> 24u) & 255u) / 255.0;
  }
  return base_a; // no override -> the baked material alpha (cg color .a)
}

// A black material shows no shading at all — nothing for the headlight to
// modulate — so a PURE black cooked colour is replaced by a grey of the
// floor's luma. Only exact black (every 8-bit channel 0) is touched: a dark
// navy or brown is a deliberate colour and stays. A user override is the
// user's choice and is never lifted.
fn lift_dark(c: vec3f) -> vec3f {
  let floor = frame.origin.w;
  if (floor <= 0.0) { return c; }
  if (any(c > vec3f(0.5 / 255.0))) { return c; }
  return vec3f(floor);
}

fn apply_item_state(base: vec4f, item: u32) -> vec4f {
  let st = item_states[item];
  var c = vec4f(lift_dark(base.rgb), base.a);
  let overridden = (st.flags & 16u) != 0u;
  if (overridden) { // color override
    c = vec4f(
      f32(st.color & 255u), f32((st.color >> 8u) & 255u), f32((st.color >> 16u) & 255u),
      255.0,
    ) / 255.0;
    c.a = base.a;
  }
  // selection highlight; frame.flags.y suppresses it on overridden items so
  // a just-applied color reads true — cleared again on the next selection
  if ((st.flags & 4u) != 0u && !(overridden && frame.flags.y == 1u)) {
    c = vec4f(mix(c.rgb, frame.sel_color.rgb, frame.sel_color.a), c.a);
  }
  return c;
}

// clip system (port of the native clip.slang model, phase A subset):
// 8 half-space planes + one axis-aligned box, evaluated per fragment
// One clip shape — the native GpuClipShape tagged union (clip.slang layout):
// inv_transform (world → shape-local, box kind only), params0 (box: local
// min.xyz | sphere: center.xyz + radius.w | cyl: base.xyz + radius.w), params1
// (box: local max.xyz | cyl: unit axis.xyz + height.w), kind_flags.x = kind
// (0 disabled, 1 box, 2 sphere, 3 cylinder), kind_flags.y = inverted (hole).
struct ClipShapeGpu {
  inv_transform: mat4x4f,
  params0: vec4f,
  params1: vec4f,
  kind_flags: vec4u,
};
struct ClipData {
  planes: array<vec4f, 8>, // xyz = unit normal, w = distance
  plane_mask: vec4u,       // x = enabled bitmask
  // slot 0 = the DEFAULT clip box (Clipping Box ribbon), slots 1..7 = the user
  // shapes — all evaluated together with the native union-of-keeps semantics
  shapes: array<ClipShapeGpu, 8>,
};

@group(0) @binding(5) var<uniform> clip: ClipData;

// True if p lies OUTSIDE the shape volume (native clip_shape_outside).
fn clip_shape_outside(s: ClipShapeGpu, p: vec3f) -> bool {
  switch (s.kind_flags.x) {
    case 1u: { // box: world → local, AABB test
      let local = (s.inv_transform * vec4f(p, 1.0)).xyz;
      return any(local < s.params0.xyz) || any(local > s.params1.xyz);
    }
    case 2u: { // sphere
      let d = p - s.params0.xyz;
      return dot(d, d) > s.params0.w * s.params0.w;
    }
    case 3u: { // cylinder: base + radius | axis + height
      let rel = p - s.params0.xyz;
      let t = dot(rel, s.params1.xyz);
      if (t < 0.0 || t > s.params1.w) { return true; }
      let radial = rel - t * s.params1.xyz;
      return dot(radial, radial) > s.params0.w * s.params0.w;
    }
    default: {
      return false; // disabled: never outside (no clipping)
    }
  }
}

fn clip_discard(p: vec3f) -> bool {
  let mask = clip.plane_mask.x;
  for (var i = 0u; i < 8u; i++) {
    if ((mask & (1u << i)) != 0u &&
        dot(clip.planes[i].xyz, p) + clip.planes[i].w < 0.0) {
      return true;
    }
  }
  // Shapes — native combine semantics (clip.slang): inverted shapes are holes
  // (each cuts what is inside it), normal shapes are keep-volumes (UNION — the
  // fragment survives if it is inside ANY of them).
  var any_keep = false;
  var inside_a_keep = false;
  for (var i = 0u; i < 8u; i++) {
    let sh = clip.shapes[i];
    if (sh.kind_flags.x == 0u) { continue; }
    let outside = clip_shape_outside(sh, p);
    if (sh.kind_flags.y != 0u) {
      if (!outside) { return true; } // hole: clip everything inside it
    } else {
      any_keep = true;
      if (!outside) { inside_a_keep = true; }
    }
  }
  if (any_keep && !inside_a_keep) { return true; } // outside every keep volume
  return false;
}

`,ve=`fn hash_color(i: u32) -> vec3f {
  var h = i * 747796405u + 2891336453u;
  h = ((h >> ((h >> 28u) + 4u)) ^ h) * 277803737u;
  h = (h >> 22u) ^ h;
  return vec3f(f32(h & 255u), f32((h >> 8u) & 255u), f32((h >> 16u) & 255u)) / 255.0;
}

struct VsOut {
  @builtin(position) clip: vec4f,
  @location(0) world: vec3f,
  @location(1) color: vec4f,
  @location(2) @interpolate(flat) id: u32,
  @location(3) @interpolate(flat) opacity: f32,
  // authored vertex normal (zero-length = flat-shade in the FS)
  @location(4) normal: vec3f,
  // per-item edge tag bits for the post pass (4 = item edges off), read from
  // the item state here so the fragment stage needs no extra fetch
  @location(5) @interpolate(flat) edge_bits: u32,
  // blend-pass facing split: the meshlet's AABB centre (rebased like world)
  // the fragment stage orients the face normal away from, and which half this
  // instance keeps (0 = back faces, 1 = front faces)
  @location(6) @interpolate(flat) centre: vec3f,
  @location(7) @interpolate(flat) facing: u32,
};

`,ye=`struct FsOut {
  @location(0) color: vec4f,
  @location(1) normal: vec4f,
  @location(2) id: vec4f, // item id packed into rgba8unorm (u32 -> 4x8 bit)
};

@fragment
fn fs(in: VsOut) -> FsOut {
  if (clip_discard(in.world + frame.origin.xyz)) { discard; }
  if ((frame.flags.z & 1u) == 0u && in.opacity < 1.0) {
    // alpha-hash mode: stochastic discard, converges under TAA
    if (alpha_hash(vec2u(in.clip.xy), frame.flags.w) > in.opacity) { discard; }
  }
  // authored normals when the model carries them (generic GLB import with
  // NORMAL data); zero-length = flat shading from screen-space derivatives.
  // dpdx/dpdy must run in uniform control flow, so the flat normal is always
  // computed and the authored one selected after.
  let flat_n = normalize(cross(dpdx(in.world), dpdy(in.world)));
  var n = flat_n;
  if (dot(in.normal, in.normal) > 0.01) {
    n = normalize(in.normal);
  }
  // headlight: point light at the eye (perspective) or view-axis directional
  // (ortho — a point headlight would shift with zoom, which reads wrong there)
  var l: vec3f;
  if (frame.light.w == 1.0) {
    l = frame.light.xyz;
  } else {
    l = normalize(frame.eye.xyz - in.world);
  }
  let blend_pass = (frame.flags.z & 2u) != 0u;
  let backdrop = (frame.flags.z & 4u) != 0u;
  // sorted blend list, facing split: facing comes from geometry, not winding
  // (the cook path enforces none) — the flat normal oriented away from the
  // meshlet centre is the outward normal; instance 0 keeps the back faces,
  // instance 1 the front faces, so a pipe's far wall blends under its near
  // wall (l points at the viewer in both projections)
  if (blend_pass && !backdrop && (frame.flags.z & 8u) != 0u) {
    let out_n = select(-flat_n, flat_n, dot(flat_n, in.world - in.centre) >= 0.0);
    if ((dot(out_n, l) > 0.0) != (in.facing == 1u)) { discard; }
  }
  if (dot(n, l) < 0.0) { n = -n; } // two-sided: face the light/camera
  let t = dot(n, l);
  // native mesh.slang: half-Lambert + Blinn-Phong spec (headlight => half = l);
  // ambient + headlight color/intensity come from the lighting settings
  let diffuse = t * 0.5 + 0.5;
  let spec = pow(saturate(t), 16.0) * 0.3;
  let shade = frame.ambient.rgb * frame.ambient.a +
              frame.headlight.rgb * (frame.headlight.a * (diffuse + spec));
  let unlit_luma = dot(in.color.rgb, vec3f(0.299, 0.587, 0.114));
  var o: FsOut;
  // blend pass: alpha is the colour blend factor only — the pipeline keeps the
  // destination alpha, so the scene alpha stays the unlit luma of the opaque
  // surface underneath (the edge pass's white-on-dark test); otherwise it
  // carries this fragment's unlit luma. Background mode renders that pass
  // solid instead, the colour faded toward the canvas by the frame's backdrop
  // amount — a receding context layer
  let alpha = select(unlit_luma, in.opacity, blend_pass && !backdrop);
  var rgb = in.color.rgb * shade;
  if (backdrop) { rgb = mix(rgb, frame.backdrop.rgb, frame.backdrop.a); }
  o.color = vec4f(rgb, alpha);
  // Sketch colour-from-mesh asks "does this surface carry colour?" — decided
  // HERE, on the UNLIT base colour, so one surface answers the same over its
  // whole area. The post pass used to ask it of the lit colour, which reaches
  // it through an 8-bit target that rounds each channel on its own: a near-grey
  // mesh then crossed the threshold back and forth along the shading gradient,
  // banding into iso-shade contours (concentric rings under the headlight).
  // Relative chroma, so a coloured mesh in shadow still counts as coloured.
  let base_mx = max(in.color.r, max(in.color.g, in.color.b));
  let base_mn = min(in.color.r, min(in.color.g, in.color.b));
  let has_chroma = select(0u, 16u, base_mx - base_mn > 0.1 * max(base_mx, 1e-4));
  // normal alpha = edge tag BITS for the post pass (quantized to 8 bits):
  //   1 = authored normals (own edge thresholds), 2 = edge lines OFF (asset
  //   import option), 4 = item edges OFF for this item (item state), 16 = the
  //   surface carries colour (sketch fill / coloured ink); 128 is stamped later
  //   by the helper overlays (lineWgsl / markerWgsl)
  let gtag = select(0u, 1u, model_uni.info.z == 1u) | select(0u, 2u, model_uni.info.w == 1u) | in.edge_bits | has_chroma;
  o.normal = vec4f(n * 0.5 + 0.5, f32(gtag) / 255.0);
  o.id = vec4f(
    f32(in.id & 255u), f32((in.id >> 8u) & 255u),
    f32((in.id >> 16u) & 255u), f32((in.id >> 24u) & 255u),
  ) / 255.0;
  return o;
}

// Pick pass (native mesh_pick.frag.slang): ids only, with the opacity rule —
// plain: solid = opacity >= threshold; shift: solid = opacity < threshold ||
// opacity >= 0.999 (band invert). Non-solid fragments discard so the click
// falls through to whatever is behind. Threshold/shift ride in the pick frame
// slot's (otherwise unused) ambient.xy.
@fragment
fn fs_pick(in: VsOut) -> @location(0) vec4f {
  if (clip_discard(in.world + frame.origin.xyz)) { discard; }
  let thr = frame.ambient.x;
  var solid: bool;
  if (frame.ambient.y > 0.5) {
    solid = (in.opacity < thr) || (in.opacity >= 0.999);
  } else {
    solid = in.opacity >= thr;
  }
  if (!solid) { discard; }
  return vec4f(
    f32(in.id & 255u), f32((in.id >> 8u) & 255u),
    f32((in.id >> 16u) & 255u), f32((in.id >> 24u) & 255u),
  ) / 255.0;
}

// Outline mask pass (native hover_xray idea): depth-only render of ONLY the
// outlined subset — selected items (when frame.ambient.x, the include-selected
// flag, is set) and/or the hovered item (global id bitcast into ambient.y;
// 0 = none). Depth-tested against its own cleared target, NOT the scene, so
// the mask holds the subset's front surface even where other geometry
// occludes it — that is what makes the hidden-edge color possible.
@fragment
fn fs_outline(in: VsOut) {
  if (clip_discard(in.world + frame.origin.xyz)) { discard; }
  let sel = (item_states[in.id - model_uni.info.x].flags & 4u) != 0u;
  let hover_id = bitcast<u32>(frame.ambient.y);
  if (!((sel && frame.ambient.x > 0.5) || (hover_id != 0u && in.id == hover_id))) { discard; }
}
`;function be(e){return`
${ge}

${e?`struct MeshletInfo {
  aabb_min: vec3f,
  cg: u32,   // color-group index (color lookup)
  aabb_scale: vec3f,
  item: u32, // globally unique draw-range item id (edge pass)
};`:`struct MeshletInfo {
  cg: u32,
  item: u32,
};`}

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> cg_colors: array<vec4f>;
@group(0) @binding(2) var<storage, read> meshlet_info: array<MeshletInfo>;

// per-item state, native MeshItem bit layout (item_state.rs)
${_e}${ve}@vertex
fn vs(
  @location(0) pos: ${e?`vec4u`:`vec3f`},
  @builtin(vertex_index) vid: u32,
  @builtin(instance_index) inst: u32,
) -> VsOut {
  var o: VsOut;
  // cull records carry firstInstance = 2 x meshlet index; bit 0 is the
  // facing half in the sorted transparent list (two instances per record)
  let mi = inst >> 1u;
  let facing = inst & 1u;
  let info = meshlet_info[mi];
  let opacity = item_opacity(info.item, cg_colors[info.cg].a);
  let blend_mode = (frame.flags.z & 1u) != 0u;
  let blend_pass = (frame.flags.z & 2u) != 0u;
  let split = blend_pass && (frame.flags.z & 12u) == 8u;
  let transparent = opacity < 1.0;
  // hidden or invisible (effective opacity 0 — the cull drops these, this
  // covers the no-cull path), routed to the other pass in blend mode, or the
  // second facing instance outside the split blend pass -> degenerate
  if ((item_states[info.item].flags & 1u) != 0u || opacity <= 0.0 ||
      (blend_mode && transparent != blend_pass) || (facing == 1u && !split)) {
    o.clip = vec4f(0.0);
    o.world = vec3f(0.0);
    o.color = vec4f(0.0);
    o.id = 0u;
    o.opacity = 1.0;
    o.normal = vec3f(0.0);
    o.edge_bits = 0u;
    o.centre = vec3f(0.0);
    o.facing = 0u;
    return o;
  }
  o.opacity = opacity;
  o.edge_bits = select(0u, 4u, (item_states[info.item].flags & 256u) != 0u);
  o.facing = facing;
  let tid = item_states[info.item].tidx;
  let live = model_uni.info.y == 1u && (item_states[info.item].flags & 4u) != 0u;
  // Rebase FIRST on the untransformed path: aabb_min - origin is an exact
  // f32 subtraction (both are nearby magnitudes), so the dequantized position
  // lands in small-number space and keeps micron precision however far the
  // model sits from the true origin. Transformed items must go through their
  // absolute-space matrix, so they rebase after (as precise as before).
${e?`  var world = (info.aabb_min - frame.origin.xyz) + vec3f(pos.xyz) * info.aabb_scale;`:`  var world = pos - frame.origin.xyz;`}
  if (tid != 0u || live) {
${e?`    let abs_world = info.aabb_min + vec3f(pos.xyz) * info.aabb_scale;`:`    let abs_world = pos;`}
    world = apply_item_transform(abs_world, tid, live) - frame.origin.xyz;
  }
  // the facing split's reference point, only when that pass asks for it
  o.centre = vec3f(0.0);
  if (split) {
${e?`    o.centre = (info.aabb_min - frame.origin.xyz) + vec3f(Q_MID) * info.aabb_scale;
    if (tid != 0u || live) {
      o.centre = apply_item_transform(info.aabb_min + vec3f(Q_MID) * info.aabb_scale, tid, live) - frame.origin.xyz;
    }`:`    o.centre = world;`}
  }
  // authored normal (generic GLB import); vid = index value + baseVertex =
  // the global vertex index the normal stream is laid out by
  o.normal = vec3f(0.0);
  if (model_uni.info.z == 1u) {
    var nrm = oct_decode(unpack2x16snorm(vertex_normals[vid]));
    if (tid != 0u) { nrm = (transforms[tid] * vec4f(nrm, 0.0)).xyz; }
    if (live) { nrm = (model_uni.global * vec4f(nrm, 0.0)).xyz; }
    o.normal = nrm; // renormalized in the FS after interpolation
  }
  o.clip = frame.view_proj * vec4f(world, 1.0);
  o.world = world;
  if (frame.flags.x == 1u) {
    o.color = vec4f(hash_color(mi), 1.0);
  } else {
    o.color = apply_item_state(cg_colors[info.cg], info.item);
  }
  o.id = info.item + model_uni.info.x; // globally unique for the id G-buffer
  return o;
}

${ye}`}function xe(){return`
${ge}

struct MeshletInfo {
  aabb_min: vec3f,
  cg: u32,
  aabb_scale: vec3f,
  item: u32,
};

// read-only mirror of the packed 36-byte cull records (cullWgsl layout); the
// draw only needs the three index/vertex words, decoded straight from the raw
// buffer (a struct binding would force a padded 48-byte stride)
struct MeshletDraw {
  index_count: u32,
  first_index: u32,
  base_vertex: u32,
};

fn load_geo(mi: u32) -> MeshletDraw {
  let o = mi * 9u;
  return MeshletDraw(geo[o + 5u], geo[o + 6u], geo[o + 8u]);
}

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> cg_colors: array<vec4f>;
@group(0) @binding(2) var<storage, read> meshlet_info: array<MeshletInfo>;

@group(1) @binding(0) var<storage, read> vis_list: array<u32>;
@group(1) @binding(1) var<storage, read> geo: array<u32>;
@group(1) @binding(2) var<storage, read> micro_indices: array<u32>; // u16 pairs
@group(1) @binding(3) var<storage, read> qverts: array<vec2u>; // u16x4 per vertex

// per-item state, native MeshItem bit layout (item_state.rs)
${_e}${ve}@vertex
fn vs(
  @builtin(vertex_index) vid: u32,
  @builtin(instance_index) inst: u32,
) -> VsOut {
  // the sorted transparent list holds two entries per meshlet, the second
  // with bit 31 set: the facing half this instance keeps
  let entry = vis_list[inst];
  let mi = entry & 0x7fffffffu;
  let facing = entry >> 31u;
  let m = load_geo(mi);
  // clamp padding vertices to the last real index -> zero-area triangles
  let li = min(vid, m.index_count - 1u);
  let gi = m.first_index + li;
  let word = micro_indices[gi >> 1u];
  let micro = select(word & 0xffffu, word >> 16u, (gi & 1u) == 1u);
  let v = qverts[m.base_vertex + micro];
  let q = vec3f(f32(v.x & 0xffffu), f32(v.x >> 16u), f32(v.y & 0xffffu));

  let info = meshlet_info[mi];
  var o: VsOut;
  let opacity = item_opacity(info.item, cg_colors[info.cg].a);
  let blend_mode = (frame.flags.z & 1u) != 0u;
  let blend_pass = (frame.flags.z & 2u) != 0u;
  let split = blend_pass && (frame.flags.z & 12u) == 8u;
  let transparent = opacity < 1.0;
  // hidden or invisible (effective opacity 0 — the cull drops these, this
  // covers the no-cull path), routed to the other pass in blend mode, or the
  // second facing entry outside the split blend pass -> degenerate
  if ((item_states[info.item].flags & 1u) != 0u || opacity <= 0.0 ||
      (blend_mode && transparent != blend_pass) || (facing == 1u && !split)) {
    o.clip = vec4f(0.0);
    o.world = vec3f(0.0);
    o.color = vec4f(0.0);
    o.id = 0u;
    o.opacity = 1.0;
    o.normal = vec3f(0.0);
    o.edge_bits = 0u;
    o.centre = vec3f(0.0);
    o.facing = 0u;
    return o;
  }
  o.opacity = opacity;
  o.edge_bits = select(0u, 4u, (item_states[info.item].flags & 256u) != 0u);
  o.facing = facing;
  // rebase before dequantizing — see the MDI path for why
  let tid = item_states[info.item].tidx;
  let live = model_uni.info.y == 1u && (item_states[info.item].flags & 4u) != 0u;
  var world = (info.aabb_min - frame.origin.xyz) + q * info.aabb_scale;
  if (tid != 0u || live) {
    world = apply_item_transform(info.aabb_min + q * info.aabb_scale, tid, live) - frame.origin.xyz;
  }
  // the facing split's reference point, only when that pass asks for it
  o.centre = vec3f(0.0);
  if (split) {
    o.centre = (info.aabb_min - frame.origin.xyz) + vec3f(Q_MID) * info.aabb_scale;
    if (tid != 0u || live) {
      o.centre = apply_item_transform(info.aabb_min + vec3f(Q_MID) * info.aabb_scale, tid, live) - frame.origin.xyz;
    }
  }
  // authored normal (generic GLB import): same global vertex index as qverts
  o.normal = vec3f(0.0);
  if (model_uni.info.z == 1u) {
    var nrm = oct_decode(unpack2x16snorm(vertex_normals[m.base_vertex + micro]));
    if (tid != 0u) { nrm = (transforms[tid] * vec4f(nrm, 0.0)).xyz; }
    if (live) { nrm = (model_uni.global * vec4f(nrm, 0.0)).xyz; }
    o.normal = nrm; // renormalized in the FS after interpolation
  }
  o.clip = frame.view_proj * vec4f(world, 1.0);
  o.world = world;
  if (frame.flags.x == 1u) {
    o.color = vec4f(hash_color(mi), 1.0);
  } else {
    o.color = apply_item_state(cg_colors[info.cg], info.item);
  }
  o.id = info.item + model_uni.info.x;
  return o;
}

${ye}`}let Se=`
struct HelperOut {
  @location(0) color: vec4f,
  @location(1) tag: vec4f,
};
const HELPER_TAG = 128.0 / 255.0;
`;function Ce(){return`
${Se}
struct Frame {
  // first two members of the shared Frame (camera-relative rendering): the
  // line vertices below are ABSOLUTE world, so they rebase here too
  view_proj: mat4x4f,
  origin: vec4f,
};

@group(0) @binding(0) var<uniform> frame: Frame;

struct VsOut {
  @builtin(position) clip: vec4f,
  @location(0) color: vec4f,
};

@vertex
fn vs(@location(0) a: vec4f) -> VsOut {
  var o: VsOut;
  o.clip = frame.view_proj * vec4f(a.xyz - frame.origin.xyz, 1.0);
  let c = bitcast<u32>(a.w);
  o.color = vec4f(
    f32(c & 255u), f32((c >> 8u) & 255u), f32((c >> 16u) & 255u), f32((c >> 24u) & 255u),
  ) / 255.0;
  return o;
}

@fragment
fn fs(in: VsOut) -> HelperOut {
  var o: HelperOut;
  o.color = vec4f(in.color.rgb, 1.0);
  o.tag = vec4f(0.0, 0.0, 0.0, HELPER_TAG);
  return o;
}
`}function we(){return`
${Se}
struct Frame {
  // the shared Frame's leading members (camera-relative rendering): instance
  // centres are ABSOLUTE world and rebase here; eye is already rebased
  view_proj: mat4x4f,
  origin: vec4f,
  eye: vec4f,
  flags: vec4u,
  light: vec4f,
};

@group(0) @binding(0) var<uniform> frame: Frame;

struct VsOut {
  @builtin(position) clip: vec4f,
  @location(0) normal: vec3f,
  @location(1) color: vec4f,
  @location(2) rel: vec3f,
};

@vertex
fn vs(
  @location(0) pos: vec3f,    // unit-sphere vertex — also its normal
  @location(1) center: vec3f, // per instance, absolute world
  @location(2) radius: f32,
  @location(3) color: vec4f,  // rgb + opacity
) -> VsOut {
  var o: VsOut;
  let rel = center - frame.origin.xyz + pos * radius;
  o.clip = frame.view_proj * vec4f(rel, 1.0);
  o.normal = pos;
  o.color = color;
  o.rel = rel;
  return o;
}

@fragment
fn fs(in: VsOut) -> HelperOut {
  // headlight like the scene: from the eye (perspective) or along the view
  // axis (ortho); half-Lambert over an ambient floor so the far side stays legible
  var l: vec3f;
  if (frame.light.w == 1.0) {
    l = frame.light.xyz;
  } else {
    l = normalize(frame.eye.xyz - in.rel);
  }
  let t = dot(normalize(in.normal), l) * 0.5 + 0.5;
  let shade = 0.3 + 0.7 * t;
  var o: HelperOut;
  o.color = vec4f(in.color.rgb * shade, in.color.a);
  o.tag = vec4f(0.0, 0.0, 0.0, HELPER_TAG);
  return o;
}
`}function Te(e){return`
@group(0) @binding(0) var src: ${e?`texture_multisampled_2d<f32>`:`texture_2d<f32>`};
@group(0) @binding(1) var<uniform> pick: vec4u;
@group(0) @binding(2) var<storage, read_write> out: array<f32>;

@compute @workgroup_size(1)
fn main() {
  let c = min(pick.xy, textureDimensions(src) - 1u);
  var d = 0.0;
${e?`  for (var s = 0u; s < textureNumSamples(src); s++) {
    d = max(d, textureLoad(src, c, i32(s)).x);
  }`:`  d = textureLoad(src, c, 0).x;`}
  out[0] = d;
}
`}function Ee(e){return`
@group(0) @binding(0) var ids: ${e?`texture_multisampled_2d<f32>`:`texture_2d<f32>`};
${e?`@group(0) @binding(1) var depth: texture_multisampled_2d<f32>;
`:``}@group(0) @binding(2) var<uniform> pick: vec4u;
@group(0) @binding(3) var<storage, read_write> out: array<u32>;

@compute @workgroup_size(1)
fn main() {
  let c = min(pick.xy, textureDimensions(ids) - 1u);
${e?`  var best = -1.0;
  var px = vec4f(0.0);
  for (var s = 0u; s < textureNumSamples(ids); s++) {
    let d = textureLoad(depth, c, i32(s)).x;
    if (d > best) {
      best = d;
      px = textureLoad(ids, c, i32(s));
    }
  }`:`  let px = textureLoad(ids, c, 0);`}
  // the id was written as four f32(byte)/255 channels through rgba8unorm
  let v = vec4u(round(px * 255.0));
  out[0] = v.x | (v.y << 8u) | (v.z << 16u) | (v.w << 24u);
}
`}function De(e){return`
struct AoParams {
  inv_size: vec2f,
  radius: f32,
  bias: f32,
  seed: u32,
  slices: u32,
  samples: u32,
  blend: f32,
  near: f32,
  thickness: f32,
  p00: f32,
  p11: f32,
  ortho: u32,       // 1 = orthographic
  ortho_half_h: f32,
  ortho_near: f32,  // ortho depth slab
  ortho_far: f32,
};

@group(0) @binding(0) var depth_tex: ${e?`texture_multisampled_2d<f32>`:`texture_2d<f32>`};
@group(0) @binding(1) var ao_out: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var ao_hist: texture_storage_2d<r32float, read_write>;
@group(0) @binding(3) var<uniform> ap: AoParams;

const PI = 3.14159265;
const HALF_PI = 1.57079633;
const NB = 32u;

fn ld_depth(px: vec2i, size: vec2i) -> f32 {
  return textureLoad(depth_tex, clamp(px, vec2i(0), size - 1), 0).x;
}

// View-space position from UV + depth, z positive into scene.
// Perspective: reversed-Z infinite far. Ortho: linear depth over the slab,
// constant lateral extent (native vbao.slang ViewPos).
fn view_pos(uv: vec2f, raw: f32) -> vec3f {
  let ndc = vec2f(uv.x * 2.0 - 1.0, -(uv.y * 2.0 - 1.0));
  if (ap.ortho == 1u) {
    let z = ap.ortho_far - raw * (ap.ortho_far - ap.ortho_near);
    let half_w = ap.ortho_half_h * (ap.inv_size.y / ap.inv_size.x);
    return vec3f(ndc.x * half_w, ndc.y * ap.ortho_half_h, z);
  }
  let z = ap.near / max(raw, 1e-7);
  return vec3f(ndc.x * z / ap.p00, ndc.y * z / ap.p11, z);
}

fn hash(pixel: vec2u, seed: u32) -> f32 {
  var n = (pixel.x * 2185031351u) ^ (pixel.y * 3758974893u) ^ (seed * 1361640981u);
  n ^= n >> 16u; n *= 0x45d9f3bu; n ^= n >> 16u;
  return f32(n & 0x00FFFFFFu) / f32(0x01000000u);
}

// Mark bitmask sectors from a to a+b-1 (Algorithm 1 line 19).
fn update_sectors(minH: f32, maxH: f32, bitmask: u32) -> u32 {
  let a = u32(minH * f32(NB));
  let b = u32(ceil((maxH - minH) * f32(NB)));
  var angle_bit = 0u;
  if (b > 0u) { angle_bit = 0xFFFFFFFFu >> (NB - min(b, NB)); }
  return bitmask | (angle_bit << min(a, NB - 1u));
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let size = vec2i(vec2f(1.0) / ap.inv_size + 0.5);
  let pixel = vec2i(gid.xy);
  if (pixel.x >= size.x || pixel.y >= size.y) { return; }

  let uv = (vec2f(pixel) + 0.5) * ap.inv_size;
  let raw_depth = ld_depth(pixel, size);
  if (raw_depth <= 0.0) {
    textureStore(ao_out, gid.xy, vec4f(1.0));
    textureStore(ao_hist, gid.xy, vec4f(1.0));
    return;
  }

  let p_vs = view_pos(uv, raw_depth);
  let cam_to_surface = normalize(p_vs);
  let z_view = p_vs.z;
  // screen-space sampling radius in pixels (ortho: constant px per metre)
  var sr_px: f32;
  if (ap.ortho == 1u) {
    sr_px = clamp(ap.radius * 0.5 / (ap.ortho_half_h * ap.inv_size.y), 4.0, 48.0);
  } else {
    sr_px = clamp(ap.radius / z_view * (0.5 / ap.inv_size.y) * ap.p11, 4.0, 48.0);
  }

  // View-space normal from minimum-depth-difference neighbours (stays on the
  // same surface instead of jumping across discontinuities).
  var d_r = ld_depth(pixel + vec2i(1, 0), size);
  var d_l = ld_depth(pixel + vec2i(-1, 0), size);
  var d_d = ld_depth(pixel + vec2i(0, 1), size);
  var d_u = ld_depth(pixel + vec2i(0, -1), size);
  if (d_r <= 0.0) { d_r = raw_depth; }
  if (d_l <= 0.0) { d_l = raw_depth; }
  if (d_d <= 0.0) { d_d = raw_depth; }
  if (d_u <= 0.0) { d_u = raw_depth; }
  var dx_vec: vec3f;
  var dy_vec: vec3f;
  if (abs(d_r - raw_depth) <= abs(d_l - raw_depth)) {
    dx_vec = view_pos(uv + vec2f(ap.inv_size.x, 0.0), d_r) - p_vs;
  } else {
    dx_vec = -(view_pos(uv + vec2f(-ap.inv_size.x, 0.0), d_l) - p_vs);
  }
  if (abs(d_d - raw_depth) <= abs(d_u - raw_depth)) {
    dy_vec = view_pos(uv + vec2f(0.0, ap.inv_size.y), d_d) - p_vs;
  } else {
    dy_vec = -(view_pos(uv + vec2f(0.0, -ap.inv_size.y), d_u) - p_vs);
  }
  let n_raw = cross(dx_vec, dy_vec);
  let n_len = length(n_raw);
  var n_vs = vec3f(0.0, 0.0, -1.0);
  if (n_len > 1e-6) { n_vs = n_raw / n_len; }
  if (n_vs.z > 0.0) { n_vs = -n_vs; }

  let jitter = hash(gid.xy, ap.seed);
  let jitter2 = hash(gid.xy, ap.seed ^ 0xDEADBEEFu);

  var total_occluded = 0u;
  for (var s = 0u; s < ap.slices; s++) {
    let phi = (f32(s) + jitter) * (2.0 * PI) / f32(ap.slices);
    let dir_px = vec2f(cos(phi), sin(phi));
    var bi = 0u;

    for (var j = 0u; j < ap.samples; j++) {
      // squared step distribution: dense near the surface
      let t_lin = (f32(j) + 0.5 + jitter2 * 0.6) / f32(ap.samples);
      let step_px = t_lin * t_lin * sr_px;
      if (step_px < 3.0) { continue; }

      let s_uv = saturate(uv + dir_px * step_px * ap.inv_size);
      let s_px = clamp(vec2i(s_uv / ap.inv_size), vec2i(0), size - 1);
      let s_depth = ld_depth(s_px, size);
      if (s_depth <= 0.0) { continue; }

      let sf_uv = (vec2f(s_px) + 0.5) * ap.inv_size;
      let sf = view_pos(sf_uv, s_depth);
      let sb = sf - cam_to_surface * ap.thickness; // back of the occluder slab

      let df = sf - p_vs;
      let db = sb - p_vs;
      let df_len = length(df);
      let db_len = length(db);
      if (df_len < 0.005 || df_len > ap.radius * 2.2) { continue; }

      // elevation above the tangent plane; the bias gate removes self-occlusion
      let ef = dot(df / df_len, n_vs);
      var eb = ef;
      if (db_len > 1e-4) { eb = dot(db / db_len, n_vs); }
      if (ef < ap.bias) { continue; }
      eb = max(eb, 0.0);

      let thetaF = (asin(clamp(ef, -1.0, 1.0)) + HALF_PI) / PI;
      let thetaB = (asin(clamp(eb, -1.0, 1.0)) + HALF_PI) / PI;
      bi = update_sectors(min(thetaF, thetaB), max(thetaF, thetaB), bi);
    }
    total_occluded += countOneBits(bi);
  }

  // only the above-tangent hemisphere (16 of 32 sectors) is ever set
  let ao_raw = 1.0 - saturate(f32(total_occluded) / f32(ap.slices * (NB / 2u)));
  let hist = textureLoad(ao_hist, gid.xy).x;
  let ao_acc = mix(hist, ao_raw, ap.blend);
  textureStore(ao_out, gid.xy, vec4f(ao_acc));
  textureStore(ao_hist, gid.xy, vec4f(ao_acc));
}
`}function Oe(e){let t=e?`texture_multisampled_2d<f32>`:`texture_2d<f32>`;return`
struct PostParams {
  frame_idx: u32,
  accum_count: u32,
  // 1 geo edges, 2 item edges, 4 taa, 8 white-on-dark; bits 4-6 debug view;
  // 1024 hold; 2048 sketch; 4096 smooth-mesh edges OFF; 8192 flat-mesh edges
  // OFF; 16384 sketch respects the edge-off switches; 32768 sketch colour
  // fill (mesh colours washed onto the paper); 65536 sketch coloured edges
  // (the ink takes the mesh colour)
  flags: u32,
  cam_near: f32,
  edge_color: vec4f,
  depth_thr: f32,
  normal_thr: f32,
  fade_exp: f32,
  dark_thr: f32,
  ao_strength: f32,
  ortho_near: f32, // ortho depth slab (flags bit 512 = orthographic)
  ortho_far: f32,
  focus_dist: f32, // camera->target distance: ortho edge-fade floor
  // separate edge tuning for meshes with AUTHORED normals (G-buffer tag 0.5)
  sm_depth_thr: f32,
  sm_normal_thr: f32,
  sm_fade_exp: f32,
  // sketch colour-from-mesh: how far the paper moves from white toward the
  // surface hue (0 = plain paper, 1 = the hue at full strength)
  fill_strength: f32,
};

const SAMPLES = ${e?4:1};
// sketch colour fill: darkest grey a colourless surface washes to (unlit luma)
const GREY_FLOOR = ${.25.toFixed(2)};

@group(0) @binding(0) var scene: texture_2d<f32>;
@group(0) @binding(1) var depth_tex: ${t};
@group(0) @binding(2) var<uniform> pp: PostParams;
@group(0) @binding(3) var history: texture_2d<f32>;
@group(0) @binding(4) var normal_tex: ${t};
@group(0) @binding(5) var id_tex: ${t};
@group(0) @binding(6) var ao_tex: texture_2d<f32>; // VBAO output (always single-sample)
${e?`@group(0) @binding(7) var scene_ms: texture_multisampled_2d<f32>; // unresolved colour`:``}

// The third textureLoad arg is the sample index for multisampled textures and
// the mip level otherwise; with SAMPLES = 1 the loop only ever passes 0, so
// the same loader bodies compile for both variants.
fn ld_depth(xy: vec2i, o: vec2i, dims: vec2i, s: i32) -> f32 {
  return textureLoad(depth_tex, clamp(xy + o, vec2i(0), dims - 1), s).x;
}
fn ld_normal(xy: vec2i, o: vec2i, dims: vec2i, s: i32) -> vec3f {
  return textureLoad(normal_tex, clamp(xy + o, vec2i(0), dims - 1), s).xyz * 2.0 - 1.0;
}
// edge tag bits of a G-buffer sample (normal alpha, quantized 8-bit)
fn ld_tag(xy: vec2i, o: vec2i, dims: vec2i, s: i32) -> u32 {
  return u32(round(textureLoad(normal_tex, clamp(xy + o, vec2i(0), dims - 1), s).w * 255.0));
}
// scene colour of ONE sample: the unresolved MSAA target, or the only colour
// texture when single-sampled (the sample index is then meaningless)
fn ld_scene(xy: vec2i, s: i32) -> vec3f {
  return textureLoad(${e?`scene_ms`:`scene`}, xy, ${e?`s`:`0`}).rgb;
}
// an id boundary draws on the HIGHER-id side (1px lines); a side whose item
// has item edges OFF never draws, and if the higher side is off the lower
// side takes over so the silhouette between the two survives
fn id_edge(id_c: u32, id_n: u32, tag_n: u32) -> bool {
  return id_n != id_c && (id_c > id_n || (tag_n & 4u) != 0u);
}
fn ld_id(xy: vec2i, o: vec2i, dims: vec2i, s: i32) -> u32 {
  let t = vec4u(round(textureLoad(id_tex, clamp(xy + o, vec2i(0), dims - 1), s) * 255.0));
  return t.x | (t.y << 8u) | (t.z << 16u) | (t.w << 24u);
}

// Linear view distance from raw depth in either projection.
fn lin_z(raw: f32) -> f32 {
  if ((pp.flags & 512u) != 0u) {
    return pp.ortho_far - raw * (pp.ortho_far - pp.ortho_near);
  }
  return pp.cam_near / max(raw, 1e-6);
}

// Comparable depth for the edge fade (edge.slang cmp_depth): ~near/dist with
// 1 = nearest. Ortho is linearised and floored at the focus distance so edge
// brightness stays stable as the camera plane slices through geometry.
fn cmp_depth(raw: f32) -> f32 {
  if ((pp.flags & 512u) != 0u) {
    let vd = pp.ortho_far - raw * (pp.ortho_far - pp.ortho_near);
    return pp.cam_near / max(vd, pp.focus_dist);
  }
  return raw;
}

// Depth heat-map from the native edge.slang HZB visualiser:
// black (far/background) -> blue -> cyan -> green -> yellow -> red (near).
fn heat(vis_in: f32) -> vec3f {
  let vis = saturate(vis_in);
  if (vis < 0.001) { return vec3f(0.04, 0.04, 0.10); }
  var a: vec3f; var b: vec3f; var s: f32;
  if (vis < 0.25) { a = vec3f(0.0, 0.0, 0.5); b = vec3f(0.0, 0.0, 1.0); s = vis / 0.25; }
  else if (vis < 0.5) { a = vec3f(0.0, 0.0, 1.0); b = vec3f(0.0, 1.0, 1.0); s = (vis - 0.25) / 0.25; }
  else if (vis < 0.75) { a = vec3f(0.0, 1.0, 1.0); b = vec3f(1.0, 1.0, 0.0); s = (vis - 0.5) / 0.25; }
  else { a = vec3f(1.0, 1.0, 0.0); b = vec3f(1.0, 0.0, 0.0); s = (vis - 0.75) / 0.25; }
  return mix(a, b, s);
}

fn id_hash_color(id: u32) -> vec3f {
  if (id == 0u) { return vec3f(0.08); }
  var h = id;
  h = (h ^ 61u) ^ (h >> 16u);
  h *= 9u; h ^= h >> 4u; h *= 0x27d4eb2du; h ^= h >> 15u;
  return vec3f(f32(h & 255u), f32((h >> 8u) & 255u), f32((h >> 16u) & 255u)) / 255.0;
}

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u));
  return vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
}

struct PostOut {
  @location(0) display: vec4f,
  @location(1) history: vec4f,
};

@fragment
fn fs(@builtin(position) fpos: vec4f) -> PostOut {
  let dims = vec2i(textureDimensions(scene));
  let xy = vec2i(fpos.xy);
  // hold mode (flag 1024): overlay-only frame after convergence (outline hover/
  // pulse) — re-present the accumulated sum untouched instead of adding another
  // sample, so animated overlays never brighten or reset the converged scene
  if ((pp.flags & 1024u) != 0u) {
    let sum = textureLoad(history, xy, 0);
    var hold: PostOut;
    hold.display = vec4f(saturate(sum.rgb / f32(max(pp.accum_count, 1u))), 1.0);
    hold.history = sum;
    return hold;
  }
  let scene_px = textureLoad(scene, xy, 0);
  var col = scene_px.rgb;

  let depth_c0 = ld_depth(xy, vec2i(0, 0), dims, 0);

  // VBAO: bilateral 5x5 blur weighted by linear-depth similarity (edge.slang
  // port) — rejects taps >1 m away so AO doesn't bleed across depth edges.
  var ao = 1.0;
  if ((pp.flags & 256u) != 0u) {
    let center_z = lin_z(depth_c0);
    var acc = 0.0;
    var tw = 0.0;
    for (var dy = -2; dy <= 2; dy++) {
      for (var dx = -2; dx <= 2; dx++) {
        let td = ld_depth(xy, vec2i(dx, dy), dims, 0);
        let tap_z = lin_z(td);
        if (abs(tap_z - center_z) < 1.0) {
          let t = clamp(xy + vec2i(dx, dy), vec2i(0), dims - 1);
          acc += textureLoad(ao_tex, t, 0).x;
          tw += 1.0;
        }
      }
    }
    if (tw > 0.0) { ao = acc / tw; }
    col *= mix(1.0, ao, pp.ao_strength);
  }

  // edge tag bits from the G-buffer normal alpha (see RENDER_FS): 1 = authored
  // normals (own thresholds), 2 = edges off (asset option), 4 = ITEM edges off
  // for this item, 16 = the surface carries colour (sketch colour-from-mesh),
  // 128 = helper overlay sample (clip helper lines / marker spheres — sketch
  // keeps their colour, and the top bit is what makes the overlay's max-blend
  // stamp outrank every surface bit). Three bits (8, 32, 64) stay free for a
  // per-model edge STRENGTH (DESIGN.md "Per-model edge tag / edge strength").
  let gtag = ld_tag(xy, vec2i(0, 0), dims, 0);
  let smooth_mesh = (gtag & 1u) != 0u;
  let use_depth_thr = select(pp.depth_thr, pp.sm_depth_thr, smooth_mesh);
  let use_normal_thr = select(pp.normal_thr, pp.sm_normal_thr, smooth_mesh);
  let use_fade_exp = select(pp.fade_exp, pp.sm_fade_exp, smooth_mesh);

  // depth-based edge fade: comparable depth ~ near/dist, 1 = near
  let edge_fade = pow(saturate(cmp_depth(depth_c0)), use_fade_exp);
  let cull = max(edge_fade, 0.04); // distance culling of weak creases

  // Detectors run per sample; fractional coverage antialiases the lines
  // (edge_msaa.slang scheme; with SAMPLES = 1 this is plain edge.slang).
  var geo_cov = 0.0;
  var item_cov = 0.0;
  for (var s = 0; s < SAMPLES; s++) {
    if ((pp.flags & 1u) != 0u) {
      // geometry edges: single-sided forward differences (+x, +y) -> 1px lines
      let d_c = ld_depth(xy, vec2i(0, 0), dims, s);
      let gx = ld_depth(xy, vec2i(1, 0), dims, s) - d_c;
      let gy = ld_depth(xy, vec2i(0, 1), dims, s) - d_c;
      let depth_edge = 4.0 * sqrt(gx * gx + gy * gy);
      let n_c = ld_normal(xy, vec2i(0, 0), dims, s);
      let normal_edge = max(
        saturate(1.0 - dot(n_c, ld_normal(xy, vec2i(1, 0), dims, s))),
        saturate(1.0 - dot(n_c, ld_normal(xy, vec2i(0, 1), dims, s))),
      );
      geo_cov += saturate(
        step(use_depth_thr, depth_edge * cull) +
        step(use_normal_thr, normal_edge * cull)
      );
    }
    if ((pp.flags & 2u) != 0u) {
      // item edges: only the higher-id side of a boundary fires -> 1px lines;
      // background id 0 loses to everything, giving object silhouettes
      let id_c = ld_id(xy, vec2i(0, 0), dims, s);
      if (id_c != 0u && (ld_tag(xy, vec2i(0, 0), dims, s) & 4u) == 0u) {
        if (id_edge(id_c, ld_id(xy, vec2i(1, 0), dims, s), ld_tag(xy, vec2i(1, 0), dims, s)) ||
            id_edge(id_c, ld_id(xy, vec2i(-1, 0), dims, s), ld_tag(xy, vec2i(-1, 0), dims, s)) ||
            id_edge(id_c, ld_id(xy, vec2i(0, 1), dims, s), ld_tag(xy, vec2i(0, 1), dims, s)) ||
            id_edge(id_c, ld_id(xy, vec2i(0, -1), dims, s), ld_tag(xy, vec2i(0, -1), dims, s))) {
          item_cov += 1.0;
        }
      }
    }
  }
  let geo_edge = geo_cov / f32(SAMPLES);
  let item_edge = item_cov / f32(SAMPLES);

  // debug buffer views (native edge.slang bits): 1 normal, 2 depth, 3 item id, 4 raw edge
  let debug_view = (pp.flags >> 4u) & 7u;
  if (debug_view != 0u) {
    var dbg = vec3f(0.0);
    if (debug_view == 1u) {
      dbg = ld_normal(xy, vec2i(0, 0), dims, 0) * 0.5 + 0.5;
    } else if (debug_view == 2u) {
      var vis = 0.0;
      if (depth_c0 > 1e-7 && pp.cam_near > 0.0) {
        vis = saturate(1.0 - log2(1.0 + lin_z(depth_c0)) / 17.0);
      }
      dbg = heat(vis);
    } else if (debug_view == 3u) {
      dbg = id_hash_color(ld_id(xy, vec2i(0, 0), dims, 0));
    } else if (debug_view == 4u) {
      let e = saturate(max(geo_edge, item_edge) * edge_fade);
      dbg = vec3f(e);
    } else if (debug_view == 5u) {
      dbg = vec3f(ao); // blurred AO buffer, greyscale
    }
    var dout: PostOut;
    dout.display = vec4f(dbg, 1.0);
    dout.history = vec4f(dbg, 1.0);
    return dout;
  }

  // composite: max() so geo+item edges don't double to 2px at boundaries.
  // Models imported with "edge lines" off tag the normal G-buffer alpha —
  // their pixels skip the edge composite (sketch mode ignores the tag, or a
  // no-edge mesh would vanish into the white paper entirely).
  let edge_raw = saturate(max(geo_edge, item_edge) * edge_fade);
  // edge-off switches: the per-asset tag (gtag 1) plus the global per-category
  // settings (flat / smooth-mesh edge lines in Settings -> Edges)
  let cat_off = select((pp.flags & 8192u) != 0u, (pp.flags & 4096u) != 0u, smooth_mesh);
  let edges_off = (gtag & 2u) != 0u || cat_off;
  let edge = select(edge_raw, 0.0, edges_off);
  if ((pp.flags & 2048u) != 0u) {
    // sketch mode: white paper + edge lines in the sketch edge color — the
    // scene color (and AO) is discarded entirely, only the edge signal draws.
    // By default sketch IGNORES the edge-off switches (a no-edge mesh would
    // vanish into the paper); flag 16384 makes it respect them.
    let sketch_edge = select(edge_raw, edge, (pp.flags & 16384u) != 0u);
    var paper = vec3f(1.0);
    var ink = pp.edge_color.rgb;
    if ((pp.flags & (32768u | 65536u)) != 0u && depth_c0 > 1e-7) {
      // colour from mesh — fill (32768): surfaces are washed onto the paper;
      // edges (65536): the INK takes the mesh hue instead. Whether a surface
      // carries colour at all is decided in the scene FS, on the UNLIT colour,
      // and arrives as tag bit 16: asking it here, of the lit 8-bit colour,
      // made a near-grey mesh band along the shading gradient (each channel
      // rounds on its own, so the chroma ratio crossed the threshold back and
      // forth across one surface).
      // Colour is used as HUE at full brightness (divide by the brightest
      // channel), so the shading drops out: one pipe washes and inks the same
      // along its length instead of turning pale where the headlight hits it,
      // and a dark base keeps its hue instead of greying out.
      let coloured = (gtag & 16u) != 0u;
      let hue = col / max(max(col.r, max(col.g, col.b)), 1e-4);
      if ((pp.flags & 32768u) != 0u) {
        // A colourless surface washes with its own grey LEVEL instead — the
        // scene alpha carries the unlit base luma, so it is shading-free the
        // same way the hue is — otherwise every grey normalizes to white and a
        // grey mesh is indistinguishable from paper. Black is floored to a
        // dark grey: a solid black wash reads as a hole in the page.
        let grey = vec3f(max(scene_px.a, GREY_FLOOR));
        paper = mix(vec3f(1.0), select(grey, hue, coloured), pp.fill_strength);
      } else if (coloured) {
        // colour wire: a colourless mesh keeps the plain sketch ink
        ink = hue * 0.55;
      }
    }
    col = mix(paper, ink, sketch_edge);
    // helper overlays (clip box / sphere / cylinder outlines, clipping-plane
    // helpers, marker spheres) tag their samples: they keep their own colour
    // on top of the paper. Read per sample from the unresolved colour so a
    // half-covered 1px line stays antialiased without the shaded scene under
    // it bleeding through (the resolved pixel would carry both).
    var helper_cov = 0.0;
    var helper_col = vec3f(0.0);
    for (var s = 0; s < SAMPLES; s++) {
      if ((ld_tag(xy, vec2i(0, 0), dims, s) & 128u) != 0u) {
        helper_cov += 1.0;
        helper_col += ld_scene(xy, s);
      }
    }
    if (helper_cov > 0.0) {
      col = mix(col, helper_col / helper_cov, helper_cov / f32(SAMPLES));
    }
  } else {
    var active_edge_color = pp.edge_color.rgb;
    if ((pp.flags & 8u) != 0u && scene_px.a < pp.dark_thr) {
      // white edges on dark items: tested on UNLIT base luminance (scene alpha)
      active_edge_color = vec3f(1.0);
    }
    col = mix(col, active_edge_color, edge);
  }

  var out: PostOut;
  if ((pp.flags & 4u) != 0u) {
    var new_sum = vec4f(col, 1.0);
    if (pp.frame_idx != 0u) { // not the reset frame: accumulate onto history
      new_sum += textureLoad(history, xy, 0);
    }
    out.display = vec4f(saturate(new_sum.rgb / f32(max(pp.accum_count, 1u))), 1.0);
    out.history = new_sum;
  } else {
    out.display = vec4f(col, 1.0);
    out.history = vec4f(col, 1.0);
  }
  return out;
}
`}function ke(e){return`
// mask/subset depth: always 1-sample; scene depth follows the scene's MSAA
@group(0) @binding(0) var mask_depth: texture_2d<f32>;
@group(0) @binding(1) var scene_depth: ${e?`texture_multisampled_2d<f32>`:`texture_2d<f32>`};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u));
  return vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
}

fn mask_at(xy: vec2i, dims: vec2i) -> f32 {
  return textureLoad(mask_depth, clamp(xy, vec2i(0), dims - 1), 0).x;
}

// 1px boundary of the mask, classified visible/hidden: the mask holds the
// subset's own front depth (reversed-Z), the scene depth holds whatever won
// the real depth test. Subset in front (>= scene, small tolerance for the
// 1-sample vs MSAA sample-position mismatch) = visible edge (r), otherwise
// the subset is occluded there = hidden edge (g).
@fragment
fn fs_edge(@builtin(position) fpos: vec4f) -> @location(0) vec4f {
  let dims = vec2i(textureDimensions(mask_depth));
  let xy = vec2i(fpos.xy);
  let c = mask_at(xy, dims);
  let l = mask_at(xy + vec2i(-1, 0), dims);
  let r = mask_at(xy + vec2i(1, 0), dims);
  let u = mask_at(xy + vec2i(0, -1), dims);
  let d = mask_at(xy + vec2i(0, 1), dims);
  let inside = c > 0.0;
  let n_inside = (l > 0.0) != inside || (r > 0.0) != inside ||
                 (u > 0.0) != inside || (d > 0.0) != inside;
  if (!n_inside) { return vec4f(0.0); }
  // depth of the mask side of the boundary (this pixel or the deepest-covered neighbour)
  let md = max(c, max(max(l, r), max(u, d)));
  let sd = textureLoad(scene_depth, clamp(xy, vec2i(0), dims - 1), 0).x;
  let visible = md * 1.005 >= sd;
  return vec4f(select(0.0, 1.0, visible), select(1.0, 0.0, visible), 0.0, 1.0);
}

// separable gaussian blur, radius 1-4 (three.js separable blur, MAX_RADIUS 4)
struct BlurParams {
  dir: vec2f,
  radius: f32,
  // dst→src coordinate factor: 1 = same resolution, 2 = full-res source into
  // a half-res target (the glow's first pass). Without it a half-res pass
  // reads the source 1:1 and the glow lands at DOUBLE the screen position.
  src_scale: f32,
};
@group(0) @binding(2) var blur_src: texture_2d<f32>;
@group(0) @binding(3) var<uniform> bp: BlurParams;

@fragment
fn fs_blur(@builtin(position) fpos: vec4f) -> @location(0) vec4f {
  let dims = vec2i(textureDimensions(blur_src));
  let scale = max(bp.src_scale, 1.0);
  let base = vec2i(vec2f(fpos.xy) * scale);
  let sigma = max(bp.radius * 0.5, 0.3);
  var sum = vec2f(0.0);
  var wsum = 0.0;
  for (var i = -4; i <= 4; i++) {
    if (f32(abs(i)) > bp.radius) { continue; }
    let w = exp(-f32(i * i) / (2.0 * sigma * sigma));
    let p = clamp(base + vec2i(bp.dir * (f32(i) * scale)), vec2i(0), dims - 1);
    sum += textureLoad(blur_src, p, 0).rg * w;
    wsum += w;
  }
  return vec4f(sum / max(wsum, 1e-4), 0.0, 1.0);
}

// additive composite over the finished frame (three.js overlay material):
// edge = strength * blurred + glow * strength * half-res wide blur.
// vis_color.a carries the pulse-modulated strength, hid_color.a the glow.
struct CompositeParams {
  vis_color: vec4f, // rgb + edge strength (pulse applied CPU-side)
  hid_color: vec4f, // rgb + glow amount
};
@group(0) @binding(4) var edge_tex: texture_2d<f32>;   // blurred, full res
@group(0) @binding(5) var glow_tex: texture_2d<f32>;   // wide blur, half res
@group(0) @binding(6) var<uniform> cp: CompositeParams;

@fragment
fn fs_composite(@builtin(position) fpos: vec4f) -> @location(0) vec4f {
  let xy = vec2i(fpos.xy);
  let dims = vec2i(textureDimensions(edge_tex));
  let gdims = vec2i(textureDimensions(glow_tex));
  let e = textureLoad(edge_tex, clamp(xy, vec2i(0), dims - 1), 0).rg;
  let g = textureLoad(glow_tex, clamp(xy / 2, vec2i(0), gdims - 1), 0).rg;
  let strength = cp.vis_color.a;
  let i2 = e * strength + g * (cp.hid_color.a * strength);
  return vec4f(cp.vis_color.rgb * i2.x + cp.hid_color.rgb * i2.y, 1.0);
}
`}function Ae(){return`
// one packed 36-byte cull record (cullWgsl layout, raw words): center xyz,
// radius, cone, index_count, first_index, pad, base_vertex
const SNAP_MESHLET_WORDS = 9u;
// one MeshletInfo record (pack.ts INFO_STRIDE_WORDS): aabb_min xyz, cg,
// aabb_scale xyz, item
const SNAP_INFO_WORDS = 8u;
struct ItemState {
  flags: u32,
  color: u32,
  tidx: u32,
};
struct SnapParams {
  ray_origin: vec4f, // xyz = origin (near-plane point under the cursor)
  ray_dir: vec4f,    // xyz = normalized direction
  // x = global item id + 1 to skip (0 = none); y = 1 also skips items with an
  // opacity override (transparent counts as not there for a seam)
  exclude: vec4u,
};

@group(0) @binding(0) var<storage, read_write> result: array<atomic<u32>, 32>;
@group(0) @binding(1) var<storage, read> geo: array<u32>;
@group(0) @binding(2) var<storage, read> info_words: array<u32>;
@group(0) @binding(3) var<storage, read> micro_indices: array<u32>; // u16 pairs
@group(0) @binding(4) var<storage, read> qverts: array<vec2u>;      // u16x4 per vertex
@group(0) @binding(5) var<storage, read> item_states: array<ItemState>;
@group(0) @binding(6) var<storage, read> transforms: array<mat4x4f>;
@group(0) @binding(7) var<uniform> sp: SnapParams;
// ModelUni.info (scene.ts): x = this model's global item id base
@group(0) @binding(8) var<uniform> model_info: vec4u;

fn geo_center(mi: u32) -> vec3f {
  let o = mi * SNAP_MESHLET_WORDS;
  return vec3f(bitcast<f32>(geo[o]), bitcast<f32>(geo[o + 1u]), bitcast<f32>(geo[o + 2u]));
}
fn geo_radius(mi: u32) -> f32 { return bitcast<f32>(geo[mi * SNAP_MESHLET_WORDS + 3u]); }
fn geo_index_count(mi: u32) -> u32 { return geo[mi * SNAP_MESHLET_WORDS + 5u]; }
fn geo_first_index(mi: u32) -> u32 { return geo[mi * SNAP_MESHLET_WORDS + 6u]; }
fn geo_base_vertex(mi: u32) -> u32 { return geo[mi * SNAP_MESHLET_WORDS + 8u]; }
fn info_min(mi: u32) -> vec3f {
  let o = mi * SNAP_INFO_WORDS;
  return vec3f(bitcast<f32>(info_words[o]), bitcast<f32>(info_words[o + 1u]), bitcast<f32>(info_words[o + 2u]));
}
fn info_scale(mi: u32) -> vec3f {
  let o = mi * SNAP_INFO_WORDS + 4u;
  return vec3f(bitcast<f32>(info_words[o]), bitcast<f32>(info_words[o + 1u]), bitcast<f32>(info_words[o + 2u]));
}
fn info_item(mi: u32) -> u32 { return info_words[mi * SNAP_INFO_WORDS + 7u]; }

// An opacity override below 1 (explicit, or a colour override with alpha) —
// mirrors item_opacity in scene.ts minus the baked material alpha
fn is_transparent(st: ItemState) -> bool {
  if ((st.flags & 64u) != 0u) { return ((st.flags >> 25u) & 127u) < 100u; }
  if ((st.flags & 16u) != 0u) { return ((st.color >> 24u) & 255u) < 255u; }
  return false;
}

// Invisible as the user sees it — hide flag, explicit opacity override of 0,
// or a colour override with alpha 0 (mirrors the cull's item_hidden /
// isEffectivelyHidden): a surface nobody can see must not catch a snap
fn is_invisible(st: ItemState) -> bool {
  if ((st.flags & 1u) != 0u) { return true; }
  if ((st.flags & 64u) != 0u) { return ((st.flags >> 25u) & 127u) == 0u; }
  return (st.flags & 16u) != 0u && ((st.color >> 24u) & 255u) == 0u;
}

// invisible items never hit; a seam cast also skips the excluded / transparent ones
fn skip_item(item: u32, st: ItemState) -> bool {
  if (is_invisible(st)) { return true; }
  if (sp.exclude.x != 0u && item + model_info.x + 1u == sp.exclude.x) { return true; }
  if (sp.exclude.y != 0u && is_transparent(st)) { return true; }
  return false;
}

// Möller–Trumbore. Returns vec4f(t, u, v, hit): hit > 0 when the ray o + t·d
// (t > 0) pierces [A,B,C]; hit point = (1−u−v)A + uB + vC.
fn ray_tri(o: vec3f, d: vec3f, A: vec3f, B: vec3f, C: vec3f) -> vec4f {
  let e1 = B - A;
  let e2 = C - A;
  let p = cross(d, e2);
  let det = dot(e1, p);
  if (abs(det) < 1e-9) { return vec4f(0.0, 0.0, 0.0, -1.0); }
  let inv = 1.0 / det;
  let tv = o - A;
  let u = dot(tv, p) * inv;
  if (u < 0.0 || u > 1.0) { return vec4f(0.0, 0.0, 0.0, -1.0); }
  let q = cross(tv, e1);
  let v = dot(d, q) * inv;
  if (v < 0.0 || u + v > 1.0) { return vec4f(0.0, 0.0, 0.0, -1.0); }
  let t = dot(e2, q) * inv;
  if (t <= 0.0) { return vec4f(0.0, 0.0, 0.0, -1.0); }
  return vec4f(t, u, v, 1.0);
}

// One meshlet-local vertex → world space (dequant + committed item transform).
fn vert_world(base_vertex: u32, amin: vec3f, ascale: vec3f, local: u32, tid: u32) -> vec3f {
  let v = qverts[base_vertex + local];
  let q = vec3f(f32(v.x & 0xffffu), f32(v.x >> 16u), f32(v.y & 0xffffu));
  var world = amin + q * ascale;
  if (tid != 0u) {
    world = (transforms[tid] * vec4f(world, 1.0)).xyz;
  }
  return world;
}

fn local_index(first_index: u32, tri: u32, corner: u32) -> u32 {
  let gi = first_index + tri * 3u + corner;
  let word = micro_indices[gi >> 1u];
  if ((gi & 1u) == 1u) { return word >> 16u; }
  return word & 0xffffu;
}

// Cheap ray↔bounding-sphere reject (center already moved by the item
// transform, like the cull shader). Purely an early-out — misses nothing the
// loop would hit.
fn sphere_miss(c: vec3f, radius: f32) -> bool {
  let oc = c - sp.ray_origin.xyz;
  let along = dot(oc, sp.ray_dir.xyz);
  let d2 = dot(oc, oc) - along * along;
  // radius unscaled by the transform — pad generously (2×) to stay conservative
  let r = radius * 2.0;
  return along < -r || d2 > r * r;
}

// The last net (see the header): a decoded vertex lies inside its meshlet's
// AABB, which the bounding sphere covers — a vertex further out than the
// sphere plus a margin is a misread, never geometry.
fn outside_sphere(p: vec3f, c: vec3f, radius: f32) -> bool {
  let lim = radius * 1.25 + 0.05;
  let d = p - c;
  return dot(d, d) > lim * lim;
}

@compute @workgroup_size(64)
fn snapMin(@builtin(global_invocation_id) gid: vec3u) {
  let mi = gid.x;
  if (mi >= arrayLength(&geo) / SNAP_MESHLET_WORDS) { return; }
  let item = info_item(mi);
  let st = item_states[item];
  if (skip_item(item, st)) { return; }
  var c = geo_center(mi);
  if (st.tidx != 0u) {
    c = (transforms[st.tidx] * vec4f(c, 1.0)).xyz;
  }
  let r = geo_radius(mi);
  if (sphere_miss(c, r)) { return; }
  let amin = info_min(mi);
  let ascale = info_scale(mi);
  let bv = geo_base_vertex(mi);
  let fi = geo_first_index(mi);
  let o = sp.ray_origin.xyz;
  let d = sp.ray_dir.xyz;
  let tris = geo_index_count(mi) / 3u;
  for (var tri = 0u; tri < tris; tri++) {
    let A = vert_world(bv, amin, ascale, local_index(fi, tri, 0u), st.tidx);
    let B = vert_world(bv, amin, ascale, local_index(fi, tri, 1u), st.tidx);
    let C = vert_world(bv, amin, ascale, local_index(fi, tri, 2u), st.tidx);
    let sane = !(outside_sphere(A, c, r) || outside_sphere(B, c, r) || outside_sphere(C, c, r));
    if (sane) {
      let h = ray_tri(o, d, A, B, C);
      if (h.w > 0.0) {
        atomicMin(&result[0], bitcast<u32>(h.x));
      }
    }
  }
}

@compute @workgroup_size(64)
fn snapWrite(@builtin(global_invocation_id) gid: vec3u) {
  let mi = gid.x;
  if (mi >= arrayLength(&geo) / SNAP_MESHLET_WORDS) { return; }
  let item = info_item(mi);
  let st = item_states[item];
  if (skip_item(item, st)) { return; }
  var c = geo_center(mi);
  if (st.tidx != 0u) {
    c = (transforms[st.tidx] * vec4f(c, 1.0)).xyz;
  }
  let r = geo_radius(mi);
  if (sphere_miss(c, r)) { return; }
  let amin = info_min(mi);
  let ascale = info_scale(mi);
  let bv = geo_base_vertex(mi);
  let fi = geo_first_index(mi);
  let best_t = bitcast<f32>(atomicLoad(&result[0]));
  let o = sp.ray_origin.xyz;
  let d = sp.ray_dir.xyz;
  let tris = geo_index_count(mi) / 3u;
  for (var tri = 0u; tri < tris; tri++) {
    let ia = local_index(fi, tri, 0u);
    let ib = local_index(fi, tri, 1u);
    let ic = local_index(fi, tri, 2u);
    let A = vert_world(bv, amin, ascale, ia, st.tidx);
    let B = vert_world(bv, amin, ascale, ib, st.tidx);
    let C = vert_world(bv, amin, ascale, ic, st.tidx);
    let sane = !(outside_sphere(A, c, r) || outside_sphere(B, c, r) || outside_sphere(C, c, r));
    if (sane) {
      let h = ray_tri(o, d, A, B, C);
      // tolerance absorbs fp reassociation between the two passes
      if (h.w > 0.0 && h.x <= best_t * 1.0001) {
        atomicStore(&result[1], 1u);
        atomicStore(&result[2], bitcast<u32>(h.y));
        atomicStore(&result[3], bitcast<u32>(h.z));
        atomicStore(&result[4], bitcast<u32>(A.x));
        atomicStore(&result[5], bitcast<u32>(A.y));
        atomicStore(&result[6], bitcast<u32>(A.z));
        atomicStore(&result[7], bitcast<u32>(B.x));
        atomicStore(&result[8], bitcast<u32>(B.y));
        atomicStore(&result[9], bitcast<u32>(B.z));
        atomicStore(&result[10], bitcast<u32>(C.x));
        atomicStore(&result[11], bitcast<u32>(C.y));
        atomicStore(&result[12], bitcast<u32>(C.z));
        atomicStore(&result[13], item + model_info.x + 1u);
        atomicStore(&result[14], st.flags);
        atomicStore(&result[15], st.color);
        // read diagnostics (see the header): the winner's inputs, re-read
        let va = qverts[bv + ia];
        let vb = qverts[bv + ib];
        let vc = qverts[bv + ic];
        atomicStore(&result[16], mi);
        atomicStore(&result[17], tri);
        atomicStore(&result[18], ia);
        atomicStore(&result[19], ib);
        atomicStore(&result[20], ic);
        atomicStore(&result[21], va.x);
        atomicStore(&result[22], va.y);
        atomicStore(&result[23], vb.x);
        atomicStore(&result[24], vb.y);
        atomicStore(&result[25], vc.x);
        atomicStore(&result[26], vc.y);
        atomicStore(&result[27], bitcast<u32>(ascale.x));
        atomicStore(&result[28], bitcast<u32>(ascale.y));
        atomicStore(&result[29], bitcast<u32>(ascale.z));
        atomicStore(&result[30], bv);
        atomicStore(&result[31], fi);
      }
    }
  }
}
`}function je(){return`
@group(0) @binding(0) var img: texture_2d<f32>;
@group(0) @binding(1) var samp: sampler;

struct VsOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VsOut {
  var o: VsOut;
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u));
  o.pos = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
  o.uv = vec2f(xy.x, 1.0 - xy.y);
  return o;
}

@fragment
fn fs(in: VsOut) -> @location(0) vec4f {
  return textureSample(img, samp, in.uv);
}
`}function Me(){return`
struct CubeFrame {
  mvp: mat4x4f,
  // x = hovered zone id (-1 none), y = opacity
  params: vec4f,
  // world-space toward-viewer direction — plates facing away are discarded
  // (facing by normal, not winding: no cull mode to get wrong)
  viewer: vec4f,
  // settings-driven palette (sketch mode swaps in its own set)
  face_col: vec4f,   // face plates
  bevel_col: vec4f,  // edge/corner plates (face colour, slightly lifted)
  line_col: vec4f,   // inset border
  hover_col: vec4f,  // hovered zone highlight
};

@group(0) @binding(0) var<uniform> frame: CubeFrame;
@group(0) @binding(1) var atlas: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

struct VsOut {
  @builtin(position) clip: vec4f,
  @location(0) uv: vec2f,
  @location(1) @interpolate(flat) zone: f32,
  @location(2) @interpolate(flat) face_slot: f32,
  @location(3) @interpolate(flat) is_bevel: f32,
  @location(4) @interpolate(flat) facing: f32,
};

@vertex
fn vs(
  @location(0) pos_zone: vec4f,
  @location(1) uv_flags: vec4f,
  @location(2) normal: vec3f,
) -> VsOut {
  var o: VsOut;
  o.clip = frame.mvp * vec4f(pos_zone.xyz, 1.0);
  o.zone = pos_zone.w;
  o.uv = uv_flags.xy;
  o.face_slot = uv_flags.z;
  o.is_bevel = uv_flags.w;
  o.facing = dot(normal, frame.viewer.xyz);
  return o;
}

@fragment
fn fs(in: VsOut) -> @location(0) vec4f {
  if (in.facing <= 0.0) { discard; } // away-facing plate
  var col = select(frame.face_col.rgb, frame.bevel_col.rgb, in.is_bevel > 0.5);
  if (in.zone == frame.params.x) { col = frame.hover_col.rgb; }
  // inset border like the DOM plates (skip on the corner triangles — their
  // uv space is the clip-path square, not the triangle). Analytic AA: the
  // border is fragment-computed, so MSAA can't smooth it — fwidth can.
  // The derivative is taken OUTSIDE the branch: uniformity analysis rejects
  // fwidth under a condition that varies per fragment.
  let e = min(min(in.uv.x, 1.0 - in.uv.x), min(in.uv.y, 1.0 - in.uv.y));
  let w = max(fwidth(e), 1e-4);
  if (in.face_slot >= 0.0 || in.is_bevel < 1.5) {
    col = mix(col, frame.line_col.rgb, 1.0 - smoothstep(0.035 - w, 0.035 + w, e));
  }
  // sample unconditionally (textureSample needs uniform control flow), then
  // mask the label onto faces only
  let tile = vec2f((in.uv.x + max(in.face_slot, 0.0)) / 6.0, in.uv.y);
  let label = textureSample(atlas, samp, tile);
  let is_face = select(0.0, 1.0, in.face_slot >= 0.0);
  col = mix(col, label.rgb, label.a * is_face);
  return vec4f(col, frame.params.y);
}
`}var Ne=class{itemPickBuf=null;pickIdTex=null;pickDepthTex=null;pending=null;inFlight=!1;fastPipeline=null;fastMsPipeline=null;fastParamsBuf=null;fastOutBuf=null;fastBind=null;fastBindId=null;fastBindDepth=null;init(e){let t=(t,n)=>e.createComputePipeline({label:n,layout:`auto`,compute:{module:e.createShaderModule({label:n,code:t}),entryPoint:`main`}});this.fastPipeline=t(Ee(!1),`pickItemIdPipeline`),this.fastMsPipeline=t(Ee(!0),`pickItemIdMsPipeline`),this.fastParamsBuf=e.createBuffer({label:`pickItemParamsBuf`,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.fastOutBuf=e.createBuffer({label:`pickItemOutBuf`,size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}get hasPending(){return this.pending!==null}request(e,t,n){return new Promise(r=>{this.pending?.resolve(null),this.pending={x:e,y:t,shift:n,resolve:r}})}encode(e,t,n,r,i,a,o,s,c,l,u,d,f){if(!this.pending||this.inFlight)return null;let p=this.pending;if(this.pending=null,this.inFlight=!0,f&&!r.hasTransparency&&this.fastPipeline&&this.fastMsPipeline)return this.encodeFast(e,t,n,f,p,d);(!this.pickIdTex||this.pickIdTex.width!==n.width||this.pickIdTex.height!==n.height)&&(this.pickIdTex?.destroy(),this.pickDepthTex?.destroy(),this.pickIdTex=t.createTexture({label:`pickIdTex`,size:[n.width,n.height],format:`rgba8unorm`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}),this.pickDepthTex=t.createTexture({label:`pickDepthTex`,size:[n.width,n.height],format:`depth32float`,usage:GPUTextureUsage.RENDER_ATTACHMENT}));let m=new ArrayBuffer(192);new Uint8Array(m).set(new Uint8Array(a));let h=new Uint32Array(m);h[M.flags+2]=0;let g=new Float32Array(m);g[M.ambient]=r.pickOpacityPct/100,g[M.ambient+1]=+!!p.shift,t.queue.writeBuffer(o,512,m);let _=Math.min(Math.max(p.x,0),n.width-1),v=Math.min(Math.max(p.y,0),n.height-1),y=e.beginRenderPass({colorAttachments:[{view:this.pickIdTex.createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:`clear`,storeOp:`store`}],timestampWrites:d.writes(11),depthStencilAttachment:{view:this.pickDepthTex.createView(),depthClearValue:0,depthLoadOp:`clear`,depthStoreOp:`store`}});y.setScissorRect(_,v,1,1),fe(y,c,s,i,l,u,512),y.end();let b=this.readbackBuf(t);return e.copyTextureToBuffer({texture:this.pickIdTex,origin:[_,v]},{buffer:b,bytesPerRow:256},[1,1]),this.resolveJob(b,p)}encodeFast(e,t,n,r,i,a){let o=Math.min(Math.max(i.x,0),n.width-1),s=Math.min(Math.max(i.y,0),n.height-1);t.queue.writeBuffer(this.fastParamsBuf,0,new Uint32Array([o,s,0,0]));let c=r.msaa?this.fastMsPipeline:this.fastPipeline;(!this.fastBind||this.fastBindId!==r.id||this.fastBindDepth!==r.depth)&&(this.fastBind=t.createBindGroup({label:`pickItemFastBind`,layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:r.id.createView()},...r.msaa?[{binding:1,resource:r.depth.createView()}]:[],{binding:2,resource:{buffer:this.fastParamsBuf}},{binding:3,resource:{buffer:this.fastOutBuf}}]}),this.fastBindId=r.id,this.fastBindDepth=r.depth);let l=e.beginComputePass({label:`pickItemFast`,timestampWrites:a.writes(11)});l.setPipeline(c),l.setBindGroup(0,this.fastBind),l.dispatchWorkgroups(1),l.end();let u=this.readbackBuf(t);return e.copyBufferToBuffer(this.fastOutBuf,0,u,0,4),this.resolveJob(u,i)}readbackBuf(e){return this.itemPickBuf??=e.createBuffer({label:`itemPickBuf`,size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),this.itemPickBuf}resolveJob(e,t){return async()=>{try{await e.mapAsync(GPUMapMode.READ);let n=new Uint8Array(e.getMappedRange(0,4)).slice();e.unmap();let r=n[0]|n[1]<<8|n[2]<<16|n[3]<<24;t.resolve(r===0?null:r>>>0)}catch{t.resolve(null)}finally{this.inFlight=!1}}}};function Pe(e,t){return e&64?(e>>>25&127)<100:e&16?(t>>>24&255)<255:!1}let H=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],U=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],W=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],G=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],Fe=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],K=e=>Math.hypot(e[0],e[1],e[2]);function Ie(e,t,n){let r=Fe(H(t,e),H(n,e)),i=K(r);return i>1e-12?W(r,1/i):null}function Le(e,t,n,r){let i=H(n,t),a=H(r,t),o=H(e,t),s=G(i,o),c=G(a,o);if(s<=0&&c<=0)return K(o);let l=H(e,n),u=G(i,l),d=G(a,l);if(u>=0&&d<=u)return K(l);let f=s*d-u*c;if(f<=0&&s>=0&&u<=0){let n=s/(s-u);return K(H(e,U(t,W(i,n))))}let p=H(e,r),m=G(i,p),h=G(a,p);if(h>=0&&m<=h)return K(p);let g=m*c-s*h;if(g<=0&&c>=0&&h<=0){let n=c/(c-h);return K(H(e,U(t,W(a,n))))}let _=u*h-m*d;if(_<=0&&d-u>=0&&m-h>=0){let t=(d-u)/(d-u+(m-h));return K(H(e,U(n,W(H(r,n),t))))}let v=1/(_+g+f),y=g*v,b=f*v;return K(H(e,U(t,U(W(i,y),W(a,b)))))}function Re(e,t,n,r){let i=G(n,e)-r,a=G(n,t)-r;return i>0&&a>0||i<0&&a<0||i===a?null:U(e,W(H(t,e),i/(i-a)))}function ze(e,t,n,r,i,a,o,s){let c=Ie(e.A,e.B,e.C),l=Ie(t.A,t.B,t.C);if(!c||!l)return null;let u=G(c,l),d=1-u*u;if(d<1e-4)return null;let f=G(c,e.A),p=G(l,t.A),m=W(U(W(c,f-p*u),W(l,p-f*u)),1/d),h=Fe(c,l),g=W(h,1/K(h)),_=H(n.origin,m),v=G(n.dir,g),y=1-v*v;if(y<1e-6)return null;let b=(G(g,_)-v*G(n.dir,_))/y,x=U(m,W(g,b)),S=s(e.t)*2;if(Le(x,e.A,e.B,e.C)>S||Le(x,t.A,t.B,t.C)>S)return null;let C=[r+.5,i+.5],w=e=>{let t=o(e);return t?Math.hypot(t[0]-C[0],t[1]-C[1]):1/0},T=G(c,n.dir)>0?W(c,-1):c;if(a.corner){let n=null,r=a.cornerPx,i=[[e.A,e.B,e.C,l,p],[t.A,t.B,t.C,c,f]];for(let[e,t,a,o,s]of i)for(let[i,c]of[[e,t],[t,a],[a,e]]){let e=Re(i,c,o,s);if(e){let t=w(e);t<=r&&(r=t,n=e)}}if(n)return{point:n,normal:T,edgeDir:g,kind:`corner`}}return a.edge&&w(x)<=a.edgePx?{point:x,normal:T,edgeDir:g,kind:`edge`}:null}function Be(e,t,n,r,i,a,o,s,c,l){let u=1-r-i,d=[u*e[0]+r*t[0]+i*n[0],u*e[1]+r*t[1]+i*n[1],u*e[2]+r*t[2]+i*n[2]],f=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],p=[n[0]-e[0],n[1]-e[1],n[2]-e[2]],m=[f[1]*p[2]-f[2]*p[1],f[2]*p[0]-f[0]*p[2],f[0]*p[1]-f[1]*p[0]],h=Math.hypot(...m);h>1e-12&&(m=[m[0]/h,m[1]/h,m[2]/h],m[0]*a[0]+m[1]*a[1]+m[2]*a[2]>0&&(m=[-m[0],-m[1],-m[2]]));let g=[o+.5,s+.5],_=e=>{let t=l(e);return t?Math.hypot(t[0]-g[0],t[1]-g[1]):1/0},v=()=>({point:d,normal:h>1e-12?m:null,edgeDir:null,kind:`face`});if(!c.enabled)return v();let y=[e,t,n];if(c.corner){let e=1/0,t=null;for(let n of y){let r=_(n);r<e&&(e=r,t=n)}if(t&&e<=c.cornerPx)return{point:t,normal:null,edgeDir:null,kind:`corner`}}if(c.edge){let e=1/0,t=null,n=null;for(let r=0;r<3;r++){let i=y[r],a=y[(r+1)%3],o=[a[0]-i[0],a[1]-i[1],a[2]-i[2]],s=o[0]*o[0]+o[1]*o[1]+o[2]*o[2],c=s>1e-18?Math.max(0,Math.min(1,((d[0]-i[0])*o[0]+(d[1]-i[1])*o[1]+(d[2]-i[2])*o[2])/s)):0,l=[i[0]+o[0]*c,i[1]+o[1]*c,i[2]+o[2]*c],u=_(l);if(u<e){e=u,t=l;let r=Math.sqrt(s)||1;n=[o[0]/r,o[1]/r,o[2]/r]}}if(t&&e<=c.edgePx)return{point:t,normal:null,edgeDir:n,kind:`edge`}}return v()}function q(e){return Math.max(64,Math.ceil(e/4)*4)}function Ve(e){let t=e.meshletCount;return{vertex:q(e.positionsQ.byteLength),index:q(e.indices16.byteLength),cgColor:q(e.cgColors.byteLength),meshletCull:q(e.cull.byteLength),vis:Math.max(64,t*4),record:Math.max(20,t*20),cand:Math.max(8,t*8),sort:8196,sortArgs:16,meshletInfo:q(e.meshletInfo.byteLength),itemState:Math.max(12,e.itemCount*12),modelUni:q(80),normal:q(e.normalsQ?.byteLength??4),fullList:q(t*4),fullArgs:q(16)}}function He(e){let t=Ve(e);return t.vertex+t.index+t.cgColor+t.meshletCull+t.vis+t.record*3+t.cand+t.sort+t.sortArgs+t.meshletInfo+t.itemState+t.modelUni+t.normal+t.fullList+t.fullArgs}var Ue=class{maskPipeline;maskVpPipeline;edgePipeline;edgeMsPipeline;blurPipeline;compPipeline;depthTex=null;edgeTex=null;tmpTex=null;glowA=null;glowB=null;blurH;blurV;glowHBuf;glowVBuf;compBuf;init(e,t,n,r,i,a){let o={primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:`depth32float`,depthWriteEnabled:!0,depthCompare:`greater`}};this.maskPipeline=e.createRenderPipeline({label:`outlineMaskPipeline`,layout:n,vertex:{module:r,entryPoint:`vs`,buffers:[{arrayStride:8,attributes:[{shaderLocation:0,offset:0,format:`uint16x4`}]}]},fragment:{module:r,entryPoint:`fs_outline`,targets:[]},...o}),this.maskVpPipeline=e.createRenderPipeline({label:`outlineMaskVpPipeline`,layout:i,vertex:{module:a,entryPoint:`vs`},fragment:{module:a,entryPoint:`fs_outline`,targets:[]},...o});let s=t=>e.createShaderModule({label:`outlineModule`,code:ke(t)}),c=s(!1),l=s(!0),u=t=>e.createRenderPipeline({label:`outlineEdgePipeline`,layout:`auto`,vertex:{module:t,entryPoint:`vs`},fragment:{module:t,entryPoint:`fs_edge`,targets:[{format:`rg8unorm`}]},primitive:{topology:`triangle-list`}});this.edgePipeline=u(c),this.edgeMsPipeline=u(l),this.blurPipeline=e.createRenderPipeline({label:`outlineBlurPipeline`,layout:`auto`,vertex:{module:c,entryPoint:`vs`},fragment:{module:c,entryPoint:`fs_blur`,targets:[{format:`rg8unorm`}]},primitive:{topology:`triangle-list`}}),this.compPipeline=e.createRenderPipeline({label:`outlineCompPipeline`,layout:`auto`,vertex:{module:c,entryPoint:`vs`},fragment:{module:c,entryPoint:`fs_composite`,targets:[{format:t,blend:{color:{srcFactor:`one`,dstFactor:`one`},alpha:{srcFactor:`zero`,dstFactor:`one`}}}]},primitive:{topology:`triangle-list`}});let d=()=>e.createBuffer({label:`outlineBlurBuf`,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.blurH=d(),this.blurV=d(),this.glowHBuf=d(),this.glowVBuf=d(),this.compBuf=e.createBuffer({label:`outlineCompBuf`,size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}encode(e,t,n,r,i,a,o,s,c,l,u,d,f){let p=n.width,m=n.height;if(!this.depthTex||this.depthTex.width!==p||this.depthTex.height!==m){for(let e of[this.depthTex,this.edgeTex,this.tmpTex,this.glowA,this.glowB])e?.destroy();let e=GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,n=(n,r)=>t.createTexture({label:`outlineRgTex`,size:[n,r],format:`rg8unorm`,usage:e});this.depthTex=t.createTexture({label:`outlineDepthTex`,size:[p,m],format:`depth32float`,usage:e}),this.edgeTex=n(p,m),this.tmpTex=n(p,m),this.glowA=n(Math.max(1,p>>1),Math.max(1,m>>1)),this.glowB=n(Math.max(1,p>>1),Math.max(1,m>>1))}let h=new ArrayBuffer(192);new Uint8Array(h).set(new Uint8Array(a));let g=new Uint32Array(h);g[M.flags+2]=0;let _=new Float32Array(h);_[M.ambient]=r.outlineSelection&&r.outlineSelectionActive?1:0,g[M.ambient+1]=d,t.queue.writeBuffer(o,768,h);let v=Math.max(1,Math.min(4,r.outlineThickness)),y=(e,n,r,i,a=1)=>t.queue.writeBuffer(e,0,new Float32Array([n,r,i,a]));y(this.blurH,1,0,v),y(this.blurV,0,1,v);let b=r.outlineGlow>0;b&&(y(this.glowHBuf,1,0,4,2),y(this.glowVBuf,0,1,4));let x=r.outlinePulse>0?.625+.375*Math.cos(performance.now()/1e3*2*Math.PI/r.outlinePulse):1;t.queue.writeBuffer(this.compBuf,0,new Float32Array([...r.outlineVisibleColor,r.outlineStrength*x,...r.outlineHiddenColor,r.outlineGlow]));let S=e.beginRenderPass({colorAttachments:[],timestampWrites:f.span(9,`begin`),depthStencilAttachment:{view:this.depthTex.createView(),depthClearValue:0,depthLoadOp:`clear`,depthStoreOp:`store`}});fe(S,c,s,i,this.maskPipeline,this.maskVpPipeline,768),S.end();let C=(n,r,i,a=`clear`,o)=>{let s=e.beginRenderPass({colorAttachments:[{view:r,loadOp:a,storeOp:`store`}],timestampWrites:o});s.setPipeline(n),s.setBindGroup(0,t.createBindGroup({label:`outlineFullscreenBind`,layout:n.getBindGroupLayout(0),entries:i})),s.draw(3),s.end()};C(r.msaa4x?this.edgeMsPipeline:this.edgePipeline,this.edgeTex.createView(),[{binding:0,resource:this.depthTex.createView()},{binding:1,resource:l.createView()}]),b&&C(this.blurPipeline,this.glowA.createView(),[{binding:2,resource:this.edgeTex.createView()},{binding:3,resource:{buffer:this.glowHBuf}}]),C(this.blurPipeline,this.tmpTex.createView(),[{binding:2,resource:this.edgeTex.createView()},{binding:3,resource:{buffer:this.blurH}}]),C(this.blurPipeline,this.edgeTex.createView(),[{binding:2,resource:this.tmpTex.createView()},{binding:3,resource:{buffer:this.blurV}}]),b&&C(this.blurPipeline,this.glowB.createView(),[{binding:2,resource:this.glowA.createView()},{binding:3,resource:{buffer:this.glowVBuf}}]),C(this.compPipeline,u,[{binding:4,resource:this.edgeTex.createView()},{binding:5,resource:this.glowB.createView()},{binding:6,resource:{buffer:this.compBuf}}],`load`,f.span(9,`end`))}};function We(){return{pixelRatio:1,meshletVis:!1,pxCut:0,pxCutAlways:0,newMeshletCap:0,settleFrames:0,pickOpacityPct:10.1,protectDist:0,fastAA:!1,msaa4x:!1,geoEdges:!1,itemEdges:!1,sketch:!1,edgeColor:[0,0,0],fadeExp:.3,depthThr:.01,normalThr:.25,smoothFadeExp:.3,smoothDepthThr:.01,smoothNormalThr:.25,flatMeshEdges:!0,smoothMeshEdges:!0,sketchRespectsEdgesOff:!1,sketchColorMode:`off`,sketchFillStrength:1,whiteOnDark:!0,darkThr:.07,darkFloor:0,freezeCull:!1,debugBuf:0,aoMode:0,aoRadius:.8,aoStrength:.15,aoSlices:6,aoSamples:6,orthographic:!1,vertexPull:!1,bgColor:[.224,.224,.224],ambientColor:[1,1,1],ambientIntensity:.45,headlightColor:[1,1,1],headlightIntensity:.65,selectionColor:[.13,.2,1],transparencyBlend:!1,transparencyBackdrop:!1,backdropFade:.7,hasTransparency:!1,aaSamples:32,suppressTintOnOverride:!1,gpuTimings:!1,traceKey:!1,outlineHover:!1,outlineSelection:!1,selectionTint:!0,outlineStrength:3,outlineGlow:0,outlineThickness:1,outlinePulse:0,outlineVisibleColor:[1,1,1],outlineHiddenColor:[.098,.039,.02],outlineSelectionActive:!1}}function Ge(e,t){let n=new Float32Array((e+1)*(t+1)*3),r=0;for(let i=0;i<=e;i++){let a=i/e*Math.PI,o=Math.sin(a),s=Math.cos(a);for(let e=0;e<=t;e++){let i=e/t*Math.PI*2;n[r++]=o*Math.cos(i),n[r++]=o*Math.sin(i),n[r++]=s}}let i=new Uint16Array(e*t*6),a=0,o=(e,n)=>e*(t+1)+n;for(let n=0;n<e;n++)for(let e=0;e<t;e++){let t=o(n,e),r=o(n+1,e),s=o(n+1,e+1),c=o(n,e+1);i[a++]=t,i[a++]=r,i[a++]=s,i[a++]=t,i[a++]=s,i[a++]=c}return{positions:n,indices:i}}let Ke={front:[0,-1,0],back:[0,1,0],right:[1,0,0],left:[-1,0,0],top:[0,0,1],bottom:[0,0,-1]},qe=.16,Je=[`front`,`back`,`left`,`right`,`top`,`bottom`],Ye=(1.5-2*qe)/Math.sqrt(3)+qe*Math.SQRT2*1.14,J=e=>{let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]},Xe=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Y=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],Ze=(e,t,n)=>[e[0]+t[0]+n[0],e[1]+t[1]+n[1],e[2]+t[2]+n[2]],Qe={front:[0,0,1],back:[0,0,1],left:[0,0,1],right:[0,0,1],top:[0,1,0],bottom:[0,-1,0]};function $e(){let e=[],t={},n=0,r=(t,n,r,i,a,o,s)=>{e.push(t[0],t[1],t[2],n,r,i,a,o,s[0],s[1],s[2],0)},i=(e,t,n,i,a,o,s,c,l)=>{let u=Ze(e,Y(t,-i),Y(n,a)),d=Ze(e,Y(t,i),Y(n,a)),f=Ze(e,Y(t,i),Y(n,-a)),p=Ze(e,Y(t,-i),Y(n,-a));r(u,o,0,0,s,c,l),r(p,o,0,1,s,c,l),r(f,o,1,1,s,c,l),r(u,o,0,0,s,c,l),r(f,o,1,1,s,c,l),r(d,o,1,0,s,c,l)},a=(1-2*qe)/2;Je.forEach((e,r)=>{let o=Ke[e],s=Qe[e],c=J(Xe(s,o));t[e]=n,i(Y(o,.5),c,s,a,a,n++,r,0,o)});let o=qe*Math.SQRT2/2,s=.84/Math.SQRT2;for(let[e,r]of[[`front`,`right`],[`front`,`left`],[`back`,`right`],[`back`,`left`],[`front`,`top`],[`front`,`bottom`],[`back`,`top`],[`back`,`bottom`],[`right`,`top`],[`right`,`bottom`],[`left`,`top`],[`left`,`bottom`]]){let c=Ke[e],l=Ke[r],u=J([c[0]+l[0],c[1]+l[1],c[2]+l[2]]),d=J(Xe(c,l)),f=J(Xe(u,d));t[`${e}+${r}`]=n,i(Y(u,s),d,f,a,o,n++,-1,1,u)}let c=(1.5-2*qe)/Math.sqrt(3),l=qe*Math.SQRT2*1.14;for(let e of[-1,1])for(let i of[-1,1])for(let a of[-1,1]){let o=J([e,i,a]),s=[i<0?`front`:`back`,a>0?`top`:`bottom`,e>0?`right`:`left`],u=[0,0,a],d=u[0]*o[0]+u[1]*o[1]+u[2]*o[2],f=J([u[0]-o[0]*d,u[1]-o[1]*d,u[2]-o[2]*d]),p=J(Xe(f,o)),m=n;t[s.join(`+`)]=n++;let h=Y(o,c),g=Ze(h,Y(f,l*.5),[0,0,0]),_=Ze(h,Y(f,-l*.25),Y(p,-l*.44)),v=Ze(h,Y(f,-l*.25),Y(p,l*.44)),y=(e,t,n)=>r(e,m,t,n,-1,2,o);y(g,.5,0),y(_,.06,.75),y(v,.94,.75)}return{vertexData:new Float32Array(e),vertexCount:e.length/12,zoneIds:t}}function et(e={},t=`#c9cfd8`){let n=new OffscreenCanvas(768,128),r=n.getContext(`2d`);r.clearRect(0,0,n.width,n.height);let i={front:`FRONT`,back:`BACK`,left:`LEFT`,right:`RIGHT`,top:`TOP`,bottom:`BOT`};r.fillStyle=t,r.textAlign=`center`,r.textBaseline=`middle`,r.font=`700 29.439999999999998px ui-sans-serif, system-ui, sans-serif`,Je.forEach((t,n)=>{let a=(e[t]??i[t]).slice(0,5);r.fillText(a,n*128+64,64,115.2)});let{data:a}=r.getImageData(0,0,n.width,n.height);return{data:a,width:n.width,height:n.height}}var tt=class{device=null;pipeline=null;pipeline4x=null;blitPipeline=null;verts=null;vertCount=0;uni=null;bind=null;bind4x=null;atlas=null;msaaTex=null;resolveTex=null;blitBind=null;labels={};atlasDirty=!0;rect=null;hover=-1;quat={x:0,y:0,z:0,w:1};faceCol=[.184,.212,.255];lineCol=[.302,.337,.396];hoverCol=[.29,.427,.612];textCol=`#c9cfd8`;init(e,t){this.device=e;let n=$e();this.vertCount=n.vertexCount,this.verts=e.createBuffer({label:`cubeVerts`,size:n.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.verts,0,n.vertexData),this.uni=e.createBuffer({label:`cubeUni`,size:160,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let r=e.createShaderModule({label:`cubeModule`,code:Me()}),i=n=>e.createRenderPipeline({label:n?`cubePipeline4x`:`cubePipeline`,layout:`auto`,vertex:{module:r,entryPoint:`vs`,buffers:[{arrayStride:48,attributes:[{shaderLocation:0,offset:0,format:`float32x4`},{shaderLocation:1,offset:16,format:`float32x4`},{shaderLocation:2,offset:32,format:`float32x3`}]}]},fragment:{module:r,entryPoint:`fs`,targets:[{format:t,blend:{color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`}}}]},primitive:{topology:`triangle-list`,cullMode:`none`},...n?{multisample:{count:4}}:{}});this.pipeline=i(!1),this.pipeline4x=i(!0);let a=e.createShaderModule({label:`cubeBlitModule`,code:je()});this.blitPipeline=e.createRenderPipeline({label:`cubeBlitPipeline`,layout:`auto`,vertex:{module:a,entryPoint:`vs`},fragment:{module:a,entryPoint:`fs`,targets:[{format:t,blend:{color:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`}}}]},primitive:{topology:`triangle-list`}})}setPlacement(e,t,n){this.rect=e,this.hover=t,this.quat=n}setLabels(e){this.labels=e,this.atlasDirty=!0}setColors(e,t,n,r){this.faceCol=e,this.lineCol=t,this.hoverCol=n,r!==this.textCol&&(this.textCol=r,this.atlasDirty=!0)}get stateKey(){return`${this.rect?`${this.rect.x},${this.rect.y},${this.rect.size}`:`-`};${this.hover};${this.faceCol.join(`,`)};${this.lineCol.join(`,`)};${this.hoverCol.join(`,`)};${this.textCol}`}draw(e,t,n,r,i,a,o){let s=this.rect,c=this.device;if(!s||!c||!this.pipeline||!this.verts||!this.uni)return;if(this.atlasDirty){this.atlasDirty=!1;let e=et(this.labels,this.textCol);this.atlas||=c.createTexture({label:`cubeAtlas`,size:[768,128],format:`rgba8unorm`,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),c.queue.writeTexture({texture:this.atlas},e.data,{bytesPerRow:e.width*4,rowsPerImage:e.height},[e.width,e.height]);let t=[{binding:0,resource:{buffer:this.uni}},{binding:1,resource:this.atlas.createView()},{binding:2,resource:c.createSampler({magFilter:`linear`,minFilter:`linear`})}];this.bind=c.createBindGroup({label:`cubeBind`,layout:this.pipeline.getBindGroupLayout(0),entries:t}),this.bind4x=c.createBindGroup({label:`cubeBind4x`,layout:this.pipeline4x.getBindGroupLayout(0),entries:t})}let l=s.size*i,u=(s.x+s.size/2)*i,d=(s.y+s.size/2)*i,f=l*Ye,p=Math.max(0,Math.floor(u-f)),m=Math.max(0,Math.floor(d-f)),h=Math.min(n.width,Math.ceil(u+f)),g=Math.min(n.height,Math.ceil(d+f)),_=h-p,v=g-m;if(_<2||v<2)return;let{x:y,y:b,z:x,w:S}=this.quat,C=1-2*(b*b+x*x),w=2*(y*b-x*S),T=2*(y*x+b*S),E=2*(y*b+x*S),D=1-2*(y*y+x*x),O=2*(b*x-y*S),k=2*(y*x-b*S),A=2*(b*x+y*S),j=1-2*(y*y+b*b),M=2*l/_,N=2*l/v,P=2*(u-p)/_-1,F=1-2*(d-m)/v,I=new Float32Array(40);I[0]=M*C,I[4]=M*E,I[8]=M*k,I[12]=P,I[1]=N*w,I[5]=N*D,I[9]=N*A,I[13]=F,I[14]=.5,I[15]=1,I[16]=this.hover,I[17]=1,I[20]=T,I[21]=O,I[22]=j;let[L,R,z]=this.faceCol;if(I.set([L,R,z,1],24),I.set([Math.min(1,L*1.08+.016),Math.min(1,R*1.08+.016),Math.min(1,z*1.08+.016),1],28),I.set([...this.lineCol,1],32),I.set([...this.hoverCol,1],36),c.queue.writeBuffer(this.uni,0,I),a&&this.pipeline4x&&this.blitPipeline){(!this.msaaTex||this.msaaTex.width!==_*2||this.msaaTex.height!==v*2)&&(this.msaaTex?.destroy(),this.resolveTex?.destroy(),this.msaaTex=c.createTexture({label:`cubeMsaa`,size:[_*2,v*2],sampleCount:4,format:r,usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.resolveTex=c.createTexture({label:`cubeResolve`,size:[_*2,v*2],format:r,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.blitBind=c.createBindGroup({label:`cubeBlitBind`,layout:this.blitPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:this.resolveTex.createView()},{binding:1,resource:c.createSampler({magFilter:`linear`,minFilter:`linear`})}]}));let n=e.beginRenderPass({timestampWrites:o.span(10,`begin`),colorAttachments:[{view:this.msaaTex.createView(),resolveTarget:this.resolveTex.createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:`clear`,storeOp:`discard`}]});n.setPipeline(this.pipeline4x),n.setBindGroup(0,this.bind4x),n.setVertexBuffer(0,this.verts),n.draw(this.vertCount),n.end();let i=e.beginRenderPass({colorAttachments:[{view:t,loadOp:`load`,storeOp:`store`}],timestampWrites:o.span(10,`end`)});i.setViewport(p,m,_,v,0,1),i.setPipeline(this.blitPipeline),i.setBindGroup(0,this.blitBind),i.draw(3),i.end();return}let B=e.beginRenderPass({colorAttachments:[{view:t,loadOp:`load`,storeOp:`store`}],timestampWrites:o.writes(10)});B.setViewport(p,m,_,v,0,1),B.setPipeline(this.pipeline),B.setBindGroup(0,this.bind),B.setVertexBuffer(0,this.verts),B.draw(this.vertCount),B.end()}};function nt(){let e=typeof navigator>`u`?null:navigator;if(typeof e!=`object`||!e||!(`deviceMemory`in e))return 0;let t=e.deviceMemory;return typeof t==`number`&&Number.isFinite(t)?t:0}function rt(e){return{name:`tombstone`,boundsMin:[1/0,1/0,1/0],boundsMax:[-1/0,-1/0,-1/0],denseMin:null,denseMax:null,meshletCount:0,triangleCount:0,itemCount:e,cgCount:0,positionsQ:new Uint16Array,normalsQ:null,indices16:new Uint16Array,cull:new ArrayBuffer(0),meshletInfo:new ArrayBuffer(0),cgColors:new Float32Array}}function it(e){for(let t=3;t<e.length;t+=4)if(e[t]<1)return!0;return!1}let X=e=>e.toFixed(3),Z=e=>`(${X(e[0])}, ${X(e[1])}, ${X(e[2])})`,at=e=>e?`(${e[0].toFixed(1)},${e[1].toFixed(1)})`:`behind`,ot=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2]),st=e=>e?`hit t=${X(e.t)} item=${e.item} uv=(${X(e.u)},${X(e.v)}) A=${Z(e.A)} B=${Z(e.B)} C=${Z(e.C)}`:`miss`,ct=4096,lt=1e-9;var ut=class{device;context;format;cull1Pipeline;cull2Pipeline;cullVp1Pipeline;cullVp2Pipeline;sortScanPipeline;sortScatterPipeline;sortScatterVpPipeline;hzbDownPipeline;hzbFirstPipeline;hzbFirstMsPipeline;pickDepthPipeline;pickDepthMsPipeline;renderPipeline1x;pickPipeline;pickVpPipeline;outline=new Ue;renderPipeline4x;renderVpPipeline1x;renderVpPipeline4x;renderBlend1x;renderBlend4x;renderVpBlend1x;renderVpBlend4x;renderBackdrop1x;renderBackdrop4x;renderVpBackdrop1x;renderVpBackdrop4x;linePipeline1x;linePipeline4x;lineBind;viewCube=new tt;lineBuf=null;lineCount=0;lastLineKey=``;markerPipelines;markerBind;sphereMeshBuf;sphereIndexBuf;sphereIndexCount=0;markerBuf=null;markerCount=0;markerOpaque=0;lastMarkerKey=``;clipBuf;transformsBuf;lastClipKey=``;clipVersion=0;vpGeoBGL;postPipeline;postMsPipeline;renderBGL;frameBuf;paramsBuf;postParamsBuf;countsBuf;cull1ParamsBind;cullVp1ParamsBind;cullVp2ParamsBind=null;models=[];multiDraw=!1;adapterInfo=``;adapterHints=null;adapterFacts=null;adapterLimits=null;gpuPreference=`high-performance`;cullMode=`full`;gpuError=``;lost=!1;onLost=null;simulatingLoss=!1;vramBuffers=0;vramTextures=0;get modelBytesTotal(){let e=0;for(let t of this.models)t.dead||(e+=t.bytes);return e}frameCounter=0;sceneFrames=0;accumResets=0;heldFrames=0;get gpuMsTotal(){return this.timings.totalMs}holdAccumulation=!1;wasHoldingAccum=!1;heldAtHoldStart=0;viewport={cssW:1,cssH:1,dpr:1};get dpr(){return this.options.pixelRatio??this.viewport.dpr}setViewportSize(e){this.viewport=e}get viewportCss(){return{w:this.viewport.cssW,h:this.viewport.cssH}}get backingSize(){let e=this.canvasEl;return{w:e?.width??0,h:e?.height??0}}options=We();nextItemBase=1;stateVersion=0;wasMoving=!1;lastMoveT=0;accumIdx=0;accumCount=0;get aaMax(){return Math.max(1,Math.min(256,this.options.aaSamples))}aoAccum=0;aoRanLastFrame=!1;vbaoPipeline;vbaoMsPipeline;snapBGL;snapMinPipeline;snapWritePipeline;snapResultBuf;snapStagingBuf;snapParamsBuf;snapInFlight=!1;aoParamsBuf;aoTex=null;aoHist=null;aoBind=null;depth=null;sceneColor=null;msColor=null;normalTex=null;idTex=null;histA=null;histB=null;postBindEven=null;postBindOdd=null;targetsMsaa=!1;targetsPost=!1;targetsAo=!1;hzb=null;hzbMipCount=0;hzbBinds=[];hzbMipSizes=[];cull2ParamsBind=null;pickBuf=null;pickParamsBuf;pickOutBuf;pickDepthBind=null;pendingPick=null;pickInFlight=!1;onTrace=null;pickSeq=0;lastCastWords=new Uint32Array(32);pendingW=0;pendingH=0;pendingSizeT=0;lastVP=new Float32Array(16);lastClickWorld=null;get viewProjMatrix(){return this.lastVP}get hostCanvas(){if(!this.canvasEl)throw Error(`renderer not initialized`);return this.canvasEl}screenRay(e,t){return k(this.currentView(),e*this.dpr,t*this.dpr)}currentView(e=``){let t=this.hostCanvas;return{vp:Float32Array.from(this.lastVP),w:t.width,h:t.height,t:performance.now(),tag:e}}probeWorld(e,t){this.queuePick(e,t,`probe`)}probeResolve=null;probeWorldAsync(e,t){return new Promise(n=>{this.probeResolve?.(null),this.probeResolve=n,this.queuePick(e,t,`probe`)})}measureResolve=null;measureSnap={enabled:!0,corner:!0,edge:!0,seam:!0,cornerPx:12,edgePx:8};probeMeasureAsync(e,t,n){return new Promise(r=>{this.measureResolve?.(null),this.measureResolve=r,this.measureSnap=n,this.queuePick(e,t,`measure`)})}queuePick(e,t,n){let r=this.hostCanvas;this.pendingPick={x:Math.min(r.width-1,Math.max(0,Math.floor(e*this.dpr))),y:Math.min(r.height-1,Math.max(0,Math.floor(t*this.dpr))),mode:n}}pendingSnap=null;snapshot(){return new Promise(e=>this.pendingSnap=e)}captureScale=1;async snapshotHiRes(e=3840){let t=Math.max(this.viewport.cssW,this.viewport.cssH)||1,n=Math.min(e,this.device.limits.maxTextureDimension2D),r=t*this.dpr;this.captureScale=Math.max(1,n/r);try{return await this.snapshot()}finally{this.captureScale=1}}itemPick=new Ne;pickItem(e,t,n=!1){return this.itemPick.request(Math.floor(e*this.dpr),Math.floor(t*this.dpr),n)}hoverItemId=0;drawnHoverId=0;setHoverItem(e){this.hoverItemId=e??0}hadFirstFit=!1;lastKey=``;lastVpKey=``;idle=!1;gpuBusy=!1;lastFrameData=new ArrayBuffer(192);statsBuf;statsInFlight=!1;newBudgetBuf;newBudgetReadBuf;capReadInFlight=!1;newVisibleWanted=0;capBacklog=!1;capReadFrame=0;zeroNewReads=0;capReadFresh=!1;keyChangeFrame=0;keyChangeT=0;lastCountRead=0;drawnPerModel=new Uint32Array;drawnResolvedT=0;get drawCountsUsable(){return this.cullMode!==`full`&&!this.options.freezeCull}drawnPass1=0;drawnPass2=0;drawnBlend=0;timings=new he;get gpuTimingSupported(){return this.timings.supported}get gpuTimes(){return this.timings.times}frames=0;lastStat=performance.now();lastFrame=performance.now();fps=0;cpuMs=0;camera=new B;sceneMin=[1/0,1/0,1/0];sceneMax=[-1/0,-1/0,-1/0];denseMin=[1/0,1/0,1/0];denseMax=[-1/0,-1/0,-1/0];fitDense=!0;get sceneBounds(){return{min:this.sceneMin,max:this.sceneMax}}get fitTarget(){return this.fitDense&&Number.isFinite(this.denseMin[0])?{min:this.denseMin,max:this.denseMax}:{min:this.sceneMin,max:this.sceneMax}}fitBounds(e,t){this.camera.fit(e,t)}markViewChosen(){this.hadFirstFit=!0}setClip(e){let t=e.join(`,`);t!==this.lastClipKey&&(this.lastClipKey=t,this.clipData=e,this.clipDataU32=new Uint32Array(e.buffer,e.byteOffset,e.length),this.device.queue.writeBuffer(this.clipBuf,0,e),this.clipVersion++)}clipData=null;clipDataU32=null;setHelperLines(e,t=e.join(`,`)){if(t!==this.lastLineKey){if(this.lastLineKey=t,this.lineCount=e.length/4,this.lineCount===0){this.clipVersion++;return}(!this.lineBuf||this.lineBuf.size<e.byteLength)&&(this.lineBuf?.destroy(),this.lineBuf=this.device.createBuffer({label:`lineBuf`,size:Math.max(256,e.byteLength),usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST})),this.device.queue.writeBuffer(this.lineBuf,0,e),this.clipVersion++}}setMarkerSpheres(e,t,n){if(n!==this.lastMarkerKey){if(this.lastMarkerKey=n,this.markerCount=e.length/8,this.markerOpaque=Math.min(t,this.markerCount),this.markerCount===0){this.clipVersion++;return}(!this.markerBuf||this.markerBuf.size<e.byteLength)&&(this.markerBuf?.destroy(),this.markerBuf=this.device.createBuffer({label:`markerBuf`,size:Math.max(256,e.byteLength),usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST})),this.device.queue.writeBuffer(this.markerBuf,0,e),this.clipVersion++}}canvasEl=null;async init(e){if(this.canvasEl=e,!navigator.gpu)throw Error(`WebGPU not available in this browser`);let t=await navigator.gpu.requestAdapter({powerPreference:this.gpuPreference===`fallback`?void 0:this.gpuPreference,forceFallbackAdapter:this.gpuPreference===`fallback`});if(t??=await navigator.gpu.requestAdapter(),!t)throw Error(`no WebGPU adapter`);let n=t.info;this.adapterInfo=`${n.vendor} ${n.architecture} ${n.device} ${n.description}`.trim(),this.adapterFacts=pe(t,this.gpuPreference===`fallback`),this.adapterLimits={maxBufferSize:t.limits.maxBufferSize,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize},this.adapterHints={vendor:n.vendor,architecture:n.architecture,maxBufferSize:t.limits.maxBufferSize,deviceMemoryGb:nt(),isMobile:ie()};let r=[];t.features.has(`chromium-experimental-multi-draw-indirect`)&&(r.push(`chromium-experimental-multi-draw-indirect`),this.multiDraw=!0);let i=t.features.has(`timestamp-query`);i&&r.push(`timestamp-query`),this.device=await t.requestDevice({requiredFeatures:r,requiredLimits:{maxBufferSize:Math.min(t.limits.maxBufferSize,2147483648),maxStorageBufferBindingSize:Math.min(t.limits.maxStorageBufferBindingSize,2147483648),maxStorageBuffersPerShaderStage:Math.min(t.limits.maxStorageBuffersPerShaderStage,16)}}),this.timings.attach(this.device,i),P(this.device,e=>{this.vramBuffers+=e},e=>{this.vramTextures+=e}),this.device.lost.then(e=>{e.reason===`destroyed`&&!this.simulatingLoss||(this.lost=!0,this.gpuError=`device lost: ${e.reason} ${e.message}`,console.error(`WebGPU device lost:`,e.reason,e.message),this.onLost?.(this.gpuError))}),this.device.addEventListener(`uncapturederror`,e=>{let t=e.error.message;this.gpuError||=t,console.error(`WebGPU:`,t)}),this.context=e.getContext(`webgpu`),this.format=navigator.gpu.getPreferredCanvasFormat(),this.context.configure({device:this.device,format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});let a=this.device;this.frameBuf=a.createBuffer({label:`frameBuf`,size:1024,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.paramsBuf=a.createBuffer({label:`paramsBuf`,size:240,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.postParamsBuf=a.createBuffer({label:`postParamsBuf`,size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.clipBuf=a.createBuffer({label:`clipBuf`,size:1040,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.transformsBuf=a.createBuffer({label:`transformsBuf`,size:262144,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),a.queue.writeBuffer(this.transformsBuf,0,new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])),this.countsBuf=a.createBuffer({label:`countsBuf`,size:ct*256*3,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.INDIRECT|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.statsBuf=a.createBuffer({label:`statsBuf`,size:ct*256*3,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),this.newBudgetBuf=a.createBuffer({label:`newBudgetBuf`,size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.newBudgetReadBuf=a.createBuffer({label:`newBudgetReadBuf`,size:4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});let o=e=>a.createComputePipeline({label:`computePipeline`,layout:`auto`,compute:{module:a.createShaderModule({label:`computeModule`,code:e}),entryPoint:`main`}});this.cull1Pipeline=o(oe(!1,!1)),this.cull2Pipeline=o(oe(!0,!1)),this.cullVp1Pipeline=o(oe(!1,!0)),this.cullVp2Pipeline=o(oe(!0,!0)),this.sortScanPipeline=o(se()),this.sortScatterPipeline=o(ce(!1)),this.sortScatterVpPipeline=o(ce(!0)),this.hzbDownPipeline=o(le(!1)),this.hzbFirstPipeline=this.hzbDownPipeline,this.hzbFirstMsPipeline=o(le(!0)),this.pickDepthPipeline=o(Te(!1)),this.pickDepthMsPipeline=o(Te(!0)),this.itemPick.init(a),this.pickParamsBuf=a.createBuffer({label:`pickParamsBuf`,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.pickOutBuf=a.createBuffer({label:`pickOutBuf`,size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.vbaoPipeline=o(De(!1)),this.vbaoMsPipeline=o(De(!0));let s=a.createShaderModule({label:`snapModule`,code:Ae()}),c=(e,t)=>({binding:e,visibility:GPUShaderStage.COMPUTE,buffer:{type:t}});this.snapBGL=a.createBindGroupLayout({entries:[c(0,`storage`),c(1,`read-only-storage`),c(2,`read-only-storage`),c(3,`read-only-storage`),c(4,`read-only-storage`),c(5,`read-only-storage`),c(6,`read-only-storage`),c(7,`uniform`),c(8,`uniform`)]});let l=a.createPipelineLayout({bindGroupLayouts:[this.snapBGL]});this.snapMinPipeline=a.createComputePipeline({label:`snapMinPipeline`,layout:l,compute:{module:s,entryPoint:`snapMin`}}),this.snapWritePipeline=a.createComputePipeline({label:`snapWritePipeline`,layout:l,compute:{module:s,entryPoint:`snapWrite`}}),this.snapResultBuf=a.createBuffer({label:`snapResultBuf`,size:128,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this.snapStagingBuf=a.createBuffer({label:`snapStagingBuf`,size:128,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),this.snapParamsBuf=a.createBuffer({label:`snapParamsBuf`,size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.aoParamsBuf=a.createBuffer({label:`aoParamsBuf`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.cull1ParamsBind=a.createBindGroup({label:`cull1ParamsBind`,layout:this.cull1Pipeline.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.paramsBuf}},{binding:3,resource:{buffer:this.clipBuf}}]}),this.cullVp1ParamsBind=a.createBindGroup({label:`cullVp1ParamsBind`,layout:this.cullVp1Pipeline.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.paramsBuf}},{binding:3,resource:{buffer:this.clipBuf}}]}),this.renderBGL=a.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`,hasDynamicOffset:!0,minBindingSize:192}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:`read-only-storage`}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{type:`read-only-storage`}},{binding:3,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`read-only-storage`}},{binding:4,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}},{binding:5,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}},{binding:6,visibility:GPUShaderStage.VERTEX,buffer:{type:`read-only-storage`}},{binding:7,visibility:GPUShaderStage.VERTEX,buffer:{type:`read-only-storage`}}]});let u=a.createPipelineLayout({bindGroupLayouts:[this.renderBGL]}),d=a.createShaderModule({label:`renderModule`,code:be(!0)}),f=(e,t=!1)=>[e&&!t?{format:this.format,blend:{color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`zero`,dstFactor:`one`}}}:{format:this.format},{format:`rgba8unorm`,writeMask:e?0:15},{format:`rgba8unorm`,writeMask:e?0:15}],p=(e,t=!1,n=!1)=>a.createRenderPipeline({label:`renderPipeline`,layout:u,vertex:{module:d,entryPoint:`vs`,buffers:[{arrayStride:8,attributes:[{shaderLocation:0,offset:0,format:`uint16x4`}]}]},fragment:{module:d,entryPoint:`fs`,targets:f(t,n)},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:`depth32float`,depthWriteEnabled:!t||n,depthCompare:`greater`},multisample:{count:e}});this.renderPipeline1x=p(1),this.renderPipeline4x=p(4),this.renderBlend1x=p(1,!0),this.renderBlend4x=p(4,!0),this.renderBackdrop1x=p(1,!0,!0),this.renderBackdrop4x=p(4,!0,!0),this.pickPipeline=a.createRenderPipeline({label:`pickPipeline`,layout:u,vertex:{module:d,entryPoint:`vs`,buffers:[{arrayStride:8,attributes:[{shaderLocation:0,offset:0,format:`uint16x4`}]}]},fragment:{module:d,entryPoint:`fs_pick`,targets:[{format:`rgba8unorm`}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:`depth32float`,depthWriteEnabled:!0,depthCompare:`greater`}}),this.vpGeoBGL=a.createBindGroupLayout({entries:[0,1,2,3].map(e=>({binding:e,visibility:GPUShaderStage.VERTEX,buffer:{type:`read-only-storage`}}))});let m=a.createPipelineLayout({bindGroupLayouts:[this.renderBGL,this.vpGeoBGL]}),h=a.createShaderModule({label:`vpModule`,code:xe()}),g=(e,t=!1,n=!1)=>a.createRenderPipeline({label:`renderVpPipeline`,layout:m,vertex:{module:h,entryPoint:`vs`},fragment:{module:h,entryPoint:`fs`,targets:f(t,n)},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:`depth32float`,depthWriteEnabled:!t||n,depthCompare:`greater`},multisample:{count:e}});this.renderVpPipeline1x=g(1),this.renderVpPipeline4x=g(4),this.renderVpBlend1x=g(1,!0),this.renderVpBlend4x=g(4,!0),this.renderVpBackdrop1x=g(1,!0,!0),this.renderVpBackdrop4x=g(4,!0,!0),this.pickVpPipeline=a.createRenderPipeline({label:`pickVpPipeline`,layout:m,vertex:{module:h,entryPoint:`vs`},fragment:{module:h,entryPoint:`fs_pick`,targets:[{format:`rgba8unorm`}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:`depth32float`,depthWriteEnabled:!0,depthCompare:`greater`}});let _=a.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:`uniform`}}]}),v=a.createShaderModule({label:`lineModule`,code:Ce()}),y={format:`rgba8unorm`,writeMask:GPUColorWrite.ALPHA,blend:{color:{operation:`add`,srcFactor:`zero`,dstFactor:`one`},alpha:{operation:`max`,srcFactor:`one`,dstFactor:`one`}}},b=e=>a.createRenderPipeline({label:`linePipeline`,layout:a.createPipelineLayout({bindGroupLayouts:[_]}),vertex:{module:v,entryPoint:`vs`,buffers:[{arrayStride:16,attributes:[{shaderLocation:0,offset:0,format:`float32x4`}]}]},fragment:{module:v,entryPoint:`fs`,targets:[{format:this.format},y,{format:`rgba8unorm`,writeMask:0}]},primitive:{topology:`line-list`},depthStencil:{format:`depth32float`,depthWriteEnabled:!1,depthCompare:`greater`},multisample:{count:e}});this.linePipeline1x=b(1),this.linePipeline4x=b(4),this.lineBind=a.createBindGroup({label:`lineBind`,layout:_,entries:[{binding:0,resource:{buffer:this.frameBuf}}]});let x=Ge(12,24);this.sphereMeshBuf=a.createBuffer({label:`sphereMesh`,size:x.positions.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),a.queue.writeBuffer(this.sphereMeshBuf,0,x.positions),this.sphereIndexBuf=a.createBuffer({label:`sphereIndex`,size:x.indices.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),a.queue.writeBuffer(this.sphereIndexBuf,0,x.indices),this.sphereIndexCount=x.indices.length;let S=a.createShaderModule({label:`markerModule`,code:we()}),C=a.createBindGroupLayout({label:`markerBGL`,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});this.markerBind=a.createBindGroup({label:`markerBind`,layout:C,entries:[{binding:0,resource:{buffer:this.frameBuf}}]});let w=(e,t)=>a.createRenderPipeline({label:`markerPipeline`,layout:a.createPipelineLayout({bindGroupLayouts:[C]}),vertex:{module:S,entryPoint:`vs`,buffers:[{arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:`float32x3`}]},{arrayStride:32,stepMode:`instance`,attributes:[{shaderLocation:1,offset:0,format:`float32x3`},{shaderLocation:2,offset:12,format:`float32`},{shaderLocation:3,offset:16,format:`float32x4`}]}]},fragment:{module:S,entryPoint:`fs`,targets:[t?{format:this.format,blend:{color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`zero`,dstFactor:`one`}}}:{format:this.format},y,{format:`rgba8unorm`,writeMask:0}]},primitive:{topology:`triangle-list`,cullMode:`back`},depthStencil:{format:`depth32float`,depthWriteEnabled:!t,depthCompare:`greater`},multisample:{count:e}});this.markerPipelines={opaque1x:w(1,!1),opaque4x:w(4,!1),blend1x:w(1,!0),blend4x:w(4,!0)},this.viewCube.init(a,this.format);let T=e=>{let t=a.createShaderModule({label:`postModule`,code:Oe(e)});return a.createRenderPipeline({label:`postPipeline`,layout:`auto`,vertex:{module:t,entryPoint:`vs`},fragment:{module:t,entryPoint:`fs`,targets:[{format:this.format},{format:`rgba16float`}]},primitive:{topology:`triangle-list`}})};this.postPipeline=T(!1),this.postMsPipeline=T(!0),this.outline.init(a,this.format,u,d,m,h)}pickTarget=(e,t,n)=>{this.queuePick(e,t,n?`fly`:`pivot`)};attachInput(e){this.camera.attach(e,this.pickTarget)}feedInput(e){this.camera.handleInput(e,this.pickTarget)}buildModelResources(e,t,n,r,i,a){let o=this.device,{positionsQ:s,indices16:c,cull:l,meshletInfo:u,cgColors:d}=e,f=e.meshletCount,p=e.triangleCount,m=Ve(e),h=(e,t,n)=>{let r=e instanceof ArrayBuffer?e:e.buffer,i=e.byteLength,a=e instanceof ArrayBuffer?0:e.byteOffset,s=o.createBuffer({label:`modelBuf`,size:n,usage:t|GPUBufferUsage.COPY_DST});return o.queue.writeBuffer(s,0,r,a,i),s},g=h(s,GPUBufferUsage.VERTEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,m.vertex),_=h(c,GPUBufferUsage.INDEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,m.index),v=h(d,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,m.cgColor),y=h(l,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,m.meshletCull),b=o.createBuffer({label:`modelBuf`,size:m.vis,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),x=()=>o.createBuffer({label:`modelRecordBuf`,size:m.record,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.INDIRECT}),S=x(),C=x(),w=x(),T=o.createBuffer({label:`modelCandBuf`,size:m.cand,usage:GPUBufferUsage.STORAGE}),E=o.createBuffer({label:`modelSortBuf`,size:m.sort,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),D=o.createBuffer({label:`modelSortArgsBuf`,size:m.sortArgs,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.INDIRECT}),O=(e,t,n,r)=>o.createBindGroup({label:`cullBind`,layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:t}},{binding:2,resource:{buffer:this.countsBuf,offset:n,size:r}},{binding:3,resource:{buffer:b}},{binding:4,resource:{buffer:j}},{binding:5,resource:{buffer:M}},{binding:6,resource:{buffer:this.transformsBuf}},{binding:7,resource:{buffer:P}},{binding:8,resource:{buffer:v}},{binding:9,resource:{buffer:T}},{binding:10,resource:{buffer:E}}]}),k=o.createBindGroup({label:`sortScanBind`,layout:this.sortScanPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:E}},{binding:1,resource:{buffer:this.countsBuf,offset:a,size:20}},{binding:2,resource:{buffer:D}}]}),A=(e,t)=>o.createBindGroup({label:`sortScatterBind`,layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:T}},{binding:1,resource:{buffer:E}},{binding:2,resource:{buffer:w}},...t?[]:[{binding:3,resource:{buffer:y}}]]}),j=h(u,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,m.meshletInfo),M=o.createBuffer({label:`itemStateBuf`,size:m.itemState,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),N=new ArrayBuffer(80);new Uint32Array(N,0,4).set([n,0,+!!e.normalsQ,+(t.edges===!1)]),new Float32Array(N,16,16).set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);let P=h(N,GPUBufferUsage.UNIFORM,m.modelUni),F=h(e.normalsQ??new Uint32Array(1),GPUBufferUsage.STORAGE,m.normal),I=o.createBindGroup({label:`renderBind`,layout:this.renderBGL,entries:[{binding:0,resource:{buffer:this.frameBuf,size:192}},{binding:1,resource:{buffer:v}},{binding:2,resource:{buffer:j}},{binding:3,resource:{buffer:M}},{binding:4,resource:{buffer:P}},{binding:5,resource:{buffer:this.clipBuf}},{binding:6,resource:{buffer:this.transformsBuf}},{binding:7,resource:{buffer:F}}]}),L=new Uint32Array(f);for(let e=0;e<f;e++)L[e]=e;let R=h(L,GPUBufferUsage.STORAGE,m.fullList),z=h(new Uint32Array([372,f,0,0]),GPUBufferUsage.INDIRECT,m.fullArgs),B=e=>o.createBindGroup({label:`vpGeoBind`,layout:this.vpGeoBGL,entries:[{binding:0,resource:{buffer:e}},{binding:1,resource:{buffer:y}},{binding:2,resource:{buffer:_}},{binding:3,resource:{buffer:g}}]});return{name:e.name,meshletCount:f,triangleCount:p,bytes:He(e),vertexBuf:g,indexBuf:_,cgColorBuf:v,meshletCullBuf:y,recordBuf1:S,recordBuf2:C,recordBufT:w,candBuf:T,sortBuf:E,sortArgsBuf:D,visBuf:b,meshletInfoBuf:j,itemStateBuf:M,normalBuf:F,modelUniBuf:P,itemBase:n,itemCount:e.itemCount,cullBind1:O(this.cull1Pipeline,S,r,4),cullBind2:O(this.cull2Pipeline,C,i,4),cullVpBind1:O(this.cullVp1Pipeline,S,r,16),cullVpBind2:O(this.cullVp2Pipeline,C,i,16),sortScanBind:k,sortScatterBind:A(this.sortScatterPipeline,!1),sortScatterVpBind:A(this.sortScatterVpPipeline,!0),renderBind:I,vpGeoBind1:B(S),vpGeoBind2:B(C),vpGeoBindT:B(w),vpGeoBindFull:B(R),fullListBuf:R,fullArgsBuf:z,countOffset1:r,countOffset2:i,countOffsetT:a,transparent:it(d)}}uploadModel(e,t={}){if(this.models.length>=ct)throw Error(`model limit reached`);let n=this.models.length,r=n*256*3,i=r+256,a=r+512,o=this.nextItemBase;this.nextItemBase+=e.itemCount,this.models.push(this.buildModelResources(e,t,o,r,i,a));for(let t=0;t<3;t++)this.sceneMin[t]=Math.min(this.sceneMin[t],e.boundsMin[t]),this.sceneMax[t]=Math.max(this.sceneMax[t],e.boundsMax[t]),this.denseMin[t]=Math.min(this.denseMin[t],(e.denseMin??e.boundsMin)[t]),this.denseMax[t]=Math.max(this.denseMax[t],(e.denseMax??e.boundsMax)[t]);if(!this.hadFirstFit){this.hadFirstFit=!0,this.camera.setView(3*Math.PI/4,-.61);let e=this.fitTarget;this.camera.fit(e.min,e.max)}return n}reviveModel(e,t,n={}){let r=this.models[e];if(!r?.dead)throw Error(`reviveModel: slot ${e} is not a tombstone`);if(t.itemCount!==r.itemCount)throw Error(`itemcount-mismatch: slot ${e} has ${r.itemCount}, packed has ${t.itemCount}`);this.models[e]=this.buildModelResources(t,n,r.itemBase,r.countOffset1,r.countOffset2,r.countOffsetT),n.quiet||(this.lastKey=``,this.stateVersion++)}traceKeyChange(e,t){let n=e.split(`;`),r=t.split(`;`),i=n.findIndex((e,t)=>e!==r[t]),a=i<0?`(length)`:`#${i}`;console.debug(`[render] re-render at rest — key segment ${a}: ${n[i]??``} → ${r[i]??``}`)}modelBytes(e){let t=this.models[e];return!t||t.dead?0:t.bytes}modelMeshletCount(e){let t=this.models[e];return!t||t.dead?0:t.meshletCount}get stats(){let e=0,t=0;for(let n of this.models)n.dead||(e+=n.meshletCount,t+=n.triangleCount);return{models:this.models.filter(e=>!e.dead).length,meshlets:e,tris:t}}dispose(){this.device?.destroy()}simulateDeviceLoss(){this.simulatingLoss=!0,this.device.destroy()}reserveTombstone(e){this.hadFirstFit=!0;let t=this.uploadModel(rt(e));return this.removeModels([t],{quiet:!0}),t}writeItemStates(e,t=!1){let n=this.models[e.model];!n||n.dead||(n.transparent=e.transparent,this.device.queue.writeBuffer(n.itemStateBuf,0,e.states,0,Math.min(e.states.length,n.itemCount*3)),t||this.stateVersion++)}setSelectionTransform(e){for(let t of this.models)t.dead||(this.device.queue.writeBuffer(t.modelUniBuf,4,new Uint32Array([+!!e])),e&&this.device.queue.writeBuffer(t.modelUniBuf,16,e,0,16));this.stateVersion++}writeTransforms(e){this.device.queue.writeBuffer(this.transformsBuf,0,e,0,Math.min(e.length,65536)),this.stateVersion++}liveModels(){return this.models.map((e,t)=>({index:t,name:e.name,dead:e.dead})).filter(e=>!e.dead)}async readModelGeometry(e){let t=this.models[e];if(!t||t.dead)return null;let n=this.device,r=[t.vertexBuf,t.indexBuf,t.meshletCullBuf,t.meshletInfoBuf,t.cgColorBuf],i=r.map(e=>n.createBuffer({label:`modelReadbackStaging`,size:e.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})),a=n.createCommandEncoder();r.forEach((e,t)=>{a.copyBufferToBuffer(e,0,i[t],0,e.size)}),n.queue.submit([a.finish()]),await Promise.all(i.map(e=>e.mapAsync(GPUMapMode.READ)));let[o,s,c,l,u]=i.map(e=>{let t=e.getMappedRange().slice(0);return e.unmap(),e.destroy(),t});return{name:t.name,meshletCount:t.meshletCount,positionsQ:o,indices16:s,cull:c,meshletInfo:l,cgColors:u}}async readMeshletFill(){let e=this.device,t=[];for(let n of this.models){if(n.dead||n.meshletCount===0)continue;let r=[n.meshletCullBuf,n.meshletInfoBuf].map(t=>e.createBuffer({label:`fillStatsStaging`,size:t.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})),i=e.createCommandEncoder();i.copyBufferToBuffer(n.meshletCullBuf,0,r[0],0,n.meshletCullBuf.size),i.copyBufferToBuffer(n.meshletInfoBuf,0,r[1],0,n.meshletInfoBuf.size),e.queue.submit([i.finish()]),await Promise.all(r.map(e=>e.mapAsync(GPUMapMode.READ)));let a=new Uint32Array(r[0].getMappedRange()),o=new Uint32Array(r[1].getMappedRange()),s=Array(8).fill(0),c=new Uint32Array(n.itemCount),l=0;for(let e=0;e<n.meshletCount;e++){let t=a[e*9+5]/3;l+=t,s[Math.min(7,Math.floor(t/16))]++;let r=o[e*8+7];r<n.itemCount&&(c[r]+=t)}let u=0,d=0;for(let e=0;e<n.itemCount;e++)c[e]!==0&&(u++,d+=Math.ceil(c[e]/124));for(let e of r)e.unmap(),e.destroy();t.push({name:n.name,meshlets:n.meshletCount,tris:l,hist:s,items:u,idealPerItem:d,idealCrossItem:Math.ceil(l/124),geoBytes:n.vertexBuf.size+n.indexBuf.size+n.normalBuf.size,recordBytes:n.meshletCount*144})}return t}itemFromGlobalId(e){if(e===0)return null;for(let t=0;t<this.models.length;t++){let n=this.models[t];if(e>=n.itemBase&&e<n.itemBase+n.itemCount)return{model:t,item:e-n.itemBase}}return null}removeModels(e,t={}){for(let t of e){let e=this.models[t];!e||e.dead||(e.vertexBuf.destroy(),e.indexBuf.destroy(),e.cgColorBuf.destroy(),e.meshletCullBuf.destroy(),e.recordBuf1.destroy(),e.recordBuf2.destroy(),e.recordBufT.destroy(),e.candBuf.destroy(),e.sortBuf.destroy(),e.sortArgsBuf.destroy(),e.visBuf.destroy(),e.meshletInfoBuf.destroy(),e.fullListBuf.destroy(),e.fullArgsBuf.destroy(),e.itemStateBuf.destroy(),e.normalBuf.destroy(),e.modelUniBuf.destroy(),e.dead=!0,e.meshletCount=0,e.triangleCount=0)}t.quiet||(this.lastKey=``)}clearModels(){for(let e of this.models)e.dead||(e.vertexBuf.destroy(),e.indexBuf.destroy(),e.cgColorBuf.destroy(),e.meshletCullBuf.destroy(),e.recordBuf1.destroy(),e.recordBuf2.destroy(),e.recordBufT.destroy(),e.candBuf.destroy(),e.sortBuf.destroy(),e.sortArgsBuf.destroy(),e.visBuf.destroy(),e.meshletInfoBuf.destroy(),e.fullListBuf.destroy(),e.fullArgsBuf.destroy(),e.itemStateBuf.destroy(),e.normalBuf.destroy(),e.modelUniBuf.destroy());this.models=[],this.nextItemBase=1,this.hadFirstFit=!1,this.sceneMin=[1/0,1/0,1/0],this.sceneMax=[-1/0,-1/0,-1/0],this.drawnPass1=0,this.drawnPass2=0,this.lastKey=``}trace(e){this.options.traceKey&&this.onTrace&&this.onTrace(e())}async resolvePick(e,t){let n=this.pickBuf;await n.mapAsync(GPUMapMode.READ);let r=new Float32Array(n.getMappedRange())[0];n.unmap(),this.pickInFlight=!1,this.trace(()=>`${t.tag} depth=${r.toExponential(3)} +${(performance.now()-t.t).toFixed(0)}ms`);let i=e=>{this.probeResolve?.(e),this.probeResolve=null},a=e=>{this.measureResolve?.(e),this.measureResolve=null},o=A(t.vp);if(r<=lt||!o){this.trace(()=>`${t.tag} ${o?`background`:`degenerate view`} → null`),i(null),a(null);return}let s=O(o,t.w,t.h,e.x,e.y,r);if(!s){this.trace(()=>`${t.tag} unproject degenerate → null`),i(null),a(null);return}if(this.trace(()=>`${t.tag} unproject=${Z(s)}`),this.lastClickWorld=s,e.mode===`measure`){let n=await this.raycastMeasure(e.x,e.y,t).catch(e=>(this.trace(()=>`${t.tag} raycast threw: ${String(e)}`),null)),r=n??{point:s,normal:null,edgeDir:null,kind:`face`};this.trace(()=>{let i=this.hostCanvas,a=j(t.vp,t.w,t.h,r.point),o=j(this.lastVP,i.width,i.height,r.point),c=t=>t?Math.hypot(t[0]-e.x-.5,t[1]-e.y-.5).toFixed(1):`-`;return`${t.tag} result ${r.kind}${n?``:` (depth fallback)`} point=${Z(r.point)} Δdepth=${X(ot(r.point,s))}m reproj@encode=${at(a)} Δ${c(a)}px reproj@now=${at(o)} Δ${c(o)}px total=${(performance.now()-t.t).toFixed(0)}ms gpuError=${this.gpuError||`none`}`}),a(r)}else i(s),e.mode===`fly`?this.camera.flyTo(s):e.mode===`pivot`&&this.camera.rePivot(s)}async raycastMeasure(e,t,n){if(this.snapInFlight||this.models.length===0)return this.trace(()=>`${n.tag} raycast skipped: ${this.snapInFlight?`a cast is still in flight`:`no models`}`),null;let r=k(n,e,t);if(!r)return this.trace(()=>`${n.tag} raycast skipped: degenerate view`),null;this.trace(()=>`${n.tag} ray origin=${Z(r.origin)} dir=${Z(r.dir)}`),this.snapInFlight=!0;try{let i=await this.castSnapRay(r,0,!1);if(this.trace(()=>`${n.tag} cast1 ${st(i)} +${(performance.now()-n.t).toFixed(0)}ms`),i&&this.options.traceKey&&this.onTrace&&await this.traceCastReads(n.tag,i),!i)return null;let a=this.measureSnap,o=e=>j(n.vp,n.w,n.h,e),s=Be(i.A,i.B,i.C,i.u,i.v,r.dir,e,t,a,o);if(this.trace(()=>`${n.tag} classify ${s.kind} point=${Z(s.point)} snap=${JSON.stringify(a)}`),!a.enabled||!a.seam||s.kind===`corner`||Pe(i.flags,i.color))return s;let c=await this.castSnapRay(r,i.item,!0);this.trace(()=>`${n.tag} cast2 ${st(c)}`);let l=c?ze(i,c,r,e,t,a,o,e=>this.pixelFootprint(e)):null;return l?(this.trace(()=>`${n.tag} seam ${l.kind} point=${Z(l.point)}`),l.kind===`corner`||s.kind===`face`?l:s):s}finally{this.snapInFlight=!1}}pixelFootprint(e){let t=this.hostCanvas.height,n=Math.tan(this.camera.fovY/2);return this.options.orthographic?2*this.camera.focusDist*n/t:2*e*n/t}async traceCastReads(e,t){let n=this.lastCastWords,r=this.itemFromGlobalId(t.item-1)??this.itemFromGlobalId(t.item),i=n[16],a=n[17],o=e=>e.toString(16).padStart(8,`0`),s=e=>`(${e.map(e=>e.toPrecision(4)).join(`, `)})`,c=Array.from(new Float32Array(n.buffer,108,3));if(this.trace(()=>`${e} gpu read: model=${r?.model??`?`} mi=${i} tri=${a} idx=(${n[18]},${n[19]},${n[20]}) base_vertex=${n[30]} first_index=${n[31]} scale=${s(c)} rawv A=${o(n[21])}/${o(n[22])} B=${o(n[23])}/${o(n[24])} C=${o(n[25])}/${o(n[26])}`),!r)return;let l=await this.readModelGeometry(r.model);if(!l)return;let u=new Uint32Array(l.cull),d=new Uint32Array(l.meshletInfo),f=new Float32Array(l.meshletInfo),p=new Uint16Array(l.indices16),m=new Uint16Array(l.positionsQ),h=u[i*9+5],g=u[i*9+6],_=u[i*9+8],v=[f[i*8],f[i*8+1],f[i*8+2]],y=[f[i*8+4],f[i*8+5],f[i*8+6]],b=[0,1,2].map(e=>p[g+a*3+e]),x=b.map(e=>[m[(_+e)*4],m[(_+e)*4+1],m[(_+e)*4+2]]),S=x.map(e=>[v[0]+e[0]*y[0],v[1]+e[1]*y[1],v[2]+e[2]*y[2]]);this.trace(()=>`${e} cpu read: meshlets=${l.meshletCount} mi=${i} item=${d[i*8+7]} index_count=${h} first_index=${g} base_vertex=${_} idx=(${b.join(`,`)}) min=${Z(v)} scale=${s(y)} q=${x.map(e=>`(${e.join(`,`)})`).join(` `)} A=${Z(S[0])} B=${Z(S[1])} C=${Z(S[2])}`)}async castSnapRay(e,t,n){let r=this.device,i=new ArrayBuffer(48),a=new Float32Array(i);a.set(e.origin,0),a.set(e.dir,4),new Uint32Array(i,32,4).set([t,+!!n,0,0]),r.queue.writeBuffer(this.snapParamsBuf,0,i);let o=new Uint32Array(32);o[0]=4294967295,r.queue.writeBuffer(this.snapResultBuf,0,o);let s=r.createCommandEncoder(),c=s.beginComputePass();for(let e of[this.snapMinPipeline,this.snapWritePipeline]){c.setPipeline(e);for(let e of this.models)e.dead||e.meshletCount===0||(e.snapBind??=r.createBindGroup({label:`modelSnapBind`,layout:this.snapBGL,entries:[{binding:0,resource:{buffer:this.snapResultBuf}},{binding:1,resource:{buffer:e.meshletCullBuf}},{binding:2,resource:{buffer:e.meshletInfoBuf}},{binding:3,resource:{buffer:e.indexBuf}},{binding:4,resource:{buffer:e.vertexBuf}},{binding:5,resource:{buffer:e.itemStateBuf}},{binding:6,resource:{buffer:this.transformsBuf}},{binding:7,resource:{buffer:this.snapParamsBuf}},{binding:8,resource:{buffer:e.modelUniBuf}}]}),c.setBindGroup(0,e.snapBind),c.dispatchWorkgroups(Math.ceil(e.meshletCount/64)))}c.end(),s.copyBufferToBuffer(this.snapResultBuf,0,this.snapStagingBuf,0,128),r.queue.submit([s.finish()]),await this.snapStagingBuf.mapAsync(GPUMapMode.READ);let l=new Uint32Array(this.snapStagingBuf.getMappedRange()).slice();if(this.snapStagingBuf.unmap(),this.lastCastWords=l,l[1]===0)return null;let u=new Float32Array(l.buffer);return{t:u[0],u:u[2],v:u[3],A:[u[4],u[5],u[6]],B:[u[7],u[8],u[9]],C:[u[10],u[11],u[12]],item:l[13],flags:l[14],color:l[15]}}sortFar(e){let t=this.camera.near;if(!Number.isFinite(this.sceneMin[0]))return t*2**20;let n=0;for(let t=0;t<3;t++){let r=Math.max(Math.abs(this.sceneMin[t]-e[t]),Math.abs(this.sceneMax[t]-e[t]));n+=r*r}return Math.max(Math.sqrt(n),t*2)}async resolveStats(e,t){await this.statsBuf.mapAsync(GPUMapMode.READ,0,e);let n=new Uint32Array(this.statsBuf.getMappedRange(0,e));this.drawnPerModel.length<this.models.length&&(this.drawnPerModel=new Uint32Array(this.models.length));let r=0,i=0,a=0;for(let e=0;e<this.models.length;e++){let o=e*256*3/4,s=n[o+t],c=n[o+64+t],l=n[o+128+4];this.drawnPerModel[e]=s+c+l,r+=s,i+=c,a+=l}this.statsBuf.unmap(),this.statsInFlight=!1,this.drawnPass1=r,this.drawnPass2=i,this.drawnBlend=a,this.drawnResolvedT=this.lastCountRead}async resolveCapBudget(){await this.newBudgetReadBuf.mapAsync(GPUMapMode.READ,0,4),this.newVisibleWanted=new Uint32Array(this.newBudgetReadBuf.getMappedRange(0,4))[0],this.newBudgetReadBuf.unmap();let e=this.capReadFrame;this.capReadInFlight=!1;let t=Math.max(0,Math.floor(this.options.newMeshletCap));if(this.capBacklog=t>0&&this.newVisibleWanted>=t,e<=this.keyChangeFrame){this.zeroNewReads=0;return}this.capReadFresh=!0,this.zeroNewReads=this.newVisibleWanted===0?this.zeroNewReads+1:0}rebuildTargets(e,t,n,r,i){let a=this.device;this.depth?.destroy(),this.sceneColor?.destroy(),this.msColor?.destroy(),this.normalTex?.destroy(),this.idTex?.destroy(),this.msColor=null,this.normalTex=null,this.idTex=null,this.targetsMsaa=n,this.depth=a.createTexture({label:`depthTex`,size:[e,t],format:`depth32float`,sampleCount:n?4:1,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|(n?0:GPUTextureUsage.COPY_SRC)}),this.sceneColor=a.createTexture({label:`sceneColorTex`,size:[e,t],format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),n&&(this.msColor=a.createTexture({label:`msColorTex`,size:[e,t],format:this.format,sampleCount:4,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}));let o=r=>a.createTexture({label:`gbufTex`,size:[e,t],format:`rgba8unorm`,sampleCount:n?4:1,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|(r&&!n?GPUTextureUsage.COPY_SRC:0)});this.normalTex=o(!1),this.idTex=o(!0),this.pickDepthBind=a.createBindGroup({label:`pickDepthBind`,layout:(n?this.pickDepthMsPipeline:this.pickDepthPipeline).getBindGroupLayout(0),entries:[{binding:0,resource:this.depth.createView()},{binding:1,resource:{buffer:this.pickParamsBuf}},{binding:2,resource:{buffer:this.pickOutBuf}}]}),this.rebuildPostTargets(e,t,n,r,i),this.rebuildHzb(e,t,n)}rebuildPostTargets(e,t,n,r,i){let a=this.device;this.histA?.destroy(),this.histB?.destroy(),this.targetsPost=r,this.targetsAo=i,this.accumIdx=0,this.aoTex?.destroy(),this.aoHist?.destroy();let o=()=>a.createTexture({label:`aoTex`,size:i?[e,t]:[1,1],format:`r32float`,usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING});this.aoTex=o(),this.aoHist=o(),this.aoAccum=0,this.aoBind=a.createBindGroup({label:`aoBind`,layout:(n?this.vbaoMsPipeline:this.vbaoPipeline).getBindGroupLayout(0),entries:[{binding:0,resource:this.depth.createView()},{binding:1,resource:this.aoTex.createView()},{binding:2,resource:this.aoHist.createView()},{binding:3,resource:{buffer:this.aoParamsBuf}}]});let s=()=>a.createTexture({label:`histTex`,size:r?[e,t]:[1,1],format:`rgba16float`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});this.histA=s(),this.histB=s();let c=e=>a.createBindGroup({label:`postBind`,layout:(n?this.postMsPipeline:this.postPipeline).getBindGroupLayout(0),entries:[{binding:0,resource:this.sceneColor.createView()},{binding:1,resource:this.depth.createView()},{binding:2,resource:{buffer:this.postParamsBuf}},{binding:3,resource:e.createView()},{binding:4,resource:this.normalTex.createView()},{binding:5,resource:this.idTex.createView()},{binding:6,resource:this.aoTex.createView()},...n?[{binding:7,resource:this.msColor.createView()}]:[]]});this.postBindEven=c(this.histA),this.postBindOdd=c(this.histB)}rebuildHzb(e,t,n){let r=this.device;this.hzb?.destroy();let i=Math.max(1,e>>1),a=Math.max(1,t>>1);this.hzbMipCount=Math.floor(Math.log2(Math.max(i,a)))+1,this.hzb=r.createTexture({label:`hzbTex`,size:[i,a],format:`r32float`,mipLevelCount:this.hzbMipCount,usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),this.hzbBinds=[],this.hzbMipSizes=[];for(let e=0;e<this.hzbMipCount;e++){let t=n?this.hzbFirstMsPipeline:this.hzbFirstPipeline,o=e===0?this.depth.createView():this.hzb.createView({baseMipLevel:e-1,mipLevelCount:1});this.hzbBinds.push(r.createBindGroup({label:`hzbBind`,layout:(e===0?t:this.hzbDownPipeline).getBindGroupLayout(0),entries:[{binding:0,resource:o},{binding:1,resource:this.hzb.createView({baseMipLevel:e,mipLevelCount:1})}]})),this.hzbMipSizes.push([Math.max(1,i>>e),Math.max(1,a>>e)])}this.cull2ParamsBind=r.createBindGroup({label:`cull2ParamsBind`,layout:this.cull2Pipeline.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.paramsBuf}},{binding:1,resource:this.hzb.createView()},{binding:2,resource:{buffer:this.newBudgetBuf}},{binding:3,resource:{buffer:this.clipBuf}}]}),this.cullVp2ParamsBind=r.createBindGroup({label:`cullVp2ParamsBind`,layout:this.cullVp2Pipeline.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.paramsBuf}},{binding:1,resource:this.hzb.createView()},{binding:2,resource:{buffer:this.newBudgetBuf}},{binding:3,resource:{buffer:this.clipBuf}}]})}frame(){let e=this.hostCanvas,t=performance.now(),n=this.device,r=this.options;this.timings.enabled=!!r.gpuTimings;let i=this.viewport.cssW*this.dpr*this.captureScale|0,a=this.viewport.cssH*this.dpr*this.captureScale|0;(i!==this.pendingW||a!==this.pendingH)&&(this.pendingW=i,this.pendingH=a,this.pendingSizeT=t);let o=(!this.depth||t-this.pendingSizeT>=80)&&(e.width!==i||e.height!==a);o&&(e.width=i,e.height=a);let s=r.geoEdges||r.itemEdges||r.sketch,c=r.fastAA||s||r.msaa4x||r.debugBuf>0||r.aoMode!==0,l=r.aoMode!==0||r.debugBuf===5;o||!this.depth||this.targetsMsaa!==r.msaa4x?this.rebuildTargets(e.width,e.height,r.msaa4x,c,l):(this.targetsPost!==c||this.targetsAo!==l)&&this.rebuildPostTargets(e.width,e.height,r.msaa4x,c,l);let u=performance.now();if(this.camera.update(Math.min(.1,(u-this.lastFrame)/1e3)),this.lastFrame=u,this.camera.ortho=r.orthographic,r.orthographic){let e=this.camera.eye(),t=this.camera.forward(),n=1/0,r=-1/0;for(let i=0;i<8;i++){let a=(i&1?this.sceneMax:this.sceneMin)[0]-e[0],o=(i&2?this.sceneMax:this.sceneMin)[1]-e[1],s=(i&4?this.sceneMax:this.sceneMin)[2]-e[2],c=a*t[0]+o*t[1]+s*t[2];n=Math.min(n,c),r=Math.max(r,c)}Number.isFinite(n)||(n=.1,r=100);let i=Math.max(r-n,1)*.05+.5;this.camera.orthoNear=n-i,this.camera.orthoFar=r+i}let d=this.camera.viewProj(e.width/e.height),f=`${d.join(`,`)};${e.width}x${e.height};${this.models.length}`,p=f!==this.lastVpKey;this.lastVpKey=f,p&&(this.lastMoveT=performance.now());let m=p||this.wasMoving?Math.max(r.pxCut,r.pxCutAlways):r.pxCutAlways;this.wasMoving=p;let h=`${f};${m};${r.meshletVis};${r.protectDist};${r.fastAA};${r.msaa4x};${r.freezeCull};${r.geoEdges};${r.itemEdges};${r.sketch};${r.edgeColor.join(`,`)};${r.fadeExp};${r.depthThr};${r.normalThr};${r.whiteOnDark};${r.darkThr};${r.darkFloor};${r.debugBuf};${r.smoothDepthThr};${r.smoothNormalThr};${r.smoothFadeExp};${r.flatMeshEdges};${r.smoothMeshEdges};${r.sketchRespectsEdgesOff};${r.sketchColorMode};${r.sketchFillStrength};${r.aoMode};${r.aoRadius};${r.aoStrength};${r.aoSlices};${r.aoSamples};${r.bgColor.join(`,`)};${r.ambientColor.join(`,`)};${r.ambientIntensity};${r.headlightColor.join(`,`)};${r.headlightIntensity};${r.vertexPull};${r.selectionColor.join(`,`)};${r.suppressTintOnOverride};${this.stateVersion};${this.clipVersion};${r.transparencyBlend};${r.transparencyBackdrop};${r.backdropFade};${r.hasTransparency};${r.aaSamples};${r.outlineHover};${r.outlineSelection};${r.selectionTint};${r.outlineStrength};${r.outlineGlow};${r.outlineThickness};${r.outlinePulse};${r.outlineSelectionActive};${r.outlineVisibleColor.join(`,`)};${r.outlineHiddenColor.join(`,`)};`+this.viewCube.stateKey,g=r.outlineHover?this.hoverItemId:0,_=this.models.length>0&&(g!==0||r.outlineSelection&&r.outlineSelectionActive),v=r.outlineHover&&g!==this.drawnHoverId||_&&r.outlinePulse>0,y=this.holdAccumulation;y&&!this.wasHoldingAccum?this.heldAtHoldStart=this.heldFrames:!y&&this.wasHoldingAccum&&this.heldFrames!==this.heldAtHoldStart&&(this.lastKey=``),this.wasHoldingAccum=y,r.traceKey&&!p&&this.lastKey!==``&&h!==this.lastKey&&this.traceKeyChange(this.lastKey,h);let b=this.drawCountsUsable&&this.models.length>0,x=this.frameCounter-this.keyChangeFrame>=Math.max(0,Math.floor(r.settleFrames))||this.capReadFresh&&performance.now()-this.keyChangeT>=500,S=!b||this.zeroNewReads>=2||x,C=!1;if(h===this.lastKey){let t=y||!r.fastAA||this.accumIdx>=this.aaMax-1,n=y||r.aoMode===0||this.aoAccum>=this.aaMax-1;if(t&&n&&S&&!this.pendingSnap&&!v&&!this.capBacklog){(this.pendingPick||this.itemPick.hasPending)&&this.submitPicksOnly(e),this.idle=!0,this.frames=0,this.lastStat=performance.now();return}!t&&r.fastAA&&this.accumIdx++,!n&&r.aoMode!==0&&this.aoAccum++,C=c&&t&&n&&S&&!this.capBacklog}else this.accumIdx=0,this.aoAccum=0,this.accumResets++,this.keyChangeFrame=this.frameCounter,this.keyChangeT=performance.now(),this.zeroNewReads=0,this.capReadFresh=!1;this.lastKey=h,this.idle=!1,this.frameCounter++,C||(this.sceneFrames++,y&&this.heldFrames++),this.accumCount=r.fastAA?this.accumIdx+1:0;let w=(!r.fastAA||this.accumIdx>=this.aaMax-1)&&(r.aoMode===0||this.aoAccum>=this.aaMax-1);this.lastVP.set(d);let T=0,E=0;if(r.fastAA){let t=(e,t)=>{let n=1,r=0;for(;e>0;)n/=t,r+=e%t*n,e=Math.floor(e/t);return r};T=(t(this.accumIdx+1,2)-.5)*2/e.width,E=(t(this.accumIdx+1,3)-.5)*2/e.height;for(let e=0;e<4;e++)d[e*4+0]+=T*d[e*4+3],d[e*4+1]+=E*d[e*4+3]}let D=this.camera.eye(),O=[Math.round(D[0]),Math.round(D[1]),Math.round(D[2])],k=this.camera.viewProjRelative(e.width/e.height,O);for(let e=0;e<4;e++)k[e*4+0]+=T*k[e*4+3],k[e*4+1]+=E*k[e*4+3];let A=new ArrayBuffer(192),j=new Float32Array(A);j.set(k,M.viewProj),j.set([...O,0],M.origin),j[M.darkFloor]=r.darkFloor,j.set([D[0]-O[0],D[1]-O[1],D[2]-O[2],1],M.eye);let N=new Uint32Array(A);N[M.flags]=+!!r.meshletVis,N[M.flags+1]=+!!r.suppressTintOnOverride,N[M.flags+2]=+!!r.transparencyBlend,N[M.flags+3]=this.accumIdx;let P=this.camera.forward();j.set([-P[0],-P[1],-P[2],+!!r.orthographic],M.light),j.set([...r.ambientColor,r.ambientIntensity],M.ambient),j.set([...r.headlightColor,r.headlightIntensity],M.headlight),j.set([...r.selectionColor,+!!r.selectionTint],M.selColor),j.set([...r.bgColor,r.backdropFade],M.backdrop),n.queue.writeBuffer(this.frameBuf,0,A);let F=r.vertexPull?`vp`:this.multiDraw?`mdi`:`full`;this.cullMode=F;let I=r.transparencyBlend&&r.hasTransparency&&F!==`full`;N[M.flags+2]|=(r.transparencyBackdrop?6:2)|(I?8:0),n.queue.writeBuffer(this.frameBuf,256,A),this.lastFrameData=A;let L=F!==`full`&&this.models.length>0&&!r.freezeCull&&!C;if(L){let t=new ArrayBuffer(240),i=new Float32Array(t);i.set(this.frustumPlanes(d),0),i.set(this.camera.lastView,24),i.set([...D,1],40),i[44]=this.camera.lastP00,i[45]=this.camera.lastP11,i[46]=this.camera.near,i[47]=this.hzbMipCount,i[48]=this.hzbMipSizes[0]?.[0]??1,i[49]=this.hzbMipSizes[0]?.[1]??1,i[50]=m,i[51]=r.protectDist,i[52]=e.height,new Uint32Array(t)[53]=+!!r.orthographic,i[54]=this.camera.orthoNear,i[55]=this.camera.orthoFar,new Uint32Array(t)[56]=+!!I,i[57]=this.sortFar(D),new Uint32Array(t)[58]=Math.max(0,Math.floor(r.newMeshletCap)),n.queue.writeBuffer(this.paramsBuf,0,t)}let R=!y&&(r.aoMode===1||r.aoMode===2&&!p&&this.models.length>0);if(R&&!this.aoRanLastFrame&&(this.aoAccum=0),this.aoRanLastFrame=R,c){let e=new ArrayBuffer(80),t=new Uint32Array(e),i=new Float32Array(e);t[0]=this.accumIdx,t[1]=this.accumIdx+1;let a=r.debugBuf===4;t[2]=(r.geoEdges||a||r.sketch?1:0)|(r.itemEdges||a||r.sketch?2:0)|(r.fastAA?4:0)|(r.whiteOnDark?8:0)|(r.debugBuf&7)<<4|(R||r.debugBuf===5?256:0)|(r.orthographic?512:0)|(C&&r.fastAA?1024:0)|(r.sketch?2048:0)|(r.smoothMeshEdges?0:4096)|(r.flatMeshEdges?0:8192)|(r.sketchRespectsEdgesOff?16384:0)|(r.sketch&&r.sketchColorMode===`fill`?32768:0)|(r.sketch&&r.sketchColorMode===`edges`?65536:0),i[3]=this.camera.near,i.set([...r.edgeColor,1],4),i[8]=r.depthThr,i[9]=r.normalThr,i[10]=r.fadeExp,i[11]=r.darkThr,i[12]=r.debugBuf===5?0:r.aoStrength,i[13]=this.camera.orthoNear,i[14]=this.camera.orthoFar,i[15]=this.camera.focusDist,i[16]=r.smoothDepthThr,i[17]=r.smoothNormalThr,i[18]=r.smoothFadeExp,i[19]=r.sketchFillStrength,n.queue.writeBuffer(this.postParamsBuf,0,e)}if(R||r.debugBuf===5){let t=new ArrayBuffer(64),i=new Float32Array(t),a=new Uint32Array(t);i[0]=1/e.width,i[1]=1/e.height,i[2]=r.aoRadius,i[3]=.1,a[4]=this.aoAccum,a[5]=Math.max(1,r.aoSlices),a[6]=Math.max(1,Math.min(12,r.aoSamples)),i[7]=1/(this.aoAccum+1),i[8]=this.camera.near,i[9]=.5,i[10]=this.camera.lastP00,i[11]=this.camera.lastP11,a[12]=+!!r.orthographic,i[13]=this.camera.orthoHalfH,i[14]=this.camera.orthoNear,i[15]=this.camera.orthoFar,n.queue.writeBuffer(this.aoParamsBuf,0,t)}let z=n.createCommandEncoder(),B=this.context.getCurrentTexture(),ee=B.createView(),te=c?this.sceneColor.createView():ee,ne={r:r.bgColor[0],g:r.bgColor[1],b:r.bgColor[2],a:1},re=r.msaa4x?this.renderPipeline4x:this.renderPipeline1x,ie=r.transparencyBlend&&r.hasTransparency&&this.models.length>0&&!r.sketch,V=(e,t)=>{let n=e?`clear`:`load`;return[r.msaa4x?{view:this.msColor.createView(),...t?{resolveTarget:te}:{},clearValue:ne,loadOp:n,storeOp:`store`}:{view:te,clearValue:ne,loadOp:n,storeOp:`store`},{view:this.normalTex.createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:n,storeOp:`store`},{view:this.idTex.createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:n,storeOp:`store`}]},ae=e=>({view:this.depth.createView(),depthClearValue:0,depthLoadOp:e?`clear`:`load`,depthStoreOp:`store`}),oe=r.msaa4x?this.renderVpPipeline4x:this.renderVpPipeline1x,se=(e,t)=>r.msaa4x?t:e,ce=r.transparencyBackdrop?se(this.renderBackdrop1x,this.renderBackdrop4x):se(this.renderBlend1x,this.renderBlend4x),le=r.transparencyBackdrop?se(this.renderVpBackdrop1x,this.renderVpBackdrop4x):se(this.renderVpBlend1x,this.renderVpBlend4x),fe=(e,t,n=!1)=>{let r=[n?256:0];if(F===`mdi`){e.setPipeline(n?ce:re);for(let i of this.models){if(i.dead||i.meshletCount===0||n&&!i.transparent)continue;e.setBindGroup(0,i.renderBind,r),e.setVertexBuffer(0,i.vertexBuf),e.setIndexBuffer(i.indexBuf,`uint16`);let{buf:a,offset:o}=ue(i,t);e.multiDrawIndexedIndirect(a,0,i.meshletCount,this.countsBuf,o)}}else{e.setPipeline(n?le:oe);for(let i of this.models)i.dead||i.meshletCount===0||n&&!i.transparent||(e.setBindGroup(0,i.renderBind,r),F===`vp`?(e.setBindGroup(1,ue(i,t).vpBind),e.drawIndirect(this.countsBuf,de(i,t))):(e.setBindGroup(1,i.vpGeoBindFull),e.drawIndirect(i.fullArgsBuf,0)))}},pe=t=>{if(!ie)return;let n=t.beginRenderPass({colorAttachments:V(!1,!0),depthStencilAttachment:ae(!1),timestampWrites:this.timings.writes(6)});r.transparencyBackdrop&&n.setViewport(0,0,e.width,e.height,0,lt),fe(n,F===`full`?1:3,!0),n.end()};if(!C){if(F!==`full`&&this.models.length>0){let e=F===`vp`;if(L){if(z.clearBuffer(this.countsBuf,0,this.models.length*256*3),z.clearBuffer(this.newBudgetBuf),I)for(let e of this.models)!e.dead&&e.meshletCount>0&&e.transparent&&z.clearBuffer(e.sortBuf,0,8196);let t=z.beginComputePass({timestampWrites:this.timings.writes(0)});t.setPipeline(e?this.cullVp1Pipeline:this.cull1Pipeline),t.setBindGroup(1,e?this.cullVp1ParamsBind:this.cull1ParamsBind);for(let n of this.models)n.dead||n.meshletCount===0||(t.setBindGroup(0,e?n.cullVpBind1:n.cullBind1),t.dispatchWorkgroups(Math.ceil(n.meshletCount/64)));t.end()}let t=z.beginRenderPass({colorAttachments:V(!0,!1),depthStencilAttachment:ae(!0),timestampWrites:this.timings.writes(1)});if(fe(t,1),t.end(),L){let t=z.beginComputePass({timestampWrites:this.timings.writes(2)});for(let e=0;e<this.hzbMipCount;e++){t.setPipeline(e===0?r.msaa4x?this.hzbFirstMsPipeline:this.hzbFirstPipeline:this.hzbDownPipeline),t.setBindGroup(0,this.hzbBinds[e]);let[n,i]=this.hzbMipSizes[e];t.dispatchWorkgroups(Math.ceil(n/8),Math.ceil(i/8))}t.end();let n=z.beginComputePass({timestampWrites:this.timings.writes(3)});n.setPipeline(e?this.cullVp2Pipeline:this.cull2Pipeline),n.setBindGroup(1,e?this.cullVp2ParamsBind:this.cull2ParamsBind);for(let t of this.models)t.dead||t.meshletCount===0||(n.setBindGroup(0,e?t.cullVpBind2:t.cullBind2),n.dispatchWorkgroups(Math.ceil(t.meshletCount/64)));if(n.end(),I){let t=z.beginComputePass({timestampWrites:this.timings.span(4,`begin`)});t.setPipeline(this.sortScanPipeline);for(let e of this.models)e.dead||e.meshletCount===0||!e.transparent||(t.setBindGroup(0,e.sortScanBind),t.dispatchWorkgroups(1));t.end();let n=z.beginComputePass({timestampWrites:this.timings.span(4,`end`)});n.setPipeline(e?this.sortScatterVpPipeline:this.sortScatterPipeline);for(let t of this.models)t.dead||t.meshletCount===0||!t.transparent||(n.setBindGroup(0,e?t.sortScatterVpBind:t.sortScatterBind),n.dispatchWorkgroupsIndirect(t.sortArgsBuf,0));n.end()}}let n=z.beginRenderPass({colorAttachments:V(!1,!ie),depthStencilAttachment:ae(!1),timestampWrites:this.timings.writes(5)});fe(n,2),this.drawHelperLines(n,r.msaa4x),this.drawMarkerSpheres(n,r.msaa4x),n.end(),pe(z)}else{let e=z.beginRenderPass({colorAttachments:V(!0,!ie),depthStencilAttachment:ae(!0),timestampWrites:this.timings.writes(1)});fe(e,1),this.drawHelperLines(e,r.msaa4x),this.drawMarkerSpheres(e,r.msaa4x),e.end(),pe(z)}}if(!C&&(R||r.debugBuf===5&&this.aoAccum===0)){let t=z.beginComputePass({timestampWrites:this.timings.writes(7)});t.setPipeline(r.msaa4x?this.vbaoMsPipeline:this.vbaoPipeline),t.setBindGroup(0,this.aoBind),t.dispatchWorkgroups(Math.ceil(e.width/8),Math.ceil(e.height/8)),t.end()}if(c){let e=this.accumIdx%2==0!==C,t=z.beginRenderPass({timestampWrites:this.timings.writes(8),colorAttachments:[{view:ee,loadOp:`clear`,storeOp:`store`},{view:(e?this.histB:this.histA).createView(),loadOp:`clear`,storeOp:`store`}]});t.setPipeline(r.msaa4x?this.postMsPipeline:this.postPipeline),t.setBindGroup(0,e?this.postBindEven:this.postBindOdd),t.draw(3),t.end()}this.drawnHoverId=g,_&&this.outline.encode(z,n,e,r,F,A,this.frameBuf,this.countsBuf,this.models,this.depth,ee,g,this.timings),this.viewCube.draw(z,ee,e,this.format,this.dpr*this.captureScale,!!(this.options.msaa4x||this.options.fastAA),this.timings);let me=this.encodeDepthPick(z,n),he=0,ge=t-this.lastCountRead>500||this.accumIdx===0&&!p;L&&!this.statsInFlight&&ge&&(this.statsInFlight=!0,this.lastCountRead=t,he=this.models.length*256*3,z.copyBufferToBuffer(this.countsBuf,0,this.statsBuf,0,he));let _e=!1;L&&!this.capReadInFlight&&(this.capReadInFlight=!0,this.capReadFrame=this.frameCounter,_e=!0,z.copyBufferToBuffer(this.newBudgetBuf,0,this.newBudgetReadBuf,0,4));let ve=this.itemPick.encode(z,n,e,r,F,A,this.frameBuf,this.countsBuf,this.models,this.pickPipeline,this.pickVpPipeline,this.timings,this.pickGbuffer()),ye=this.encodeSnapshot(z,n,e,w,B),be=this.timings.resolve(z);n.queue.submit([z.finish()]),this.awaitGpu(n),me?.(),ye?.(),ve?.(),be?.(),_e?this.resolveCapBudget().catch(()=>this.capReadInFlight=!1):L||(this.capBacklog=!1,this.newVisibleWanted=0),he>0&&this.resolveStats(he,+(F===`vp`)).catch(()=>this.statsInFlight=!1),this.cpuMs=this.cpuMs*.9+(performance.now()-t)*.1,this.frames++;let xe=performance.now();xe-this.lastStat>500&&(this.fps=this.frames*1e3/(xe-this.lastStat),this.frames=0,this.lastStat=xe)}awaitGpu(e){this.gpuBusy=!0;let t=()=>{this.gpuBusy=!1};e.queue.onSubmittedWorkDone().then(t,t)}pickGbuffer(){return this.idTex&&this.depth?{id:this.idTex,depth:this.depth,msaa:this.targetsMsaa}:null}submitPicksOnly(e){let t=this.device,n=t.createCommandEncoder({label:`picksOnly`}),r=this.encodeDepthPick(n,t),i=this.itemPick.encode(n,t,e,this.options,this.cullMode,this.lastFrameData,this.frameBuf,this.countsBuf,this.models,this.pickPipeline,this.pickVpPipeline,this.timings,this.pickGbuffer());if(!r&&!i)return;let a=this.timings.resolve(n);t.queue.submit([n.finish()]),this.awaitGpu(t),r?.(),i?.(),a?.()}encodeDepthPick(e,t){if(!this.pendingPick||this.pickInFlight||!this.pickDepthBind)return null;let n=this.pendingPick;this.pendingPick=null,t.queue.writeBuffer(this.pickParamsBuf,0,new Uint32Array([n.x,n.y,0,0]));let r=e.beginComputePass({label:`pickDepth`});r.setPipeline(this.targetsMsaa?this.pickDepthMsPipeline:this.pickDepthPipeline),r.setBindGroup(0,this.pickDepthBind),r.dispatchWorkgroups(1),r.end(),this.pickBuf??=t.createBuffer({label:`pickBuf`,size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),e.copyBufferToBuffer(this.pickOutBuf,0,this.pickBuf,0,4),this.pickInFlight=!0;let i=this.currentView(`pick#${++this.pickSeq}`);return this.trace(()=>`${i.tag} encode ${n.mode} px=(${n.x},${n.y}) target=${i.w}x${i.h} dpr=${this.dpr} msaa=${this.targetsMsaa} cull=${this.cullMode} models=${this.models.length} gpuError=${this.gpuError||`none`}`),()=>this.resolvePick(n,i).catch(()=>this.pickInFlight=!1)}encodeSnapshot(e,t,n,r,i){let a=null;if(this.pendingSnap&&r){let r=this.pendingSnap;this.pendingSnap=null;let o=Math.ceil(n.width*4/256)*256,s=t.createBuffer({label:`snapBuf`,size:o*n.height,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.copyTextureToBuffer({texture:i},{buffer:s,bytesPerRow:o},[n.width,n.height]);let c=n.width,l=n.height,u=this.format.startsWith(`bgra`);a=async()=>{await s.mapAsync(GPUMapMode.READ);let e=new Uint8Array(s.getMappedRange()),t=new Uint8ClampedArray(c*l*4);for(let n=0;n<l;n++)for(let r=0;r<c;r++){let i=n*o+r*4,a=(n*c+r)*4;t[a+0]=e[i+(u?2:0)],t[a+1]=e[i+1],t[a+2]=e[i+(u?0:2)],t[a+3]=255}s.destroy(),r({w:c,h:l,rgba:t})}}return a}setViewCube(e,t,n){this.viewCube.setPlacement(e,t,n)}setViewCubeLabels(e){this.viewCube.setLabels(e)}setViewCubeColors(e,t,n,r){this.viewCube.setColors(e,t,n,r)}drawHelperLines(e,t){this.lineCount===0||!this.lineBuf||(e.setPipeline(t?this.linePipeline4x:this.linePipeline1x),e.setBindGroup(0,this.lineBind),e.setVertexBuffer(0,this.lineBuf),e.draw(this.lineCount))}drawMarkerSpheres(e,t){if(this.markerCount===0||!this.markerBuf)return;let n=this.markerPipelines;e.setBindGroup(0,this.markerBind),e.setVertexBuffer(0,this.sphereMeshBuf),e.setVertexBuffer(1,this.markerBuf),e.setIndexBuffer(this.sphereIndexBuf,`uint16`),this.markerOpaque>0&&(e.setPipeline(t?n.opaque4x:n.opaque1x),e.drawIndexed(this.sphereIndexCount,this.markerOpaque));let r=this.markerCount-this.markerOpaque;r>0&&(e.setPipeline(t?n.blend4x:n.blend1x),e.drawIndexed(this.sphereIndexCount,r,0,0,this.markerOpaque))}frustumPlanes(e){let t=new Float32Array(24),n=t=>[e[t],e[4+t],e[8+t],e[12+t]],r=n(3),i=(e,n,i)=>{let a=r[0]+i*n[0],o=r[1]+i*n[1],s=r[2]+i*n[2],c=r[3]+i*n[3],l=Math.hypot(a,o,s)||1;t[e*4]=a/l,t[e*4+1]=o/l,t[e*4+2]=s/l,t[e*4+3]=c/l};return i(0,n(0),1),i(1,n(0),-1),i(2,n(1),1),i(3,n(1),-1),i(4,n(2),1),i(5,n(2),-1),t}};let Q=null,dt=null,ft=0,pt=60,mt=0,ht=!1,gt=!1;function _t(e){dt?.postMessage(e)}function vt(e){let t=e.camera;return{target:t.target,azimuth:t.azimuth,elevation:t.elevation,orbitDistance:t.orbitDistance,fovY:t.fovY,ortho:t.ortho,orthoNear:t.orthoNear,orthoFar:t.orthoFar,navMode:t.navMode,lastInputT:t.lastInputT,pointerActive:t.pointerActive,animating:t.animating,spaceHeld:t.spaceHeld,seq:ft}}function yt(e){return{camera:vt(e),multiDraw:e.multiDraw,adapterInfo:e.adapterInfo,adapterHints:e.adapterHints,adapterLimits:e.adapterLimits,cullMode:e.cullMode,gpuError:e.gpuError,lost:e.lost,vramBuffers:e.vramBuffers,vramTextures:e.vramTextures,newVisibleWanted:e.newVisibleWanted,drawnPass1:e.drawnPass1,drawnPass2:e.drawnPass2,drawnBlend:e.drawnBlend,aaMax:e.aaMax,accumCount:e.accumCount,idle:e.idle,fps:e.fps,cpuMs:e.cpuMs,gpuBusy:e.gpuBusy,gpuTimingSupported:e.gpuTimingSupported,gpuTimes:e.gpuTimes,lastClickWorld:e.lastClickWorld,sceneBounds:e.sceneBounds,stats:e.stats,viewProjMatrix:e.viewProjMatrix,viewportCss:e.viewportCss,backingSize:e.backingSize,adapterFacts:e.adapterFacts,fitTarget:e.fitTarget,drawCountsUsable:e.drawCountsUsable,drawnPerModel:e.drawnPerModel,lastMoveT:e.lastMoveT,frameCounter:e.frameCounter,sceneFrames:e.sceneFrames,accumResets:e.accumResets,heldFrames:e.heldFrames,gpuMsTotal:e.gpuMsTotal,drawnResolvedT:e.drawnResolvedT,modelBytesTotal:e.modelBytesTotal}}function bt(e){requestAnimationFrame(bt);let t=Q;if(!t||t.lost||gt||t.gpuBusy)return;let n=1e3/pt;e-mt<n-.5||(mt=e-mt>n*2?e:mt+n,t.frame(),_t({kind:`mirror`,mirror:yt(t)}))}function $(){if(!Q)throw Error(`render worker not initialized`);return Q}c({async init(e,t,n){dt=t,t.onmessage=e=>{Q?.feedInput(e.data)};let r=new ut;return r.gpuPreference=n,await r.init(e),r.onLost=e=>_t({kind:`lost`,message:e}),r.onTrace=e=>_t({kind:`trace`,line:e}),r.camera.onMoveKey=()=>_t({kind:`moveKey`}),r.camera.onOrbitIntent=()=>_t({kind:`orbitIntent`}),Q=r,ht||(ht=!0,requestAnimationFrame(bt)),{adapterInfo:r.adapterInfo,multiDraw:r.multiDraw,mirror:yt(r)}},setPaused(e){gt=e},setHoldAccumulation(e){Q&&(Q.holdAccumulation=e)},setFitDense(e){Q&&(Q.fitDense=e)},setFpsLimit(e){pt=Math.max(1,e)},setViewportSize(e){Q?.setViewportSize(e)},setOptions(e){Q&&Object.assign(Q.options,e)},camera(e,t){ft=t;let n=$().camera;switch(e.m){case`rePivot`:n.rePivot(e.a);break;case`flyTo`:n.flyTo(e.a);break;case`snapView`:n.snapView(e.a[0],e.a[1],e.a[2]);break;case`setView`:n.setView(e.a[0],e.a[1]);break;case`setPose`:n.setPose(e.a[0],e.a[1],e.a[2],e.a[3]);break;case`goToPose`:n.goToPose(e.a[0],e.a[1],e.a[2],e.a[3],e.a[4]);break;case`dolly`:n.dolly(e.a[0],e.a[1],e.a[2]);break;case`fit`:n.fit(e.a[0],e.a[1]);break;case`claimPointer`:n.claimPointer(e.a);break;case`releasePointer`:n.releasePointer(e.a);break;case`settings`:Object.assign(n,e.a)}},cameraSettled(e){return $().camera.settled(e)},uploadModel(e,t){$().uploadModel(e,t)},reviveModel(e,t,n){$().reviveModel(e,t,n)},reserveTombstone(e){$().reserveTombstone(e)},removeModels(e,t){$().removeModels(e,t)},clearModels(){$().clearModels()},liveModels(){return $().liveModels()},readModelGeometry(e){return $().readModelGeometry(e)},readMeshletFill(){return $().readMeshletFill()},writeItemStates(e,t){$().writeItemStates(e,t)},writeTransforms(e){$().writeTransforms(e)},setSelectionTransform(e){$().setSelectionTransform(e)},setClip(e){$().setClip(e)},setHelperLines(e,t){$().setHelperLines(e,t)},setMarkerSpheres(e,t,n){$().setMarkerSpheres(e,t,n)},setViewCube(...e){$().setViewCube(...e)},setViewCubeLabels(...e){$().setViewCubeLabels(...e)},setViewCubeColors(...e){$().setViewCubeColors(...e)},setHoverItem(e){$().setHoverItem(e)},fitBounds(e,t){$().fitBounds(e,t)},markViewChosen(){$().markViewChosen()},pickItem(e,t,n){return $().pickItem(e,t,n)},probeWorld(e,t){$().probeWorld(e,t)},probeWorldAsync(e,t){return $().probeWorldAsync(e,t)},probeMeasureAsync(...e){return $().probeMeasureAsync(...e)},snapshot(){return $().snapshot()},snapshotHiRes(e){return $().snapshotHiRes(e)},simulateDeviceLoss(){$().simulateDeviceLoss()},dispose(){Q?.dispose(),Q=null}})})();