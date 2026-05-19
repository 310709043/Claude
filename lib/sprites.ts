/* Sprite library — characters, buildings, items, props.
 * Each sprite uses single-char codes mapped to a palette.
 * Ported from sprites.jsx — pure data + canvas helpers, no React.
 */

import type { Palette } from '@/lib/pixel-engine';

export interface SpriteDef {
  id?: string;
  name?: string;
  sprite: string;
  palette: Palette;
}

export interface FrameDef {
  frames: string[];
  palette: Palette;
}

export interface SkylinePalette {
  body: string;
  edge: string;
  windows: string[];
}

export interface SkylineOpts {
  width: number;
  height: number;
  palette: SkylinePalette;
  seed?: number;
  layer?: 'fg' | 'mg' | 'bg';
}

export const AVATARS = [
  // UI Designer — cat with pink mohawk
  { id: 'designer', name: 'UI 設計師', sprite: `
....AAAAAAAA....
...AOOOOOOOOA...
..AOPPPOPPPPOA..
.AOPPPPPPPPPPOA.
.AOWWOPOOOOWWOA.
.AOPWPOPPOPWPPOA
AOPPPPPPPPPPPPOA
AOPPNNPPPPNNPPOA
AOPPPPPPPPPPPPOA
AOPPPRPPRPPPPOA.
.AOPPPRRRPPPPOA.
.AOPPPPPPPPPPOA.
..AOPPPPPPPPOA..
...AOOOOOOOOA...
....A.....A.....
....A.....A.....
`, palette: { A: '#0a0524', O: '#1a0f3d', P: '#f4c7a8', W: '#fff', N: '#1a0f3d', R: '#ec4899' } },

  // Frontend Dev — fox with glasses + headphones
  { id: 'frontend', name: '前端工程師', sprite: `
....AAAAAAAA....
...AOOOOOOOOA...
..AHOOOOOOOOOHA.
.AHOOFFFFFFFFHOA
AHHFFFFFFFFFFHOA
AHHFFGGFFFGGFFOA
AHGGFFGGFFFGGFOA
AHFFGGGGFFGGGFOA
AHFFFNFFFFNFFFOA
AHFFFFFFFFFFFFOA
.AOFFFFRRFFFFOA.
.AOOFFFFFFFFOOA.
..AOOFFFFFFOOA..
...AOOOOOOOOA...
....A.....A.....
....A.....A.....
`, palette: { A: '#0a0524', O: '#1a0f3d', F: '#fb923c', G: '#0a0524', N: '#0a0524', H: '#a78bfa', R: '#fcd34d' } },

  // Novelist — frog
  { id: 'novelist', name: '小說作家', sprite: `
....AAAAAAAA....
...AGGGGGGGGA...
..AGGGGGGGGGGA..
.AGGGGGGGGGGGGA.
.AGGGWWGGGWWGGA.
AGGGGWBGGGBWGGGA
AGGGGWWGGGWWGGGA
AGGGGGGGGGGGGGGA
AGGGGGGGGGGGGGGA
AGGRGRGGGGRGRGGA
.AGGGRGGGGGGRGGA
.AGGGGRRRRRGGGGA
..AGGGGGGGGGGGA.
...AGGGGGGGGA...
....A.....A.....
....A.....A.....
`, palette: { A: '#0a0524', G: '#86efac', W: '#fff', B: '#0a0524', R: '#16a34a' } },

  // Researcher — owl
  { id: 'researcher', name: '研究員', sprite: `
....AAAAAAAA....
...ATTTTTTTTA...
..ATTBBTTBBTTA..
.ATBYBBBTBBBYBA.
.ATBYYBBBBBYYBA.
ATBYYNBBBBBNYYBA
ATBYYYBBBBBYYYBA
ATBYYBBOOBBBYYBA
ATTBBBOPPOBBBBTA
ATTBBBOOOOBBBBTA
.ATBBBBBBBBBBBA.
.ATBBBBBBBBBBBA.
..ATTBBBBBBBTTA.
...ATTTTTTTTA...
....TT....TT....
....TT....TT....
`, palette: { A: '#0a0524', T: '#3f3a5a', B: '#7c6f9e', Y: '#fcd34d', N: '#0a0524', O: '#fb923c', P: '#0a0524' } },

  // Musician — butterfly headphones
  { id: 'musician', name: '音樂製作人', sprite: `
....AAAAAAAA....
.HHHOOOOOOOOHHH.
.HSSOSSSSSSOSSH.
.HSSOPPPPPPOSSH.
HHSSOPYYYYPOSSHH
HSSSOPYWWYPOSSSH
HSSSOPPNNPPOSSSH
HSSSOPPPPPPOSSSH
.HSSOPPPPPPOSSH.
.HSSOPRRRRPOSSH.
..SOOPPPPPPOOS..
...OPPPPPPPPO...
....OOOOOOOO....
....O......O....
....O......O....
....O......O....
`, palette: { A: '#0a0524', O: '#1a0f3d', P: '#f4c7a8', Y: '#0a0524', W: '#fff', N: '#0a0524', R: '#ec4899', S: '#1a0f3d', H: '#22d3ee' } },

  // Photographer — bear with camera
  { id: 'photo', name: '攝影師', sprite: `
....AAAAAAAA....
...AOOOOOOOOA...
..AOBBBOBBBBOA..
.AOBBBBBBBBBBOA.
.AOBWWBOBWWBOA.
AOBBWBOBOBWBBOA
AOBBBBBOOBBBBOA
AOBBBBBOOBBBBOA
AOBBBPPPPPBBBOA
AOBBBPMMMPBBBOA
.AOBBPMMMPBBOA.
.AOOBPPPPPBOOA.
..AOOBBBBBBOOA.
...AOOOOOOOOA...
....A.....A.....
....A.....A.....
`, palette: { A: '#0a0524', O: '#3a2820', B: '#8b6f47', W: '#fff', P: '#0a0524', M: '#fcd34d' } },

  // Philosopher — owl alt (purple)
  { id: 'philo', name: '哲學家', sprite: `
....AAAAAAAA....
...APPPPPPPPA...
..APPVVPPVVPPA..
.APVYVPPPVYVPPA.
.APVYYVPPVYYVPA.
APVYNYVPPVYNYVPA
APVYYYVPPVYYYVPA
APVYYVOOVVYYVPA
APPVVOPPOVVPPPA
APPVOPPPPOVVPPA
.APPVPPVVPPVPPA.
.APPPPPVVPPPPPA.
..APPPVVVVPPPPA.
...APPPPPPPPA...
....P.....P.....
....P.....P.....
`, palette: { A: '#0a0524', P: '#6d28d9', V: '#a78bfa', Y: '#fcd34d', N: '#0a0524', O: '#fb923c' } },

  // Barista — coffee bean / steam
  { id: 'barista', name: '咖啡師', sprite: `
....AAAAAAAA....
...ABBBBBBBBA...
..ABBBBBBBBBBA..
.ABBBBBBBBBBBBA.
.ABNNBBBBBBNNBA.
ABBBBBBBBBBBBBA
ABBWWBBBBBWWBBA
ABBBBBBBBBBBBBA
ABBBBBBNBBBBBBA
ABBBBPPNPPBBBBA
.ABBBPPPPPPBBA.
.ABBBBPPPPBBBA.
..ABBBBBBBBBBA.
...ABBBBBBBBA...
....B.....B.....
....B.....B.....
`, palette: { A: '#0a0524', B: '#7c4a2a', N: '#fcd34d', W: '#fff', P: '#fff' } },

  // Chef — lion
  { id: 'chef', name: '廚藝者', sprite: `
....WWWWWWWW....
...WWWWWWWWWW...
..WAAAAAAAAAAW..
.AAYYYYYYYYYYAA.
.AYYMMYYYMMYYYA.
AYYYMBYYYBMYYYYA
AYYYMMYYYMMYYYYA
AYYYYYBNBYYYYYA
AYYYYYBBBYYYYYA
AYYYYRRRRRYYYYA
.AYYYYRRRYYYYA.
.AYYYYYRYYYYYA.
..AYYYYYYYYYYA.
...AYYYYYYYYA...
....A.....A.....
....A.....A.....
`, palette: { W: '#fff', A: '#0a0524', Y: '#fbbf24', M: '#fff', B: '#0a0524', N: '#fb923c', R: '#dc2626' } },

  // Data Scientist — panda
  { id: 'data', name: '資料科學家', sprite: `
....AAAAAAAA....
.AAABBAAAABBAAA.
ABBBBBBBBBBBBBBA
ABBWWWWWWWWWWBBA
ABWWWWWWWWWWWWA
AWWBBWWWWBBWWWA
AWWBNBWWBNBWWWA
AWWBBBWWBBBWWWA
AWWWWWBBWWWWWWA
AWWWWWBBWWWWWWA
.AWWBBBWWBBBWWA
.AWWWWWWWWWWWWA
..AAAAAAAAAAAA.
...AWWWWWWWWA...
....A.....A.....
....A.....A.....
`, palette: { A: '#0a0524', B: '#0a0524', W: '#fff', N: '#fcd34d' } },

  // Game enthusiast — unicorn
  { id: 'gamer', name: '玩遊戲', sprite: `
....AAAAAAAA....
...AYYYYYAA.....
..APYYYYAAPA....
.APPPYAPPPPA....
.AWWWPPPPPPA....
APPPPPPPPPPPA...
APPPPPPPPPPPPA..
AWWPPPCCPPCCPPA.
APPPPCNCPPCNCPA.
APPPPCCPPCCPPPA.
.APPPPPPPPPPPA..
.APPPPMMMPPPPA..
..APPPMMMPPPPA..
...APPPPPPPPA...
....P.....P.....
....P.....P.....
`, palette: { A: '#0a0524', P: '#f4c7a8', Y: '#fcd34d', W: '#fff', C: '#22d3ee', N: '#0a0524', M: '#ec4899' } },

  // Crypto trader — crocodile
  { id: 'crypto', name: '幣圈炒貨者', sprite: `
....AAAAAAAA....
...AGGGGGGGGA...
..AGGGGGGGGGGA..
.AGGYGGGGGYGGA.
.AGGYNGGGYNGGGA.
AGGYYGGGYYYGGGA
AGYYGGGGGGYYGGA
AGGGGGGGGGGGGGA
AGGRRRRRRRRGGGA
AGRWWRWWRWWRGGA
.AGRWWRWWRWWRGA
.AGGRRRRRRRRGGA
..AGGGGGGGGGGGA
...AGGGGGGGGA...
....G.....G.....
....G.....G.....
`, palette: { A: '#0a0524', G: '#4ade80', Y: '#fcd34d', N: '#0a0524', R: '#0a0524', W: '#fff' } },

  // Black hat consultant — eagle
  { id: 'blackhat', name: '駭客顧問', sprite: `
....AAAAAAAA....
.AABBBBBBBBBBAA.
ABBBBBBBBBBBBBA
ABBRRBBBBBRRBBA
ABBRYBBBBBYRBBA
ABBBBBBBBBBBBBA
ABBBBNNNNBBBBBA
ABBBNNYYNNBBBBA
ABBBNYYYYNBBBBA
ABBBNNNNNNBBBBA
.ABBBBBBBBBBBA.
.ABBYYBBBYYBBA.
..ABBBBBBBBBBA.
...ABBBBBBBBA...
....B.....B.....
....B.....B.....
`, palette: { A: '#0a0524', B: '#1a0f3d', R: '#ec4899', Y: '#fcd34d', N: '#fb923c' } },

  // UX researcher — dolphin
  { id: 'ux', name: 'UX 研究員', sprite: `
....AAAAAAAA....
...ACCCCCCCCA...
..ACCCCCCCCCCA..
.ACCCCCCCCCCCCA.
.ACWWCCCCCWWCCA.
ACCWBCCCCCBWCCA
ACCWWCCCCCWWCCA
ACCCCCCNNCCCCCA
ACCCCCCNNCCCCCA
ACCCRCCCCCRCCCA
.ACCCRRRRRCCCA.
.ACCCCCCCCCCCA.
..ACCCCCCCCCCA.
...ACCCCCCCCA...
....C.....C.....
....C.....C.....
`, palette: { A: '#0a0524', C: '#22d3ee', W: '#fff', B: '#0a0524', N: '#fbbf24', R: '#0a0524' } },

  // Writer — octopus
  { id: 'writer', name: '文案作家', sprite: `
....AAAAAAAA....
...APPPPPPPPA...
..APPPPPPPPPPA..
.APPPPPPPPPPPPA.
.APWWPPPPPWWPA.
APPWBPPPPPBWPPA
APPWWPPPPPWWPPA
APPPPPPPPPPPPPA
APPPRRRRRRRPPPA
APPRRRRRRRRRPPA
.APRPRPRPRPRPPA
.APRPRPRPRPRPPA
..ARRRRRRRRRR..
...APPPPPPPPA...
....P.....P.....
....P.....P.....
`, palette: { A: '#0a0524', P: '#c084fc', W: '#fff', B: '#0a0524', R: '#a855f7' } },

  // PM — tiger
  { id: 'pm', name: '產品經理', sprite: `
....AAAAAAAA....
.AAYOYYOYYOYOAA.
AYYOYOYOOYOYOYA
AYYYYYOOOOYYYYA
AYWWYYOOOOYYWYA
AYWBYOOOOOOYBYA
AYWWYOOOOOOYWYA
AYYYYYOONNOYYYA
AYYYYOOOOOOYYA
AYYYYRYNNYRYYYA
.AYYRRRRRRRYYA.
.AYYYRRRRRYYYA.
..AYYYYYYYYYYA.
...AYYYYYYYYA...
....Y.....Y.....
....Y.....Y.....
`, palette: { A: '#0a0524', Y: '#fb923c', O: '#0a0524', W: '#fff', B: '#0a0524', N: '#0a0524', R: '#fff' } },

  // Marketing — parrot
  { id: 'marketing', name: '行銷企劃', sprite: `
....AAAAAAAA....
...AYYYYYYYAA...
..AYYRRRRRYYYAA.
.AYRRYYYYYRRYA.
.AYRYYYYYYYYRA.
AYYYYYYYYYYYYA
AYYYBYYYYYBYYA
AYYBBBYYYYBBYA
AYYYBYNNYYBYYA
AYYYYYNNYYYYYA
.AYYYORRRYYYYA
.AYYYORRROYYYA
..AYYYORROYYYY
...AYYYYYYYYA...
....Y.....Y.....
....Y.....Y.....
`, palette: { A: '#0a0524', Y: '#fbbf24', R: '#dc2626', B: '#0a0524', N: '#fff', O: '#fb923c' } },

  // Language learner — bird
  { id: 'lang', name: '語言學習者', sprite: `
....AAAAAAAA....
...AYYYYYYYYA...
..AYYGGGGYYYA...
.AYYGGGGGGYYA...
.AYGGGGGGGYYA...
AYYGGGGGGGYYA...
AYGGBYYGGGYYA...
AYGGBNYGGGYYA...
AYGGGGYGGGYOOA..
AYGGGGGGGGYYOOA.
.AYGGGGGGGYYYA..
.AYGGGGGGGGYYA..
..AYGGGGGGGYYA..
...AYYYYYYYYA...
....Y.....Y.....
....Y.....Y.....
`, palette: { A: '#0a0524', Y: '#86efac', G: '#22c55e', B: '#fff', N: '#0a0524', O: '#fb923c' } },

  // Astronomy lover — moon
  { id: 'astro', name: '天文愛好者', sprite: `
....AAAAAAAA....
...AOOOOOOOOA...
..AOOSSSSOOSOA..
.AOSSSOSSSSOSA.
.AOSSSSSSSOSSSA
AOSSOSSSSSOSSSA
AOSSSSSSSSSSSA
AOSSSSSSSSSSSA
AOSSSSSWWWWSSA
AOSSSSWWWWWSSSA
.AOSSWWMMWWSSA.
.AOSSWMMWSSSSA.
..AOSWWWWSOOSA.
...AOOOOOOOOA...
....O.....O.....
....O.....O.....
`, palette: { A: '#0a0524', O: '#1a0f3d', S: '#312e81', W: '#fcd34d', M: '#fb923c' } },

  // Eco designer — leaf
  { id: 'eco', name: '環境設計師', sprite: `
....AAAAAAAA....
...AGGGGGGGGA...
..AGGEEEEGGGGA..
.AGGEEEGGGGGGGA.
.AGEEGGGGGGGGGA.
AGEEGGGGGGGGGGA
AGEEGGEEGGGGGGA
AGEEEEEEEGGGGGA
AGGEEEEEEGGGGGA
AGGGEEEEEEEGGGA
.AGGEEEEEEEEGA.
.AGGEEEEEEEGGA.
..AGGGEEEEGGGGA
...AGGGGGGGGA...
....G.....G.....
....G.....G.....
`, palette: { A: '#0a0524', G: '#65a30d', E: '#86efac' } },

  // Nurse / health — stethoscope
  { id: 'health', name: '護師', sprite: `
....AAAAAAAA....
...AWWWWWWWWA...
..AWWWWWWWWWWA..
.AWWWRWWWWRWWA.
.AWWWRRWWRRWWA.
AWWWWRRWWRRWWA
AWWWWWBWWWWWWA
AWWWWWBNBWWWWA
AWWWWBNNNBWWWA
AWWWWBNNNBWWWA
.AWWWBBBBBBWA.
.AWWWWBBBBWWWA.
..AWWWWWWWWWWA.
...AWWWWWWWWA...
....W.....W.....
....W.....W.....
`, palette: { A: '#0a0524', W: '#f5f3ff', R: '#ec4899', B: '#dc2626', N: '#fff' } },

  // Teacher — graduation cap
  { id: 'teacher', name: '教師', sprite: `
.BBBBBBBBBBBBBB.
BBYYBBBBBBBBYYBB
.BBBBBBBBBBBBBB.
...AAAAAAAAAA...
..AOOOOOOOOOOA..
.AOPPPPPPPPPPOA.
.AOPWWPPPPWWPOA.
AOPPWBPPPPBWPPOA
AOPPWWPPPPWWPOA
AOPPPPPPPPPPPOA
AOPPPPNNNNPPPOA
.AOPPPNYYNPPPOA
.AOOPPPNNPPPOOA
..AOOOOOOOOOOA..
...O........O...
...O........O...
`, palette: { B: '#1a0f3d', Y: '#fcd34d', A: '#0a0524', O: '#1a0f3d', P: '#f4c7a8', W: '#fff', N: '#dc2626' } },

  // Lawyer — scales
  { id: 'lawyer', name: '律師', sprite: `
....AAAAAAAA....
...AOOOOOOOOA...
..AOOOOOOOOOOA..
.AOPPPPPPPPPPOA.
.AOPWWOPPOWWPOA.
AOPPWBOPPOBWPPOA
AOPPPPOPPOPPPOA
AOPPPPOPPOPPPOA
AOPPPPRRRPPPPOA
AOPPPPRRRPPPPOA
.AOPPPRRRRPPPA.
.AOOPPPPPPPOOA.
..AOOOOOOOOOOA.
...AOOOOOOOOA...
....A.....A.....
....A.....A.....
`, palette: { A: '#0a0524', O: '#1a0f3d', P: '#e4c0a8', W: '#fff', B: '#0a0524', R: '#fcd34d' } },

  // Athlete — running
  { id: 'athlete', name: '運動員', sprite: `
....AAAAAAAA....
...AOOOOOOOOA...
..AOPPPPPPPPOA..
.AOPPPPPPPPPPOA.
.AOPWWPPPPWWPA.
AOPPWBPPPPBWPPOA
AOPPWWPPPPWWPOA
AOPPPPRRRRPPPOA
AOPPPPRRRRPPPOA
AOPPPPPPPPPPPOA
.AOPPCPPPPCPPOA
.AOOPCCPCPCCPOA
..AOOPPPPPPPOOA
...AOOOOOOOOA...
....O.....O.....
....O.....O.....
`, palette: { A: '#0a0524', O: '#1a0f3d', P: '#f4c7a8', W: '#fff', B: '#0a0524', R: '#22d3ee', C: '#1a0f3d' } },

  // Student — books
  { id: 'student', name: '學生', sprite: `
....AAAAAAAA....
...AOOOOOOOOA...
..AOBBOOOOBBOOA.
.AOBBBOOOOBBBOA.
.AOPPPPPPPPPPOA.
AOPPWWPPPPWWPOA
AOPPWBPPPPBWPOA
AOPPWWPPPPWWPOA
AOPPPPPPPPPPPOA
AOPPPPRRRRPPPOA
.AOPPPRRRRPPPA.
.AOORRRRRRRROA.
..AYYYRRRRRYYYA.
...AYYYRRRYYYYA.
....A.....A.....
....A.....A.....
`, palette: { A: '#0a0524', O: '#1a0f3d', B: '#fcd34d', P: '#f4c7a8', W: '#fff', R: '#0a0524', Y: '#22d3ee' } },

  // Content creator — clapperboard
  { id: 'content', name: '內容創作者', sprite: `
.BBBBBBBBBBBBBB.
BWBWBWBWBWBWBWBB
BBWBWBWBWBWBWBB.
.BBBBBBBBBBBBBB.
...AAAAAAAAAA...
..AOPPPPPPPPOA..
.AOPPWWPPPWWPOA.
.AOPPWBPPPBWPOA.
AOPPWWPPPPWWPOA
AOPPPPPNNPPPPOA
AOPPPPPNNPPPPOA
.AOPPPRRRRRPPA.
.AOOPPPPPPPPOOA
..AOOOOOOOOOOA..
...O........O...
...O........O...
`, palette: { B: '#1a0f3d', W: '#fff', A: '#0a0524', O: '#1a0f3d', P: '#f4c7a8', N: '#0a0524', R: '#ec4899' } },

  // Psychologist — brain
  { id: 'psych', name: '心理師', sprite: `
....AAAAAAAA....
...APPPPPPPPA...
..APPRRPPRRPPA..
.APRRRRPRRRRPA.
.APRRPRRRRPRRPA.
APRRRRRRRRRRRPA
APRRPRRRRRRPRPA
APRRRRRPPPRRPA
APRRPRRRRRRPRPA
APRRRRRRRRRRRPA
.APRRPRRRRPRRPA.
.APRRRRRRRRRPA.
..APPRRRRRRPPA.
...APPPPPPPPA...
....P.....P.....
....P.....P.....
`, palette: { A: '#0a0524', P: '#0a0524', R: '#ec4899' } },

  // Accountant — bar chart
  { id: 'accountant', name: '會計師', sprite: `
....AAAAAAAA....
...AWWWWWWWWA...
..AWWWWWWWWWWA..
.AWWWWWWWWWWWWA.
.AWWWBBWBBWBBWA.
AWWWWBBWBBWBBWA
AWWWWBBWBBWBBWA
AWWWWBBWBBWBBWA
AWGGGBBWBBWBBWA
AWGGGGRRWBBWBBA
.AWGGGGGRRWBBA.
.AWGGGGGGGWBBA.
..AWWWWWWWWWBBA
...AWWWWWWWWA...
....W.....W.....
....W.....W.....
`, palette: { A: '#0a0524', W: '#f5f3ff', B: '#22d3ee', G: '#86efac', R: '#dc2626' } },

  // Coder/dev alt — astronaut helmet
  { id: 'astronaut', name: '太空人', sprite: `
....AAAAAAAA....
...AWWWWWWWWA...
..AWCCCCCCCCWA..
.AWCBBBBBBBBCWA.
.AWCBBBBBBBBCWA.
AWCBBBPPPPBBCWA
AWCBBPPPPPPBBCWA
AWCBBPWWWWPBBCWA
AWCBBPWWWWPBBCWA
AWCBBBPPPPBBCWA
.AWCBBBBBBBBCWA.
.AWCBBBBBBBBCWA.
..AWCCCCCCCCWA..
...AWWWWWWWWA...
....A.....A.....
....A.....A.....
`, palette: { A: '#0a0524', W: '#f5f3ff', C: '#a78bfa', B: '#1a0f3d', P: '#22d3ee' } },

  // Locked / mystery
  { id: 'mystery', name: '？？？', sprite: `
....AAAAAAAA....
...A........A...
..A..........A..
.A............A.
.A...YYYYYY...A.
A...YY....YY...A
A...YY....YY...A
A........YY...A
A.......YY....A
A......YY.....A
.A....YY.....A.
.A....YY.....A.
..A...........A.
...A...YY...A...
....A.....A.....
....AAAAAAAAA...
`, palette: { A: '#1a0f3d', Y: '#a78bfa' } },
];

