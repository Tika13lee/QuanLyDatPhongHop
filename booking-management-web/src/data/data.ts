import { time } from "console";

// location
export type LocationProps = {
  locationId?: number;
  branch: string;
  building: string;
  floor: string;
  number: string;
};

export const locations: LocationProps[] = [
  {
    locationId: 1,
    branch: "Hà Nội",
    building: "Tòa A",
    floor: "3",
    number: "P301",
  },
  {
    locationId: 2,
    branch: "Hồ Chí Minh",
    building: "Tòa B",
    floor: "5",
    number: "P502",
  },
  {
    locationId: 3,
    branch: "Trụ sở chính",
    building: "Tòa Nhà 1",
    floor: "2",
    number: "P202",
  },
  {
    locationId: 4,
    branch: "Chi nhánh Đà Nẵng",
    building: "Tòa Nhà 3",
    floor: "4",
    number: "P404",
  },
  {
    locationId: 5,
    branch: "Trung tâm đào tạo",
    building: "Tòa Nhà 4",
    floor: "1",
    number: "P101",
  },
  {
    locationId: 6,
    branch: "Cơ sở nghiên cứu",
    building: "Tòa Nhà 5",
    floor: "3",
    number: "P305",
  },
  {
    locationId: 7,
    branch: "Chi nhánh Cần Thơ",
    building: "Tòa Nhà 6",
    floor: "2",
    number: "P206",
  },
  {
    locationId: 8,
    branch: "Văn phòng miền Bắc",
    building: "Tòa Nhà 7",
    floor: "5",
    number: "P507",
  },
  {
    locationId: 9,
    branch: "Khu công nghệ cao",
    building: "Tòa Nhà 8",
    floor: "7",
    number: "P708",
  },
  {
    locationId: 10,
    branch: "Khu tổ hợp sản xuất",
    building: "Tòa Nhà 9",
    floor: "6",
    number: "P609",
  },
];

// Tìm vị trí theo id
const findLocationById = (id: number): LocationProps | undefined =>
  locations.find((location) => location.locationId === id);

export type RoomProps = {
  id: number;
  roomName: string;
  location: LocationProps;
  capacity: number;
  roomImg: string;
  price: number;
  typeRoom: string;
  statusRoom: string;
  approvers: {
    id: number;
    name: string;
  }[];
  devices: {
    id: number;
    name: string;
    quantity: number;
  }[];
  schedules: {
    id: number;
    date: string;
    timeStart: string;
    timeEnd: string;
    title: string;
    status: string;
  }[];
};

export const rooms: RoomProps[] = [
  {
    id: 1,
    roomName: "Phòng họp A",
    location: findLocationById(1)!,
    capacity: 20,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
    price: 100,
    approvers: [
      { id: 1, name: "Nguyễn Văn A" },
      { id: 2, name: "Trần Thị B" },
    ],
    typeRoom: "Mặc định",
    statusRoom: "Có sẵn",
    devices: [
      { id: 1, name: "Máy chiếu", quantity: 2 },
      { id: 2, name: "Tivi", quantity: 1 },
      { id: 3, name: "Bảng trắng", quantity: 3 },
      { id: 4, name: "Hệ thống âm thanh", quantity: 1 },
    ],
    schedules: [
      {
        id: 1,
        date: "2025-03-01",
        timeStart: "08:00",
        timeEnd: "10:00",
        title: "Họp nhóm",
        status: "Đã đặt",
      },
      {
        id: 2,
        date: "2025-03-03",
        timeStart: "10:30",
        timeEnd: "12:00",
        title: "Họp dự án",
        status: "Chờ phê duyệt",
      },
      {
        id: 3,
        date: "2025-03-07",
        timeStart: "14:00",
        timeEnd: "16:00",
        title: "Họp khẩn cấp",
        status: "Đã đặt",
      },
    ],
  },
  {
    id: 2,
    roomName: "Phòng họp B",
    location: findLocationById(2)!,
    capacity: 30,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-9.jpg",
    price: 120,
    approvers: [
      { id: 3, name: "Lê Hoàng C" },
      { id: 4, name: "Phạm Thị D" },
    ],
    typeRoom: "Cao cấp",
    statusRoom: "Đã đặt",
    devices: [
      { id: 5, name: "Máy chiếu", quantity: 1 },
      { id: 6, name: "Loa không dây", quantity: 2 },
      { id: 7, name: "Laptop", quantity: 2 },
      { id: 8, name: "Bảng điện tử", quantity: 1 },
    ],
    schedules: [
      {
        id: 4,
        date: "2025-03-02",
        timeStart: "09:00",
        timeEnd: "11:00",
        title: "Họp kế hoạch",
        status: "Đã đặt",
      },
      {
        id: 5,
        date: "2025-03-05",
        timeStart: "13:00",
        timeEnd: "15:00",
        title: "Đào tạo nội bộ",
        status: "Đã đặt",
      },
    ],
  },
  {
    id: 3,
    roomName: "Phòng họp C",
    location: findLocationById(3)!,
    capacity: 15,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-10.jpg",
    price: 80,
    approvers: [
      { id: 5, name: "Nguyễn Thị E" },
      { id: 6, name: "Trần Minh F" },
    ],
    typeRoom: "Tiêu chuẩn",
    statusRoom: "Có sẵn",
    devices: [
      { id: 9, name: "Tivi", quantity: 1 },
      { id: 10, name: "Bảng trắng", quantity: 2 },
      { id: 11, name: "Micro không dây", quantity: 1 },
    ],
    schedules: [
      {
        id: 6,
        date: "2025-03-06",
        timeStart: "10:00",
        timeEnd: "11:30",
        title: "Báo cáo tiến độ",
        status: "Chờ phê duyệt",
      },
    ],
  },
  {
    id: 4,
    roomName: "Phòng họp D",
    location: findLocationById(4)!,
    capacity: 40,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-11.jpg",
    price: 150,
    approvers: [
      { id: 7, name: "Phan Văn G" },
      { id: 8, name: "Lý Thị H" },
    ],
    typeRoom: "Cao cấp",
    statusRoom: "Đã đặt",
    devices: [
      { id: 12, name: "Máy chiếu", quantity: 2 },
      { id: 13, name: "Bảng thông minh", quantity: 1 },
      { id: 14, name: "Micro có dây", quantity: 3 },
    ],
    schedules: [
      {
        id: 7,
        date: "2025-03-08",
        timeStart: "09:00",
        timeEnd: "12:00",
        title: "Hội nghị công ty",
        status: "Đã đặt",
      },
    ],
  },
  {
    id: 5,
    roomName: "Phòng họp E",
    location: findLocationById(5)!,
    capacity: 25,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-12.jpg",
    price: 110,
    approvers: [
      { id: 9, name: "Bùi Đức I" },
      { id: 10, name: "Đỗ Mai J" },
    ],
    typeRoom: "Mặc định",
    statusRoom: "Có sẵn",
    devices: [
      { id: 15, name: "Tivi", quantity: 2 },
      { id: 16, name: "Loa di động", quantity: 2 },
      { id: 17, name: "Laptop", quantity: 1 },
    ],
    schedules: [
      {
        id: 8,
        date: "2025-03-09",
        timeStart: "14:00",
        timeEnd: "16:00",
        title: "Họp chiến lược",
        status: "Chờ phê duyệt",
      },
      {
        id: 10,
        date: "2025-03-09",
        timeStart: "16:00",
        timeEnd: "16:30",
        title: "Họp chiến lược",
        status: "Chờ phê duyệt",
      },
    ],
  },
];

