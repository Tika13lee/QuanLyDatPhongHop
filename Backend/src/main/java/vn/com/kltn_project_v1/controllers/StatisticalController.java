package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.model.StatusReservation;
import vn.com.kltn_project_v1.services.IStatistical;

import java.util.Date;

@RestController
@RequestMapping("/api/v1/statistical")
@CrossOrigin(origins = "http://localhost:3000")
public class StatisticalController {
     @Autowired
     private IStatistical statisticalService;
     @GetMapping("/statisticalService")
     public ResponseEntity<?> getStatisticalService(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDate) {
         return ResponseEntity.ok(statisticalService.getStatisticalService(startDate, endDate));
     }
        @GetMapping("/statisticalBranchData")
        public ResponseEntity<?> getBranchData(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDate) {
             return ResponseEntity.ok(statisticalService.getBranchData(startDate, endDate));
        }
        @GetMapping("/statisticalDaily")
        public ResponseEntity<?> getStatisticalDaily(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDate) {
            return ResponseEntity.ok(statisticalService.statisticalDaily(startDate, endDate));
        }
        @GetMapping("/statisticalRoom")
        public ResponseEntity<?> getStatisticalRoom(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDate, @RequestParam Long branchId){
            return ResponseEntity.ok(statisticalService.statisticalRoom(startDate, endDate, branchId));
        }
        @GetMapping("/statisticalChart24h")
        public ResponseEntity<?> getStatisticalChart24h(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDate) {
            return ResponseEntity.ok(statisticalService.statisticalChart24h(startDate, endDate));
        }
        @GetMapping("/countReservationByDate")
           public ResponseEntity<?> countReservationByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date date) {
                return ResponseEntity.ok(statisticalService.countReservationByDate(date));
            }
        @GetMapping("/countReservationByDateAndStatus")
        public ResponseEntity<?> countReservationByDateAndStatus(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date date) {
            return ResponseEntity.ok(statisticalService.countReservationByDateAndStatus(date, StatusReservation.CANCELED));
        }
        @GetMapping("/countReservationByDateAndStatusCheckin")
        public ResponseEntity<?> countReservationByDateAndStatusCheckin(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date date) {
            return ResponseEntity.ok(statisticalService.countReservationByDateAndStatus(date, StatusReservation.CHECKED_IN));
        }

}
