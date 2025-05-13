import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
  Pie,
  Cell,
  PieChart,
} from "recharts";
import useFetch from "../../../hooks/useFetch";
import { formatCurrencyVND } from "../../../utilities";
import { useEffect, useState } from "react";
import axios from "axios";

const cx = classNames.bind(styles);

const statusScheduleData = [
  { name: "Đã hoàn thành", value: 400 },
  { name: "Đã hủy", value: 100 },
  { name: "Không nhận phòng", value: 200 },
];

const colors = ["#4CAF50", "#F44336", "#9E9E9E"];

const Dashboard = () => {
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

  const { data: timeData } = useFetch<[]>(
    `http://localhost:8080/api/v1/statistical/statisticalChart24h?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
    // `http://localhost:8080/api/v1/statistical/statisticalChart24h?startDate=2025-04-01T17:00:00.000Z&endDate=2025-04-30T17:00:00.000Z`
  );

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    canceled: 0,
    totalCost: 0,
  });

  const today = new Date().toISOString();
<<<<<<< HEAD
  const todayString = today.split("T")[0];
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [totalRes, completedRes, canceledRes] = await Promise.all([
          axios.get(
            "http://localhost:8080/api/v1/statistical/countReservationByDate",
            { params: { date: today } }
          ),
          axios.get(
            "http://localhost:8080/api/v1/statistical/countReservationByDateAndStatusCheckin",
            {
              params: { date: today },
            }
          ),
          axios.get(
            "http://localhost:8080/api/v1/statistical/countReservationByDateAndStatus",
            {
              params: { date: today },
            }
          ),
          // axios.get("/totalCostByDate", { params: { date: today } }),
        ]);
=======
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const [totalRes, completedRes, canceledRes] = await Promise.all([
  //         axios.get(
  //           "http://localhost:8080/api/v1/statistical/countReservationByDate",
  //           { params: { date: today } }
  //         ),
  //         axios.get(
  //           "http://localhost:8080/api/v1/statistical/countReservationByDateAndStatusCheckin",
  //           {
  //             params: { date: today },
  //           }
  //         ),
  //         axios.get(
  //           "http://localhost:8080/api/v1/statistical/countReservationByDateAndStatus",
  //           {
  //             params: { date: today },
  //           }
  //         ),
  //         // axios.get("/totalCostByDate", { params: { date: today } }),
  //       ]);
>>>>>>> ee6ed33b053c3171a2826f391bc437d548a4fff6

  //       setStats({
  //         total: totalRes.data,
  //         completed: completedRes.data,
  //         canceled: canceledRes.data,
  //         totalCost: 0,
  //       });
  //     } catch (err) {
  //       console.error("Lỗi khi tải dữ liệu thống kê", err);
  //     }
  //   };

<<<<<<< HEAD
    fetchStats();
  }, [todayString]);
=======
  //   fetchStats();
  // }, [today]);
>>>>>>> ee6ed33b053c3171a2826f391bc437d548a4fff6

  return (
    <div className={cx("dashboard")}>
      <div className={cx("header")}>
        <h2>Dữ liệu trong ngày</h2>
        <div className={cx("headerData")}>
          <div className={cx("summaryCards")}>
            <div className={cx("summaryCard-wrap")}>
              <div className={cx("summaryCard")}>
                <div>
                  <h3>
                    <span className={cx("symbol")}>📅</span>Tổng số lịch đã đặt
                  </h3>
                  <p>
                    {stats.total} <small>cuộc họp</small>
                  </p>
                </div>
              </div>
              <div className={cx("summaryCard")}>
                <h3>
                  <span className={cx("symbol")}>✅</span>Số lịch hoàn thành
                </h3>
                <p>
                  {stats.completed} <small>cuộc họp</small>
                </p>
              </div>
            </div>
            <div className={cx("summaryCard-wrap")}>
              <div className={cx("summaryCard")}>
                <h3>
                  <span className={cx("symbol")}>❌</span>Số lịch đã hủy
                </h3>
                <p>
                  {stats.canceled} <small>cuộc họp</small>
                </p>
              </div>
              <div className={cx("summaryCard")}>
                <h3>
                  <span className={cx("symbol")}>💲</span>Tổng chi phí
                </h3>
                <p>
                  {formatCurrencyVND(500000)} <small>VND</small>
                </p>
              </div>
            </div>
          </div>
          <div className={cx("card")}>
            <h2>Tỉ lệ trạng thái lịch</h2>

            {statusScheduleData && statusScheduleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    key={JSON.stringify(statusScheduleData)}
                    data={statusScheduleData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    innerRadius={50}
                    isAnimationActive={true}
                    label={({ percent, name }) => {
                      return `${name} (${(percent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {statusScheduleData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "230px",
                }}
                className={cx("no-data")}
              >
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cx("card")}>
        <h2>Chi phí & số cuộc họp theo giờ</h2>

        {timeData && timeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={timeData}>
              <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                allowDecimals={false}
                domain={[0, "dataMax + 1"]}
                tickFormatter={(value) => `${value}`}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className={cx("custom-tooltip")}>
                        <p>Chi phí: {formatCurrencyVND(data.total)}</p>
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
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="count"
                stroke="#EA4335"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 3, stroke: "#333" }}
                connectNulls={true}
                legendType="line"
                name="Số cuộc họp"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: "230px",
            }}
            className={cx("no-data")}
          >
            <p>Hôm nay không có cuộc họp nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
