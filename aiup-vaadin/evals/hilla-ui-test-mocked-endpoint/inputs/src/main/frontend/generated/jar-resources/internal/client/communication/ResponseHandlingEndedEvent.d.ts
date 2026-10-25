/**
 * Event fired when handling of a response ends.
 */
export declare class ResponseHandlingEndedEvent {
}
/**
 * Handler for {@link ResponseHandlingEndedEvent}s.
 *
 * @param responseHandlingEndedEvent - the event object
 */
export type ResponseHandlingEndedEventHandler = (responseHandlingEndedEvent: ResponseHandlingEndedEvent) => void;
