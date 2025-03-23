package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import vn.com.kltn_project_v1.dtos.ServiceDTO;

import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.model.PriceRoom;
import vn.com.kltn_project_v1.model.Service;
import vn.com.kltn_project_v1.model.Type;
import vn.com.kltn_project_v1.repositories.PriceRepository;
import vn.com.kltn_project_v1.repositories.PriceServiceRepository;
import vn.com.kltn_project_v1.repositories.ServiceRepository;
import vn.com.kltn_project_v1.services.IService;
import vn.com.kltn_project_v1.until.ConvertData;

import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.List;
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService implements IService {
    private final ServiceRepository serviceRepository;
    private final ModelMapper modelMapper;
    private final PriceRepository priceRepository;
    private final PriceServiceRepository priceServiceRepository;
    @Override
    public List<Service> findAll() {
      return serviceRepository.findAll();
    }

    @Override
    public Service createService(ServiceDTO serviceDTO) {
        Service service = modelMapper.map(serviceDTO, Service.class);
        Price price = priceRepository.findActivePrice(Date.from(Instant.now()));
        if (price == null) {
            return null;
        }
        vn.com.kltn_project_v1.model.PriceService priceService = new vn.com.kltn_project_v1.model.PriceService();
        priceService.setPrice(price);
        priceService.setService(service);
        priceService.setValue(serviceDTO.getPrice());
        service.setPriceService(priceService);
        serviceRepository.save(service);
        priceRepository.findAll().forEach(p->{
            if (p.getPriceId()!=price.getPriceId()){
                vn.com.kltn_project_v1.model.PriceService priceService1 = new vn.com.kltn_project_v1.model.PriceService();
                priceService1.setPrice(p);
                priceService1.setService(service);
                priceService1.setValue(serviceDTO.getPrice());
                priceServiceRepository.save(priceService1);
            }
        });
        return service;
    }

    @Override
    public Service upDateService(ServiceDTO serviceDTO) {
        Service service = serviceRepository.findById(serviceDTO.getServiceId()).orElse(null);
        if (service == null) {
            return null;
        }
        service.setServiceName(serviceDTO.getServiceName());
        service.setDescription(serviceDTO.getDescription());
        return serviceRepository.save(service);
    }

    @Override
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    @Override
    public List<Service> getServiceByName(String name) {
        return serviceRepository.findServiceByServiceName(name);
    }
}
