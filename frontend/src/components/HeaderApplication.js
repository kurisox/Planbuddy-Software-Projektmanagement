import { AppBar, Button, ButtonGroup, Toolbar } from "@mui/material";
import planbuddylogo from "../assets/planbuddylogoInverted.png";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "./theme";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import CONFIG from "../config";
import Cookies from 'js-cookie';

export default function HeaderApplication() {
  return (
    <ThemeProvider theme={Theme}>
      <AppBar style={{ background: "#335C7D" }}>
        <Toolbar>
          <a href="/">
            <img src={planbuddylogo} alt="planbuddylogo" />
          </a>
          <ButtonGroup variant="text" aria-label="text button group">
            <Box>
              <Button href="/privatecalendar" style={{ color: "#FFFFFF" }}>
                Private Calendar
              </Button>
            </Box>
            <Box>
              <Button href="/globalCalendar" style={{ color: "#FFFFFF" }}>Global Calendar</Button>
            </Box>
            <Box>
              <Button href="/todo" style={{ color: "#FFFFFF" }}>TODO</Button>
            </Box>
            <Box>
              <Button href="/timer" style={{ color: "#FFFFFF" }}>Timer</Button>
            </Box>
          </ButtonGroup>
          <Typography sx={{ flexGrow: 1 }}>
          </Typography>
          <FontAwesomeIcon style={{ color: "#FFFFFF" }} icon={faSignOutAlt} 
            onClick={() => { 
              Cookies.remove('planbuddy-jwt'); 
              Cookies.remove('planbuddy-user');
              window.location = CONFIG.frontendURL + 'signin';
            }} 
          />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
