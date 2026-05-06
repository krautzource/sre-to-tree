import tape from 'tape';
import { sre2tree } from '../lib.js'
import { parseHTML } from 'linkedom';

tape('failure tests', async (t) => {
  t.plan(5);
  const { document } = parseHTML(
    `<!DOCTYPE html>
    <p>Hello world</p>
    <div><span data-semantic-id data-semantic-speech="bla" data-semantic-owns="2"></span></div>
    <div><span data-semantic-id="1" data-semantic-speech="bla" data-semantic-owns="2"><span data-semantic-id="2"></span></span></div>
    <div><span data-semantic-id="1" data-semantic-speech="bla" data-semantic-owns="2"><span data-semantic-id="2"></span><a href="#"></a></span></div>`
  );
  const p = document.querySelector('p');
  const result = sre2tree(p);
  t.equal(result.outerHTML, p.outerHTML, 'Noop when no SRE markup');
  let div = document.querySelectorAll('div')[0];
  let processedDiv = await sre2tree(div);
  t.equal(processedDiv.getAttribute('data-owns'), '', 'Graceful failure with unexpected markup: cut off tree');
  t.equal(processedDiv.getAttribute('aria-label'), 'bla', 'Graceful failure with unexpected markup: label intact');
  div = document.querySelectorAll('div')[1];
  processedDiv = await sre2tree(div);
  t.equal(processedDiv.outerHTML, `<div aria-label="bla" data-label="bla" data-owns-id="1" data-owns="2" role="img"><span role="presentation" data-semantic-id="1" data-semantic-speech="bla" data-semantic-owns="2"><span aria-hidden="true" role="presentation" data-owns-id="2" data-semantic-id="2"></span></span></div>`, 'Missing data-semantic-speech does not cause errors'); // TODO: Should it?
  div = document.querySelectorAll('div')[2];
  processedDiv = await sre2tree(div);
  t.equal(processedDiv.outerHTML, `<div aria-label="bla" data-label="bla" data-owns-id="1" data-owns="2" role="img"><span role="presentation" data-semantic-id="1" data-semantic-speech="bla" data-semantic-owns="2"><span aria-hidden="true" role="presentation" data-owns-id="2" data-semantic-id="2"></span><a href="#"></a></span></div>`, 'Link without data-semantic');
});
