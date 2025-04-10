import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useFetch from "../../../hooks/useFetch";
import { BranchProps } from "../../../data/data";

const cx = classNames.bind(styles);

const todayMeetings = 30;
const todayCost = 15000000;
const todayRooms = 10;

// truyền id chi nhánh
const phongBanData = [
  { name: "P.KD", chiPhi: 5000000, soCuocHop: 22 },
  { name: "P.NS", chiPhi: 4000000, soCuocHop: 2 },
  { name: "P.KT", chiPhi: 6000000, soCuocHop: 12 },
  { name: "IT", chiPhi: 6000000, soCuocHop: 14 },
  { name: "Kế toán", chiPhi: 6000000, soCuocHop: 10 },
  { name: "P.KT", chiPhi: 6000000, soCuocHop: 9 },
  { name: "P.KT", chiPhi: 6000000, soCuocHop: 2 },
  { name: "P.KT", chiPhi: 6000000, soCuocHop: 3 },
];

const Dashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  // lấy chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  const { data: timeData } = useFetch<[]>(
    // `http://localhost:8080/api/v1/statistical/statisticalService?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
    `http://localhost:8080/api/v1/statistical/statisticalChart24h?startDate=2025-04-01T17:00:00.000Z&endDate=2025-04-30T17:00:00.000Z`
  );

  return (
    <div className={cx("dashboard")}>
      <div className={cx("header")}>
        <h2>Dữ liệu trong ngày</h2>
        <div className={cx("summaryCards")}>
          <div className={cx("summaryCard")}>
            <h3>Tổng số cuộc họp</h3>
            <p>{todayMeetings}</p>
          </div>
          <div className={cx("summaryCard")}>
            <h3>Số lịch hoàn thành</h3>
            <p>{todayMeetings}</p>
          </div>
          <div className={cx("summaryCard")}>
            <h3>Số lịch đã hủy</h3>
            <p>{todayMeetings}</p>
          </div>
          <div className={cx("summaryCard")}>
            <h3>Tổng chi phí</h3>
            <p>{todayCost.toLocaleString()} VNĐ</p>
          </div>
          <div className={cx("summaryCard")}>
            <h3>Phòng đang sử dụng</h3>
            <p>{todayRooms}</p>
          </div>
          <div className={cx("summaryCard")}>
            <h3>Số lượt truy cập</h3>
            <p>{todayRooms}</p>
          </div>
        </div>
      </div>

      <div className={cx("card")}>
        <h2>Chi phí & số cuộc họp theo giờ</h2>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={timeData ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className={cx("custom-tooltip")}>
                      <p>Chi phí: {data.total.toLocaleString()} VNĐ</p>
                      <p>Số cuộc họp: {data.count}</p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend />
            <Bar
              yAxisId="left"
              dataKey="total"
              fill="#82ca9d"
              name="Chi phí"
              barSize={30}
            />
            <Bar
              yAxisId="right"
              dataKey="count"
              fill="#ffc658"
              name="Số cuộc họp"
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={cx("card")}>
        <div className={cx("cardHeader")}>
          <h2>
            Chi phí và số cuộc họp theo phòng ban của 1 chi nhánh trong 1 ngày
          </h2>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {branchs?.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={phongBanData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="chiPhi"
              fill="#82ca9d"
              name="Chi phí"
              barSize={30}
            />
            <Bar
              yAxisId="right"
              dataKey="soCuocHop"
              fill="#ffc658"
              name="Số cuộc họp"
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
