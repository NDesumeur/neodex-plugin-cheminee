// lancé par le test « local » de NeoDex : la vérification interne (sauts, crocs, bottes, casque, piolet, paliers), un saut chargé au clavier,
// une ascension à la manette, le magasin de gemmes, les paliers de décor (cristaux, sous les étoiles), le plein écran et la place prise
// (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const key = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('chCanvas').getAttribute('aria-label')`);
  const C = code => pj(`(() => { const T = document.getElementById('chCanvas').__ch, ch = T.st(), CH = T.CH, chs = T.chs; ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('chCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'cheminee-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await shot('0-depart');
  await key('keydown', ' '); await key('keyup', ' '); await sleep(1200);  // partir (un appui bref : petit saut)
  await key('keydown', ' '); await sleep(750); await key('keyup', ' '); await sleep(1100);
  const first = await label(), m = +(/(\d+) mètres/.exec(first) || [])[1];
  if (!(m >= 5)) throw new Error('le grimpeur n\'a pas monté : « ' + first + ' »');
  // la manette : A part, A maintenu puis lâché saute
  await pj(`document.getElementById('chNew').click(), 0`); await sleep(200);
  await pj(`(() => { const pad = {axes: [0, 0], buttons: Array.from({length: 17}, () => ({pressed: false}))}; window.__pad = pad; navigator.getGamepads = () => [pad]; return 0; })()`);
  await pj(`(__pad.buttons[0].pressed = true, 0)`); await sleep(100); await pj(`(__pad.buttons[0].pressed = false, 0)`); await sleep(1200);
  if (await C('return ch.mode;') !== 'play') throw new Error('A ne lance pas l\'ascension');
  await pj(`(__pad.buttons[0].pressed = true, 0)`); await sleep(500); await shot('1-charge'); await sleep(250); await pj(`(__pad.buttons[0].pressed = false, 0)`); await sleep(1100);
  const top = await C('return Math.floor(ch.top / 10);'); if (!(top >= 5)) throw new Error('le saut à la manette ne monte pas : ' + top + ' m');
  await pj(`(__pad.buttons[9].pressed = true, 0)`); await sleep(100); await pj(`(__pad.buttons[9].pressed = false, 0)`); await sleep(100);
  if (await C('return ch.mode;') !== 'pause') throw new Error('Start ne met pas en pause');
  await pj(`navigator.getGamepads = () => [], 0`);
  // le magasin : des gemmes pour le test (rendues à la fin), les trois objets achetés
  const keep = await C('return JSON.stringify({w: chs.wallet, s: chs.shop});');
  await pj(`document.getElementById('chNew').click(), 0`); await sleep(100);
  await C('chs.wallet = 200; chs.shop = {}; return 0;');
  const bought = await C(`return ['piolet', 'bottes', 'casque'].map(T.buy).join(',') + '|' + chs.wallet + '|' + ch.piolet + ch.casque;`);
  if (bought !== 'true,true,true|80|truetrue') throw new Error('magasin : ' + bought);
  const btns = await pj(`[...document.querySelectorAll('#chShop .btn')].map(b => b.textContent.trim() + (b.disabled ? '#' : '')).join('|')`);
  if (!/PIOLET · ACHETÉ#\|BOTTES · ACHETÉ#\|CASQUE · ACHETÉ#/.test(btns)) throw new Error('boutons du magasin : ' + btns);
  await sleep(200); await shot('2-objets');
  // les paliers : les cristaux à 150 m, la sortie du volcan à 300 m
  for (const [h, n] of [[1500, '3-cristaux'], [3000, '4-etoiles']]) {
    await C(`ch.mode = 'play'; ch.y = -${h}; ch.top = ${h} - 20; ch.side = -1; ch.x = CH.L; ch.cam = -${h} - CH.H * .6; ch.lava = -${h} + 170; ch.spikes = []; ch.saws = []; ch.wallC = [-${h} - 400, -${h} - 400]; ch.sawC = ch.gemC = -${h} - 300; return 0;`);
    await sleep(700); await shot(n);
    const t = await C('return T.tier(-ch.top) + "|" + (ch.banner ? ch.banner.text : "");');
    if (t !== (h === 1500 ? '1|LES CRISTAUX' : '2|SOUS LES ÉTOILES')) throw new Error('palier à ' + h / 10 + ' m : ' + t);
  }
  await C(`const k = ${keep}; chs.wallet = k.w; chs.shop = k.s; T.st().mode = 'pause'; return 0;`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.getElementById('chFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('chCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && Math.abs(r.height - innerHeight) < 3; })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('chCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('chCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · ' + m + ' m au clavier · ' + top + ' m à la manette · magasin · cristaux et étoiles · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
