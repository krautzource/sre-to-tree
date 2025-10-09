import sre from 'speech-rule-engine';
import { parseHTML } from 'linkedom';

// TeX to MathML
import { TeX } from '@mathjax/src/js/input/tex.js';
import { BaseConfiguration } from '@mathjax/src/js/input/tex/base/BaseConfiguration.js';
import { AmsConfiguration } from '@mathjax/src/js/input/tex/ams/AmsConfiguration.js';
import { AmsCdConfiguration } from '@mathjax/src/js/input/tex/amscd/AmsCdConfiguration.js';
import { BboxConfiguration } from '@mathjax/src/js/input/tex/bbox/BboxConfiguration.js';
import { BoldsymbolConfiguration } from '@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import { BraketConfiguration } from '@mathjax/src/js/input/tex/braket/BraketConfiguration.js';
import { CancelConfiguration } from '@mathjax/src/js/input/tex/cancel/CancelConfiguration.js';
import { ColorConfiguration } from '@mathjax/src/js/input/tex/color/ColorConfiguration.js';
import { HtmlConfiguration } from '@mathjax/src/js/input/tex/html/HtmlConfiguration.js';
import { EmpheqConfiguration } from '@mathjax/src/js/input/tex/empheq/EmpheqConfiguration.js';
import { configuration as img } from 'mathjax-img';
import { configuration as xhref } from '@amermathsoc/mathjax-xhref';

const texPackages = [
  BaseConfiguration.name,
  AmsConfiguration.name,
  AmsCdConfiguration.name,
  BboxConfiguration.name,
  BoldsymbolConfiguration.name,
  BraketConfiguration.name,
  CancelConfiguration.name,
  ColorConfiguration.name,
  HtmlConfiguration.name,
  EmpheqConfiguration.name,
  img.name,
  xhref.name,
];

import { HTMLDocument } from '@mathjax/src/js/handlers/html/HTMLDocument.js';
import { liteAdaptor } from '@mathjax/src/js/adaptors/liteAdaptor.js';
import { STATE } from '@mathjax/src/js/core/MathItem.js';
const tex = new TeX({ packages: texPackages });
const html = new HTMLDocument('', liteAdaptor(), { InputJax: tex });
import { SerializedMmlVisitor } from '@mathjax/src/js/core/MmlTree/SerializedMmlVisitor.js';
const visitor = new SerializedMmlVisitor();
const toMathML = (node) => visitor.visitTree(node, html);

const tex2mml = (string, display) => {
  return toMathML(
    html.convert(string || '', { display: display, end: STATE.CONVERT })
  );
};

// MathML to SVG / CHTML
import { mathjax } from '@mathjax/src/js/mathjax.js';
import { MathML } from '@mathjax/src/js/input/mathml.js';
import { SVG } from '@mathjax/src/js/output/svg.js';
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js';
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const mml = new MathML();
const svg = new SVG({});
// const svg = new SVG({
//   linebreaks: {
//     inline: true,
//   },
// });

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
  // // FOR LINEBREAKING
  // const { document } = parseHTML(`<!DOCTYPE html>${adaptor.outerHTML(mjx)}<div>${enrichedMmlBraille}</div>`); // note: removed div to get mjx-container for inline-linebreaking
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
