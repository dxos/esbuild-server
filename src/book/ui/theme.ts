export type Mode = 'light' | 'dark' | undefined;

// https://mui.com/customization/color
export const theme = {
  dark: {
    bg: {
      main: '#263238',
      panel: '#263238',
      module: '#263238',
      selected: '#546e7a'
    },
    fg: {
      main: '#AAA',
      header: '#57ACDB',
      story: '#BBB',
      selected: '#DDD',
      bullet: '#d32f2f',
      border: '#263238'
    }
  },

  light: {
    bg: {
      main: '#FAFAFA',
      panel: '#FAFAFA',
      module: '#FAFAFA',
      selected: '#377BB8'
    },
    fg: {
      main: '#666',
      header: '#57ACDB',
      story: '#333',
      selected: '#EEE',
      bullet: '#377BB8',
      border: '#AAA'
    }
  }
};
