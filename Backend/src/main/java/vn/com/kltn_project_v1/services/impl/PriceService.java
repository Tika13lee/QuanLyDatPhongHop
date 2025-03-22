package vn.com.kltn_project_v1.services.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.PriceDTO;
import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.model.PriceRoom;
import vn.com.kltn_project_v1.model.Room;
import vn.com.kltn_project_v1.repositories.*;
import vn.com.kltn_project_v1.services.IPrice;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class PriceService implements IPrice {
    private final PriceRepository priceRepository;
    private final PriceRoomRepository priceRoomRepository;
    private final PriceServiceRepository priceServiceRepository;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;
    private final ModelMapper modelMapper;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Price> getAllPrice() {
        return priceRepository.findAll();
    }

    @Override
    public Price getPriceById(Long id) {
        return null;
    }
    @Override
    public Price savePrice(PriceDTO priceDTO) {
        Price price = modelMapper.map(priceDTO, Price.class);
        price.setPriceRoom(new ArrayList<>());
        price.setPriceService(new ArrayList<>());

        priceRepository.save(price);
        priceDTO.getPriceRooms().forEach(priceRoomDTO -> {
            PriceRoom priceRoom = new PriceRoom();
            priceRoom.setValue(priceRoomDTO.getValue());
            Room room = roomRepository.findById(priceRoomDTO.getRoomId()).get();
            priceRoom.setRoom(room);
            priceRoom.setPrice(price);
            priceRoomRepository.save(priceRoom);
            room.setPriceRoom(priceRoom);
            price.getPriceRoom().add(priceRoom);
        });
        priceDTO.getPriceServices().forEach(priceServiceDTO -> {
            vn.com.kltn_project_v1.model.PriceService priceService = new vn.com.kltn_project_v1.model.PriceService();
            priceService.setValue(priceServiceDTO.getValue());
            vn.com.kltn_project_v1.model.Service service = serviceRepository.findById(priceServiceDTO.getServiceId()).get();
            priceService.setService(service);
            priceService.setPrice(price);
            priceServiceRepository.save(priceService);
            service.setPriceService(priceService);
            price.getPriceService().add(priceService);
        });
        return priceRepository.save(price);

    }

    @Override
    public Price updatePrice(Price price) {
        return null;
    }
    @Override
    public List<Price> checkTime(PriceDTO priceDTO){
        return priceRepository.findPriceByTimeStartAndTimeEnd(priceDTO.getTimeStart(),priceDTO.getTimeEnd());
    }
}
