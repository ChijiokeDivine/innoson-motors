/**
 * Vehicle Full Detail (node 510:253) assets.
 * Run soon — Figma MCP URLs expire ~7 days after generation.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ASSETS = {
  "images/hero-caris.png":
    "https://www.figma.com/api/mcp/asset/37c1f7d0-1cbb-4cea-8fcc-9b84c04ff6a8.png",
  "images/quote-car.png":
    "https://www.figma.com/api/mcp/asset/7ca0826e-2b6a-418f-b093-8506d90ff5ce.png",
  "icons/icon-cancel.svg":
    "https://www.figma.com/api/mcp/asset/56beaa34-294d-41b4-ab14-f798f080f6da.svg",
  "images/hero-caris-mobile.png":
    "https://www.figma.com/api/mcp/asset/87207fde-c8ec-4c16-9580-2156cd9fad01.png",
  "images/interior-hero.png":
    "https://www.figma.com/api/mcp/asset/e32c61cd-9d33-4ac0-92da-de759eef0439.png",
  "images/interior-detail-1.png":
    "https://www.figma.com/api/mcp/asset/6486e2f1-185d-4f4a-b2f3-7d94c1964a84.png",
  "images/interior-detail-2.png":
    "https://www.figma.com/api/mcp/asset/5ad4a032-7d1e-49ba-b1d2-889ec0695c93.png",
  "images/exterior-hero.png":
    "https://www.figma.com/api/mcp/asset/9a7d5c0f-3f01-4695-b014-d542acd698b3.png",
  "images/exterior-detail-1.png":
    "https://www.figma.com/api/mcp/asset/bff42686-6be0-41bf-8e5f-01af08656948.png",
  "images/exterior-detail-2.png":
    "https://www.figma.com/api/mcp/asset/bda6a0fe-3ccd-4e52-bdfc-7e2b47c76904.png",
  "images/testimonial-1.png":
    "https://www.figma.com/api/mcp/asset/07ffd021-b1cc-431f-8549-3c22ed0c9c16.png",
  "images/testimonial-2.png":
    "https://www.figma.com/api/mcp/asset/3c52cbe2-fdb7-419a-a293-d6664c1ba90e.png",
  "images/tech-reverse-camera.png":
    "https://www.figma.com/api/mcp/asset/67f5131b-4216-44f1-b1ed-3c2b11588dfe.png",

  "icons/icon-nav-arrow.svg":
    "https://www.figma.com/api/mcp/asset/b64964ca-ac5c-4725-b41c-b497f81936d3.svg",
  "icons/icon-nav-arrow-alt.svg":
    "https://www.figma.com/api/mcp/asset/383fe7f1-59f4-4df2-bc9f-dea376b88cdc.svg",
  "icons/icon-nav-left.svg":
    "https://www.figma.com/api/mcp/asset/f85edf3c-d040-4859-9ede-e0ab3eb17023.svg",
  "icons/icon-nav-right.svg":
    "https://www.figma.com/api/mcp/asset/b18a7fe2-4748-4d97-9d43-e334cbab83d7.svg",
  "icons/icon-plus.svg":
    "https://www.figma.com/api/mcp/asset/02aaf322-d4fb-4779-b6fa-447e2d171fc9.svg",
  "icons/icon-minus.svg":
    "https://www.figma.com/api/mcp/asset/48c64a14-21f1-47d8-b5c9-3c4f87b61ce3.svg",
  "icons/icon-pause.svg":
    "https://www.figma.com/api/mcp/asset/ad4ad0d4-dbcb-4515-b46e-220340d53bcf.svg",
  "icons/icon-arrow-up-right.svg":
    "https://www.figma.com/api/mcp/asset/8bc86b1a-d64f-48de-99d9-83e4c46fca69.svg",
  "icons/icon-pdf.svg":
    "https://www.figma.com/api/mcp/asset/59413834-ce06-4878-a601-e12f1f66da9c.svg",
};

const PUBLIC_DIR = join(process.cwd(), "public");

async function main() {
  let ok = 0;
  let failed = 0;
  for (const [path, url] of Object.entries(ASSETS)) {
    const dest = join(PUBLIC_DIR, path);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      console.log(`✔ ${path}`);
      ok++;
    } catch (e) {
      console.error(`✘ ${path} — ${e.message}`);
      failed++;
    }
  }
  console.log(`\nDone: ${ok} ok, ${failed} failed.`);
}

main();