// Fill remaining to 30 by reusing color shifts
while (AVATARS.length < 30) {
  AVATARS.push({ ...AVATARS[AVATARS.length % 24], id: 'extra-' + AVATARS.length, name: '神秘職業' });
}

// ---------- WALKING CHARACTERS (8x14, 2-frame walk) ----------
export function buildWalker(palette: Palette): FrameDef {
  // 2 frames
  const f1 = `
.HHHHH..
.HFFFH..
.HFNNFH.
.HFFFH..
HHCCCCH.
HCBBBCH.
HCBBBCH.
HCBBBCH.
HCBBBCH.
HHCCCCH.
.HLLLH..
.HLLLH..
.HSSSH..
.HS.SH..
`;
  const f2 = `
.HHHHH..
.HFFFH..
.HFNNFH.
.HFFFH..
HHCCCCH.
HCBBBCH.
HCBBBCH.
HCBBBCH.
HCBBBCH.
HHCCCCH.
.HLLLH..
.HLL.H..
.HSSSH..
.H.SSH..
`;
  return { frames: [f1, f2], palette };
}

export const WALKERS = [
  buildWalker({ H: '#0a0524', F: '#f4c7a8', N: '#0a0524', C: '#ec4899', B: '#ec4899', L: '#1a0f3d', S: '#0a0524' }), // pink coder
  buildWalker({ H: '#0a0524', F: '#fbbf24', N: '#0a0524', C: '#22d3ee', B: '#22d3ee', L: '#1a0f3d', S: '#0a0524' }), // cyan
  buildWalker({ H: '#0a0524', F: '#f4c7a8', N: '#0a0524', C: '#a78bfa', B: '#a78bfa', L: '#3f3a5a', S: '#0a0524' }), // purple
  buildWalker({ H: '#0a0524', F: '#86efac', N: '#0a0524', C: '#fbbf24', B: '#fbbf24', L: '#1a0f3d', S: '#0a0524' }), // green head yellow
  buildWalker({ H: '#0a0524', F: '#f4c7a8', N: '#0a0524', C: '#fb923c', B: '#fb923c', L: '#1a0f3d', S: '#0a0524' }), // orange
  buildWalker({ H: '#0a0524', F: '#fcd34d', N: '#0a0524', C: '#dc2626', B: '#dc2626', L: '#1a0f3d', S: '#0a0524' }), // red
  buildWalker({ H: '#0a0524', F: '#f4c7a8', N: '#0a0524', C: '#06d6a0', B: '#06d6a0', L: '#1a0f3d', S: '#0a0524' }), // mint
  buildWalker({ H: '#0a0524', F: '#f4c7a8', N: '#0a0524', C: '#f0abfc', B: '#f0abfc', L: '#3f3a5a', S: '#0a0524' }), // pink alt
];

