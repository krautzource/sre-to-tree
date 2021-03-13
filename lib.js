const crypto = require('crypto');

/**
 * Creates valid ID from fixed prefix and hash as well as running index.
 * @param {string} hash string unique to root node
 * @param {string} id string unique to current node
 */
const generateId = (hash, id) => {
  return 'sretree-' + hash + '-' + id;
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
  node.setAttribute('role', 'treeitem');
};

/**
 * Calculates the ID attribute of a semantic child node.
 * @param {Node} node The semantic parent DOM node
 * @param {hash} hash The hash used to ensure unique IDs.
 * @param {Number} semanticChildId The semantic ID of a semantic child.
 */
const calculateOwnedId = (semanticIdTable, hash, semanticChildId) => {
  const semanticChild = semanticIdTable[semanticChildId];
  if (!semanticChild) {
    console.warn('no semantic child found with ID: ', semanticChildId);
    return '';
  }
  return semanticChild.hasAttribute('id')
    ? semanticChild.getAttribute('id')
    : generateId(hash, semanticChildId);
};

/**
 * Calculates the aria-owns attribute of a semantic parent node.
 * @param {Object} semanticIdTable A hash table to look up nodes by data-semantic-id.
 * @param {hash} hash The hash used to ensure unique IDs.
 * @param {string} semanticOwned The semantic parent's data-semantic-owns attribute.
 */
const calculateOwnedIds = (semanticIdTable, hash, semanticOwned) => {
  const combinedSemanticChildrenIDs = semanticOwned.split(' ');
  return combinedSemanticChildrenIDs
    .map(calculateOwnedId.bind(null, semanticIdTable, hash))
    .join(' ');
};

/**
 * Rewrites the DOM node and potentially recurses to children.
 * @param {Object} semanticIdTable A hash table to look up nodes by data-semantic-id.
 * @param {hash} hash The hash used to ensure unique IDs.
 * @param {Number} level The parent node's level in the tree.
 * @param {Node} node The DOM node to rewrite (usually passed from Array.prototype.forEach).
 * @param {Number} index The index (passed from Array.prototype.forEach).
 * @param {Array} array The array (passed from Array.prototype.forEach).
 */
function rewriteNode(semanticIdTable, hash, level, node, index, array) {
  if (!node) {
    console.warn('Cannot rewrite falsy node - hash', hash);
    return;
  }
  if (!node.getAttribute('id')) {
    node.setAttribute(
      'id',
      generateId(hash, node.getAttribute('data-semantic-id'))
    );
  }
  level++;
  node.setAttribute('aria-level', level);
  if (Number.isInteger(index) && array.length) {
    node.setAttribute('aria-posinset', ++index);
    node.setAttribute('aria-setsize', array.length);
  }
  generateLabelAndRole(node);
  const semanticOwned = node.getAttribute('data-semantic-owns');
  if (!semanticOwned) return;
  const ariaOwned = calculateOwnedIds(semanticIdTable, hash, semanticOwned);
  if (ariaOwned.includes('  ')) {
    console.warn('empty aria-own part; stopping recursion');
    return;
  }
  node.setAttribute('aria-owns', ariaOwned);
  semanticOwned
    .split(' ')
    .map((id) => semanticIdTable[id])
    .forEach(rewriteNode.bind(null, semanticIdTable, hash, level));
}

/**
 *
 * @param {Node} oldnode Node to move attribute away from
 * @param {Node} newnode Node to move attribute to
 * @param {string} attribute Name of attribute to be moved
 */
const moveAttribute = (oldnode, newnode, attribute) => {
  if (
    !oldnode ||
    !newnode ||
    oldnode === newnode ||
    !oldnode.hasAttribute(attribute)
  )
    return;
  const value = oldnode.getAttribute(attribute);
  newnode.setAttribute(attribute, value);
  oldnode.removeAttribute(attribute);
};

/**
 * Creates a hash map of nodes with data-semantic-id attribute.
 * @param {NodeList} nodes A DOM node list containing some nodes with data-semantic-id attribute
 */
const generateSemanticIdTable = (nodes) => {
  const result = {};
  nodes.forEach((node) => {
    if (!node.hasAttribute('data-semantic-id')) return;
    result[node.getAttribute('data-semantic-id')] = node;
  });
  return result;
};

/**
 *
 * @param {Node} child A DOM descendant to postprocess
 */
const postprocessingDescendant = (child) => {
  if (child.getAttribute('role')) return;
  if (child.tagName.toUpperCase() !== 'A' || !child.hasAttribute('href')) {
    child.setAttribute('role', 'presentation');
    return;
  }
  const firstSemanticChild = child.querySelector('[data-semantic-speech]');
  if (!firstSemanticChild) {
    console.warn('Link without semantic child');
    return;
  }
  firstSemanticChild.setAttribute('data-href', child.getAttribute('href'));
  firstSemanticChild.setAttribute(
    'aria-label',
    firstSemanticChild.getAttribute('aria-label') + ' link'
  ); // TODO R&D braille display affordances and how to fit them together with Nemeth
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
  node.setAttribute('role', 'tree');
  const level = 0;
  const descendantNodes = skeletonNode.querySelectorAll('*');
  const semanticIdTable = generateSemanticIdTable(descendantNodes);
  rewriteNode(semanticIdTable, hash, level, skeletonNode);
  descendantNodes.forEach(postprocessingDescendant);
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
