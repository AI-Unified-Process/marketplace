/** Detected operating systems. */
export declare enum OperatingSystem {
    UNKNOWN = 0,
    WINDOWS = 1,
    MACOSX = 2,
    LINUX = 3,
    IOS = 4,
    ANDROID = 5,
    CHROMEOS = 6
}
/**
 * Detected browser families.
 */
export declare enum BrowserName {
    UNKNOWN = 0,
    SAFARI = 1,
    CHROME = 2,
    FIREFOX = 3,
    OPERA = 4,
    IE = 5,
    EDGE = 6
}
/**
 * Detected browser rendering engines.
 */
export declare enum BrowserEngine {
    UNKNOWN = 0,
    GECKO = 1,
    WEBKIT = 2,
    PRESTO = 3,
    TRIDENT = 4
}
/**
 * Parses the user agent string from the browser and provides information about
 * the browser.
 *
 * @deprecated For browser information users should parse the user-agent using a
 *             parsing library like ua-parser/uap-java
 */
export declare class BrowserDetails {
    #private;
    /**
     * Create an instance based on the given user agent.
     *
     * @param userAgentString - User agent as provided by the browser.
     */
    constructor(userAgentString: string);
    /**
     * Tests if the browser is Firefox.
     *
     * @returns true if it is Firefox, false otherwise
     */
    isFirefox(): boolean;
    /**
     * Tests if the browser is using the Gecko engine.
     *
     * @returns true if it is Gecko, false otherwise
     */
    isGecko(): boolean;
    /**
     * Tests if the browser is using the WebKit engine.
     *
     * @returns true if it is WebKit, false otherwise
     */
    isWebKit(): boolean;
    /**
     * Tests if the browser is using the Presto engine.
     *
     * @returns true if it is Presto, false otherwise
     */
    isPresto(): boolean;
    /**
     * Tests if the browser is using the Trident engine.
     *
     * @returns true if it is Trident, false otherwise
     */
    isTrident(): boolean;
    /**
     * Tests if the browser is Safari.
     *
     * @returns true if it is Safari, false otherwise
     */
    isSafari(): boolean;
    /**
     * Tests if the browser is Chrome.
     *
     * @returns true if it is Chrome, false otherwise
     */
    isChrome(): boolean;
    /**
     * Tests if the browser is Opera.
     *
     * @returns true if it is Opera, false otherwise
     */
    isOpera(): boolean;
    /**
     * Tests if the browser is Internet Explorer.
     *
     * @returns true if it is Internet Explorer, false otherwise
     */
    isIE(): boolean;
    /**
     * Tests if the browser is Edge.
     *
     * @returns true if it is Edge, false otherwise
     */
    isEdge(): boolean;
    /**
     * Returns the version of the browser engine. For WebKit this is an integer
     * e.g., 532.0. For gecko it is a float e.g., 1.8 or 1.9.
     *
     * @returns The version of the browser engine
     */
    getBrowserEngineVersion(): number;
    /**
     * Returns the browser major version e.g., 3 for Firefox 3.5, 4 for Chrome
     * 4, 8 for Internet Explorer 8.
     *
     * @returns The major version of the browser.
     */
    getBrowserMajorVersion(): number;
    /**
     * Returns the browser minor version e.g., 5 for Firefox 3.5.
     *
     * @see {@link getBrowserMajorVersion}
     *
     * @returns The minor version of the browser, or -1 if not known/parsed.
     */
    getBrowserMinorVersion(): number;
    /**
     * Tests if the browser is run on Windows.
     *
     * @returns true if run on Windows, false otherwise
     */
    isWindows(): boolean;
    /**
     * Tests if the browser is run on Windows Phone.
     *
     * @returns true if run on Windows Phone, false otherwise
     */
    isWindowsPhone(): boolean;
    /**
     * Tests if the browser is run on Mac OSX.
     *
     * @returns true if run on Mac OSX, false otherwise
     */
    isMacOSX(): boolean;
    /**
     * Tests if the browser is run on Linux.
     *
     * @returns true if run on Linux, false otherwise
     */
    isLinux(): boolean;
    /**
     * Tests if the browser is run on Android.
     *
     * @returns true if run on Android, false otherwise
     */
    isAndroid(): boolean;
    /**
     * Tests if the browser is run on iPhone.
     *
     * @returns true if run on iPhone, false otherwise
     */
    isIPhone(): boolean;
    /**
     * Tests if the browser is run on iPad.
     *
     * @returns true if run on iPad, false otherwise
     */
    isIPad(): boolean;
    /**
     * Tests if the browser is run on Chrome OS (e.g. a Chromebook).
     *
     * @returns true if run on Chrome OS, false otherwise
     */
    isChromeOS(): boolean;
    /**
     * Returns the major version of the operating system. Currently only
     * supported for mobile devices (iOS/Android)
     *
     * @returns The major version or -1 if unknown
     */
    getOperatingSystemMajorVersion(): number;
    /**
     * Returns the minor version of the operating system. Currently only
     * supported for mobile devices (iOS/Android)
     *
     * @returns The minor version or -1 if unknown
     */
    getOperatingSystemMinorVersion(): number;
    /**
     * Checks if the browser is so old that it simply won't work.
     *
     * @returns true if the browser won't work, false if not the browser is
     *         supported or might work
     */
    isTooOldToFunctionProperly(): boolean;
    protected log(error: string, e: unknown): void;
}
