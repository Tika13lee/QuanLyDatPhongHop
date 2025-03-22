package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Device;

import java.util.Optional;
@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    @Query("SELECT d FROM Device d WHERE d.deviceName like %?1%")
    Optional<Device> findDeviceByDeviceName(String name);
}