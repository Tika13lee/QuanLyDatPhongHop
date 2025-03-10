package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.DeviceDTO;
import vn.com.kltn_project_v1.model.Device;
import vn.com.kltn_project_v1.model.Room_Device;

import java.util.List;

public interface IDevice {
    List<Device> findAll();
    Device findByName(String name);
    Device createDevice(DeviceDTO deviceDTO);

    Device updateDevice(DeviceDTO deviceDTO);
    void deleteDevice(Long id);

    Room_Device createRoomDevice(Long roomId,Long deviceId, int quantity);

}
