package vn.com.kltn_project_v1.configs;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.model.Reservation;

@Configuration
public class MapperConfig {
    @Bean
    public ModelMapper modelMapper() {
    return new ModelMapper();
    }

}


