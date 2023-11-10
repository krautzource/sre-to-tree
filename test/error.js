import tape from 'tape';
import { sre2tree } from '../lib.js'
import { parseHTML } from 'linkedom';

tape('failure tests', async (t) => {
  t.plan(3);
  const { document } = parseHTML(
    `<!DOCTYPE html><p>Hello world</p><div> <span data-semantic-id data-semantic-speech="bla" data-semantic-owns="2"></span</div>`
  );
  const p = document.querySelector('p');
  const result = sre2tree(p);
  t.equal(result, p, 'Noop when no SRE markup');
  const div = document.querySelector('div');
  const processedDiv = await sre2tree(div)
  t.equal(processedDiv.getAttribute('data-owns'), '', 'Graceful failure with unexpected markup: cut off tree');
  t.equal(processedDiv.getAttribute('aria-label'), 'bla', 'Graceful failure with unexpected markup: label intact');
});
