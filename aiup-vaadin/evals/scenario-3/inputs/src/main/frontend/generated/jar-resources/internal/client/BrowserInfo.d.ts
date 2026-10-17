/**
 * Provides a way to query information about web browser.
 *
 * Browser details are detected only once and those are stored in this singleton
 * class.
 */
export declare class BrowserInfo {
    #private;
    static readonly ENGINE_GECKO = "gecko";
    static readonly ENGINE_WEBKIT = "webkit";
    static readonly ENGINE_PRESTO = "presto";
    static readonly ENGINE_TRIDENT = "trident";
    private constructor();
    /**
     * Singleton method to get BrowserInfo object.
     *
     * @returns instance of BrowserInfo object
     */
    static get(): BrowserInfo;
    /**
     * Checks if the browser is IE.
     *
     * @returns true if the browser is IE, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isIE(): boolean;
    /**
     * Checks if the browser is Edge.
     *
     * @returns true if the browser is Edge, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isEdge(): boolean;
    /**
     * Checks if the browser is Firefox.
     *
     * @returns true if the browser is Firefox, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isFirefox(): boolean;
    /**
     * Checks if the browser is Safari.
     *
     * @returns true if the browser is Safari, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isSafari(): boolean;
    /**
     * Checks if the browser is Safari or runs on iOS (covering also Chrome on
     * iOS).
     *
     * @returns true if the browser is Safari or running on iOS, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isSafariOrIOS(): boolean;
    /**
     * Checks if the browser is Chrome.
     *
     * @returns true if the browser is Chrome, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isChrome(): boolean;
    /**
     * Checks if the browser using the Gecko engine.
     *
     * @returns true if the browser is using Gecko, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isGecko(): boolean;
    /**
     * Checks if the browser using the Webkit engine.
     *
     * @returns true if the browser is using Webkit, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isWebkit(): boolean;
    /**
     * Returns the Gecko version if the browser is Gecko based. The Gecko version
     * for Firefox 2 is 1.8 and 1.9 for Firefox 3.
     *
     * @returns The Gecko version or -1 if the browser is not Gecko based
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    getGeckoVersion(): number;
    /**
     * Returns the WebKit version if the browser is WebKit based. The WebKit
     * version returned is the major version e.g., 523.
     *
     * @returns The WebKit version or -1 if the browser is not WebKit based
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    getWebkitVersion(): number;
    /**
     * Checks if the browser is Opera.
     *
     * @returns true if the browser is Opera, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isOpera(): boolean;
    /**
     * Checks if the browser runs on a touch capable device.
     *
     * @returns true if the browser runs on a touch based device, false otherwise
     */
    isTouchDevice(): boolean;
    /**
     * Checks if the browser is run on Android.
     *
     * @returns true if the browser is run on Android, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    isAndroid(): boolean;
    /**
     * Tests if this is an Android devices with a broken scrollTop
     * implementation.
     *
     * @returns true if scrollTop cannot be trusted on this device, false otherwise
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     *             and check version against known issues.
     */
    isAndroidWithBrokenScrollTop(): boolean;
    /**
     * Returns the browser major version e.g., 3 for Firefox 3.5, 4 for Chrome
     * 4, 8 for Internet Explorer 8.
     *
     * @returns The major version of the browser.
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    getBrowserMajorVersion(): number;
    /**
     * Returns the browser minor version e.g., 5 for Firefox 3.5.
     *
     * @see {@link getBrowserMajorVersion}
     *
     * @returns The minor version of the browser, or -1 if not known/parsed.
     * @deprecated use a parsing library like ua-parser-js to parse the user agent
     */
    getBrowserMinorVersion(): number;
}
