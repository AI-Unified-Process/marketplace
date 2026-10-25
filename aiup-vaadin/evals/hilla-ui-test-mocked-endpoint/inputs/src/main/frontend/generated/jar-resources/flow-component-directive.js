import { noChange } from 'lit';
import { directive, PartType } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

class FlowComponentDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.CHILD) {
      throw new Error(`${this.constructor.directiveName}() can only be used in child bindings`);
    }
  }

  update(part, [appid, nodeid]) {
    this.updateContent(part, appid, nodeid);
    return noChange;
  }

  updateContent(part, appid, nodeid) {
    const { parentNode, startNode } = part;

    const hasNewNodeId = nodeid !== undefined && nodeid !== null;
    const newNode = hasNewNodeId ? this.getNewNode(appid, nodeid) : null;
    const oldNode = this.getOldNode(part);

    if (hasNewNodeId && !newNode) {
      // The node is not in the client registry. Flow sends the nodes of a
      // response before the JavaScript that renders them, so this only happens
      // for a node the server has already discarded, for example when a row is
      // rendered again from a stale client cache. Such a node never arrives, so
      // keep the current content until the next render replaces it.
      return;
    } else if (oldNode === newNode) {
      return;
    } else if (oldNode && newNode) {
      parentNode.replaceChild(newNode, oldNode);
    } else if (oldNode) {
      parentNode.removeChild(oldNode);
    } else if (newNode) {
      startNode.after(newNode);
    }
  }

  getNewNode(appid, nodeid) {
    return window.Vaadin.Flow.clients[appid].getByNodeId(nodeid);
  }

  getOldNode(part) {
    const { startNode, endNode } = part;
    if (startNode.nextSibling === endNode) {
      return;
    }
    return startNode.nextSibling;
  }
}

/**
 * Renders the given flow component node.
 *
 * WARNING: This directive is not intended for public use.
 *
 * @param {string} appid
 * @param {number} nodeid
 * @private
 */
export const flowComponentDirective = directive(FlowComponentDirective);
