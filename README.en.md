# Chimney

A pixel art climbing game: a miner climbs a volcano chimney by jumping from one wall to the other, while the lava rises under his feet. Climb as high as you can.

*Version française : [README.md](README.md)*

## Controls

- **Space**, **↑** or **click**: hold to charge the jump, release to jump to the opposite wall.
- **P** or **Esc**: pause.
- **Gamepad**: hold **A** (or B, X, Y, RB, RT, d-pad up) to charge, release to jump; **Start** to pause.
- **FULLSCREEN**: the chimney fills the screen. On a big screen, the playfield grows with the window.

## How it works

- **The longer you hold, the higher the jump.** While charging, a gauge shows above the miner and white dots show the path, up to where he will land.
- A **short jump** barely rises, then goes down: handy to pass under a saw or land below spikes.
- Hanging on a wall, the miner **slides** faster and faster: he cannot wait long.
- The **fangs** stuck in the walls are deadly, when landing as well as when sliding. A red streak in the rock marks them. Between two groups of fangs there are always at least 4 m free.
- The **saws** move back and forth between the walls. Higher up, others go up and down along the walls.
- **Gems** are picked up in flight.
- The **lava** rises faster and faster with height, and is never far behind.

## The gem shop

The gems you pick up go to your purse (those from earlier games are already there). Three items, bought once and for all:

- **Ice axe** (30 gems): once per climb, while falling, press to drive it into the nearest wall and hang on.
- **Boots** (50 gems): charged jumps go 15 % higher.
- **Helmet** (40 gems): once per climb, a fang does not kill you; the helmet shatters and you get a short moment to get clear.

The ice axe and helmet still ready are shown at the top left, under the height.

## Climbing higher

The volcanic rock gives way to **crystals** at 100 m, then to the **volcano's mouth under the stars** at 250 m, with a banner at each step.

## Statistics

The Records panel keeps your **highest climb**, the number of **games**, the **gems** picked up and the **total climbed**.

## Data and sync

Your record and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Chimney → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
