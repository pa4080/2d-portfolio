import { DIALOGUE_DATA, SCALE_FACTOR } from './constants.js';
import { kCtx } from './kaplay-ctx.js';
import { closeDialogue, displayDialogue, setCamScale } from './utils.js';

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
            displayDialogue(DIALOGUE_DATA[boundary.name], () => (player.isInDialogue = false));
          });
        }
      }

      continue;
    }

    if (layer?.name === 'spawnpoints' && layer?.objects) {
      for (const entity of layer.objects) {
        if (entity.name === 'player') {
          player.pos = kCtx.vec2((map.pos.x + entity.x) * SCALE_FACTOR, (map.pos.y + entity.y) * SCALE_FACTOR);
          kCtx.add(player);
          continue;
        }
      }
    }
  }

  setCamScale(kCtx);
  kCtx.onResize(() => setCamScale(kCtx));

  kCtx.onUpdate(() => {
    kCtx.setCamPos(player.worldPos().x, player.worldPos().y - 100);
  });

  kCtx.onMouseDown(mouseBtn => {
    if (mouseBtn !== 'left' || player.isInDialogue) return;

    const worldMousePosition = kCtx.toWorld(kCtx.mousePos());
    player.moveTo(worldMousePosition, player.speed);

    const mouseAngle = player.pos.angle(worldMousePosition);
    const lowerBound = 50;
    const upperBound = 125;

    if (mouseAngle > lowerBound && mouseAngle < upperBound && player.getCurAnim() !== 'walk-up') {
      player.play('walk-up');
      player.direction = 'up';
      return;
    }

    if (mouseAngle < -lowerBound && mouseAngle > -upperBound && player.getCurAnim() !== 'walk-down') {
      player.play('walk-down');
      player.direction = 'down';
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.getCurAnim() !== 'walk-side') {
        player.play('walk-side');
      }
      player.direction = 'right';
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.getCurAnim() !== 'walk-side') {
        player.play('walk-side');
      }
      player.direction = 'left';
      return;
    }
  });

  kCtx.onKeyDown(key => {
    const keyMap = [
      key === 'right' || key === 'd', // kCtx.isKeyDown('right'), // 0
      key === 'left' || key === 'a', // kCtx.isKeyDown('left'), // 1
      key === 'up' || key === 'w', // kCtx.isKeyDown('up'), // 2
      key === 'down' || key === 's', // kCtx.isKeyDown('down'), // 3
    ];

    let nbOfKeyPressed = 0;
    for (const key of keyMap) {
      if (key) {
        nbOfKeyPressed++;
      }
    }

    if (nbOfKeyPressed > 1) return;
    if (player.isInDialogue) {
      if (key === 'space' || key === 'enter') {
        closeDialogue();
      }
      return;
    }

    if (keyMap[0]) {
      player.flipX = false;
      if (player.getCurAnim() !== 'walk-side') {
        player.play('walk-side');
      }
      player.direction = 'right';
      player.move(player.speed, 0);
      return;
    }

    if (keyMap[1]) {
      player.flipX = true;
      if (player.getCurAnim() !== 'walk-side') {
        player.play('walk-side');
      }
      player.direction = 'left';
      player.move(-player.speed, 0);
      return;
    }

    if (keyMap[2]) {
      player.play('walk-up');
      player.direction = 'up';
      player.move(0, -player.speed);
      return;
    }

    if (keyMap[3]) {
      player.play('walk-down');
      player.direction = 'down';
      player.move(0, player.speed);
      return;
    }
  });

  const stopAnimations = () => {
    if (player.direction === 'down') {
      return player.play('idle-down');
    }

    if (player.direction === 'up') {
      return player.play('idle-up');
    }

    player.play('idle-side');
  };

  kCtx.onMouseRelease(stopAnimations);
  kCtx.onKeyRelease(stopAnimations);
});

kCtx.go('main');
