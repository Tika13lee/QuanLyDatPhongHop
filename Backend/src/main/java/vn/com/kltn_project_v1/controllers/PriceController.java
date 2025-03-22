package vn.com.kltn_project_v1.controllers;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.PriceDTO;
import vn.com.kltn_project_v1.services.IPrice;
import vn.com.kltn_project_v1.services.IService;

@RestController
@RequestMapping("/api/v1/price")
@CrossOrigin(origins = "http://localhost:3000")
public class PriceController {
    @Autowired
    private IPrice priceService;
    @PostMapping("/createPrice")
    public ResponseEntity<?> createPrice(@RequestBody PriceDTO priceDTO){
        try {
            if(!priceService.checkTime(priceDTO).isEmpty()){
                return ResponseEntity.badRequest().body(priceService.checkTime(priceDTO));
            }
            else {
                return ResponseEntity.ok(priceService.savePrice(priceDTO));
            }
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
}
