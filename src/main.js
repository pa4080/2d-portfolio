import { SCALE_FACTOR } from './constants.js';
import { kCtx } from './kaplay-ctx.js';
import { displayDialogue } from './utils.js';

kCtx.loadSprite('spritesheet', './spritesheet.png', {
  sliceX: 39,
  sliceY: 31,
  width: 16,
  height: 16,
  anims: {
    'idle-down': 936,
    'walk-down': { from: 936, to: 939, loop: true, speed: 8 },
    'idle-side': 975,
    'walk-side': { from: 975, to: 978, loop: true, speed: 8 },
    'idle-up': 1014,
    'walk-up': { from: 1014, to: 1017, loop: true, speed: 8 },
  },
});

kCtx.loadSprite('map', './map.png');
kCtx.setBackground(kCtx.Color.fromHex('#311047'));

kCtx.scene('main', async () => {
  const mapData = await (await fetch('./map.json')).json();
  const layers = mapData.layers;
  const map = kCtx.make([kCtx.sprite('map'), kCtx.pos(0), kCtx.scale(SCALE_FACTOR)]);
  const player = kCtx.make([
    kCtx.sprite('spritesheet', { anim: 'idle-down' }),
    kCtx.area({ shape: new kCtx.Rect(kCtx.vec2(0, 3), 10, 10) }),
    kCtx.body(),
    kCtx.anchor('center'),
    kCtx.pos(),
    kCtx.scale(SCALE_FACTOR),
    {
      speed: 250,
      direction: 'down',
      isInDialogue: false,
    },
    'player', // tag
  ]);

  kCtx.add(map);

  for (const layer of layers) {
    if (layer?.name === 'boundaries' && layer?.objects) {
      for (const boundary of layer.objects) {
        map.add([
          kCtx.area({
            shape: new kCtx.Rect(kCtx.vec2(0), boundary.width, boundary.height),
          }),
          kCtx.body({ isStatic: true }),
          kCtx.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary?.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            displayDialogue('TODO', () => (player.isInDialogue = false));
          });
        }
      }

      continue;
    }

    if (layer?.name === 'spawnpoints' && layer?.object) {
      for (const entity of layer.objects) {
        if (entity.name === 'player') {
          player.pos = kCtx.vec2((map.pos.x + entity.x) * SCALE_FACTOR, (map.pos.y + entity.y) * SCALE_FACTOR);
          kCtx.add(player);
          continue;
        }
      }
    }
  }

  kCtx.onUpdate(() => {
    kCtx.setCamPos(player.pos.x, player.pos.y + 100);
  });

  kCtx.onMouseDown(mouseBtn => {
    if (mouseBtn !== 'left' || player.isInDialogue) return;

    const worldMousePosition = kCtx.toWorld(kCtx.mousePos());
    player.moveTo(worldMousePosition, player.speed);
  });
});

kCtx.go('main');
