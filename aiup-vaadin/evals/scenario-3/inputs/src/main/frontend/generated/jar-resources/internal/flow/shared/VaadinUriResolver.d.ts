/**
 * Utility for translating special Vaadin URIs into URLs usable by the browser.
 * This is an abstract class performing the main logic in
 * {@link VaadinUriResolver.resolveVaadinUri}.
 */
export declare abstract class VaadinUriResolver {
    /**
     * Translates a Vaadin URI to a URL that can be loaded by the browser. The
     * following URI schemes are supported:
     *
     * - `context://` resolves to the application context root
     * - `base://` - resolves to the base URI of the page
     *
     * Any other URI protocols, such as `http://` or `https://` are passed through
     * this method unmodified.
     *
     * @param uri - the URI to resolve
     * @param servletToContextRoot - the relative path from the servlet path (used
     *          as base path in the client) to the context root
     * @returns the resolved URI
     */
    protected resolveVaadinUri(uri: string | null, servletToContextRoot: string): string | null;
}
