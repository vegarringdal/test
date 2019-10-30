(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./reflowStrategy", "../reflow-strategy/rerenderInnerHTML"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const reflowStrategy_1 = require("./reflowStrategy");
    const rerenderInnerHTML_1 = require("../reflow-strategy/rerenderInnerHTML");
    exports.createHookElementChangeListener = (reflowStrategy = reflowStrategy_1.ReflowStrategy.RERENDER_INNER_HTML, reflowDelayMs = 250, onCustomElementChangeListener) => {
        let timer;
        let elementsChanged = [];
        if (!onCustomElementChangeListener) {
            onCustomElementChangeListener = () => { };
        }
        return (elementName, impl, options) => {
            onCustomElementChangeListener(elementName, impl, options);
            if (reflowStrategy && reflowStrategy === reflowStrategy_1.ReflowStrategy.RERENDER_INNER_HTML) {
                elementsChanged.push(elementName);
                clearTimeout(timer);
                timer = setTimeout(() => {
                    rerenderInnerHTML_1.rerenderInnerHTML();
                    elementsChanged = [];
                }, reflowDelayMs);
            }
        };
    };
});
//# sourceMappingURL=createHookElementChangeListener.js.map