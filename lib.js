const crypto = require('crypto');

/**
 * Creates valid ID from fixed prefix and hash as well as running index.
 * @param {string} hash string unique to root node
 * @param {string} id string unique to current node
 */
const generateId = (hash, id) => {
  return 'MJX-' + hash + '-' + id;
};

/**
 * Creates aria-label from SRE attribute and changes role if needed.
 * @param {Node} node current node
 */
const generateLabelAndRole = function (node) {
  if (!node.hasAttribute('data-semantic-speech')) {
    node.setAttribute('role', 'presentation');
    return;
  }
  let speech = '';
  if (node.getAttribute('data-semantic-prefix'))
    speech += node.getAttribute('data-semantic-prefix') + ' ';
  speech += node.getAttribute('data-semantic-speech');
  node.setAttribute('aria-label', speech);
  if (node.getAttribute('data-semantic-braille'))
    node.setAttribute(
      'aria-braillelabel',
      node.getAttribute('data-semantic-braille')
    );
  if (
    node.hasAttribute('role') ||
    node.tagName === 'A' ||
    node.tagName === 'IMAGE'
  )
    return;
  node.setAttribute('role', 'treeitem');
};

/**
 * Rewrites the DOM node and potentially recurses to children.
 * @param {hash} hash The hash used to ensure unique IDs.
 * @param {Number} level The parent node's level in the tree.
 * @param {Node} node The DOM node to rewrite (usually passed from Array.prototype.forEach).
 * @param {Number} index The index (passed from Array.prototype.forEach).
 * @param {Array} array The array (passed from Array.prototype.forEach).
 */
function rewriteNode(hash, level, node, index, array) {
  if (!node) {
    console.warn('Cannot rewrite falsy node - hash', hash);
    return;
  }
  node.setAttribute(
    'id',
    generateId(hash, node.getAttribute('data-semantic-id'))
  );
  level++;
  node.setAttribute('aria-level', level);
  if (Number.isInteger(index) && array.length) {
    node.setAttribute('aria-posinset', ++index);
    node.setAttribute('aria-setsize', array.length);
  }
  generateLabelAndRole(node);
  const owned = node.getAttribute('data-semantic-owns');
  if (!owned) return;
  const combinedSemanticChildrenIDs = owned.split(' ');
  node.setAttribute(
    'aria-owns',
    combinedSemanticChildrenIDs.map(generateId.bind(null, hash)).join(' ')
  );
  combinedSemanticChildrenIDs
    .map((id) => node.querySelector('[data-semantic-id="' + id + '"'))
    .forEach(rewriteNode.bind(null, hash, level));
}

/**
 *
 * @param {Node} oldnode Node to move attribute away from
 * @param {Node} newnode Node to move attribute to
 * @param {string} attribute Name of attribute to be moved
 */
const moveAttribute = (oldnode, newnode, attribute) => {
  if (!oldnode || !newnode || oldnode === newnode) return;
  const value = oldnode.getAttribute(attribute);
  if (!value) return;
  newnode.setAttribute(attribute, value);
  oldnode.removeAttribute(attribute);
};

/**
 *
 * @param {Node} node A DOM node containing speech-rule-engine-style attributes (data-semantic-*)
 */
const rewrite = (node) => {
  const skeletonNode = node.querySelector('[data-semantic-speech]');
  if (!skeletonNode) {
    console.warn('sre-to-tree: no SRE markup found', node);
    return node;
  }
  const hash = crypto.createHash('md5').update(node.outerHTML).digest('hex');
  node.setAttribute('tabindex', '0');
  node.setAttribute('role', 'tree');
  node.setAttribute('data-treewalker', '');
  const level = 0;
  rewriteNode(hash, level, skeletonNode);
  skeletonNode.querySelectorAll('*').forEach((child) => {
    if (!child.getAttribute('role')) child.setAttribute('role', 'presentation');
  });
  if (node !== skeletonNode) {
    moveAttribute(skeletonNode, node, 'aria-owns');
    moveAttribute(skeletonNode, node, 'aria-label');
    moveAttribute(skeletonNode, node, 'aria-braillelabel');
    moveAttribute(skeletonNode, node, 'aria-level');
    skeletonNode.setAttribute('role', 'presentation');
  }
  return node;
};

module.exports = rewrite;