// Small cat companion
export const CAT_WALK = {
  frames: [`
..BBBBBB..
.BWWWWWWB.
BWBWBBWBWB
BWWWWWWWWB
.BWWWWWWB.
.BBBBBBBB.
B........B
.B......B.
`, `
..BBBBBB..
.BWWWWWWB.
BWBWBBWBWB
BWWWWWWWWB
.BWWWWWWB.
.BBBBBBBB.
.B......B.
B........B
`],
  palette: { B: '#0a0524', W: '#fcd34d' },
};

// Tree pixel
export const TREE = {
  sprite: `
...GGG...
..GGGGG..
.GGGGGGG.
GGGGGGGGG
.GGGGGGG.
..GGGGG..
...GGG...
....B....
....B....
....B....
`,
  palette: { G: '#15803d', B: '#3a2820' },
};

// Bench
export const BENCH = {
  sprite: `
BBBBBBBB
BBBBBBBB
.B....B.
.B....B.
.B....B.
`,
  palette: { B: '#3a2820' },
};

// Lamp post
export const LAMP = {
  sprite: `
.YYY.
YYBYY
YYBYY
.YBY.
..B..
..B..
..B..
..B..
..B..
`,
  palette: { Y: '#fcd34d', B: '#1a0f3d' },
};

// Cars (3 colors, 2-frame for wheel turn)
export function buildCar(body: string, accent?: string): FrameDef {
  return {
    frames: [`
.....BBBBBBBB....
....BBBBBBBBBB...
...BBBBBBBBBBBB..
..BBBWWWBWWWBBB..
.BBBBWWWBWWWBBBB.
BBBBBBBBBBBBBBBBB
.KKKBBBBBBBBKKK..
..KK........KK...
`.replaceAll('B', '#').replaceAll('#', 'X'), `
.....XXXXXXXX....
....XXXXXXXXXX...
...XXXXXXXXXXXX..
..XXXWWWXWWWXXX..
.XXXXWWWXWWWXXXX.
XXXXXXXXXXXXXXXXX
..KKXXXXXXXXKK...
.KK..........KK..
`],
    palette: { X: body, W: '#a78bfa', K: '#0a0524' },
  };
}
// Headlight glow rendered separately

