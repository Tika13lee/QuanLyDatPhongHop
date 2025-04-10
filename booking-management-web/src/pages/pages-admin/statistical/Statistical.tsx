import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Statistical.module.scss";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import useFetch from "../../../hooks/useFetch";
import { BranchProps } from "../../../data/data";
import { formatDateString } from "../../../utilities";

const cx = classNames.bind(styles);

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a0522d",
  "#d2691e",
];

type StatisticalBranchData = {
  name: string;
  price: number;
  quantityReservation: number;
  quantityRoom: number;
};

// truyền id chi nhánh và tháng
const phongData = [
  { name: "P.KD", chiPhi: 5000000, soCuocHop: 22 },
  { name: "P.NS", chiPhi: 4000000, soCuocHop: 2 },
  { name: "P.KT", chiPhi: 6000000, soCuocHop: 12 },
  { name: "IT", chiPhi: 6000000, soCuocHop: 14 },
  { name: "Kế toán", chiPhi: 6000000, soCuocHop: 10 },
  { name: "P.KT", chiPhi: 6000000, soCuocHop: 9 },
  { name: "P.KT", chiPhi: 6000000, soCuocHop: 2 },
  { name: "P.KT", chiPhi: 6000000, soCuocHop: 3 },
];

// truyền năm
const chiPhiTheoThang = [
  { name: "Tháng 1", chiPhi: 280000000 },
  { name: "Tháng 2", chiPhi: 300000000 },
  { name: "Tháng 3", chiPhi: 310000000 },
  { name: "Tháng 4", chiPhi: 320000000 },
  { name: "Tháng 5", chiPhi: 330000000 },
  { name: "Tháng 6", chiPhi: 340000000 },
  { name: "Tháng 7", chiPhi: 350000000 },
  { name: "Tháng 8", chiPhi: 360000000 },
  { name: "Tháng 9", chiPhi: 370000000 },
  { name: "Tháng 10", chiPhi: 380000000 },
  { name: "Tháng 11", chiPhi: 390000000 },
  { name: "Tháng 12", chiPhi: 400000000 },
];

