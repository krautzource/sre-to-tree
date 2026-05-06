/**
 * Creates aria-label from SRE attribute and changes role if needed.
 * @param {Node} node current node
 */
const generateLabelAndRole = function (node) {
  node.setAttribute('role', 'presentation'); // TODO: remove?
  node.setAttribute('aria-hidden', 'true'); // TODO: remove?
  if (!node.hasAttribute('data-semantic-speech')) {
    return;
  }
  let speech = '';
  if (node.getAttribute('data-semantic-prefix'))
    speech += node.getAttribute('data-semantic-prefix') + ' ';
  speech += node.getAttribute('data-semantic-speech');
  if (speech === '') speech = 'blank';
  node.setAttribute('data-label', speech);
  if (node.getAttribute('data-semantic-braille'))
    node.setAttribute(
      'data-braillelabel',
      node.getAttribute('data-semantic-braille')
    );
};

/**
 * Rewrites the DOM node and potentially recurses to children.
 * @param {Object} semanticIdTable A hash table to look up nodes by data-semantic-id.
 * @param {Node} node The DOM node to rewrite (usually passed from Array.prototype.forEach).
 */
function rewriteNode(semanticIdTable, node) {
  node.setAttribute('data-owns-id', node.getAttribute('data-semantic-id'));
  generateLabelAndRole(node);
  const semanticOwned = node.getAttribute('data-semantic-owns');
  if (!semanticOwned) return;
  const validOwned = semanticOwned
    .split(' ')
    .filter((id) => {
      if (!semanticIdTable[id]) console.warn(`sre-to-tree: Bad data-semantic-owns value: ${id} on parent ID ${node.getAttribute('data-semantic-id')}`);
      return semanticIdTable[id];
    });
  node.setAttribute('data-owns', validOwned.join(' '));

  validOwned
    .map((id) => semanticIdTable[id])
    .forEach(rewriteNode.bind(null, semanticIdTable));
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
  // skip nodes we processed
  if (child.hasAttribute('data-label')) return;
  // general rule: make it presentation (removing it from the accessibility tree)
  if (child.tagName.toUpperCase() !== 'A' || !child.hasAttribute('href')) {
    child.setAttribute('role', 'presentation'); // TODO: remove?
    child.removeAttribute('aria-label');
    child.removeAttribute('aria-braillelabel');
    return;
  }
  // skip flattened links
  if (child.hasAttribute('data-sre2tree-flatlink')) {
    child.removeAttribute('data-sre2tree-flatlink');
    return;
  }
  // rewrite (proper) links
  // NOTE. Since MathJax does not support <a> in internal format, the SRE structure is placed inside the a. We assume it's on the first semantic child
  const firstSemanticChild = child.querySelector('[data-semantic-speech]');
  if (!firstSemanticChild) {
    console.warn('sre-to-tree: Link without semantic child');
    return;
  }
  // move all attributes
  [...firstSemanticChild.attributes].forEach(attr => {
    if (attr.name === 'role') return; // don't move role(=presentation) to link
    if (attr.name === 'aria-hidden') return; // don't move aria-hidden to link
    child.setAttribute(attr.name, attr.value);
    firstSemanticChild.removeAttribute(attr.name);
  })
  // links must have names
  child.setAttribute(
    'aria-label',
    child.getAttribute('data-label')
  );
  if (child.hasAttribute('data-braillelabel')) {
    child.setAttribute(
      'aria-braillelabel',
      child.getAttribute('data-braillelabel')
    );
  }
};

/**
 * Rewrites SRE-enriched MathJax output into a tree structure (except for edge cases)
 * @param {Node} node A DOM node containing speech-rule-engine-style attributes (data-semantic-*)
 * @return {Node} the same node (after changes)
 */
export const sre2tree = (node) => {
  const skeletonNode = node.querySelector('[data-semantic-id]:not([data-semantic-parent])');
  if (!skeletonNode) {
    console.warn('sre-to-tree: no SRE markup found:', node.outerHTML);
    return node;
  }
  const descendantNodes = node.querySelectorAll('*');

  const link = node.querySelector('a');
  if (link?.contains(skeletonNode)) {
    // Edge case 1: link wrapping the semantic root
    // We turn this into a "flat" link (cf. discussion in #41)
    // NOTE: postprocessingDescendant() will remove role=img added by mathjax on descendants; we only need to handle the given node
    postprocessingDescendant(node);
    link.setAttribute(
      'aria-label',
      skeletonNode.getAttribute('data-semantic-speech')
    );
    const brailleLabel = skeletonNode.getAttribute('data-semantic-braille');
    if (brailleLabel) link.setAttribute(
      'aria-braillelabel', brailleLabel
    );
    // mark as "special" so postprocessingDescendant() can ignore it
    link.setAttribute('data-sre2tree-flatlink', '');
  }
  else if (!node.querySelector('[data-semantic-owns]')) {
    // Edge case 2: "flat" (one node with data-semantic-speech) [but not a link]
    // We move the label to the the root and add img role there
    node.setAttribute('role', 'img');
    node.setAttribute(
      'aria-label',
      node
        .querySelector('[data-semantic-speech]')
        .getAttribute('data-semantic-speech')
    );
    const brailleLabel = node
      .querySelector('[data-semantic-braille]')
      ?.getAttribute('data-semantic-braille');
    if (brailleLabel) node.setAttribute(
      'aria-braillelabel', brailleLabel
    );
  }
  else {
    // The main case: rewrite the SRE tree structure
    node.setAttribute('role', 'img');// the simplest default role as fallback for downstream
    const semanticIdTable = generateSemanticIdTable(descendantNodes);
    rewriteNode(semanticIdTable, skeletonNode);
  }
  descendantNodes.forEach(postprocessingDescendant);
  if (node !== skeletonNode && link !== skeletonNode) {
    moveAttribute(skeletonNode, node, 'data-owns');
    moveAttribute(skeletonNode, node, 'data-owns-id');
    moveAttribute(skeletonNode, node, 'data-label');
    moveAttribute(skeletonNode, node, 'data-braillelabel');
    if (node.hasAttribute('data-label')) node.setAttribute('aria-label', node.getAttribute('data-label'));
    if (node.hasAttribute('data-braillelabel')) node.setAttribute('aria-braillelabel', node.getAttribute('data-braillelabel'));
    skeletonNode.removeAttribute('aria-hidden');
  }
  return node;
};