// ---------- BUILDINGS (procedural skyline) ----------
// We'll generate buildings as canvases via drawSkyline.

export function drawSkyline(canvas: HTMLCanvasElement, opts: SkylineOpts) {
  const { width, height, palette, seed = 1, layer = 'fg' } = opts;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);

  // Seeded RNG
  let s = seed;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const minH = layer === 'fg' ? Math.floor(height * 0.55) : Math.floor(height * 0.35);
  const maxH = layer === 'fg' ? Math.floor(height * 0.95) : Math.floor(height * 0.75);

  let x = 0;
  const buildings: { x: number; w: number; h: number; kind: number }[] = [];
  while (x < width + 20) {
    const w = 18 + Math.floor(rng() * 36);
    const h = minH + Math.floor(rng() * (maxH - minH));
    buildings.push({ x, w, h, kind: Math.floor(rng() * 4) });
    x += w + Math.floor(rng() * 4);
  }

  // Sort by height (taller behind for slight depth in fg)
  for (const b of buildings) {
    const yTop = height - b.h;
    // body
    ctx.fillStyle = palette.body;
    ctx.fillRect(b.x, yTop, b.w, b.h);
    // roof tip
    if (b.kind === 0) {
      ctx.fillRect(b.x + b.w / 2 - 1, yTop - 4, 2, 4); // antenna
    } else if (b.kind === 1) {
      ctx.fillStyle = palette.body;
      ctx.fillRect(b.x + 2, yTop - 3, b.w - 4, 3); // smaller roof box
    } else if (b.kind === 2) {
      ctx.fillStyle = palette.body;
      ctx.fillRect(b.x + b.w / 2 - 3, yTop - 6, 6, 6);
      ctx.fillRect(b.x + b.w / 2 - 1, yTop - 10, 2, 4);
    }
    // edge highlight
    ctx.fillStyle = palette.edge;
    ctx.fillRect(b.x, yTop, 1, b.h);
    ctx.fillRect(b.x + b.w - 1, yTop, 1, b.h);
    ctx.fillRect(b.x, yTop, b.w, 1);

    // windows: grid pattern, randomly lit
    const ww = 2; const wh = 3; const gap = 2;
    const cols = Math.floor((b.w - 4) / (ww + gap));
    const rows = Math.floor((b.h - 6) / (wh + gap));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rng() < 0.55) {
          const winColors = palette.windows;
          const col = winColors[Math.floor(rng() * winColors.length)];
          ctx.fillStyle = col;
          const wx = b.x + 2 + c * (ww + gap);
          const wy = yTop + 3 + r * (wh + gap);
          ctx.fillRect(wx, wy, ww, wh);
        }
      }
    }
  }
  return buildings;
}

