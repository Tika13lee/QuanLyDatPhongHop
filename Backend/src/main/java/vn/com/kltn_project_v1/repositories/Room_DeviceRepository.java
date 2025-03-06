package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.com.kltn_project_v1.model.RoomDeviceKey;
import vn.com.kltn_project_v1.model.Room_Device;

import java.util.List;

public interface Room_DeviceRepository extends JpaRepository<Room_Device, RoomDeviceKey> {
    @Query("SELECT rd FROM Room_Device rd WHERE rd.room_deviceId.room.roomId = ?1")
    List<Room_Device> findByRoomId(Long roomId);
}