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
/**
 * Returns the current screen orientation type synchronously, or
 * {@code 'unsupported'} if the Screen Orientation API is unavailable. Used by
 * the bootstrap path to seed the server-side signal without waiting for a DOM
 * event.
 */
export function currentScreenOrientationType() {
    return screen.orientation?.type ?? 'unsupported';
}
/**
 * Returns the current screen orientation angle synchronously, or 0 if the
 * Screen Orientation API is unavailable.
 */
export function currentScreenOrientationAngle() {
    return screen.orientation?.angle ?? 0;
}
// Dispatch on document.body so the server-side ScreenOrientation facade
// (listening on the UI element, which is body) can update its signal.
function dispatch(detail) {
    document.body.dispatchEvent(new CustomEvent('vaadin-screen-orientation-change', { detail }));
}
if (screen.orientation) {
    screen.orientation.addEventListener('change', () => {
        dispatch({
            type: screen.orientation.type,
            angle: screen.orientation.angle
        });
    });
}
const $wnd = window;
$wnd.Vaadin ??= {};
$wnd.Vaadin.Flow ??= {};
function lockErrorCode(domExceptionName) {
    switch (domExceptionName) {
        case 'NotSupportedError':
            return 'NOT_SUPPORTED';
        case 'SecurityError':
            return 'SECURITY';
        case 'AbortError':
            return 'ABORT';
        default:
            return 'UNKNOWN';
    }
}
$wnd.Vaadin.Flow.screenOrientation = {
    // Always resolves so the server-side .then(success, error) chain only
    // receives the "error" branch on a bridge failure (lost connection, etc.).
    // Rejected DOMExceptions are folded into the resolved result so the server
    // can decode them as a record without forfeiting the JS-bridge error arm.
    lock(type) {
        if (!screen.orientation || typeof screen.orientation.lock !== 'function') {
            return Promise.resolve({
                success: false,
                code: 'NOT_SUPPORTED',
                message: 'Screen Orientation API is not supported in this browser.'
            });
        }
        return screen.orientation
            .lock(type)
            .then(() => ({ success: true }))
            .catch((e) => {
            const code = lockErrorCode(e.name);
            const message = e.message ?? '';
            return {
                success: false,
                code,
                // The DOMException name is dropped once mapped to a typed code;
                // keep it in the message for diagnostics when no code matches.
                message: code === 'UNKNOWN' && e.name ? `${e.name}: ${message}` : message
            };
        });
    },
    unlock() {
        screen.orientation?.unlock();
    }
};
//# sourceMappingURL=ScreenOrientation.js.map