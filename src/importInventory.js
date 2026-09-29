// Kullanım: node src/importInventory.js <platform> <dosya.txt>
// platform: google | instagram | linkedin_kurumsal | linkedin_kisisel  — dosyada her satır bir konu.
import fs from "node:fs";
import path from "node:path";
import { ROOT, normTopic } from "./util.js";
const [platform, file] = process.argv.slice(2);
if (!platform || !file) { console.error("Kullanım: node src/importInventory.js <platform> <dosya.txt>"); process.exit(1); }
const target = path.join(ROOT, "data/inventory", platform + ".txt");
const have = new Set(fs.existsSync(target) ? fs.readFileSync(target, "utf8").split("\n").map(normTopic) : []);
const add = fs.readFileSync(file, "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !have.has(normTopic(l)) && have.add(normTopic(l)));
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.appendFileSync(target, add.map((l) => l + "\n").join(""));
console.log(`${add.length} yeni konu eklendi → ${target}`);