function Statistical() {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonthPrice, setSelectedMonthPrice] = useState(
    currentMonth.toString()
  );

  const [selectedMonthService, setSelectedMonthService] = useState(
    currentMonth.toString()
  );
  const [selectedMonthBranch, setSelectedMonthBranch] = useState(
    currentMonth.toString()
  );

  const [selectedBranch, setSelectedBarnch] = useState<string>("1");
  const [selectedMonthDept, setSelectedMonthDept] = useState("1");

  // lấy chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  // lấy ngày đầu tháng và cuối tháng
  const getMonthDateRange = (month: string) => {
    const year = new Date().getFullYear();
    const monthIndex = parseInt(month, 10) - 1;

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);

    return { startDate, endDate };
  };

  const { data: tiLeDichVu } = useFetch<[]>(
    `http://localhost:8080/api/v1/statistical/statisticalService?startDate=${getMonthDateRange(
      selectedMonthService
    ).startDate.toISOString()}&endDate=${getMonthDateRange(
      selectedMonthService
    ).endDate.toISOString()}`
  );

  const { data: chiNhanhData } = useFetch<StatisticalBranchData[]>(
    `http://localhost:8080/api/v1/statistical/statisticalBranchData?startDate=${getMonthDateRange(
      selectedMonthBranch
    ).startDate.toISOString()}&endDate=${getMonthDateRange(
      selectedMonthBranch
    ).endDate.toISOString()}`
  );

  const { data: chiPhiTheoNgay } = useFetch<[]>(
    `http://localhost:8080/api/v1/statistical/statisticalDaily?startDate=${getMonthDateRange(
      selectedMonthPrice
    ).startDate.toISOString()}&endDate=${getMonthDateRange(
      selectedMonthPrice
    ).endDate.toISOString()}`
  );

  const { data: phongData } = useFetch<[]>(
    `http://localhost:8080/api/v1/statistical/statisticalRoom?startDate=${getMonthDateRange(
      selectedMonthPrice
    ).startDate.toISOString()}&endDate=${getMonthDateRange(
      selectedMonthPrice
    ).endDate.toISOString()}&branchId=${selectedBranch}`
  );

  return (
    <div className={cx("statistical")}>
      <div className={cx("charts-container")}>
        <div className={cx("card-pie")}>
          <div className={cx("cardHeader")}>
            <h2>Tỉ lệ sử dụng dịch vụ </h2>
            <select
              value={selectedMonthService}
              onChange={(e) => setSelectedMonthService(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={tiLeDichVu ?? []}
                dataKey="quantityService"
                nameKey="name"
                outerRadius={100}
                label
              >
                {tiLeDichVu?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={cx("card")}>
          <div className={cx("cardHeader")}>
            <h2>Chi phí & số cuộc họp theo chi nhánh của 1 tháng</h2>
            <select
              value={selectedMonthBranch}
              onChange={(e) => setSelectedMonthBranch(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chiNhanhData ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className={cx("custom-tooltip")}>
                        <strong>{`${data.name} - ${data.quantityRoom} phòng`}</strong>
                        <p>Chi phí: {data.price.toLocaleString()} VNĐ</p>
                        <p>Số cuộc họp: {data.quantityReservation}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend />
              <Bar
                yAxisId="left"
                dataKey="price"
                fill="#82ca9d"
                name="Chi phí"
                barSize={30}
              />
              <Bar
                yAxisId="right"
                dataKey="quantityReservation"
                fill="#ffc658"
                name="Số cuộc họp"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={cx("card")}>
        <div className={cx("cardHeader")}>
          <h2>Chi phí & số cuộc họp theo phòng</h2>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBarnch(e.target.value)}
          >
            {branchsLoading ? (
              <option value="">Loading...</option>
            ) : branchsError ? (
              <option value="">Error loading branches</option>
            ) : (
              branchs?.map((branch) => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName}
                </option>
              ))
            )}
          </select>
          <select
            value={selectedMonthDept}
            onChange={(e) => setSelectedMonthDept(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={phongData ?? []}>
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

      <div className={cx("charts-container")}>
        <div className={cx("card")}>
          <div className={cx("cardHeader")}>
            <h2>Tổng chi phí trong tháng (theo ngày)</h2>
            <select
              value={selectedMonthPrice}
              onChange={(e) => setSelectedMonthPrice(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chiPhiTheoNgay ?? []}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                interval={3}
                angle={-30}
                textAnchor="end"
                tickFormatter={(value: string) => {
                  return value.slice(-2);
                }}
              />

              {/* Trục Y bên trái cho chi phí */}
              <YAxis
                yAxisId="left"
                tickFormatter={(value) =>
                  `${(Number(value) / 1000000).toFixed(1)}tr`
                }
              />

              {/* Trục Y bên phải cho số cuộc họp */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${value} cuộc`}
              />

              <Tooltip
                labelFormatter={(label: string) => {
                  return `${formatDateString(label)}`;
                }}
                formatter={(value: number | string, name: string) => {
                  if (name === "price") {
                    return `${(Number(value) / 1000000).toFixed(1)} triệu VNĐ`;
                  }
                  if (name === "quantityReservation") {
                    return `${value} cuộc họp`;
                  }
                  return value;
                }}
              />

              {/* Đường chi phí */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                dot={false}
                name="Chi phí"
              />

              {/* Đường số cuộc họp */}
              <Line
                yAxisId="right"
                type="basis"
                dataKey="quantityReservation"
                stroke="#82ca9d"
                dot={false}
                name="Số cuộc họp"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={cx("card")}>
          <div className={cx("cardHeader")}>
            <h2>Tổng chi phí trong năm (theo tháng)</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chiPhiTheoThang}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" minTickGap={10} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="chiPhi" fill="#FFCCFF" barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistical;
