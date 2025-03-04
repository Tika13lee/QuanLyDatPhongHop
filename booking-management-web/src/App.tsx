import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayoutAdmin from "./layouts/MainLayoutAdmin";
import {
  BookingMgmt,
  Dashboard,
  Employee,
  Location,
  Room,
  RoomDetail,
} from "./pages/pages-admin";
import MainLayoutUser from "./layouts/MainLayoutUser";
import { Booking } from "./pages/pages-user";
import { Home, Login } from "./pages/general";
import { Provider } from "react-redux";
import store from "./app/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<MainLayoutAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="booking-mgmt" element={<BookingMgmt />} />
            <Route path="room" element={<Room />} />
            <Route path="room/detail/:id" element={<RoomDetail />} />
            <Route path="location" element={<Location />} />
            <Route path="employee" element={<Employee />} />
          </Route>

          <Route path="/user" element={<MainLayoutUser />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<Booking />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
