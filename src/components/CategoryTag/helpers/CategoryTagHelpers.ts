const lastColors = [] as string[];

export const getRandomHexColor = (): string => {
  let newColor = '';

  do {
    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const h = randomInt(0, 360);
    const s = randomInt(45, 100);
    const l = randomInt(25, 75);
    newColor = `hsl(${h},${s}%,${l}%)`;

    if (lastColors.length > 10) {
      lastColors.shift();
    }

    const shouldRegenerate = lastColors.some((color) => {
      return colorDifference(color, newColor) < 30;
    });

    if (shouldRegenerate) continue;

    lastColors.push(newColor);
    break;

    // eslint-disable-next-line no-constant-condition
  } while (true);

  return newColor;
};

const colorDifference = (color1: string, color2: string): number => {
  const h1 = parseInt(color1.slice(4, color1.indexOf(',')));
  const s1 = parseInt(
    color1.slice(color1.indexOf(',') + 1, color1.lastIndexOf(',')),
  );
  const l1 = parseInt(
    color1.slice(
      color1.lastIndexOf(',') + 1,
      color1.indexOf('%', color1.lastIndexOf(',') + 1),
    ),
  );

  const h2 = parseInt(color2.slice(4, color2.indexOf(',')));
  const s2 = parseInt(
    color2.slice(color2.indexOf(',') + 1, color2.lastIndexOf(',')),
  );
  const l2 = parseInt(
    color2.slice(
      color2.lastIndexOf(',') + 1,
      color2.indexOf('%', color2.lastIndexOf(',') + 1),
    ),
  );

  return Math.abs(h1 - h2) + Math.abs(s1 - s2) + Math.abs(l1 - l2);
};

export const getTextColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness > 128) {
    return '#0e1116';
  } else {
    return '#f5f5f5';
  }
};
