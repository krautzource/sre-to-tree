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
  if (node.hasAttribute('data-semantic-speech')) {
    let speech = '';
    if (node.getAttribute('data-semantic-prefix'))
      speech += node.getAttribute('data-semantic-prefix') + ' ';
    speech += node.getAttribute('data-semantic-speech');
    node.setAttribute('aria-label', speech);
    if (
      node.hasAttribute('role') ||
      node.tagName === 'A' ||
      node.tagName === 'IMAGE'
    )
      return;
    node.setAttribute('role', 'treeitem');
  } else {
    node.setAttribute('role', 'presentation');
  }
};

/**
 * Rewrites the DOM node and potentially recurses to children.
 * @param {Node} node The DOM node to rewrite.
 * @param {hash} hash The hash used to ensure unique IDs.
 */
function rewriteNode(hash, node) {
  if (!node) {
    console.warn('Cannot rewrite falsy node - hash', hash);
    return;
  }
  node.setAttribute(
    'id',
    generateId(hash, node.getAttribute('data-semantic-id'))
  );
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
    .forEach(rewriteNode.bind(null, hash));
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
  const hash = crypto.createHash('md5').update(node.outerHTML).digest('hex');
  node.setAttribute('tabindex', '0');
  node.setAttribute('role', 'tree');
  node.setAttribute('data-treewalker', '');
  rewriteNode(hash, skeletonNode);
  skeletonNode.querySelectorAll('*').forEach((child) => {
    if (!child.getAttribute('role')) child.setAttribute('role', 'presentation');
  });
  if (node !== skeletonNode) {
    moveAttribute(skeletonNode, node, 'aria-owns');
    moveAttribute(skeletonNode, node, 'aria-label');
    skeletonNode.setAttribute('role', 'presentation');
  }
  return node;
};

module.exports = rewrite;
