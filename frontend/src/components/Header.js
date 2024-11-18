import { AppBar, Toolbar } from "@mui/material";
import planbuddylogo from "../assets/planbuddylogoInverted.png";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "./theme";

export default function Header() {
  return (
      <ThemeProvider theme={Theme}>
        <AppBar style={{ background: '#335C7D' }}>
          <Toolbar>
            <img src={planbuddylogo} alt="planbuddylogo" />
          </Toolbar>
        </AppBar>
      </ThemeProvider>
  );
}
