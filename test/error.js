const test = require('tape');
const sre2tree = require('../lib');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

test('failure tests', (t) => {
  t.plan(3);
  t.equal(sre2tree('hello'), 'hello', 'Noop when input is not an element');
  const dom = new JSDOM(
    `<!DOCTYPE html><p>Hello world</p><div> <span data-semantic-speech data-semantic-owns="2"></span</div>`
  );
  const p = dom.window.document.querySelector('p');
  t.equal(sre2tree(p), p, 'Noop when no SRE markup');
  const div = dom.window.document.querySelector('div');
  t.equal(sre2tree(div), div, 'Noop when element fails');
});
