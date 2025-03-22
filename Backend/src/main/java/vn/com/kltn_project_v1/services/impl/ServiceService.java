package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import vn.com.kltn_project_v1.dtos.ServiceDTO;
import vn.com.kltn_project_v1.model.Device;
import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.model.Service;
import vn.com.kltn_project_v1.model.Type;
import vn.com.kltn_project_v1.repositories.PriceRepository;
import vn.com.kltn_project_v1.repositories.ServiceRepository;
import vn.com.kltn_project_v1.services.IService;

import java.util.Collections;
import java.util.Date;
import java.util.List;
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService implements IService {
    private final ServiceRepository serviceRepository;
    private final ModelMapper modelMapper;
    private final PriceRepository priceRepository;
    @Override
    public List<Service> findAll() {
      return serviceRepository.findAll();
    }

    @Override
    public Service createService(ServiceDTO serviceDTO) {
        Service service = modelMapper.map(serviceDTO, Service.class);
        return serviceRepository.save(service);
    }

    @Override
    public Service upDateService(ServiceDTO serviceDTO) {
        Service service = modelMapper.map(serviceDTO, Service.class);
        return serviceRepository.save(service);
    }

    @Override
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    @Override
    public Service getServiceByName(String name) {
        return serviceRepository.findServiceByServiceName(name);
    }
}
