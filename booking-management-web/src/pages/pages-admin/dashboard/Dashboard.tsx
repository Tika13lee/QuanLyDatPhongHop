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
  ComposedChart,
  Line,
  Sector,
  Pie,
  Cell,
  PieChart,
} from "recharts";
import useFetch from "../../../hooks/useFetch";
import { BranchProps } from "../../../data/data";
import { formatCurrencyVND } from "../../../utilities";

const cx = classNames.bind(styles);

const statusScheduleData = [
  { name: "Đã hoàn thành", value: 400 },
  { name: "Đã hủy", value: 300 },
  { name: "Không nhận phòng", value: 300 },
];

const COLORS = ["#00C49F", "#FF8042", "#8884d8"];

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

  console.log(statusScheduleData);

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
                    30 <small>cuộc họp</small>
                  </p>
                </div>
              </div>
              <div className={cx("summaryCard")}>
                <h3>
                  <span className={cx("symbol")}>✅</span>Số lịch hoàn thành
                </h3>
                <p>
                  30 <small>cuộc họp</small>
                </p>
              </div>
            </div>
            <div className={cx("summaryCard-wrap")}>
              <div className={cx("summaryCard")}>
                <h3>
                  <span className={cx("symbol")}>❌</span>Số lịch đã hủy
                </h3>
                <p>
                  30 <small>cuộc họp</small>
                </p>
              </div>
              <div className={cx("summaryCard")}>
                <h3>
                  <span className={cx("symbol")}>💲</span>Tổng chi phí
                </h3>
                <p>
                  500000 <small>VND</small>
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
                    data={statusScheduleData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    innerRadius={60}
                    isAnimationActive={true}
                    label={({ percent, name }) => {
                      return `${name} (${(percent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {statusScheduleData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
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
          <div className={cx("no-data")}>
            <p>Hôm nay không có cuộc họp nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
