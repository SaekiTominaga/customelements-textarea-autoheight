/**
 * Automatically adjust the height of the `<textarea>` element according to the input content.
 */
export default class TextareaAutoheight extends HTMLTextAreaElement {
	#supportCSSTypedOM: boolean; // CSS Typed Object Model に対応しているか https://caniuse.com/mdn-api_element_attributestylemap

	constructor() {
		super();

		this.#supportCSSTypedOM = this.attributeStyleMap !== undefined;
	}

	connectedCallback(): void {
		this._inputEvent();
		this.addEventListener('input', this._inputEvent, { passive: true });
	}

	disconnectedCallback(): void {
		this.removeEventListener('input', this._inputEvent);
	}

	/**
	 * 入力時の処理
	 */
	private _inputEvent() {
		if (this.#supportCSSTypedOM) {
			this.attributeStyleMap.set('height', 'unset');

			let heightPx = this.scrollHeight;

			const textareaComputedStyleMap = this.computedStyleMap();
			switch ((<CSSKeywordValue | undefined>textareaComputedStyleMap.get('box-sizing'))?.value) {
				case 'border-box': {
					const borderTopWidthPx = <CSSUnitValue | undefined>textareaComputedStyleMap.get('border-top-width');
					if (borderTopWidthPx !== undefined) {
						heightPx += borderTopWidthPx.value;
					}

					const borderBottomWidthPx = <CSSUnitValue | undefined>textareaComputedStyleMap.get('border-bottom-width');
					if (borderBottomWidthPx !== undefined) {
						heightPx += borderBottomWidthPx.value;
					}
					break;
				}
			}

			this.attributeStyleMap.set('height', CSS.px(heightPx));
		} else {
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
