import assert from "node:assert/strict";

import { combineSvgPages, splitJianpuSvgPages } from "../lib/svg-pages.ts";

const pageOne = '<svg width="1000" height="1415" viewBox="0 0 1000 1415"><defs><g id="glyph"><path d="M0 0"/></g></defs><use xlink:href="#glyph"/></svg>';
const pageTwo = '<svg width="1000" height="1415" viewBox="0 0 1000 1415"><defs><g id="glyph"><path d="M1 1"/></g></defs><use xlink:href="#glyph"/></svg>';
const combined = combineSvgPages([pageOne, pageTwo]);
const pages = [...combined.matchAll(/<svg x="0" y="\d+" width="1000" height="1415" viewBox="0 0 1000 1415">([\s\S]*?)<\/svg>/g)];

assert.equal(pages.length, 2, "both score pages should be included");
assert.equal(pages[0][1], pageOne.slice(pageOne.indexOf(">") + 1, pageOne.lastIndexOf("</svg>")), "page one should remain unchanged");
assert.equal(pages[1][1], '<defs><g id="fenye-page-1-glyph"><path d="M1 1"/></g></defs><use xlink:href="#fenye-page-1-glyph"/>', "page two references should use page-local IDs");
assert.match(combined, /width="1000" height="2830" viewBox="0 0 1000 2830"/, "combined export should stack page-sized viewports");
assert.deepEqual(
  splitJianpuSvgPages(`${pageOne}[fenye]${pageTwo}`),
  [pageOne, pageTwo],
  "fenye delimiters should return separate SVG pages",
);
assert.deepEqual(
  splitJianpuSvgPages('<svg><use code="1&dy" title="already &amp; escaped"/></svg>'),
  ['<svg><use code="1&amp;dy" title="already &amp; escaped"/></svg>'],
  "SVG ampersands should be escaped without changing existing entities",
);

console.log("Verified fenye page splitting and stacked SVG export.");
