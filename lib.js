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
  if (speech === '') speech = 'blank';
  node.setAttribute('aria-label', speech);
  if (node.getAttribute('data-semantic-braille'))
    node.setAttribute(
      'aria-braillelabel',
      node.getAttribute('data-semantic-braille')
    ); // NOTE: if data-semantic-braille is falsy, aria-braillelabel is not set. Instead, AT will fall back to aria-label which will always at least be "blank", cf. #40
  node.setAttribute('role', 'treeitem');
  node.setAttribute('aria-hidden', 'true');
};

/**
 * Rewrites the DOM node and potentially recurses to children.
 * @param {Object} semanticIdTable A hash table to look up nodes by data-semantic-id.
 * @param {Number} level The parent node's level in the tree.
 * @param {Node} node The DOM node to rewrite (usually passed from Array.prototype.forEach).
 * @param {Number} index The index (passed from Array.prototype.forEach).
 * @param {Array} array The array (passed from Array.prototype.forEach).
 */
function rewriteNode(semanticIdTable, level, node, index, array) {
  node.setAttribute('data-owns-id', node.getAttribute('data-semantic-id'));
  if (Number.isInteger(index) && array.length) {
    node.setAttribute('aria-level', level);
    node.setAttribute('aria-posinset', ++index);
    node.setAttribute('aria-setsize', array.length);
  }
  level++;
  generateLabelAndRole(node);
  const semanticOwned = node.getAttribute('data-semantic-owns');
  if (!semanticOwned) return;
  const validOwned = semanticOwned
    .split(' ')
    .filter((id) => {
      if (!semanticIdTable[id]) console.warn(`Bad data-semantic-owns value: ${id} on parent ID ${node.getAttribute('data-semantic-id')}`);
      return semanticIdTable[id];
    });
  node.setAttribute('data-owns', validOwned.join(' '));

  validOwned
    .map((id) => semanticIdTable[id])
    .forEach(rewriteNode.bind(null, semanticIdTable, level));
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
  // general rule: make it presentation (removing it from the accessibility tree)
  if (child.tagName.toUpperCase() !== 'A' || !child.hasAttribute('href')) {
    child.setAttribute('role', 'presentation');
    return;
  }
  // rewrite (proper) links
  // NOTE. Since MathJax does not support <a> in internal format, the SRE structure is placed inside the a. We assume it's on the first semantic child
  const firstSemanticChild = child.querySelector('[data-semantic-speech]');
  if (!firstSemanticChild) {
    console.warn('Link without semantic child');
    return;
  }
  // move all attributes
  [...firstSemanticChild.attributes].forEach(attr => {
    child.setAttribute(attr.name, attr.value);
    firstSemanticChild.removeAttribute(attr.name);
  })
  firstSemanticChild.setAttribute('role', 'presentation');
  // tweak aria-label
  child.setAttribute(
    'aria-label',
    child.getAttribute('aria-label') + ' link'
  ); // TODO R&D braille display affordances and how to fit them together with Nemeth
};

/**
 *
 * @param {Node} node A DOM node containing speech-rule-engine-style attributes (data-semantic-*)
 * @return {Node} the changed node
 */
export const sre2tree = (node) => {
  const skeletonNode = node.querySelector('[data-semantic-id]:not([data-semantic-parent])');
  if (!skeletonNode) {
    console.warn('sre-to-tree: no SRE markup found:', node.outerHTML);
    return node;
  }
  node.setAttribute('role', 'tree');
  const level = 0;
  const descendantNodes = node.querySelectorAll('*');
  const semanticIdTable = generateSemanticIdTable(descendantNodes);
  rewriteNode(semanticIdTable, level, skeletonNode);
  descendantNodes.forEach(postprocessingDescendant);
  if (node !== skeletonNode) {
    moveAttribute(skeletonNode, node, 'data-owns');
    moveAttribute(skeletonNode, node, 'aria-label');
    moveAttribute(skeletonNode, node, 'aria-braillelabel');
    moveAttribute(skeletonNode, node, 'aria-level');
    skeletonNode.removeAttribute('aria-hidden');
    skeletonNode.setAttribute('role', 'presentation');
  }
  return node;
};
