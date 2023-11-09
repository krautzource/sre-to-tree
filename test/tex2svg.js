const sre = require('speech-rule-engine');
const { parseHTML } = require('linkedom');

// TeX to MathML
const TeX = require('mathjax-full/js/input/tex.js').TeX;
const HTMLDocument = require('mathjax-full/js/handlers/html/HTMLDocument.js')
  .HTMLDocument;
const liteAdaptor = require('mathjax-full/js/adaptors/liteAdaptor.js')
  .liteAdaptor;
const STATE = require('mathjax-full/js/core/MathItem.js').STATE;
const AllPackages = require('mathjax-full/js/input/tex/AllPackages.js').AllPackages.filter(
  (x) => x !== 'bussproofs' && x !== 'textmacros'
); // NOTE bussproofs needs getBBox() method
const tex = new TeX({ packages: AllPackages });
const html = new HTMLDocument('', liteAdaptor(), { InputJax: tex });
const MmlVisitor = require('mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js')
  .SerializedMmlVisitor;
const visitor = new MmlVisitor();
const toMathML = (node) => visitor.visitTree(node, html);

const tex2mml = (string, display) => {
  return toMathML(
    html.convert(string || '', { display: display, end: STATE.CONVERT })
  );
};

// MathML to SVG / CHTML
const mathjax = require('mathjax-full/js/mathjax.js').mathjax;
const MathML = require('mathjax-full/js/input/mathml.js').MathML;
const SVG = require('mathjax-full/js/output/svg.js').SVG;
const RegisterHTMLHandler = require('mathjax-full/js/handlers/html.js').RegisterHTMLHandler;
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const mml = new MathML();
const svg = new SVG();

const svghtml = mathjax.document('', { InputJax: mml, OutputJax: svg });

// const rewrite = require('sre-to-tree');

const mjenrich = async (texstring, displayBool) => {
  // set up MathSpeak output
  await sre.setupEngine({
    domain: 'mathspeak',
    style: 'default',
    locale: 'en',
    speech: 'deep',
    structure: true,
  });
  await sre.engineReady();
  const mml = tex2mml(texstring, displayBool);
  const enrichedMml = await sre.toEnriched(mml).toString();
  const mjx = svghtml.convert(enrichedMml, {
    em: 16,
    ex: 8,
    containerWidth: 80 * 16,
  });

  // switch sre to Braille
  await sre.setupEngine({
    domain: 'default',
    style: 'default',
    locale: 'nemeth',
    modality: 'braille',
    speech: 'deep',
    structure: true,
  });
  await sre.engineReady();
  const enrichedMmlBraille = await sre.toEnriched(mml).toString();
  const { document } = parseHTML(`<!DOCTYPE html><div>${adaptor.outerHTML(mjx)}</div><div>${enrichedMmlBraille}</div>`);
  const mjxWrapper = document.firstElementChild;
  const brailleWrapper = document.lastElementChild;
  
  // crossing the streams... cf. zorkow/speech-rule-engine#438
  mjxWrapper.querySelectorAll('[data-semantic-speech]').forEach((node) => {
    node.setAttribute(
      'data-semantic-braille',
      brailleWrapper
        .querySelector(
          '[data-semantic-id="' + node.getAttribute('data-semantic-id') + '"]'
        )
        .getAttribute('data-semantic-speech')
    );
  });

  return mjxWrapper;
};

module.exports = mjenrich;
