package vn.com.kltn_project_v1.controllers;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.PriceDTO;
import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.services.IPrice;
import vn.com.kltn_project_v1.services.IService;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/price")
@CrossOrigin(origins = "http://localhost:3000")
public class PriceController {
    @Autowired
    private IPrice priceService;
    @PostMapping("/createPrice")
    public ResponseEntity<?> createPrice(@RequestBody PriceDTO priceDTO){
        try {
            if (!priceDTO.isActive()){
                return ResponseEntity.ok(priceService.savePrice(priceDTO));
            }else {
            if(!priceService.checkTime(priceDTO.getTimeStart(),priceDTO.getTimeEnd()).isEmpty()){
                return ResponseEntity.badRequest().body(priceService.checkTime(priceDTO.getTimeStart(),priceDTO.getTimeEnd()));
            }
            else {
                return ResponseEntity.ok(priceService.savePrice(priceDTO));
            }}
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/getAllPrice")
    public ResponseEntity<?> getAllPrice(){
        try {
            return ResponseEntity.ok(priceService.getAllPrice());
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/checkTimePrice")
    public ResponseEntity<?> checkTimePrice(@RequestParam(name = "timeStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date timeStart, @RequestParam(name = "timeEnd") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date timeEnd){
        try {
            return ResponseEntity.ok(priceService.checkTime(timeStart,timeEnd));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/activePrice")
    public ResponseEntity<?> activePrice(@RequestParam Long priceId){
        try {
            Price price = priceService.getPriceById(priceId);
            List<Price> priceDuplicate = priceService.checkTime(price.getTimeStart(),price.getTimeEnd());
            if(priceDuplicate.size()>1||(priceDuplicate.size()==1&&!priceDuplicate.get(0).getPriceId().equals(priceId))){
                return ResponseEntity.badRequest().body(priceService.checkTime(price.getTimeStart(),price.getTimeEnd()));
            }
            else {
                return ResponseEntity.ok(priceService.activePrice(price));
            }
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
