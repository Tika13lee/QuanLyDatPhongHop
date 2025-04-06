import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayoutAdmin from "./layouts/MainLayoutAdmin";
import {
  ApprovalList,
  Dashboard,
  Device,
  Employee,
  Location,
  Overview,
  Price,
  Room,
  RoomDetail,
  Service,
} from "./pages/pages-admin";
import MainLayoutUser from "./layouts/MainLayoutUser";
import {
  ApprovedList,
  RequestList,
  BookingSearch,
  Booking,
  RejectedList,
  Schedule,
  ViewSchedule,
  ListApprovalByApprover,
  FrequencySchedules,
} from "./pages/pages-user";
import { Home, Login } from "./pages/general";
import { Provider } from "react-redux";
import store from "./app/store";
import ScheduleList from "./pages/pages-user/schedule/ScheduleList";
import Notification from "./pages/pages-user/notification/Notification";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<MainLayoutAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="overview" element={<Overview />} />
            <Route path="approval-list" element={<ApprovalList />} />
            <Route path="room" element={<Room />} />
            <Route path="room/detail/:id" element={<RoomDetail />} />
            <Route path="location" element={<Location />} />
            <Route path="device" element={<Device />} />
            <Route path="service" element={<Service />} />
            <Route path="price" element={<Price />} />
            <Route path="employee" element={<Employee />} />
          </Route>

          <Route path="/user" element={<MainLayoutUser />}>
            <Route index element={<BookingSearch />} />
            <Route path="booking" element={<Booking />} />
            <Route path="booking-list" element={<RequestList />} />
            <Route path="detail/:id" element={<ViewSchedule />} />
            <Route path="approve" element={<ListApprovalByApprover />} />
            <Route path="approved" element={<ApprovedList />} />
            <Route path="rejected" element={<RejectedList />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="schedulelist" element={<ScheduleList />} />
            <Route path="schedule-frequency" element={<FrequencySchedules />} />
            <Route path="notification" element={<Notification />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