// Sign tags for buildings (HTML overlaid)
export function buildingTags(direction: 'neon' | 'dusk' | 'rain' = 'neon') {
  const colors = direction === 'dusk'
    ? ['#ffb86b', '#ff6b9d', '#ffd166']
    : direction === 'rain'
    ? ['#00f5d4', '#ff006e', '#8338ec']
    : ['#a78bfa', '#ec4899', '#22d3ee'];
  return [
    { label: 'CAFE', col: colors[0], x: 0.04, y: 0.16 },
    { label: 'HOTEL', col: colors[1], x: 0.13, y: 0.08 },
    { label: 'NEON', col: colors[2], x: 0.22, y: 0.04 },
    { label: 'CODE', col: colors[0], x: 0.32, y: 0.18 },
    { label: 'STORE', col: colors[1], x: 0.41, y: 0.06 },
    { label: 'PIXEL', col: colors[2], x: 0.5, y: 0.12 },
    { label: 'STUDY', col: colors[1], x: 0.62, y: 0.06 },
    { label: 'INK', col: colors[0], x: 0.55, y: 0.32 },
    { label: 'CAFE', col: colors[2], x: 0.75, y: 0.1 },
    { label: 'LOFI BAR', col: colors[1], x: 0.45, y: 0.4 },
  ];
}

