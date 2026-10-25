/*
 * Copyright 2000-2026 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/**
 * A string that, if found in a non-JSON response to a UIDL request, will cause
 * the browser to refresh the page. If followed by a colon, optional whitespace,
 * and a URI, causes the browser to synchronously load the URI.
 *
 * This allows, for instance, a servlet filter to redirect the application to a
 * custom login page when the session expires. For example:
 *
 * ```
 * if (sessionExpired) {
 *     response.setHeader("Content-Type", "text/html");
 *     response.getWriter().write(myLoginPageHtml + "<!-- Vaadin-Refresh: "
 *             + request.getContextPath() + " --\>");
 * }
 * ```
 */
export const UIDL_REFRESH_TOKEN = 'Vaadin-Refresh';
//# sourceMappingURL=ConnectionStateHandler.js.map