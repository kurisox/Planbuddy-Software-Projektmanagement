import { createTheme } from '@mui/material/styles';

const planbuddyTheme = createTheme({
    palette: {
      primary: {
        main: '#335C7D',
      },
      secondary: {
          main: '#335C7D',
      }
    },
    labelColors: {
        red: '#EA797E',
        blue: '#8DC5FB',
        green: '#71DC6F',
        yellow: '#D9B94B',
    },
    pomodoroColors: {
        red: '#DD6662',
    }
});

export default planbuddyTheme;