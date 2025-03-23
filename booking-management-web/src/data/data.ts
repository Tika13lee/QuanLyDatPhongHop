// bảng giá
export type PriceTableProps = {
  priceId: number;
  timeStart: string;
  timeEnd: string;
  priceName: string;
  active: boolean;
  priceRoom: {
    
    roomId: number;
    roomName: string;
    value: number;
  }[];
  priceService: {
    serviceId: number;
    serviceName: string;
    value: number;
  }[];
};

//
export type Reservation = {
  time: string;
  timeStart: string;
  timeEnd: string;
  note: string;
  description: string;
  title: string;
  frequency: string;
  timeFinishFrequency: string;
  bookerId: number;
  roomId: number;
  employeeIds: number[];
  serviceIds: number[];
};

// building
export type BuildingProps = {
  buildingId: number;
  buildingName: string;
  branch: BranchProps;
};

// branch
export type BranchProps = {
  branchId: number;
  branchName: string;
};

// location
export type LocationProps = {
  locationId?: number;
  building: BuildingProps;
  floor: string;
};

export type LocationProps2 = {
  locationId?: number;
  branch: string;
  building: string;
  floor: string;
};

// department
export type DepartmentProps = {
  departmentId?: number;
  depName: string;
  location: LocationProps;
};

export type RoomViewProps = {
  roomId: number;
  roomName: string;
  reservationViewDTOS: ReservationProps[];
};

// nhân viên
export type EmployeeProps = {
  employeeId: number;
  employeeName: string;
  email: string;
  phone: string;
  avatar: string;
  actived: boolean;
  department: {
    departmentId: number;
    depName: string;
    location: LocationProps;
  };
  account: {
    role: boolean;
  };
};

// phòng
export type RoomProps = {
  roomId: number;
  roomName: string;
  capacity: number;
  statusRoom: string;
  typeRoom: string;
  location: LocationProps;
  imgs: string[];
  price: PriceProps;
  approvers: {
    id: number;
    name: string;
  }[];
  devices: RoomDeviceProps[];
  reservationDTOS: {
    id: number;
    time: string;
    timeStart: string;
    timeEnd: string;
    title: string;
    statusReservation: string;
    note: string;
    frequency: string;
  }[];
};
export type RoomProps2 = {
  roomId: number;
  roomName: string;
  capacity: number;
  statusRoom: string;
  typeRoom: string;
  location: LocationProps2;
  imgs: string[];
  price: string;
  approvers: {
    id: number;
    name: string;
  }[];
  devices: RoomDeviceProps[];
  reservationDTOS: {
    id: number;
    time: string;
    timeStart: string;
    timeEnd: string;
    title: string;
    status: string;
  }[];
};

export type RoomDeviceProps = {
  id: number;
  deviceName: string;
  quantity: number;
};

// trạng thái phòng
export const statusesRoom = [
  { value: "AVAILABLE", label: "Có sẵn" },
  { value: "ONGOING", label: "Đang sử dụng" },
  { value: "MAINTAIN", label: "Đang bảo trì" },
  { value: "REPAIR", label: "Sửa chữa" },
];

// loại phòng
export const typeRoom = [
  { value: "DEFAULT", label: "Mặc định" },
  { value: "VIP", label: "Phòng VIP" },
  { value: "CONFERENCEROOM", label: "Phòng hội nghị" },
];

// giá
export type PriceProps = {
  priceId: number;
  value: number;
  time: string;
  type: string;
};

// thiết bị
export type DeviceProps = {
  deviceId: number;
  deviceName: string;
  description: string;
};

// dịch vụ
export type ServiceProps = {
  serviceId: number;
  serviceName: string;
  description: string;
  priceService?: {
    priceServiceId: number;
    value: number;
  };
};

// form yêu cầu
export type RequestFormProps = {
  requestFormId: number;
  timeRequest: string;
  timeResponse: string;
  statusRequestForm: string;
  reasonReject: string;
  typeRequestForm: string;
  reservations: ReservationDetailProps[];
  requestReservation: {
    requestReservationId: number;
    time: string;
    timeStart: string;
    timeEnd: string;
    note: string;
    description: string;
    title: string;
    frequency: string;
    timeFinishFrequency: string[];
    bookerId: number;
    roomId: number;
    employeeIds: number[];
    serviceIds: number[];
  };
};

// đặt phòng
export type ReservationProps = {
  reservationId: number;
  time: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  img: string;
  nameBooker: string;
  statusReservation: string;
  note: string;
  frequency: string;
};

// tần suất
export const frequency = [
  { value: "ONE_TIME", label: "Một lần" },
  { value: "DAILY", label: "Mỗi ngày" },
  { value: "WEEKLY", label: "Mỗi tuần" },
];

export type ReservationDetailProps = {
  reservationId: number;
  time: string;
  timeStart: string;
  timeEnd: string;
  timeCheckIn: string;
  timeCheckOut: string;
  timeCancel?: string;
  note: string;
  filePaths: string[];
  description: string;
  title: string;
  total: number;
  frequency: string;
  statusReservation: string;

  booker: EmployeeProps;
  attendants: EmployeeProps[];

  services?: {
    serviceId: number;
    serviceName: string;
    description: string;
    priceService: {
      priceServiceId: number;
      value: number;
    };
  }[];

  room: {
    roomId: number;
    roomName: string;
    capacity: number;
    statusRoom: string;
    typeRoom: string;
    location: LocationProps;
    price: PriceProps;
    imgs: string[];
    approver: EmployeeProps;
  };
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
