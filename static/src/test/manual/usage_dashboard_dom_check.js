/*
 * Behavioural regression check for dashboard row rendering.
 *
 * The admin usage dashboard round-tripped project and owner names through
 * `data-*` attributes before rebuilding rows as markup. Browser parsing can
 * change attribute content before the click handler reads it back, so this
 * check drives the real handler in jsdom and asserts on the resulting DOM.
 *
 * It lives outside the Jest suite on purpose. static/src pins jest@23 and
 * deasync@0.1.24, whose native build fails on current Node, so `npm ci` there
 * cannot complete on a modern machine. This file needs only jsdom and jquery:
 *
 *     mkdir -p /tmp/usage-dashboard-check && cd /tmp/usage-dashboard-check
 *     npm init -y && npm i jsdom jquery
 *     node <repo>/pybossa/pybossa/themes/default/static/src/test/manual/usage_dashboard_dom_check.js
 *     node ... --demo-legacy    # same assertions against the previous renderer; must FAIL
 *
 * Verified 2026-09-08 on Node v24.16.0, jsdom 27, jquery 3.7: clean run passes
 * all assertions, --demo-legacy fails the DOM reconstruction assertions.
 *
 * Two things to know when reading the --demo-legacy output:
 *
 *  - It reverts only the DOM sink, not the data-attribute shape, so the
 *    comma-alignment assertion still passes there. The comma bug was confirmed
 *    separately against the previous template, where a project named
 *    "comma, in name" rendered as "comma" and shifted every following column.
 *  - "no script executed" passes even against the previous renderer, because
 *    jsdom does not fetch resources and so never fires onerror. The evidence
 *    of exploitability is the assertion above it: a live <img onerror=...>
 *    node materialises in the admin's DOM. Do not read that PASS as safety.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const TEMPLATE = path.resolve(__dirname, '../../../../templates/admin/usage_dashboard.html');
const DEMO_LEGACY = process.argv.includes('--demo-legacy');

const PAYLOAD = '<img src=x onerror=alert(document.domain)>';
const ROWS = [
  {
    id: '42',
    name: PAYLOAD,
    owner_name: 'eve',
    owner_email: 'eve@bloomberg.net',
    last_submission: '2026-01-02T03:04:05.123456',
    published: 'true'
  },
  // A short_name may contain a comma: ProjectAPI._validate_instance applies no
  // character validator, so POST /api/project accepts one even though the web
  // form's NotAllowedChars would not.
  {
    id: '43',
    name: 'comma, in name',
    owner_name: 'bob',
    owner_email: 'bob@bloomberg.net',
    last_submission: 'None',
    published: 'false'
  }
];

// The handler lives in the last <script> block, which contains no Jinja syntax.
function handlerSource () {
  const src = fs.readFileSync(TEMPLATE, 'utf8');
  const templateDocument = new JSDOM(src).window.document;
  const blocks = [...templateDocument.querySelectorAll('script')].map(script => script.textContent);
  let js = blocks[blocks.length - 1];
  if (/\{\{|\{%/.test(js)) {
    throw new Error('the handler script now contains Jinja syntax; this check needs updating');
  }
  if (DEMO_LEGACY) js = reintroduceLegacyRendering(js);
  return js;
}

// Swap the DOM-building loop back to the previous implementation so a reviewer
// can confirm the assertions below distinguish the two rendering approaches.
function reintroduceLegacyRendering (js) {
  const CLOSE = '\n        });';
  const start = js.indexOf('        table.innerHTML = \'\';');
  const close = start === -1 ? -1 : js.indexOf(CLOSE, start);
  if (close === -1) throw new Error('cannot locate the row-building loop');
  const end = close + CLOSE.length;
  return js.slice(0, start) +
    `
        table.innerHTML = '';
        for (let i = 0; i < rows.length; i++) {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            cell1.textContent = String(rows[i].id).trim();
            cell2.innerHTML = \`<a href="/projectid/\${String(rows[i].id).trim()}" target="_blank">\${rows[i].name}</a>\`;
            cell3.innerHTML = \`<span title="\${rows[i].owner_email}">\${rows[i].owner_name}</span>\`;
            cell4.innerHTML = \`<span title="\${rows[i].last_submission}">\${rows[i].last_submission}</span>\`;
            cell5.innerHTML = \`<span title="\${rows[i].published}">\${rows[i].published}</span>\`;
        }
` + js.slice(end);
}

// Mirrors what the template emits: Jinja's tojson, in a single-quoted attribute.
function anchorHtml () {
  const json = JSON.stringify(ROWS)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026').replace(/'/g, '\\u0027');
  return `<a href="#" class="stat-link" data-toggle="modal" data-target="#statsModal" ` +
    `data-rows='${json}'>${ROWS.length}</a>`;
}

async function render () {
  const dom = new JSDOM(`<!DOCTYPE html><html><body>
    <table><tbody><tr>
      <th><p class="row-heading"><strong>Some Component</strong></p></th>
      <td><p>${anchorHtml()}</p></td>
    </tr></tbody></table>
    <span id="modal-subject"></span>
    <select id="timeframe-select"></select>
    <p class="table-header"></p><h2 id="large-header"></h2>
    <table id="project-table"><tbody></tbody></table>
  </body></html>`, {
    url: 'https://gigwork.test/admin/usage_dashboard/?days=30',
    runScripts: 'outside-only'
  });

  const { window } = dom;
  window.eval(fs.readFileSync(require.resolve('jquery'), 'utf8'));

  const executed = [];
  window.alert = message => executed.push('alert:' + message);

  window.eval(handlerSource());
  // jQuery schedules $(document).ready asynchronously.
  await new Promise(resolve => setTimeout(resolve, 0));
  await new Promise(resolve => setTimeout(resolve, 0));
  window.document.querySelector('.stat-link').click();

  const tbody = window.document.querySelector('#project-table tbody');
  return { tbody, executed };
}

(async () => {
  const { tbody, executed } = await render();
  const nameCell = i => tbody.rows[i].cells[1];

  const checks = [
    ['no element was injected from a project name',
      tbody.querySelectorAll('img, script, svg, iframe').length === 0],
    ['no script executed',
      executed.length === 0],
    ['the payload is rendered as literal text',
      nameCell(0).textContent === PAYLOAD],
    ['the project link is still built, and points at the id',
      nameCell(0).querySelector('a') !== null &&
        nameCell(0).querySelector('a').getAttribute('href') === '/projectid/42'],
    ['one row per project',
      tbody.rows.length === ROWS.length],
    ['a comma in a project name does not shift the columns',
      nameCell(1).textContent === 'comma, in name'],
    ['the owner column keeps name and email apart',
      tbody.rows[0].cells[2].textContent === 'eve' &&
        tbody.rows[0].cells[2].querySelector('span').getAttribute('title') === 'eve@bloomberg.net'],
    ['a missing submission date renders as a dash',
      tbody.rows[1].cells[3].textContent === '-']
  ];

  let failed = 0;
  for (const [name, ok] of checks) {
    if (!ok) failed++;
    console.log((ok ? 'PASS  ' : 'FAIL  ') + name);
  }
  if (DEMO_LEGACY) {
    console.log('\n--demo-legacy: failures above are the expected previous behaviour.');
    console.log(failed ? 'OK - the assertions discriminate.'
                       : 'PROBLEM - the assertions pass against the previous renderer.');
    process.exit(failed ? 0 : 1);
  }
  console.log(failed ? `\n${failed} FAILED` : '\nall assertions passed');
  process.exit(failed ? 1 : 0);
})();
