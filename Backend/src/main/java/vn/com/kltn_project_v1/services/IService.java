package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.PriceDTO;
import vn.com.kltn_project_v1.dtos.ServiceDTO;
import vn.com.kltn_project_v1.model.Service;

import java.util.Collection;
import java.util.List;

public interface IService {
    List<Service> findAll();
    Service createService(ServiceDTO serviceDTO);
    Service upDateService(ServiceDTO serviceDTO);
    void deleteService(Long id);
    List<Service> getServiceByName(String name);

}
