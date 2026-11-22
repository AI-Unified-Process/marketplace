import './Clipboard';
import './Download';
import './ElementResize';
import './Geolocation';
import './WakeLock';
/**
 * Collects browser and device details (screen size, timezone, initial state
 * of the browser features above, etc.) as parameters for the server.
 */
export declare function collectBrowserDetails(): Promise<Record<string, string>>;
