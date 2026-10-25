// @ts-nocheck
window.Vaadin = window.Vaadin || {};
window.Vaadin.featureFlags = window.Vaadin.featureFlags || {};
if (Object.keys(window.Vaadin.featureFlags).length === 0) {
window.Vaadin.featureFlags.collaborationEngineBackend = false;
window.Vaadin.featureFlags.accessibleDisabledButtons = false;
window.Vaadin.featureFlags.themeComponentStyles = false;
window.Vaadin.featureFlags.tailwindCss = false;
window.Vaadin.featureFlags.ssePushTransport = false;
window.Vaadin.featureFlags.fullstackSignals = false;
window.Vaadin.featureFlags.layoutComponentImprovements = false;
window.Vaadin.featureFlags.defaultAutoResponsiveFormLayout = false;
window.Vaadin.featureFlags.aiComponents = false;
window.Vaadin.featureFlags.messageListTypingIndicator = false;
window.Vaadin.featureFlags.accessibleDisabledMenuItems = false;
};
if (window.Vaadin.featureFlagsUpdaters) { 
const activator = (id) => window.Vaadin.featureFlags[id] = true;
window.Vaadin.featureFlagsUpdaters.forEach(updater => updater(activator));
delete window.Vaadin.featureFlagsUpdaters;
} 
export {};