// Tek dosyalık çıktı üretir: dist/YilmazColakStudio.jsx (Claude artifact'ına yapıştırılabilir)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const inv = readFileSync(new URL("./inventory.js", import.meta.url), "utf8").replace(/^export /gm, "");
let src = readFileSync(new URL("./Studio.src.jsx", import.meta.url), "utf8")
  .replace(/^import \{[^}]*\} from "\.\/inventory\.js";\n/m, "")
  .replace("/*__INVENTORY_INLINE__*/", inv);
mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("./dist/YilmazColakStudio.jsx", import.meta.url), src);
console.log("dist/YilmazColakStudio.jsx", src.length, "karakter");
