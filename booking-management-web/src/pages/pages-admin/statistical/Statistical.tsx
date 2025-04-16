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
  ComposedChart,
  ReferenceLine,
} from "recharts";
import useFetch from "../../../hooks/useFetch";
import { BranchProps } from "../../../data/data";
import { formatCurrencyVND, formatDateString } from "../../../utilities";

const cx = classNames.bind(styles);

const colors = [
  "#8dd1e1", // xanh dương nhạt
  "#a4de6c", // xanh lá tươi
  "#ffbb28", // vàng cam
  "#83a6ed", // xanh tím
  "#ff8042", // cam rực
  "#d0ed57", // vàng xanh
  "#b8860b", // nâu vàng đậm
  "#20b2aa", // teal
  "#6495ed", // xanh cornflower
  "#dda0dd", // tím pastel
];

type StatisticalBranchData = {
  name: string;
  price: number;
  quantityReservation: number;
  quantityRoom: number;
};

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

const avg =
  chiPhiTheoThang.reduce((acc, item) => acc + Number(item.chiPhi), 0) /
  chiPhiTheoThang.length;

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
  const [selectedMonthDept, setSelectedMonthDept] = useState(
    currentMonth.toString()
  );

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
      selectedMonthDept
    ).startDate.toISOString()}&endDate=${getMonthDateRange(
      selectedMonthDept
    ).endDate.toISOString()}&branchId=${selectedBranch}`
  );

  return (
    <div className={cx("statistical")}>
      <div className={cx("summaryCards")}>
        <div className={cx("summaryCard")}>
          <h3>
            <span className={cx("symbol")}>👥</span>Tổng số nhân viên
          </h3>
          <p>
            30 <small>người</small>
          </p>
        </div>
        <div className={cx("summaryCard")}>
          <h3>
            <span className={cx("symbol")}>🧑‍🔧</span>Tổng số dịch vụ
          </h3>
          <p>
            30 <small>dịch vụ</small>
          </p>
        </div>
        <div className={cx("summaryCard")}>
          <h3>
            <span className={cx("symbol")}>🖥️</span>Tổng số thiết bị
          </h3>
          <p>
            30 <small>thiết bị</small>
          </p>
        </div>
        <div className={cx("summaryCard")}>
          <h3>
            <span className={cx("symbol")}>🌐</span>Tổng số chi nhánh
          </h3>
          <p>
            5 <small>chi nhánh</small>
          </p>
        </div>
        <div className={cx("summaryCard")}>
          <h3>
            <span className={cx("symbol")}>🏢</span>Số lượng phòng
          </h3>
          <p>
            30 <small>phòng</small>
          </p>
        </div>
      </div>

      <div className={cx("charts-container")}>
        {/* Tỉ lệ sử dụng dịch vụ  */}
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
          {tiLeDichVu && tiLeDichVu.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tiLeDichVu}
                  dataKey="quantityService"
                  nameKey="name"
                  outerRadius={100}
                  label={({ percent, name }) => {
                    return `${name} (${(percent * 100).toFixed(0)}%)`;
                  }}
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
          ) : (
            <div
              style={{
                height: "300px",
              }}
              className={cx("no-data")}
            >
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Tổng chi phí & số cuộc họp của mỗi chi nhánh */}
        <div className={cx("card")}>
          <div className={cx("cardHeader")}>
            <h2>Tổng chi phí & số cuộc họp của mỗi chi nhánh</h2>
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
          {chiNhanhData && chiNhanhData.length > 0 ? (
            <ResponsiveContainer width="100%" height={330}>
              <BarChart
                data={chiNhanhData ?? []}
                margin={{
                  top: 10,
                  right: 0,
                  left: 20,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) =>
                    `${(Number(value) / 1000000).toFixed(1)}tr`
                  }
                />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className={cx("custom-tooltip")}>
                          <strong>{`${data.name} - ${data.quantityRoom} phòng`}</strong>
                          <p>Chi phí: {formatCurrencyVND(data.price)}</p>
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
          ) : (
            <div
              style={{
                height: "330px",
              }}
              className={cx("no-data")}
            >
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>

      {/* Chi phí & số cuộc họp của mỗi phòng */}
      <div className={cx("card")}>
        <div className={cx("cardHeader")}>
          <h2>Chi phí & số cuộc họp của mỗi phòng</h2>
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
        {phongData && phongData.length > 0 ? (
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart
              data={phongData}
              margin={{
                top: 10,
                right: 0,
                left: 20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) =>
                  `${(Number(value) / 1000000).toFixed(1)}tr`
                }
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value: number | string, name: string) => {
                  if (name === "Chi phí") {
                    return [`${formatCurrencyVND(value as number)}`, "Chi phí"];
                  }
                  if (name === "Số cuộc họp") {
                    return [`${value} cuộc họp`, "Số cuộc họp"];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="price"
                fill="#82ca9d"
                name="Chi phí"
                barSize={25}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quantityReservation"
                stroke="#ff7300"
                name="Số cuộc họp"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: "450px",
            }}
            className={cx("no-data")}
          >
            Không có dữ liệu
          </div>
        )}
      </div>

      <div className={cx("charts-container")}>
        {/* Tổng chi phí trong tháng (theo ngày) */}
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

          {chiPhiTheoNgay && chiPhiTheoNgay.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chiPhiTheoNgay ?? []}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  interval={2}
                  // angle={-30}
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
                <YAxis yAxisId="right" orientation="right" />

                <Tooltip
                  labelFormatter={(label: string) => {
                    return `${formatDateString(label)}`;
                  }}
                  formatter={(value: number | string, name: string) => {
                    if (name === "Chi phí") {
                      return `${formatCurrencyVND(value as number)} `;
                    }
                    if (name === "Số cuộc họp") {
                      return `${value} cuộc họp`;
                    }
                    return value;
                  }}
                />
                <Legend />

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
          ) : (
            <div
              style={{
                height: "300px",
              }}
              className={cx("no-data")}
            >
              Không có dữ liệu
            </div>
          )}
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chiPhiTheoThang}
              margin={{
                top: 20,
                right: 50,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" minTickGap={10} />
              <YAxis />
              <Tooltip />
              <ReferenceLine
                y={avg}
                stroke="red"
                strokeDasharray="3 3"
                label={{
                  value: "Trung bình",
                  position: "insideTopRight",
                  fill: "red",
                }}
              />

              <Bar dataKey="chiPhi" fill="#FFCCFF" barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistical;
