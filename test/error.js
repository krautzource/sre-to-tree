const test = require('tape');
const sre2tree = require('../lib');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

test('failure tests', (t) => {
  t.plan(3);
  const dom = new JSDOM(
    `<!DOCTYPE html><p>Hello world</p><div> <span data-semantic-speech="" data-semantic-owns="2"></span</div>`
  );
  const p = dom.window.document.querySelector('p');
  t.equal(sre2tree(p), p, 'Noop when no SRE markup');
  const div = dom.window.document.querySelector('div');
  const processedDiv = sre2tree(div)
  t.equal(processedDiv.getAttribute('aria-owns'), '', 'Graceful failure with unexpected markup: cut off tree');
  t.equal(processedDiv.getAttribute('aria-label'), '', 'Graceful failure with unexpected markup: label intact');
});
