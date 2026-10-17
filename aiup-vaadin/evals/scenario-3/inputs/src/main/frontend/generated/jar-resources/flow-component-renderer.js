import { flowComponentDirective } from './flow-component-directive.js';
import { render, html as litHtml } from 'lit';

/**
 * Returns the requested node in a form suitable for Lit template interpolation.
 * @param {string} appid
 * @param {number} nodeid
 * @returns {any} a Lit directive
 */
function getNode(appid, nodeid) {
  return flowComponentDirective(appid, nodeid);
}

/**
 * Sets the nodes defined by the given node ids as the child nodes of the
 * given root element.
 * @param {string} appid
 * @param {number[]} nodeIds
 * @param {Element} root
 */
function setChildNodes(appid, nodeIds, root) {
  render(litHtml`${nodeIds.map((id) => flowComponentDirective(appid, id))}`, root);
}

/**
 * SimpleElementBindingStrategy::addChildren uses insertBefore to add child
 * elements to the container. When the children are manually placed under
 * another element, the call to insertBefore can occasionally fail due to
 * an invalid reference node.
 *
 * This is a temporary workaround which patches the container's native API
 * to not fail when called with invalid arguments.
 */
function patchVirtualContainer(container) {
  const originalInsertBefore = container.insertBefore;

  container.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode === this) {
      return originalInsertBefore.call(this, newNode, referenceNode);
    } else {
      return originalInsertBefore.call(this, newNode, null);
    }
  };
}

window.Vaadin ||= {};
window.Vaadin.FlowComponentHost ||= { patchVirtualContainer, getNode, setChildNodes };
