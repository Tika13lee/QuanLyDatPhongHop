package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.model.Device;
import vn.com.kltn_project_v1.model.Room;
import vn.com.kltn_project_v1.model.RoomDeviceKey;
import vn.com.kltn_project_v1.model.Room_Device;
import vn.com.kltn_project_v1.repositories.DeviceRepository;
import vn.com.kltn_project_v1.repositories.RoomRepository;
import vn.com.kltn_project_v1.repositories.Room_DeviceRepository;
import vn.com.kltn_project_v1.services.IDevice;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService implements IDevice {
    private final DeviceRepository deviceRepository;
    private final Room_DeviceRepository roomDeviceRepository;
    private final RoomRepository roomRepository;
    @Override
    public List<Device> findAll() {
        return deviceRepository.findAll();
    }

    @Override
    public Device findByName(String name) {
        return deviceRepository.findDeviceByDeviceName(name)
                .orElseThrow(()->new RuntimeException("Device not found"));
    }

    @Override
    public Device createDevice(Device device) {
        return deviceRepository.save(device);
    }

    @Override
    public Room_Device createRoomDevice(Long roomId,Long deviceId, int quantity) {
        Room room = roomRepository.findById(roomId).orElse(null);
        Device device = deviceRepository.findById(deviceId).orElse(null);
        return roomDeviceRepository.save(new Room_Device(new RoomDeviceKey(room,device),quantity));
    }

}
