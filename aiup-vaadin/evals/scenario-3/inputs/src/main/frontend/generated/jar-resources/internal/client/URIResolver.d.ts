import type { Registry } from './Registry';
import { VaadinUriResolver } from '../flow/shared/VaadinUriResolver';
/** Client side URL resolver for vaadin protocols. */
export declare class URIResolver extends VaadinUriResolver {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Translates a Vaadin URI to a URL that can be loaded by the browser. The
     * following URI schemes are supported:
     *
     * - `context://` - resolves to the application context root
     * - `base://` - resolves to the base URI of the page
     *
     * Any other URI protocols, such as `http://` or `https://` are passed through
     * this method unmodified.
     *
     * @param uri - the URI to resolve
     * @returns the resolved URI
     */
    resolveVaadinUri(uri: string | null): string | null;
    protected getContextRootUrl(): string;
}
/**
 * Returns the current document location as relative to the base uri of the document.
 *
 * @returns the document current location as relative to the document base uri
 */
export declare function getCurrentLocationRelativeToBaseUri(): string;
/**
 * Returns the given uri as relative to the given base uri.
 *
 * @param baseURI - the base uri of the document
 * @param uri - an absolute uri to transform
 * @returns the uri as relative to the document base uri, or the given uri * unmodified
 *          if it is for different context.
 */
export declare function getBaseRelativeUri(baseURI: string, uri: string): string;
