import fs from "node:fs";
import path from "node:path";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { ROOT } from "./util.js";

export const OPTS = {
  family: "PlayfairDisplay, Georgia, serif",
  titleColor: "#ffffff", titleWeight: "600", titleSize: 66, lineHeight: 1.18, titleX: 540, titleY: 225, titleMaxW: 680,
  labelColor: "#2b2b2b", labelWeight: "600", labelSize: 40, labelSpacing: 9, labelX: 540, labelY: 495,
};

export function registerFonts() {
  const dir = path.join(ROOT, "assets/fonts");
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) if (/\.(ttf|otf)$/i.test(f)) GlobalFonts.registerFromPath(path.join(dir, f), f.split(/[-.]/)[0]);
}

export function wrap(ctx, text, maxW) {
  const lines = []; let cur = "";
  for (const w of text.split(" ")) {
    const t = cur ? cur + " " + w : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

async function background() {
  const p = process.env.TEMPLATE_PATH || path.join(ROOT, "assets/template.png");
  if (fs.existsSync(p)) return loadImage(p);
  // Şablon yoksa sade kurumsal zemin (assets/template.png koyarak değiştirin)
  const c = createCanvas(1080, 1080), x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 1080, 1080); g.addColorStop(0, "#2a1f16"); g.addColorStop(1, "#4a3a29");
  x.fillStyle = g; x.fillRect(0, 0, 1080, 1080);
  x.fillStyle = "#f8f7f4"; x.fillRect(140, 400, 800, 140);
  x.strokeStyle = "#bf9b51"; x.lineWidth = 6; x.strokeRect(60, 60, 960, 960);
  x.fillStyle = "#bf9b51"; x.font = "700 34px Georgia, serif"; x.textAlign = "center";
  x.fillText("YILMAZ & ÇOLAK HUKUK BÜROSU", 540, 940);
  return c;
}

/** 1080×1080 PNG üretir: şablon + başlık + hukuk dalı etiketi. */
export async function renderPost(title, branch, o = OPTS) {
  registerFonts();
  const img = await background();
  const W = img.width || 1080, H = img.height || 1080, s = W / 1080;
  const canvas = createCanvas(W, H), ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, W, H);
  ctx.textAlign = "center";
  ctx.fillStyle = o.titleColor;
  ctx.font = `${o.titleWeight} ${o.titleSize * s}px ${o.family}`;
  const lines = wrap(ctx, title, o.titleMaxW * s);
  const lh = o.titleSize * s * o.lineHeight;
  let y = o.titleY * s - ((lines.length - 1) * lh) / 2;
  for (const ln of lines) { ctx.fillText(ln, o.titleX * s, y); y += lh; }
  if (branch) {
    ctx.fillStyle = o.labelColor;
    ctx.font = `${o.labelWeight} ${o.labelSize * s}px ${o.family}`;
    const chars = [...branch], sp = o.labelSpacing * s;
    const ws = chars.map((c) => ctx.measureText(c).width + sp);
    let x = o.labelX * s - (ws.reduce((a, b) => a + b, 0) - sp) / 2;
    ctx.textAlign = "left";
    chars.forEach((c, i) => { ctx.fillText(c, x, o.labelY * s); x += ws[i]; });
  }
  return canvas.toBuffer("image/png");
}
