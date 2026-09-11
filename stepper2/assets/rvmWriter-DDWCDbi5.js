/*!
 * TreDeSpace Web Viewer v0.0.112
 * Copyright (c) 2026 Vegar Ringdal. All rights reserved.
 *
 * Use of the hosted application is permitted as-is. Redistribution of this
 * code or a reconstructed form of it, publication of the model format or
 * derived tools to compete with the application, and use of this code or its
 * data for machine-learning training or text and data mining are not
 * permitted. Rights under mandatory law (incl. decompilation for
 * interoperability) are unaffected. See https://tredespace.com — LICENSE.
 */
(function(){let e=(async()=>(await(await navigator.storage.getDirectory()).getDirectoryHandle(`temp`,{create:!0})).getDirectoryHandle(`rvm-import`,{create:!0}))(),t=0,n=[],r=Promise.resolve();async function i(r,i){try{let n=await(await(await e).getFileHandle(r,{create:!0})).createSyncAccessHandle();try{n.truncate(0),n.write(new Uint8Array(i),{at:0}),n.flush()}finally{n.close()}t++}catch(e){n.push(`${r}: ${e instanceof Error?e.message:e}`)}}self.onmessage=e=>{let a=e.data;if(`flush`in a){r.then(()=>self.postMessage({flushed:t,errors:n}));return}r=r.then(()=>i(a.name,a.bytes))}})();