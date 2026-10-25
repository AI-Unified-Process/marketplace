/**
 * Throws an Error with the given message when the condition is falsy.
 *
 * Java evaluates the message expression only when the assertion fails, so a
 * caller on a hot path passes a function and pays for the message only then.
 */
export declare function assert(condition: unknown, message: string | (() => string)): asserts condition;