// trạng thái phòng
export const statusesRoom = [
  { value: "AVAILABLE", label: "Có sẵn" },
  { value: "ONGOING", label: "Đang sử dụng" },
  { value: "MAINTAIN", label: "Đang bảo trì" },
  { value: "REPAIR", label: "Sửa chữa" }
];

// loại phòng
export const typeRoom = [
  { value: "DEFAULT", label: "Mặc định" },
  { value: "VIP", label: "Phòng VIP" },
  { value: "CONFERENCEROOM", label: "Phòng hội nghị" }
];


// giá
export type PriceProps = {
  priceID: number;
  value: number;
  time: string;
  type: string;
};

// thiết bị
export type DeviceProps = {
  deviceId?: number;
  deviceName: string;
  description: string;
  price?: PriceProps;
};

export const devices: DeviceProps[] = [
  {
    deviceId: 1,
    deviceName: "Máy chiếu",
    description: "Máy chiếu hình ảnh",
  },
  {
    deviceId: 2,
    deviceName: "Tivi",
    description: "Tivi 4K",

  },
  {
    deviceId: 3,
    deviceName: "Bảng trắng",
    description: "Bảng trắng kích thước lớn",

  },
  {
    deviceId: 4,
    deviceName: "Hệ thống âm thanh",
    description: "Hệ thống âm thanh chất lượng cao",

  },
];



// dịch vụ
export type ServiceProps = {
  id: number;
  serviceName: string;
  description: string;
  price: number;
};

export const services: ServiceProps[] = [
  {
    id: 1,
    serviceName: "Đồ ăn",
    description: "Đồ ăn tiệc",
    price: 100,
  },
  {
    id: 2,
    serviceName: "Đồ uống",
    description: "Đồ uống tiệc",
    price: 50,
  },
  {
    id: 3,
    serviceName: "Trang trí",
    description: "Trang trí tiệc",
    price: 200,
  },
  {
    id: 4,
    serviceName: "Âm nhạc",
    description: "Âm nhạc tiệc",
    price: 150,
  },
];

// đặt phòng
export type ReservationProps = {
  id: number;
  time: string;
  timeStart: string;
  timeEnd: string;
  note: string;
  description: string;
  title: string;
  services?: ServiceProps[];
  frequency?: string;
  approvalType: boolean;
  booker: {
    id: number;
    name: string;
    img: string;
  };
  room: {
    id: number;
    roomName: string;
    location: LocationProps;
    capacity: number;
    roomImg: string;
    price: number;
    typeRoom: string;
    statusRoom: string;
    devices: {
      id: number;
      name: string;
      quantity: number;
    }[];
  };
};

export const reservations: ReservationProps[] = [
  {
    id: 1,
    time: "2025-03-01",
    timeStart: "08:00",
    timeEnd: "10:00",
    note: "Họp nhóm",
    description: "Họp nhóm",
    title: "Họp nhóm",
    approvalType: true,
    booker: {
      id: 1,
      name: "Nguyễn Văn A",
      img: "https://i.pravatar.cc/150?img=1",
    },
    room: rooms[0],
  },
  {
    id: 2,
    time: "2025-03-03",
    timeStart: "10:30",
    timeEnd: "12:00",
    note: "Họp dự án",
    description: "Họp dự án",
    title: "Họp dự án",
    approvalType: false,
    booker: {
      id: 2,
      name: "Trần Thị B",
      img: "https://i.pravatar.cc/150?img=2",
    },
    room: rooms[1],
  },
];
