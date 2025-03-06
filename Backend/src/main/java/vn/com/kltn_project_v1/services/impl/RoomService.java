package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.RoomDTO;
import vn.com.kltn_project_v1.exceptions.DataNotFoundException;
import vn.com.kltn_project_v1.model.*;
import vn.com.kltn_project_v1.repositories.*;
import vn.com.kltn_project_v1.services.IRoom;

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
    @Override
    public Room createRoom(RoomDTO roomDTO) throws DataNotFoundException {
        Price price = priceRepository.save(new Price(roomDTO.getPrice(), new Date(), Type.ROOM));
        Location location = locationRepository.findById(roomDTO.getLocationId())
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
                device = deviceRepository.findById(rd.getDeviceId())
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

}
