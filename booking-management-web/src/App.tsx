import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayoutAdmin from "./layouts/MainLayoutAdmin";
import { Booking, Dashboard, Employee, Room, RoomDetail } from "./pages/pages-admin";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}

        <Route path="/admin" element={<MainLayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="booking" element={<Booking />} />
          <Route path="room" element={<Room />} />
          <Route path="room/detail" element={<RoomDetail />} />
          <Route path="employee" element={<Employee />} />
        </Route>

        {/* <Route path="/" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="profile" element={<UserProfile />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
