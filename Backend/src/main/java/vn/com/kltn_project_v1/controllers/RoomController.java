package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.RoomDTO;
import vn.com.kltn_project_v1.model.Room;
import vn.com.kltn_project_v1.model.StatusRoom;
import vn.com.kltn_project_v1.services.IDevice;
import vn.com.kltn_project_v1.services.IRoom;

@RestController
@RequestMapping("/api/v1/room")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {
    @Autowired
    private IRoom roomService;
    @Autowired
    private IDevice deviceService;

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody RoomDTO roomDTO) {
        try {
            Room newRoom = roomService.createRoom(roomDTO);
            return ResponseEntity.ok(newRoom);
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/getRoomsByBranch")
public ResponseEntity<?> getRoomsByBranch( @RequestParam Long locationId) {
        try {
            return ResponseEntity.ok(roomService.getRoomsByBranch( locationId));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/changeStatusRoom")
    public ResponseEntity<?> changeStatusRoom(@RequestParam Long roomId, @RequestParam String status) {
        try {
            return ResponseEntity.ok(roomService.changeStatusRoom(roomId, status));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/getAllRooms")
    public ResponseEntity<?> getAllRooms(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "roomId") String sortBy) {
        try {

            return ResponseEntity.ok(roomService.getAllRooms(page, size, sortBy));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/searchRooms")
    public ResponseEntity<?> searchRooms(@RequestParam(required = false)String branch , @RequestParam(defaultValue = "0") int capacity, @RequestParam(defaultValue = "0") int price,@RequestParam(required = false) StatusRoom statusRoom, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "roomId") String sortBy){
        try {
            return ResponseEntity.ok(roomService.searchRooms(branch, capacity, price, statusRoom, page, size, sortBy));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/addDeviceToRoom")
    public ResponseEntity<?> addDeviceToRoom(@RequestParam Long deviceId,@RequestParam Long roomId, @RequestParam(defaultValue = "1") int quantity){
        try {
            return ResponseEntity.ok(deviceService.createRoomDevice(roomId, deviceId, quantity));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/addApproveToRoom")
    public ResponseEntity<?> addApproveToRoom(@RequestParam Long roomId, @RequestParam String phoneApprover){
        try {
            return ResponseEntity.ok(roomService.addApproverToRoom(roomId, phoneApprover));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/searchRoomByName")
    public ResponseEntity<?> searchRoomByName(@RequestParam String roomName){
        try {
            return ResponseEntity.ok(roomService.searchRoomByName(roomName));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

}
