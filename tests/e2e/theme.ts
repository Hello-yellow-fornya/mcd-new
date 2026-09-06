/** Which theme the build under test carries, and the colours the specs expect from it. */
export const theme = process.env.NEXT_PUBLIC_THEME === 'mcd3' ? 'mcd3' : 'mcd2';
export const isMcd3 = theme === 'mcd3';

export const colours = isMcd3
  ? {
      ink: 'rgb(25, 24, 15)',
      bright: 'rgb(255, 212, 0)',
      onBright: 'rgb(25, 24, 15)',
      paper: 'rgb(247, 245, 239)',
      white: 'rgb(255, 255, 255)',
      sky: 'rgb(255, 246, 201)',
      stone: 'rgb(255, 255, 255)',
      chipText: 'rgb(25, 24, 15)',
    }
  : {
      ink: 'rgb(22, 50, 79)',
      bright: 'rgb(242, 105, 75)',
      onBright: 'rgb(15, 36, 56)',
      paper: 'rgb(247, 245, 240)',
      white: 'rgb(255, 255, 255)',
      sky: 'rgb(191, 214, 230)',
      stone: 'rgb(237, 233, 225)',
      chipText: 'rgb(255, 255, 255)',
    };
