/**
 * Event fired when a request starts.
 */
export declare class RequestStartingEvent {
}
/**
 * Handler for {@link RequestStartingEvent}s.
 *
 * @param requestStartingEvent - the event object
 */
export type RequestStartingEventHandler = (requestStartingEvent: RequestStartingEvent) => void;
