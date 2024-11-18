import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Leaderboard from './pages/Leaderboard';
import ForgotPassword from "./pages/ForgotPassword";
import PrivateCalendar from "./pages/PrivateCalendar";
import GlobalCalendar from "./pages/GlobalCalendar";
import Todo from "./pages/Todo";
import Timer from "./pages/Timer";
import Cookies from "js-cookie";

let loggedIn = Cookies.get("planbuddy-jwt") ? true : false;

function App() {
  return (
    <Routes>
      <Route path="/" element={loggedIn ? <PrivateCalendar /> : <Navigate to="/signin" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/privatecalendar" element={loggedIn ? <PrivateCalendar /> : <Navigate to="/signin" />} />
      <Route path="/globalcalendar" element={loggedIn ? <GlobalCalendar /> : <Navigate to="/signin" />} />
      <Route path="/leaderboard" element={loggedIn ? <Leaderboard /> : <Navigate to="/signin" />} />
      <Route path="/todo" element={loggedIn ? <Todo /> : <Navigate to="/signin" />} />
      <Route path="/timer" element={loggedIn ? <Timer /> : <Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
