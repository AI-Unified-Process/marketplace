/**
 * Gets the value of the given parameter from the given search (query) string.
 *
 * @param search - the search string, including the leading '?'
 * @param parameter - the parameter to retrieve
 * @returns the value of the parameter, an empty string if it is present without
 *   a value, or null if it is not present
 */
export declare function getParameter(search: string, parameter: string): string | null;
