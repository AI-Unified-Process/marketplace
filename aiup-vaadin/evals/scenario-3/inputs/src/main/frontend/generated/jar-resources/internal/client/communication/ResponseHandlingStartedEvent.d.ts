/**
 * Event fired when handling of a response starts.
 */
export declare class ResponseHandlingStartedEvent {
}
/**
 * Handler for {@link ResponseHandlingStartedEvent}s.
 *
 * @param responseHandlingStartedEvent - the event object
 */
export type ResponseHandlingStartedEventHandler = (responseHandlingStartedEvent: ResponseHandlingStartedEvent) => void;
