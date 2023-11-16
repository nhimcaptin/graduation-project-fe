import { viVN } from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import viLocale from "date-fns/locale/vi";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import ConfirmModal from "./components/ConfirmModal";
import LoadingScreen from "./components/LoadingScreen";
import { AuthProvider } from "./contexts/JWTAuthContext";
import store from "./redux/index";
import routes, { renderRoutes } from "./router/routes";

const theme = createTheme(viVN);


function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
        <ThemeProvider theme={theme}>
          <Router>
            <AuthProvider>{renderRoutes(routes)}</AuthProvider>
          </Router>
        </ThemeProvider>
      </LocalizationProvider>
      <ConfirmModal />
      <LoadingScreen />
    </Provider>
  );
}

export default App;
