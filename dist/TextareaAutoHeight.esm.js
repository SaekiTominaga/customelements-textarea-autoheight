var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _supportCSSTypedOM;
/**
 * Automatically adjust the height of the `<textarea>` element according to the input content.
 *
 * @version 1.0.1
 */
export default class TextareaAutoheight extends HTMLTextAreaElement {
    constructor() {
        super();
        _supportCSSTypedOM.set(this, void 0); // CSS Typed Object Model に対応しているか https://caniuse.com/mdn-api_element_attributestylemap
        __classPrivateFieldSet(this, _supportCSSTypedOM, this.attributeStyleMap !== undefined);
    }
    connectedCallback() {
        this._inputEvent();
        this.addEventListener('input', this._inputEvent, { passive: true });
    }
    disconnectedCallback() {
        this.removeEventListener('input', this._inputEvent);
    }
    /**
     * 入力時の処理
     */
    _inputEvent() {
        if (__classPrivateFieldGet(this, _supportCSSTypedOM)) {
            this.attributeStyleMap.set('height', 'unset');
            let heightPx = this.scrollHeight;
            const textareaComputedStyleMap = this.computedStyleMap();
            switch (textareaComputedStyleMap.get('box-sizing')?.value) {
                case 'border-box': {
                    const borderTopWidthPx = textareaComputedStyleMap.get('border-top-width');
                    if (borderTopWidthPx !== undefined) {
                        heightPx += borderTopWidthPx.value;
                    }
                    const borderBottomWidthPx = textareaComputedStyleMap.get('border-bottom-width');
                    if (borderBottomWidthPx !== undefined) {
                        heightPx += borderBottomWidthPx.value;
                    }
                    break;
                }
            }
            this.attributeStyleMap.set('height', CSS.px(heightPx));
        }
        else {
            this.style.height = 'unset';
            let heightPx = this.scrollHeight;
            const textareaComputedStyle = getComputedStyle(this, '');
            switch (textareaComputedStyle.boxSizing) {
                case 'border-box': {
                    const borderTopWidthPx = Number.parseInt(textareaComputedStyle.borderTopWidth);
                    if (!Number.isNaN(borderTopWidthPx)) {
                        heightPx += borderTopWidthPx;
                    }
                    const borderBottomWidthPx = Number.parseInt(textareaComputedStyle.borderBottomWidth);
                    if (!Number.isNaN(borderBottomWidthPx)) {
                        heightPx += borderBottomWidthPx;
                    }
                    break;
                }
            }
            this.style.height = `${heightPx}px`;
        }
    }
}
_supportCSSTypedOM = new WeakMap();
