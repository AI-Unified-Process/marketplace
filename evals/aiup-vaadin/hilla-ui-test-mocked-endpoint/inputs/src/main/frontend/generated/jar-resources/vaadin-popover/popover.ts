import { Popover } from '@vaadin/popover/src/vaadin-popover.js';

const _window = window as any;
_window.Vaadin ||= {};
_window.Vaadin.Flow ||= {};
_window.Vaadin.Flow.popover ||= {};

Object.assign(_window.Vaadin.Flow.popover, {
  setDefaultHideDelay: (hideDelay: number) => Popover.setDefaultHideDelay(hideDelay),
  setDefaultFocusDelay: (focusDelay: number) => Popover.setDefaultFocusDelay(focusDelay),
  setDefaultHoverDelay: (hoverDelay: number) => Popover.setDefaultHoverDelay(hoverDelay)
});

const { defaultHideDelay, defaultFocusDelay, defaultHoverDelay } = _window.Vaadin.Flow.popover;

if (defaultHideDelay) {
  Popover.setDefaultHideDelay(defaultHideDelay);
}

if (defaultFocusDelay) {
  Popover.setDefaultFocusDelay(defaultFocusDelay);
}

if (defaultHoverDelay) {
  Popover.setDefaultHoverDelay(defaultHoverDelay);
}
