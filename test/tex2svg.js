import sre from 'speech-rule-engine';
import { parseHTML } from 'linkedom';

// TeX to MathML
import { TeX } from 'mathjax-full/js/input/tex.js';
import { HTMLDocument } from 'mathjax-full/js/handlers/html/HTMLDocument.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { STATE } from 'mathjax-full/js/core/MathItem.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
const AlmostAllPackages = AllPackages.filter((x) => x !== 'bussproofs' && x !== 'textmacros');// NOTE bussproofs needs getBBox() method
const tex = new TeX({ packages: AlmostAllPackages });
const html = new HTMLDocument('', liteAdaptor(), { InputJax: tex });
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
const visitor = new SerializedMmlVisitor();
const toMathML = (node) => visitor.visitTree(node, html);

const tex2mml = (string, display) => {
  return toMathML(
    html.convert(string || '', { display: display, end: STATE.CONVERT })
  );
};

// MathML to SVG / CHTML
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { MathML } from 'mathjax-full/js/input/mathml.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const mml = new MathML();
const svg = new SVG({});

const svghtml = mathjax.document('', { InputJax: mml, OutputJax: svg });

export const tex2svg = async (texstring, displayBool) => {
  // set up MathSpeak output
  await sre.setupEngine({
    domain: 'mathspeak',
    style: 'default',
    locale: 'en',
    speech: 'deep',
    structure: true,
    modality: 'speech',
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
