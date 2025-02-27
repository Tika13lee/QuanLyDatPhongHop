// location
export type LocationProps = {
  id?: string;
  branch: string;
  building: string;
  floor: string;
  number: string;
};

export const locations: LocationProps[] = [
  {
    id: "loc-100",
    branch: "Hà Nội",
    building: "A1",
    floor: "3",
    number: "P301",
  },
  {
    id: "loc-111",
    branch: "Hồ Chí Minh",
    building: "B2",
    floor: "5",
    number: "P502",
  },
  {
    id: "loc-101",
    branch: "Headquarters",
    building: "Building 1",
    floor: "3",
    number: "P301",
  },
  {
    id: "loc-102",
    branch: "Branch Office",
    building: "Building 2",
    floor: "5",
    number: "P502",
  },
  {
    id: "loc-103",
    branch: "Headquarters",
    building: "Building 1",
    floor: "2",
    number: "P202",
  },
  {
    id: "loc-104",
    branch: "Main Campus",
    building: "Building 3",
    floor: "1",
    number: "P105",
  },
  {
    id: "loc-105",
    branch: "Headquarters",
    building: "VIP Building",
    floor: "10",
    number: "P1001",
  },
  {
    id: "loc-106",
    branch: "Training Center",
    building: "Building 4",
    floor: "2",
    number: "P205",
  },
  {
    id: "loc-107",
    branch: "Research Facility",
    building: "Building 5",
    floor: "3",
    number: "P305",
  },
];

// Tìm vị trí theo id
const findLocationById = (id: string): LocationProps | undefined =>
  locations.find((location) => location.id === id);

// room
type RoomProps = {
  id?: string;
  name: string;
  location: LocationProps;
  capacity: number;
  roomImg: string;
  price: number; // giá hiện tại đang áp dụng
  approver: {
    id: string;
    name: string;
  }[];
};

export const rooms: RoomProps[] = [
  {
    id: "room-001",
    name: "Meeting Room A",
    location: findLocationById("loc-101")!,
    capacity: 20,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
    price: 100,
    approver: [
      { id: "user-001", name: "John Doe" },
      { id: "user-002", name: "Jane Smith" },
    ],
  },
  {
    id: "room-002",
    name: "Conference Room B",
    location: findLocationById("loc-102")!,
    capacity: 50,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
    price: 250,
    approver: [{ id: "user-003", name: "Michael Brown" }],
  },
  {
    id: "room-003",
    name: "Training Room C",
    location: findLocationById("loc-103")!,
    capacity: 30,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
    price: 150,
    approver: [
      { id: "user-004", name: "Emily White" },
      { id: "user-005", name: "Robert Johnson" },
      { id: "user-006", name: "Sophia Lee" },
    ],
  },
  {
    id: "room-004",
    name: "Boardroom D",
    location: findLocationById("loc-104")!,
    capacity: 15,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
    price: 120,
    approver: [
      { id: "user-007", name: "David Miller" },
      { id: "user-008", name: "Olivia Davis" },
    ],
  },
  {
    id: "room-005",
    name: "Executive Suite E",
    location: findLocationById("loc-105")!,
    capacity: 5,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
    price: 500,
    approver: [{ id: "user-009", name: "William Anderson" }],
  },
  {
    id: "room-006",
    name: "Lecture Hall F",
    location: findLocationById("loc-106")!,
    capacity: 100,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
    price: 400,
    approver: [
      { id: "user-010", name: "Charlotte Wilson" },
      { id: "user-011", name: "Liam Martinez" },
    ],
  },
  {
    id: "room-007",
    name: "Small Group Room G",
    location: findLocationById("loc-107")!,
    capacity: 8,
    roomImg:
      "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
    price: 80,
    approver: [
      { id: "user-012", name: "Emma Thomas" },
      { id: "user-013", name: "James Harris" },
    ],
  },
];

// status
export const statusesRoom = ["Có sẵn", "Đang sử dụng?", "Đang bảo trì", "Sửa chữa"];
