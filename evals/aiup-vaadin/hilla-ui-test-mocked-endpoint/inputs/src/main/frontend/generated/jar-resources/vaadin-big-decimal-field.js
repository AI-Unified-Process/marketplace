/*
 * Copyright 2000-2026 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
import { css } from 'lit';
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

class BigDecimalField extends TextField {
  static get is() {
    return 'vaadin-big-decimal-field';
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, is: 'vaadin-text-field' };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host([dir='rtl']) [part='input-field'] {
          direction: ltr;
        }

        :host([dir='rtl']) [part='input-field'] ::slotted(input) {
          --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em) !important;
        }
      `
    ];
  }

  static get properties() {
    return {
      _decimalSeparator: {
        type: String,
        value: '.',
        sync: true,
        observer: '__decimalSeparatorChanged'
      },

      inputMode: {
        type: String,
        value: 'decimal'
      }
    };
  }

  __decimalSeparatorChanged(separator, oldSeparator) {
    this.allowedCharPattern = '[-+\\d' + separator + ']';

    if (this.value && oldSeparator) {
      this.value = this.value.split(oldSeparator).join(separator);
    }
  }
}

defineCustomElement(BigDecimalField);
