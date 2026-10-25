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
// TypeScript port of com.vaadin.client.flow.nodefeature.MapPropertyAddEvent.
import { ReactiveValueChangeEvent } from '../reactive/ReactiveValueChangeEvent';
/**
 * Event fired when a property is added to a {@link NodeMap}.
 */
export class MapPropertyAddEvent extends ReactiveValueChangeEvent {
    #property;
    /**
     * Creates a new property add event.
     *
     * @param source - the changed map
     * @param property - the newly added property
     */
    constructor(source, property) {
        super(source);
        this.#property = property;
    }
    getSource() {
        return super.getSource();
    }
    /**
     * Gets the added property.
     *
     * @returns the added property
     */
    getProperty() {
        return this.#property;
    }
}
//# sourceMappingURL=MapPropertyAddEvent.js.map