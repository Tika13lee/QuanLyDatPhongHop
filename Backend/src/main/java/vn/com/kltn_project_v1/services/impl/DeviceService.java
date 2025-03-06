package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.model.Device;
import vn.com.kltn_project_v1.repositories.DeviceRepository;
import vn.com.kltn_project_v1.services.IDevice;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService implements IDevice {
    private final DeviceRepository deviceRepository;

    @Override
    public List<Device> findAll() {
        return deviceRepository.findAll();
    }
}
