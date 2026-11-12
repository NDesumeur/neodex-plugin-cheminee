// lancé par le test « local » de NeoDex : part, fait un saut chargé à fond et vérifie que le grimpeur a monté
// (avec NEO_SHOTS : enchaîne d'autres sauts et garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const key = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('chCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('chCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'cheminee-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await shot('0-depart');
  await key('keydown', ' '); await key('keyup', ' ');  // partir (un appui bref : petit saut)
  await sleep(1200);
  let first = '';
  for (let i = 0; i < 4; i++) {  // sauts chargés à fond (après le premier, une pointe peut finir la partie : seul le premier compte)
    await key('keydown', ' '); await sleep(500); if (i === 1) await shot('1-charge'); await sleep(250); await key('keyup', ' ');
    await sleep(350); if (i === 2) await shot('2-saut'); await sleep(750);
    if (!i) first = await label();
    if (!process.env.NEO_SHOTS) break;
  }
  if (process.env.NEO_SHOTS) { await sleep(6000); await shot('3-fin'); }
  const m = +(/(\d+) mètres/.exec(first) || [])[1];
  if (!(m >= 5)) throw new Error('le grimpeur n\'a pas monté : « ' + first + ' »');
  return first + ' après un saut chargé';
};
