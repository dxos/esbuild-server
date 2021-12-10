export type Mode = 'light' | 'dark' | undefined;

export const theme = {
  dark: {
    fg: {
      main: '#AAA',
      header: '#57ACDB',
      story: '#BBB',
      selected: '#DDD',
      bullet: 'orange',
      border: '#555'
    },
    bg: {
      main: '#31313D',
      panel: '#31313D',
      module: '#31313D',
      selected: '#2C2B38'
    }
  },

  light: {
    fg: {
      main: '#666',
      header: '#57ACDB',
      story: '#333',
      selected: '#EEE',
      bullet: '#377BB8',
      border: '#AAA'
    },
    bg: {
      main: '#FAFAFA',
      panel: '#FAFAFA',
      module: '#FAFAFA',
      selected: '#377BB8'
    }
  }
};
