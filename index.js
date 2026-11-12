// Cheminée : un mineur grimpe une cheminée de volcan en sautant d'une paroi à l'autre, avant que la lave ne le rattrape.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Cheminée</span><span class="hint">Maintiens Espace (ou le clic) pour charger, lâche pour sauter · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="chCanvas" width="144" height="204" role="img" aria-label="Cheminée"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="chStats"></div></div>
      <div class="row"><button class="btn main" id="chNew">NOUVELLE ASCENSION</button></div>
      <div class="hint">Plus tu maintiens, plus le saut monte : les points blancs montrent où tu vas atterrir. Un saut bref redescend, pratique pour passer sous une scie. Évite les crocs plantés dans les parois (repérés par une trace rouge) et ramasse les gemmes. La lave monte de plus en plus vite.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,816px);width:auto;aspect-ratio:144/204;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'CHEMINÉE', T: { k: '#0e080c', k2: '#1a0e14', fill: '#24161e', fillOn: '#34202a', hl: '#3e2a34', line: '#6a5060', acc: '#ff8a3a', accL: '#ffd0a0', accS: '#c8541a', accD: '#4a1a08',
  rivet: '#fff0e0', btn: '#3e2a34', btnHi: '#6a5060', btnLo: '#1a0e14', btnHov: '#4e3640', btnHovHi: '#8a6a7a', text: '#f8f0f0', muted: '#c8b0b8', acc2: '#5ee8c8', gold: '#ffd84a',
  orange: '#ff8a3a', red: '#ff4a3a', green: '#7ee07a', green2: '#2f8a3a', bg: '#120a0e', bgDot: '#24161e', bgDot2: '#1a0e14', spark: '#6a2a1a', spark2: '#ff8a3a',
  tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................',
    '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] },
  emblem: ['..kkkk......', '.kggggk.....', 'kggggwgk....', 'kkkkkkkk....', '.kwwwk......', '.kwwwk......', '..kkk.......', 'kooookk.....', 'oorooooo....', 'orrrrooo....', 'rrrrrrrr....'],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Cheminée : on grimpe entre deux parois en sautant de l'une à l'autre ; plus on maintient, plus le saut monte.
   Pointes sur les parois, scies qui vont et viennent, et la lave qui monte par en dessous. 10 px = 1 m ---------- */
const CH = {W: 144, H: 204, WALL: 18, PW: 10, PH: 12, G: .18, VX: 2.6, CHARGE: 40, VMIN: 2.4, VADD: 3.6};
CH.L = CH.WALL; CH.R = CH.W - CH.WALL - CH.PW;  // x du grimpeur accroché à gauche / à droite
const chs = gstore('cheminee', {games: 0, gems: 0, meters: 0});
let ch = null;
// le mineur, de profil vers la droite (accroché à la paroi gauche) ; miroir pour la paroi droite
const CH_PAL = {k: '#1a0e14', h: '#ffd84a', H: '#c89a1a', l: '#fff6b0', s: '#ffd0a8', e: '#1a0e14', r: '#3a8ad8', R: '#1e5aa8', d: '#4a3a5a', b: '#8a4a1a', g: '#f0e8d8'};
const CH_ART = {
  cling: ['...kkkk...', '..khhhlk..', '..kHHHHkk.', '...kssek..', '...ksssk..', 'kg.kkrrk..', 'kgkrrrRrk.', '.kkrrrRrk.', '...kddddk.', '...kdkkdk.', '...kbk.kbk', '...kkk.kkk'],
  crouch: ['..........', '..........', '...kkkk...', '..khhhlk..', '..kHHHHkk.', 'kg.kssek..', 'kgkkkssk..', 'kgkrrrRrk.', '.kkrrrRrk.', '..kddddddk', '..kbbk.kbk', '..kkkk.kkk'],
  jump: ['.g.kkkk...', 'kgkhhhlk..', '.kkHHHHkk.', '..kkssek..', '...ksssk..', '..kkrrrkgk', '..krrrRrkk', '..krrrRrk.', '...kddddk.', '..kddkkdk.', '..kbbk.kbk', '...kk..kk.'],
  fall: ['..........', '...kkkk...', '..khhhlk..', '..kHHHHkk.', 'k..kssek.k', 'gk.ksssk.g', '.kkkrrrkk.', '...krrRk..', '...kddddk.', '..kdk..kdk', '..kbk..kbk', '..kkk..kkk'],
};
const chArt = (rows, flip) => { const c = el('canvas'); c.width = CH.PW; c.height = CH.PH; sprite(c.getContext('2d'), flip ? rows.map(r => [...r].reverse().join('')) : rows, 0, 0, CH_PAL); return c; };
const CH_SPR = Object.fromEntries(Object.entries(CH_ART).map(([k, rows]) => [k, [chArt(rows, false), chArt(rows, true)]]));
const CH_GEM = [['...k...', '..kwk..', '.kwccck', 'kccccck', '.kcCCk.', '..kCk..', '...k...'], ['...k...', '..kck..', '.kcccwk', 'kccccwk', '.kcCCk.', '..kCk..', '...k...']]
  .map(rows => { const c = el('canvas'); c.width = 7; c.height = 7; sprite(c.getContext('2d'), rows, 0, 0, {k: '#1a0e14', w: '#ffffff', c: '#5ee8c8', C: '#2a9a8a'}); return c; });
// la scie : un disque de métal, son moyeu, 8 dents ; 4 images pour la faire tourner
const CH_SAW = [0, 1, 2, 3].map(f => { const c = el('canvas'); c.width = 15; c.height = 15; const g = c.getContext('2d');
  for (let y = 0; y < 15; y++) for (let x = 0; x < 15; x++) { const dx = x - 7, dy = y - 7, d = Math.hypot(dx, dy), a = (Math.atan2(dy, dx) + f * Math.PI / 16 + Math.PI * 2) % (Math.PI / 4);
    const col = d < 1.6 ? '#1a0e14' : d < 2.6 ? '#ffd84a' : d < 5.2 ? ((dx + dy) < -2 ? '#e8e8f0' : '#a8a8b8') : d < 6 ? '#1a0e14' : d < 7.6 && a < Math.PI / 8 ? (d < 6.8 ? '#d8d8e0' : '#1a0e14') : null;
    if (col) px(g, col, x, y); } return c; });
// les parois : blocs de roche volcanique à fissures, en tuile de 64 px de haut (seedée : la même à chaque partie)
function chRock(w, base, hi, lo, crack, seed) {
  const c = el('canvas'); c.width = w; c.height = 64; const g = c.getContext('2d'), r = seeded(seed); px(g, lo, 0, 0, w, 64);
  for (let y = 0, row = 0; y < 64; y += 16, row++) for (let x = -(row % 2) * 7; x < w; x += 14) {
    px(g, base, x + 1, y + 1, 13, 14); px(g, hi, x + 1, y + 1, 13, 1); px(g, hi, x + 1, y + 1, 1, 13);
    if (r() < .5) { let cx = x + 3 + Math.floor(r() * 8), cy = y + 3; for (let i = 0; i < 6; i++) { px(g, crack, cx, cy); cx += Math.round(r() * 2 - 1); cy++; } }
    if (r() < .3) px(g, hi, x + 4 + Math.floor(r() * 6), y + 5 + Math.floor(r() * 6), 2, 1);
  } return c; }
const CH_WALL = chRock(CH.WALL, '#5a3a32', '#7e5646', '#2a1612', '#a8381a', 7), CH_BACK = chRock(CH.W - 2 * CH.WALL, '#2a1a1c', '#342224', '#180e10', '#5a1a10', 21);
const chDiff = () => Math.min(1, ch.top / 3000);
const chHeight = () => Math.max(0, Math.floor(ch.top / 10));
function chNew() {
  ch = Object.assign(ch || {tick: 0, raf: 0}, {seen: ch ? ch.tick : 0, mode: 'ready', x: CH.L, y: 0, vx: 0, vy: 0, side: -1, charge: 0, hold: false, slide: 0, top: 0,
    cam: -CH.H * .6, lava: 150, gems: 0, dead: 0, record: false, spikes: [], saws: [], gemsL: [], dust: [], wallC: [-120, -170], sawC: -230, gemC: -90, rnd: seeded(Math.random() * 1e9 | 0)});
  chGen(ch.cam - CH.H);
}
// crée parois à pointes, scies et gemmes jusqu'à la hauteur upTo (y monde, négatif vers le haut) ; entre deux pointes, toujours au moins 40 px libres
function chGen(upTo) {
  const r = ch.rnd;
  for (const s of [0, 1]) while (ch.wallC[s] > upTo) {
    const d = Math.min(1, -ch.wallC[s] / 3000), len = 12 + Math.floor(r() * (3 + d * 6)) * 6, b = ch.wallC[s];
    ch.spikes.push({side: s ? 1 : -1, a: b - len, b}); ch.wallC[s] = b - len - (40 + r() * (80 - d * 36));
  }
  while (ch.sawC > upTo) {
    const d = Math.min(1, -ch.sawC / 3000), vert = d > .25 && r() < .35;
    ch.saws.push(vert ? {vert: true, side: r() < .5 ? -1 : 1, y0: ch.sawC, amp: 30 + r() * 30, sp: .02 + r() * .015 + d * .02, ph: r() * 6.3}
      : {vert: false, y0: ch.sawC, sp: (.5 + r() * .4 + d * 1.1) * (r() < .5 ? -1 : 1), x: CH.L + CH.PW + 8 + r() * (CH.R - CH.L - CH.PW - 16)});
    ch.sawC -= 150 - d * 60 + r() * 80;
  }
  while (ch.gemC > upTo) { ch.gemsL.push({x: CH.L + 18 + r() * (CH.R - CH.L - 26), y: ch.gemC}); ch.gemC -= 70 + r() * 60; }
}
const chSawPos = s => s.vert ? {x: s.side < 0 ? CH.L + 4 : CH.R + CH.PW - 4, y: s.y0 + Math.sin(ch.tick * s.sp + s.ph) * s.amp} : {x: s.x, y: s.y0};
const chOnSpike = (side, y) => ch.spikes.some(p => p.side === side && y - 2 > p.a && y - CH.PH + 2 < p.b);
let chac = null;
function chBeep(f, d, type = 'triangle', slide = 0, vol = .06) { try { chac ??= new AudioContext(); const o = chac.createOscillator(), g = chac.createGain(), t = chac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(chac.destination); o.start(t); o.stop(t + d); } catch {} }
function chDie(how) {
  if (ch.mode !== 'play') return;
  ch.mode = 'over'; ch.dead = 0; ch.how = how; ch.side = 0; ch.vy = how === 'lave' ? .5 : -3; ch.vx = 0;
  chBeep(how === 'lave' ? 220 : 520, .8, 'sawtooth', 50, .05);
  const m = chHeight(); ch.record = best('cheminee', m); chs.meters += m; chs.gems += ch.gems; saveGames(); chInfo();
}
function chJump() {
  if (ch.side === 0 || (ch.mode !== 'play')) return;
  ch.vy = -(CH.VMIN + ch.charge * CH.VADD); ch.vx = -ch.side * CH.VX; ch.side = 0;
  chBeep(300 + ch.charge * 500, .14, 'square', 600 + ch.charge * 600, .04); ch.charge = 0; ch.slide = 0;
}
function chLand(side) {
  ch.side = side; ch.vx = ch.vy = 0; ch.x = side < 0 ? CH.L : CH.R; ch.slide = 0;
  for (let i = 0; i < 5; i++) ch.dust.push({x: side < 0 ? CH.L : CH.R + CH.PW, y: ch.y - 2 - i * 2, vx: -side * (.3 + Math.random() * .6), vy: -.2 + Math.random() * .4, t: 14});
  if (chOnSpike(side, ch.y)) return chDie('pointes');
  chBeep(140, .06, 'square', 0, .03);
}
function chUpdate() {
  for (const d of ch.dust) { d.x += d.vx; d.y += d.vy; d.t--; } ch.dust = ch.dust.filter(d => d.t > 0);
  if (ch.mode === 'over') { ch.dead++; ch.vy = Math.min(4, ch.vy + (ch.how === 'lave' ? .02 : CH.G)); ch.y += ch.vy; return; }
  if (ch.mode !== 'play') return;
  const d = chDiff();
  if (ch.side !== 0) {  // accroché : on glisse, de plus en plus vite ; on s'accroupit en chargeant
    if (ch.hold) ch.charge = Math.min(1, ch.charge + 1 / CH.CHARGE);
    ch.slide = Math.min(.8, ch.slide + .006); ch.y += ch.slide; if (ch.lava > 0) ch.y = Math.min(ch.y, 0);  // le sol de départ tient tant que la lave ne l'a pas recouvert
    if (chOnSpike(ch.side, ch.y)) return chDie('pointes');
  } else {
    ch.vy = Math.min(6, ch.vy + CH.G); ch.y += ch.vy; ch.x += ch.vx;
    if (ch.lava > 0) ch.y = Math.min(ch.y, 0);
    if (ch.x <= CH.L) chLand(-1); else if (ch.x >= CH.R) chLand(1);
    if (ch.mode !== 'play') return;
  }
  ch.top = Math.max(ch.top, -ch.y);
  // la lave : lente au début, plus pressante en hauteur, et jamais à plus de 180 px sous le grimpeur
  ch.lava = Math.min(ch.lava - (.14 + d * .36), ch.y + 180);
  for (const s of ch.saws) if (!s.vert) { s.x += s.sp; if (s.x < CH.L + 8 || s.x > CH.R + CH.PW - 8) s.sp = -s.sp; }
  const cx = ch.x + CH.PW / 2, cy = ch.y - CH.PH / 2;
  for (const s of ch.saws) { const p = chSawPos(s), nx = Math.max(ch.x + 1, Math.min(p.x, ch.x + CH.PW - 1)), ny = Math.max(ch.y - CH.PH + 1, Math.min(p.y, ch.y - 1)); if (Math.hypot(p.x - nx, p.y - ny) < 5.5) return chDie('scie'); }
  for (const g of ch.gemsL) if (!g.got && Math.abs(g.x + 3 - cx) < 8 && Math.abs(g.y + 3 - cy) < 9) { g.got = true; ch.gems++; chBeep(988, .1, 'square', 1480, .04); }
  if (ch.y - 3 > ch.lava) return chDie('lave');
  // la caméra suit, le monde se crée au-dessus et s'oublie en dessous
  ch.cam += ((ch.y - CH.H * .6) - ch.cam) * .08;
  chGen(ch.cam - CH.H);
  const low = ch.cam + CH.H + 300;
  ch.spikes = ch.spikes.filter(p => p.a < low); ch.saws = ch.saws.filter(s => s.y0 - 70 < low); ch.gemsL = ch.gemsL.filter(g => g.y < low);
}
// la trajectoire que prendrait le saut chargé maintenant : quelques points, jusqu'à la paroi d'en face
function chPath(charge) {
  const pts = []; let x = ch.x, y = ch.y, vy = -(CH.VMIN + charge * CH.VADD), vx = -ch.side * CH.VX;
  for (let i = 1; i < 120; i++) { vy = Math.min(6, vy + CH.G); y += vy; x += vx; if (x <= CH.L || x >= CH.R) { pts.push([x <= CH.L ? CH.L : CH.R, y, true]); break; } if (i % 4 === 0) pts.push([x, y]); }
  return pts;
}
function chDraw() {
  const g = ch.g, {W, H, WALL} = CH, cam = Math.round(ch.cam), sy = y => Math.round(y - cam);
  for (; ch.seen < ch.tick; ch.seen++) if (ch.mode !== 'play') chUpdate();
  g.imageSmoothingEnabled = false;
  // le fond (parallaxe à moitié) et les braises rougeoyantes dans les fissures
  const bo = ((Math.floor(-cam * .5) % 64) + 64) % 64;
  for (let y = bo - 64; y < H; y += 64) g.drawImage(CH_BACK, WALL, y);
  // les parois et leur arête éclairée
  const wo = ((-cam % 64) + 64) % 64;
  for (let y = wo - 64; y < H; y += 64) { g.drawImage(CH_WALL, 0, y); g.save(); g.translate(W, 0); g.scale(-1, 1); g.drawImage(CH_WALL, 0, y); g.restore(); }
  px(g, '#a87a62', WALL - 1, 0, 1, H); px(g, '#a87a62', W - WALL, 0, 1, H); px(g, '#120a0e', WALL, 0, 1, H); px(g, '#120a0e', W - WALL - 1, 0, 1, H);
  // le sol de départ
  if (sy(0) < H) { px(g, '#1a0e14', WALL, sy(0), W - 2 * WALL, H); for (let x = WALL; x < W - WALL; x += 12) { px(g, '#4a3640', x + 1, sy(0) + 1, 10, 6); px(g, '#6a5060', x + 1, sy(0) + 1, 10, 1); } }
  // les pointes : des crocs d'os qui sortent de la paroi
  for (const p of ch.spikes) { const top = sy(p.a), bot = sy(p.b); if (bot < -6 || top > H + 6) continue;
    for (let y = top; y < bot; y += 6) for (let i = 0; i < 5; i++) { const w = 5 - Math.abs(i - 2) * 2, x0 = p.side < 0 ? WALL : W - WALL - w;
      px(g, '#1a0e14', x0 + (p.side < 0 ? 0 : -1), y + i, w + 1, 1); px(g, i < 2 ? '#f0e8d8' : '#b8a898', x0 + (p.side < 0 ? 0 : 1), y + i, Math.max(1, w - 1), 1); }
    px(g, '#7a1a1a', p.side < 0 ? WALL - 2 : W - WALL, top, 2, bot - top); }
  // les gemmes
  for (const gm of ch.gemsL) if (!gm.got && sy(gm.y) > -8 && sy(gm.y) < H) g.drawImage(CH_GEM[(ch.tick >> 4) % 2], Math.round(gm.x), sy(gm.y) + (Math.floor(ch.tick / 12 + gm.x) % 2));
  // les scies et leur rail
  for (const s of ch.saws) { const p = chSawPos(s); if (sy(p.y) < -20 || sy(p.y) > H + 20) continue;
    if (s.vert) px(g, '#120a0e', Math.round(p.x) - 1, sy(s.y0 - s.amp), 2, Math.round(s.amp * 2));
    else for (let x = WALL; x < W - WALL; x += 3) px(g, '#5a4450', x, sy(s.y0), 2, 1);
    g.drawImage(CH_SAW[(ch.tick >> 1) % 4], Math.round(p.x) - 7, sy(p.y) - 7); }
  // la trajectoire prévue pendant la charge
  if (ch.mode === 'play' && ch.side !== 0 && ch.hold) for (const [x, y, end] of chPath(ch.charge)) px(g, end ? '#ffd84a' : '#ffffff', Math.round(x + CH.PW / 2) - (end ? 1 : 0), sy(y - CH.PH / 2) - (end ? 1 : 0), end ? 3 : 1, end ? 3 : 1);
  // le grimpeur
  const face = ch.side ? (ch.side > 0 ? 1 : 0) : (ch.vx < 0 ? 1 : 0), pose = ch.mode === 'over' ? 'fall' : ch.side === 0 ? 'jump' : ch.hold && ch.charge > .05 ? 'crouch' : 'cling';
  if (!(ch.mode === 'over' && ch.how === 'lave' && ch.dead > 30)) g.drawImage(CH_SPR[pose][face], Math.round(ch.x), sy(ch.y) - CH.PH);
  for (const d of ch.dust) px(g, d.t > 7 ? '#c8b8c0' : '#6a5060', d.x, sy(d.y));
  // la jauge de saut, au-dessus de la tête : 8 crans
  if (ch.mode === 'play' && ch.side !== 0 && ch.hold) { const n = Math.round(ch.charge * 8), bx = Math.round(ch.x) - 3, by = sy(ch.y) - CH.PH - 6;
    px(g, '#1a0e14', bx, by, 18, 4); for (let i = 0; i < 8; i++) px(g, i < n ? (n === 8 ? '#ffffff' : i < 3 ? '#7ee07a' : i < 6 ? '#ffd84a' : '#ff8a3a') : '#3a2a32', bx + 1 + i * 2, by + 1, 1, 2); }
  // la lave : la croûte qui ondule, les bulles, une lueur tramée au-dessus
  const lv = sy(ch.lava);
  if (lv < H + 8) {
    for (let y = lv - 14; y < lv; y += 2) for (let x = (y >> 1) % 4; x < W; x += 4 + ((lv - y) >> 2)) px(g, '#ff5a1a', x, y);
    for (let x = 0; x < W; x++) { const wv = Math.round(Math.sin((x + ch.tick * .6) / 7) * 1.5 + Math.sin((x - ch.tick * .4) / 3)); px(g, '#ffd84a', x, lv + wv, 1, 2); px(g, '#ff8a1a', x, lv + wv + 2, 1, 3); px(g, '#e83a10', x, lv + wv + 5, 1, H); }
    for (let i = 0; i < 6; i++) { const bx = (i * 37 + Math.floor(ch.tick / 40) * 13) % W, ph = (ch.tick + i * 23) % 60; if (ph < 30) px(g, ph < 20 ? '#ffd84a' : '#ffffff', bx, lv + 10 - (ph >> 2), 2, 2); }
    for (let y = lv + 9; y < H; y += 5) for (let x = (y * 7) % 11; x < W; x += 11) px(g, '#a8200a', x, y, 3, 1);
  }
  // l'affichage : hauteur, gemmes, alerte
  pxFont(g, chHeight() + ' m', 6, 14, '#ffffff', 12);
  g.drawImage(CH_GEM[0], W - 14, 6); pxFont(g, String(ch.gems), W - 17, 14, '#5ee8c8', 8, 'right');
  if (ch.mode === 'play' && lv - sy(ch.y) < 60 && (ch.tick >> 3) % 2) pxFont(g, 'LA LAVE !', W / 2, H - 22, '#ffd84a', 8, 'center');
  if (ch.mode === 'ready') gameText(g, W, [['CHEMINÉE', '#ff8a3a', 16], ['Maintiens Espace,', '#ffffff'], ['lâche pour sauter', '#ffffff'], ['Plus tu maintiens,', '#b8b0c8'], ['plus tu montes', '#b8b0c8'], ['Record ' + (games.best.cheminee || 0) + ' m', '#ffd84a']], 56);
  if (ch.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace pour reprendre', '#b8b0c8']], 90);
  if (ch.mode === 'over' && ch.dead > 40) gameText(g, W, [[ch.how === 'lave' ? 'ENGLOUTI !' : ch.how === 'scie' ? 'TRANCHÉ !' : 'EMPALÉ !', '#ff8a3a', 12], [chHeight() + ' m · ' + ch.gems + (ch.gems > 1 ? ' gemmes' : ' gemme'), '#ffffff'], [ch.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.cheminee || 0) + ' m', '#ffd84a'], [ch.dead > 60 ? 'Espace : recommencer' : '', '#b8b0c8']], 76);
  if (ch.tick % 30 === 0) g.canvas.setAttribute('aria-label', 'Cheminée : ' + (ch.mode === 'play' ? chHeight() + ' mètres, ' + ch.gems + ' gemmes' : ch.mode === 'over' ? 'partie finie à ' + chHeight() + ' mètres' : ch.mode === 'pause' ? 'pause' : 'prêt'));
}
function chInfo() {
  $('chStats').replaceChildren(...[['Plus haut', (games.best.cheminee || 0) + ' m'], ['Parties', chs.games], ['Gemmes', chs.gems], ['Total grimpé', chs.meters + ' m']].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
// appuyer : partir, reprendre ou recommencer, ou commencer à charger ; relâcher : sauter
function chPress() {
  if (ch.mode === 'ready') { ch.mode = 'play'; chs.games++; saveGames(); }
  else if (ch.mode === 'pause') { ch.mode = 'play'; return; }
  else if (ch.mode === 'over') { if (ch.dead > 60) chNew(); return; }
  ch.hold = true;
}
function chRelease() { if (!ch.hold) return; ch.hold = false; chJump(); }
const CH_KEYS = [' ', 'ArrowUp', 'w', 'z', 'Enter'];
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !ch || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (CH_KEYS.includes(e.key)) { e.preventDefault(); if (!e.repeat) chPress(); }
  if ((e.key.toLowerCase() === 'p' || e.key === 'Escape') && ch.mode === 'play') { ch.mode = 'pause'; ch.hold = false; ch.charge = 0; }
});
document.addEventListener('keyup', e => { if (ch && CH_KEYS.includes(e.key)) chRelease(); });
$('chCanvas').onpointerdown = e => { e.preventDefault(); if (ch) chPress(); };
document.addEventListener('pointerup', () => { if (ch) chRelease(); });
$('chNew').onclick = () => { chNew(); $('chNew').blur(); };
{  // vérification : saut chargé = monte de plus de 80 px, saut bref = redescend ; toujours 40 px libres entre deux pointes d'une paroi
  const keep = ch, realBest = games.best.cheminee, realStats = {...chs}; ch = null;
  const jump = c => { chNew(); ch.mode = 'play'; ch.y = -400; ch.lava = 999; ch.saws = []; ch.spikes = []; ch.wallC = [-1e9, -1e9]; ch.sawC = ch.gemC = -1e9; ch.charge = c; chJump(); let n = 0; while (ch.side === 0 && n++ < 300) chUpdate(); return {dy: ch.y + 400, side: ch.side}; };
  const full = jump(1), tap = jump(0);
  chNew(); chGen(-20000); let gaps = true;
  for (const s of [-1, 1]) { const l = ch.spikes.filter(p => p.side === s).sort((a, b) => b.b - a.b); for (let i = 1; i < l.length; i++) if (l[i - 1].a - l[i].b < 40) gaps = false; }
  console.assert(full.side === 1 && full.dy < -80 && tap.side === 1 && tap.dy > 0 && gaps, 'cheminee', {full, tap, gaps});
  if (realBest === undefined) delete games.best.cheminee; else games.best.cheminee = realBest; Object.assign(chs, realStats);
  ch = keep;
}
ctx.onOpen(() => {
  if (!ch || !ch.g) { chNew(); ch.g = $('chCanvas').getContext('2d'); }
  gameLoop(ch, 'cheminee', chUpdate, chDraw); chInfo();
});
}
