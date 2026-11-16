/*!
 * TreDeSpace Web Viewer v0.0.158
 * Copyright (c) 2026 Vegar Ringdal. All rights reserved.
 *
 * Use of the hosted application is permitted as-is. Redistribution of this
 * code or a reconstructed form of it, publication of the model format or
 * derived tools to compete with the application, and use of this code or its
 * data for machine-learning training or text and data mining are not
 * permitted. Rights under mandatory law (incl. decompilation for
 * interoperability) are unaffected. See https://tredespace.com — LICENSE.
 */
(function(){let e=Promise.reject(/* @__PURE__ */ Error(`no directory named yet`));e.catch(()=>void 0);async function t(e){return(await(await navigator.storage.getDirectory()).getDirectoryHandle(`temp`,{create:!0})).getDirectoryHandle(e,{create:!0})}let n=0,r=[],i=Promise.resolve(),a=/* @__PURE__ */ new Map;async function o(t){let n=a.get(t);if(n)return n;let r=await(await(await e).getFileHandle(t,{create:!0})).createSyncAccessHandle();return r.truncate(0),a.set(t,r),r}async function s(e,t,n){try{(await o(e)).write(new Uint8Array(n),{at:t})}catch(t){r.push(`${e}: ${t instanceof Error?t.message:t}`)}}async function c(e,t){let i=a.get(e);if(a.delete(e),i)try{i.truncate(t),i.flush(),n++}catch(t){r.push(`${e}: ${t instanceof Error?t.message:t}`)}finally{i.close()}}self.onmessage=a=>{let o=a.data;`dir`in o?e=t(o.dir):`flush`in o?i.then(()=>self.postMessage({flushed:n,errors:r})):i=`end`in o?i.then(()=>c(o.name,o.end)):i.then(()=>s(o.name,o.at,o.bytes))}})();