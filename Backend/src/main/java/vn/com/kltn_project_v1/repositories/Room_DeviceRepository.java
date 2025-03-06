package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.com.kltn_project_v1.model.RoomDeviceKey;
import vn.com.kltn_project_v1.model.Room_Device;

public interface Room_DeviceRepository extends JpaRepository<Room_Device, RoomDeviceKey> {
}