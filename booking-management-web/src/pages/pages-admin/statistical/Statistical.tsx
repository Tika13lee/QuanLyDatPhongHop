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

const cx = classNames.bind(styles);

const tiLeDichVu = [
  { name: "Nước suối", value: 240 },
  { name: "Xịt thơm phòng", value: 180 },
  { name: "Trái cây", value: 120 },
  { name: "Hoa quả", value: 90 },
  { name: "Bánh trái", value: 60 },
];

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a0522d"];

// truyền tháng được chọn
const chiNhanhData = [
  { name: "Chi nhánh 1", chiPhi: 15000000, soCuocHop: 22, soPhong: 8 },
  { name: "Chi nhánh 2", chiPhi: 18000000, soCuocHop: 28, soPhong: 12 },
  { name: "Chi nhánh 3", chiPhi: 12000000, soCuocHop: 19, soPhong: 7 },
  { name: "Chi nhánh 4", chiPhi: 12000000, soCuocHop: 19, soPhong: 10 },
  { name: "Chi nhánh 5", chiPhi: 12000000, soCuocHop: 19, soPhong: 6 },
];

// truyền id chi nhánh và tháng
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

const chiPhiTheoNgay = Array.from({ length: 31 }, (_, i) => ({
  name: `${i + 1}`,
  chiPhi: Math.floor(5000000 + Math.random() * 10000000),
  hienThi: parseFloat(
    (Math.floor(5000000 + Math.random() * 10000000) / 1000000).toFixed(2)
  ),
}));

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
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(1);

  const [selectedMonthBranch, setSelectedMonthBranch] = useState("1");

  const [selectedBranch, setSelectedBarnch] = useState<string>("");
  const [selectedMonthDept, setSelectedMonthDept] = useState("1");

  // lấy chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  return (
    <div className={cx("statistical")}>
      <div className={cx("charts-container")}>
        <div className={cx("card-pie")}>
          <h2>Tỉ lệ sử dụng dịch vụ </h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={tiLeDichVu}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {tiLeDichVu.map((entry, index) => (
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
            <BarChart data={chiNhanhData}>
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
                        <strong>{`${data.name} - ${data.soPhong} phòng`}</strong>
                        <p>Chi phí: {data.chiPhi.toLocaleString()} VNĐ</p>
                        <p>Số cuộc họp: {data.soCuocHop}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

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

      <div className={cx("card")}>
        <div className={cx("cardHeader")}>
          <h2>Chi phí & số cuộc họp theo phòng ban</h2>
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

      <div className={cx("charts-container")}>
        <div className={cx("card")}>
          <div className={cx("cardHeader")}>
            <h2>Tổng chi phí trong tháng (theo ngày)</h2>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chiPhiTheoNgay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={3} angle={-30} textAnchor="end" />
              <YAxis
                tickFormatter={(value) =>
                  `${(Number(value) / 1000000).toFixed(1)}tr`
                }
              />
              <Tooltip
                formatter={(value: number | string) =>
                  `${(Number(value) / 1000000).toFixed(1)} triệu`
                }
              />
              <Line
                type="monotone"
                dataKey="chiPhi"
                stroke="#8884d8"
                dot={false}
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
