interface PolymerBindingCallbacks {
    handlePropertiesChanged: (changedProps: unknown) => void;
    fireReadyEvent: (element: Element) => void;
    handleListItemPropertyChange: (nodeId: number, host: Element, propertyName: string, value: unknown) => void;
}
/**
 * Hooks the Polymer model-property bridge onto the element. If the element is
 * already a Polymer element it is wired immediately; if it may still become one
 * (a custom element that has not upgraded yet) the wiring is deferred until the
 * element is defined. A timeout races the whenDefined promise so a non-custom
 * element does not leak the chained closures.
 */
export declare function bindPolymerModelProperties(element: Element, callbacks: PolymerBindingCallbacks): void;
export {};
