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
(function(){let e=(async()=>(await(await navigator.storage.getDirectory()).getDirectoryHandle(`temp`,{create:!0})).getDirectoryHandle(`rvm-import`,{create:!0}))(),t=0,n=[],r=Promise.resolve(),i=new Map;async function a(t){let n=i.get(t);if(n)return n;let r=await(await(await e).getFileHandle(t,{create:!0})).createSyncAccessHandle();return r.truncate(0),i.set(t,r),r}async function o(e,t,r){try{(await a(e)).write(new Uint8Array(r),{at:t})}catch(t){n.push(`${e}: ${t instanceof Error?t.message:t}`)}}async function s(e,r){let a=i.get(e);if(i.delete(e),a)try{a.truncate(r),a.flush(),t++}catch(t){n.push(`${e}: ${t instanceof Error?t.message:t}`)}finally{a.close()}}self.onmessage=e=>{let i=e.data;if(`flush`in i){r.then(()=>self.postMessage({flushed:t,errors:n}));return}if(`end`in i){r=r.then(()=>s(i.name,i.end));return}r=r.then(()=>o(i.name,i.at,i.bytes))}})();