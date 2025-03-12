package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.*;
import vn.com.kltn_project_v1.dtos.Overview.ReservationViewDTO;
import vn.com.kltn_project_v1.dtos.Overview.RoomViewDTO;
import vn.com.kltn_project_v1.entityRespones.RoomRespone;
import vn.com.kltn_project_v1.exceptions.DataNotFoundException;
import vn.com.kltn_project_v1.model.*;
import vn.com.kltn_project_v1.repositories.*;
import vn.com.kltn_project_v1.services.IReservation;
import vn.com.kltn_project_v1.services.IRoom;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService implements IRoom {
    private final RoomRepository roomRepository;
    private final DeviceRepository deviceRepository;
    private final Room_DeviceRepository room_deviceRepository;
    private final PriceRepository priceRepository;
    private final LocationRepository locationRepository;
    private final ReservationRepository reservationRepository;
    private final ModelMapper modelMapper;
    private final EmployeeRepository employeeRepository;
    private final IReservation reservationService;
    @Override
    public Room createRoom(RoomDTO roomDTO) throws DataNotFoundException {
        Price price = priceRepository.save(new Price(roomDTO.getPrice(), new Date(), Type.ROOM));
        Location location = locationRepository.findLocationByBranchAndBuildingAndFloorAndNumber(roomDTO.getLocation().getBranch(),roomDTO.getLocation().getBuilding(),roomDTO.getLocation().getFloor(),roomDTO.getLocation().getNumber())
                .orElseThrow(()->new DataNotFoundException("Location not found"));
        Room room = Room.builder()
                .roomName(roomDTO.getRoomName())
                .typeRoom(roomDTO.getTypeRoom())
                .capacity(roomDTO.getCapacity())
                .statusRoom(StatusRoom.valueOf(roomDTO.getStatusRoom()))
                .location(location)
                .price(price)
                .imgs(roomDTO.getImgs())
                .build();
        roomRepository.save(room);
        roomDTO.getRoom_deviceDTOS().forEach(rd->{
            Device device = null;
            try {
                device = deviceRepository.findDeviceByDeviceName(rd.getDeviceName())
                        .orElseThrow(()->new DataNotFoundException("Device not found"));
            } catch (DataNotFoundException e) {
                throw new RuntimeException(e);
            }
            Room_Device room_device = Room_Device.builder()
                    .room_deviceId(new RoomDeviceKey(room,device))
                    .quantity(rd.getQuantity())
                    .build();
            room_deviceRepository.save(room_device);
        });
        return room;
    }

    @Override
    public List<Room> getRoomsByBranch( Long locationId) throws DataNotFoundException {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(()->new DataNotFoundException("Location not found"));
        List<Room> rooms = roomRepository.findByBranch(location.getBranch());

        rooms.sort(Comparator.comparing((Room r) -> {
                            boolean sameBuilding = r.getLocation().getBuilding().equals(location.getBuilding());
                            boolean sameFloor = r.getLocation().getFloor().equals(location.getFloor());

                            if (sameBuilding && sameFloor) return 1; // Cùng Building & Floor
                            if (sameBuilding) return 2; // Cùng Building nhưng khác Floor
                            if (sameFloor) return 3; // Cùng Floor nhưng khác Building
                            return 4; // Cả Building & Floor đều khác
                        })
                        .thenComparing(r -> r.getLocation().getBuilding()) // Sắp xếp theo Building
                        .thenComparing(r -> r.getLocation().getFloor()) // Sắp xếp theo Floor
                        .thenComparing(Room::getRoomName)
        );

        return rooms;
    }

    @Override
    public boolean changeStatusRoom(Long roomId, String status) throws DataNotFoundException {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(()->new DataNotFoundException("Room not found"));
        room.setStatusRoom(StatusRoom.valueOf(status));
        roomRepository.save(room);
        return true;
    }

    @Override
    public RoomRespone getAllRooms(int page, int size, String sortBy) throws DataNotFoundException {

        PageRequest pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Room> pageRooms = roomRepository.findAll(pageable); // Lấy Page<Room>
        List<Room> rooms = pageRooms.getContent(); // Lấy List<Room> từ Page<Room>

        return RoomRespone.builder()
                .roomDTOS(convertRoomToRoomDTO(rooms))
                .totalPage(pageRooms.getTotalPages())
                .build();
    }

    @Override
    public RoomRespone searchRooms(String branch,int capacity, int price, StatusRoom statusRoom, int page, int size, String sortBy) throws DataNotFoundException {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Room> pageRooms = roomRepository.findRooms(branch, capacity, price, statusRoom, pageable);
        List<Room> rooms = pageRooms.getContent();
        return RoomRespone.builder()
                .roomDTOS(convertRoomToRoomDTO(rooms))
                .totalPage(pageRooms.getTotalPages())
                .build();
    }

    @Override
    public Room addApproverToRoom(Long roomId, String phoneAppover) throws DataNotFoundException {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(()->new DataNotFoundException("Room not found"));
        Employee employee = employeeRepository.findEmployeeByPhone(phoneAppover).orElseThrow();
        room.setApprover(employee);
        roomRepository.save(room);
        return room;
    }

    @Override
    public List<Room> searchRoomByName(String roomName) {
        return roomRepository.searchRoomsByName(roomName);
    }

    @Override
    public RoomDTO getRoomById(Long roomId) throws DataNotFoundException {
         Room room = roomRepository.findById(roomId)
                .orElseThrow(()->new DataNotFoundException("Room not found"));
            return convertRoomToDTO(room);
    }

    @Override
    public List<RoomViewDTO> getRoomOverView(String branch,Date  dayStart, Date dayEnd) throws DataNotFoundException {
        List<Room> rooms = roomRepository.findByBranch(branch);
        return rooms.stream().map(room -> {
            RoomViewDTO roomViewDTO = new RoomViewDTO();
            roomViewDTO.setRoomId(room.getRoomId());
            roomViewDTO.setRoomName(room.getRoomName());
            List<ReservationViewDTO> reservationViewDTOS = reservationService.getAllReservationInRoom(room.getRoomId(), dayStart, dayEnd);
            roomViewDTO.setReservationViewDTOS(reservationViewDTOS);
            return roomViewDTO;
        }).toList();
    }

    @Override
    public List<Room> getRoomByEmployee(String phone) throws DataNotFoundException {
        return reservationRepository.findDistinctRoomsByBookerPhone(phone);
    }

    public List<RoomDTO> convertRoomToRoomDTO(List<Room> rooms){
        return rooms.stream().map(this::convertRoomToDTO).toList();
    }
    public RoomDTO convertRoomToDTO(Room room){
        RoomDTO roomDTO = new RoomDTO();
        roomDTO.setRoomId(room.getRoomId());
        roomDTO.setRoomName(room.getRoomName());
        roomDTO.setCapacity(room.getCapacity());
        roomDTO.setStatusRoom(room.getStatusRoom().name());
        roomDTO.setTypeRoom(room.getTypeRoom());
        LocationDTO locationDTO = new LocationDTO();
        locationDTO.setBranch(room.getLocation().getBranch());
        locationDTO.setBuilding(room.getLocation().getBuilding());
        locationDTO.setFloor(room.getLocation().getFloor());
        locationDTO.setNumber(room.getLocation().getNumber());
        roomDTO.setLocation(locationDTO);

        try {
            Price price = priceRepository.findById(room.getPrice().getPriceId())
                    .orElseThrow(()->new DataNotFoundException("Price not found"));
            roomDTO.setPrice(price.getValue());
        } catch (DataNotFoundException e) {
            throw new RuntimeException(e);
        }
        roomDTO.setImgs(room.getImgs());
        ArrayList<Room_DeviceDTO> room_deviceDTOS = new ArrayList<>();
        room_deviceRepository.findByRoomId(room.getRoomId()).forEach(rd->{
            Room_DeviceDTO room_deviceDTO = new Room_DeviceDTO();
            room_deviceDTO.setDeviceName(rd.getRoom_deviceId().getDevice().getDeviceName());
            room_deviceDTO.setQuantity(rd.getQuantity());
            room_deviceDTOS.add(room_deviceDTO);
        });
        roomDTO.setRoom_deviceDTOS(room_deviceDTOS);
        if (room.getApprover()!=null) {
            ApproverDTO approverDTO = new ApproverDTO();
            approverDTO.setPhone(room.getApprover().getPhone());
            approverDTO.setName(room.getApprover().getEmployeeName());
            roomDTO.setApprover(approverDTO);
        }
        ArrayList<ReservationDTO> reservationDTOS = new ArrayList<>();
        reservationRepository.findReservationsByRoomRoomId(room.getRoomId()).forEach(reservation -> {
            ReservationDTO reservationDTO = modelMapper.map(reservation,ReservationDTO.class);
            reservationDTOS.add(reservationDTO);
        });
        roomDTO.setReservationDTOS(reservationDTOS);
        return roomDTO;
    }

}
