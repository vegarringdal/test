var et=new WeakMap,N=i=>typeof i=="function"&&et.has(i);var D=typeof window!="undefined"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0,V=(i,t,s=null)=>{for(;t!==s;){let e=t.nextSibling;i.removeChild(t),t=e}};var d={},$={};var m=`{{lit-${String(Math.random()).slice(2)}}}`,F=`<!--${m}-->`,j=new RegExp(`${m}|${F}`),A="$lit$",M=class{constructor(t,s){this.parts=[],this.element=s;let e=[],n=[],r=document.createTreeWalker(s.content,133,null,!1),a=0,o=-1,c=0,{strings:u,values:{length:C}}=t;for(;c<C;){let l=r.nextNode();if(l===null){r.currentNode=n.pop();continue}if(o++,l.nodeType===1){if(l.hasAttributes()){let h=l.attributes,{length:T}=h,_=0;for(let p=0;p<T;p++)W(h[p].name,A)&&_++;for(;_-- >0;){let p=u[c],v=P.exec(p)[2],y=v.toLowerCase()+A,b=l.getAttribute(y);l.removeAttribute(y);let f=b.split(j);this.parts.push({type:"attribute",index:o,name:v,strings:f}),c+=f.length-1}}l.tagName==="TEMPLATE"&&(n.push(l),r.currentNode=l.content)}else if(l.nodeType===3){let h=l.data;if(h.indexOf(m)>=0){let T=l.parentNode,_=h.split(j),p=_.length-1;for(let v=0;v<p;v++){let y,b=_[v];if(b==="")y=g();else{let f=P.exec(b);f!==null&&W(f[2],A)&&(b=b.slice(0,f.index)+f[1]+f[2].slice(0,-A.length)+f[3]),y=document.createTextNode(b)}T.insertBefore(y,l),this.parts.push({type:"node",index:++o})}_[p]===""?(T.insertBefore(g(),l),e.push(l)):l.data=_[p],c+=p}}else if(l.nodeType===8)if(l.data===m){let h=l.parentNode;(l.previousSibling===null||o===a)&&(o++,h.insertBefore(g(),l)),a=o,this.parts.push({type:"node",index:o}),l.nextSibling===null?l.data="":(e.push(l),o--),c++}else{let h=-1;for(;(h=l.data.indexOf(m,h+1))!==-1;)this.parts.push({type:"node",index:-1}),c++}}for(let l of e)l.parentNode.removeChild(l)}},W=(i,t)=>{let s=i.length-t.length;return s>=0&&i.slice(s)===t},st=i=>i.index!==-1,g=()=>document.createComment(""),P=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var L=class{constructor(t,s,e){this.__parts=[],this.template=t,this.processor=s,this.options=e}update(t){let s=0;for(let e of this.__parts)e!==void 0&&e.setValue(t[s]),s++;for(let e of this.__parts)e!==void 0&&e.commit()}_clone(){let t=D?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),s=[],e=this.template.parts,n=document.createTreeWalker(t,133,null,!1),r=0,a=0,o,c=n.nextNode();for(;r<e.length;){if(o=e[r],!st(o)){this.__parts.push(void 0),r++;continue}for(;a<o.index;)a++,c.nodeName==="TEMPLATE"&&(s.push(c),n.currentNode=c.content),(c=n.nextNode())===null&&(n.currentNode=s.pop(),c=n.nextNode());if(o.type==="node"){let u=this.processor.handleTextExpression(this.options);u.insertAfterNode(c.previousSibling),this.__parts.push(u)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,o.name,o.strings,this.options));r++}return D&&(document.adoptNode(t),customElements.upgrade(t)),t}};var Y=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:i=>i}),it=` ${m} `,O=class{constructor(t,s,e,n){this.strings=t,this.values=s,this.type=e,this.processor=n}getHTML(){let t=this.strings.length-1,s="",e=!1;for(let n=0;n<t;n++){let r=this.strings[n],a=r.lastIndexOf("<!--");e=(a>-1||e)&&r.indexOf("-->",a+1)===-1;let o=P.exec(r);o===null?s+=r+(e?it:F):s+=r.substr(0,o.index)+o[1]+o[2]+A+o[3]+m}return s+=this.strings[t],s}getTemplateElement(){let t=document.createElement("template"),s=this.getHTML();return Y!==void 0&&(s=Y.createHTML(s)),t.innerHTML=s,t}};var I=i=>i===null||!(typeof i=="object"||typeof i=="function"),H=i=>Array.isArray(i)||!!(i&&i[Symbol.iterator]),B=class{constructor(t,s,e){this.dirty=!0,this.element=t,this.name=s,this.strings=e,this.parts=[];for(let n=0;n<e.length-1;n++)this.parts[n]=this._createPart()}_createPart(){return new R(this)}_getValue(){let t=this.strings,s=t.length-1,e=this.parts;if(s===1&&t[0]===""&&t[1]===""){let r=e[0].value;if(typeof r=="symbol")return String(r);if(typeof r=="string"||!H(r))return r}let n="";for(let r=0;r<s;r++){n+=t[r];let a=e[r];if(a!==void 0){let o=a.value;if(I(o)||!H(o))n+=typeof o=="string"?o:String(o);else for(let c of o)n+=typeof c=="string"?c:String(c)}}return n+=t[s],n}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},R=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==d&&(!I(t)||t!==this.value)&&(this.value=t,N(t)||(this.committer.dirty=!0))}commit(){for(;N(this.value);){let t=this.value;this.value=d,t(this)}if(this.value===d)return;this.committer.commit()}},w=class{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(g()),this.endNode=t.appendChild(g())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=g()),t.__insert(this.endNode=g())}insertAfterPart(t){t.__insert(this.startNode=g()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;N(this.__pendingValue);){let s=this.__pendingValue;this.__pendingValue=d,s(this)}let t=this.__pendingValue;if(t===d)return;I(t)?t!==this.value&&this.__commitText(t):t instanceof O?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):H(t)?this.__commitIterable(t):t===$?(this.value=$,this.clear()):this.__commitText(t)}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){if(this.value===t)return;this.clear(),this.__insert(t),this.value=t}__commitText(t){let s=this.startNode.nextSibling;t=t==null?"":t;let e=typeof t=="string"?t:String(t);s===this.endNode.previousSibling&&s.nodeType===3?s.data=e:this.__commitNode(document.createTextNode(e)),this.value=t}__commitTemplateResult(t){let s=this.options.templateFactory(t);if(this.value instanceof L&&this.value.template===s)this.value.update(t.values);else{let e=new L(s,t.processor,this.options),n=e._clone();e.update(t.values),this.__commitNode(n),this.value=e}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let s=this.value,e=0,n;for(let r of t)n=s[e],n===void 0&&(n=new w(this.options),s.push(n),e===0?n.appendIntoPart(this):n.insertAfterPart(s[e-1])),n.setValue(r),n.commit(),e++;e<s.length&&(s.length=e,this.clear(n&&n.endNode))}clear(t=this.startNode){V(this.startNode.parentNode,t.nextSibling,this.endNode)}},q=class{constructor(t,s,e){if(this.value=void 0,this.__pendingValue=void 0,e.length!==2||e[0]!==""||e[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=s,this.strings=e}setValue(t){this.__pendingValue=t}commit(){for(;N(this.__pendingValue);){let s=this.__pendingValue;this.__pendingValue=d,s(this)}if(this.__pendingValue===d)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=d}},U=class extends B{constructor(t,s,e){super(t,s,e);this.single=e.length===2&&e[0]===""&&e[1]===""}_createPart(){return new z(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},z=class extends R{},Z=!1;(()=>{try{let i={get capture(){return Z=!0,!1}};window.addEventListener("test",i,i),window.removeEventListener("test",i,i)}catch(i){}})();var G=class{constructor(t,s,e){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=s,this.eventContext=e,this.__boundHandleEvent=n=>this.handleEvent(n)}setValue(t){this.__pendingValue=t}commit(){for(;N(this.__pendingValue);){let r=this.__pendingValue;this.__pendingValue=d,r(this)}if(this.__pendingValue===d)return;let t=this.__pendingValue,s=this.value,e=t==null||s!=null&&(t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive),n=t!=null&&(s==null||e);e&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),n&&(this.__options=nt(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=d}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},nt=i=>i&&(Z?{capture:i.capture,passive:i.passive,once:i.once}:i.capture);var J=class{handleAttributeExpressions(t,s,e,n){let r=s[0];if(r==="."){let o=new U(t,s.slice(1),e);return o.parts}if(r==="@")return[new G(t,s.slice(1),n.eventContext)];if(r==="?")return[new q(t,s.slice(1),e)];let a=new B(t,s,e);return a.parts}handleTextExpression(t){return new w(t)}},rt=new J;typeof window!="undefined"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.3.0");var ot=(i,...t)=>new O(i,t,"html",rt);function at(){globalThis._STD_SYMBOL||(globalThis._STD_SYMBOL={observedAttributesMap:Symbol("observedAttributesMap"),observedAttributes:Symbol("observedAttributes"),updateCallbackCallers:Symbol("updateCallbackCallers"),disconnectCallbackCaller:Symbol("disconnectCallbackCaller"),constructorDone:Symbol("constructorDone"),transmitter:Symbol("transmitter")},globalThis._PROP_SYMBOL={})}function x(){return globalThis._STD_SYMBOL}function S(){return x().observedAttributesMap}function K(){return x().observedAttributes}function k(){return x().updateCallbackCallers}function E(){return x().disconnectCallbackCaller}function lt(){return x().constructorDone}function Q(){return x().transmitter}at();function ct(i){let t=X.get(i.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},X.set(i.type,t));let s=t.stringsArray.get(i.strings);if(s!==void 0)return s;let e=i.strings.join(m);return s=t.keyString.get(e),s===void 0&&(s=new M(i,i.getTemplateElement()),t.keyString.set(e,s)),t.stringsArray.set(i.strings,s),s}var X=new Map;var tt=new WeakMap,dt=(i,t,s)=>{let e=tt.get(t);e===void 0&&(V(t,t.firstChild),tt.set(t,e=new w(Object.assign({templateFactory:ct},s))),e.appendInto(t)),e.setValue(i),e.commit()};function mt(i,t){return function(e){let n=e.observedAttributes;Object.defineProperty(e,"observedAttributes",{set:function(a){return e.prototype[K()]=a,!0},get:function(){return e.prototype[K()]},configurable:!0}),Array.isArray(n)&&Array.isArray(e.observedAttributes)&&(e.observedAttributes=e.observedAttributes.concat(n)),Array.isArray(n)&&!Array.isArray(e.observedAttributes)&&(e.observedAttributes=n);let r=class extends e{constructor(){super();this[k()]=[],this[E()]=[],this[lt()]=!0}render(...a){if(super.render){let o=super.render.call(this,...a);Promise.resolve(o).then(c=>{dt(c,this,{eventContext:this});let u=this[k()];(super.updatedCallback||u.length)&&requestAnimationFrame(()=>{u.length&&u.forEach(C=>C()),this[k()]=[],super.updatedCallback&&super.updatedCallback()})})}}adoptedCallback(){super.adoptedCallback&&super.adoptedCallback()}connectedCallback(){super.connectedCallback&&super.connectedCallback.call(this),this.render(this)}registerDisconnectCallback(a){this[E()].push(a)}registerUpdatedCallback(a){this[k()].push(a)}disconnectedCallback(){let a=this[E()];a.length&&a.forEach(o=>o()),this[k()]=[],this[E()]=[],super.disconnectedCallback&&super.disconnectedCallback.call(this)}attributeChangedCallback(a,o,c){if(!this[S()]){let C=a.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/\s+/g,"-").toLowerCase();this[S()]=new Map,this[S()].set(C,a)}let u=this[S()].get(a);this[u]=c||"",super.attributeChangedCallback&&super.attributeChangedCallback.call(this,a,o,c),super.valuesChangedCallback&&super.valuesChangedCallback("attribute",a,o,c)}};customElements.get(i)?globalThis.hmrCache&&(t?customElements.define(i,r,t):customElements.define(i,r)):t?customElements.define(i,r,t):customElements.define(i,r)}}globalThis[Q()]||(globalThis[Q()]={});var ut=window.state||{};window.state||(window.state={},window.addEventListener("SIMPLE_HTML_SAVE_STATE",()=>{window.state=ut,console.log("SIMPLE_HTML_HMR",window.state)}));export{et as a,lt as b,mt as c,ot as d};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