// Sprite for tomato (pomodoro)
export const TOMATO_SPRITE = `
....GGG....
...GGGGG...
..RRRRRRR..
.RRRRWRRRR.
.RRWWWWRRR.
RRRWRRRRRR.
RRRRRRRRRR.
RRRRRRRRRR.
.RRRRRRRR..
..RRRRRR...
...RRRR....
`;
export const TOMATO_PAL = { R: '#dc2626', G: '#15803d', W: '#fca5a5' };

// Moon
export const MOON = `
....YYYY....
...YYYYYYY..
..YYYYYBBYY.
.YYYYYYBYYY.
YYYYYYYYYYY.
YYYYBBYYYYY.
YYYYBBYYYYY.
YYYYYYYYYYY.
.YYYYYBYYY..
..YYYYYY....
....YYYY....
`;
export const MOON_PAL = { Y: '#fef9c3', B: '#fcd34d' };

// Sun
export const SUN = `
....YYYY....
...YYYYYYY..
..YYYYYYYYY.
.YYYYYYYYYY.
YYYYYYYYYYYY
YYYYYYYYYYYY
YYYYYYYYYYYY
YYYYYYYYYYYY
.YYYYYYYYYY.
..YYYYYYYYY.
...YYYYYYY..
....YYYY....
`;
export const SUN_PAL = { Y: '#fcd34d' };

// Coffee cup
export const COFFEE = `
.WWWWWWWW.
.W......W.
.W.RRRR.W.
.W.RRRR.W.
.W.BBBB.W.
.WWWWWWWW.
..WWWWWW..
`;
export const COFFEE_PAL = { W: '#f5f3ff', R: '#7c4a2a', B: '#92400e' };

// Star icon
export const STAR = `
..Y..
.YYY.
YYYYY
.YYY.
..Y..
`;
export const STAR_PAL = { Y: '#fcd34d' };

// Trophy
export const TROPHY = `
.YYYYYYY.
.YWWWWWY.
.YWWWWWY.
.YWWWWWY.
B.YYYYY.B
B..YYY..B
.B.YYY.B.
...YYY...
..YYYYY..
.YYYYYYY.
`;
export const TROPHY_PAL = { Y: '#fcd34d', W: '#fff', B: '#fcd34d' };

// Music note
export const NOTE = `
..NN.
.NNN.
NNN..
NN...
NN...
NNNN.
.NN..
`;
export const NOTE_PAL = { N: '#22d3ee' };

