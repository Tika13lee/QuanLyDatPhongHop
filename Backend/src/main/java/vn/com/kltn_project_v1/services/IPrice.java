package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.PriceDTO;
import vn.com.kltn_project_v1.model.Price;

import java.util.Date;
import java.util.List;

public interface IPrice {
    List<Price> getAllPrice();
    Price getPriceById(Long id);
    Price savePrice(PriceDTO priceDTO);
    Price updatePrice(Price price);

    List<Price> checkTime(Date timeStart, Date timeEnd);
    Price activePrice(Price price);
}
