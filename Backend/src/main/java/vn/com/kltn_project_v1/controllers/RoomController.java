package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.RoomDTO;
import vn.com.kltn_project_v1.model.Room;
import vn.com.kltn_project_v1.model.StatusRoom;
import vn.com.kltn_project_v1.model.TypeRoom;
import vn.com.kltn_project_v1.services.IDevice;
import vn.com.kltn_project_v1.services.IRoom;
import vn.com.kltn_project_v1.util.AESUtil;
import vn.com.kltn_project_v1.util.QRCodeGenerator;

import java.io.File;
import java.io.FileInputStream;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static vn.com.kltn_project_v1.util.QRCodeGenerator.saveQRCodeToPDF;

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
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }

    @GetMapping("/getRoomsByBranch")
    public ResponseEntity<?> getRoomsByBranch(@RequestParam Long locationId) {
        try {
            return ResponseEntity.ok(roomService.getRoomsByBranch(locationId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/changeStatusRoom")
    public ResponseEntity<?> changeStatusRoom(@RequestParam Long roomId, @RequestParam String status) {
        try {
            return ResponseEntity.ok(roomService.changeStatusRoom(roomId, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAllRooms")
    public ResponseEntity<?> getAllRooms(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "roomId") String sortBy) {
        try {

            return ResponseEntity.ok(roomService.getAllRooms(page, size, sortBy));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }

    @GetMapping("/searchRooms")
    public ResponseEntity<?> searchRooms(@RequestParam(required = false) String branch, @RequestParam(defaultValue = "0") int capacity, @RequestParam(defaultValue = "0") int price, @RequestParam(required = false) StatusRoom statusRoom, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "roomId") String sortBy) {
        try {
            return ResponseEntity.ok(roomService.searchRooms(branch, capacity, price, statusRoom, page, size, sortBy));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/addDeviceToRoom")
    public ResponseEntity<?> addDeviceToRoom(@RequestParam Long deviceId, @RequestParam Long roomId, @RequestParam(defaultValue = "1") int quantity) {
        try {
            return ResponseEntity.ok(deviceService.createRoomDevice(roomId, deviceId, quantity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/addApproveToRoom")
    public ResponseEntity<?> addApproveToRoom(@RequestParam Long roomId, @RequestParam String phoneApprover) {
        try {
            return ResponseEntity.ok(roomService.addApproverToRoom(roomId, phoneApprover));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/searchRoomByName")
    public ResponseEntity<?> searchRoomByName(@RequestParam String roomName) {
        try {
            return ResponseEntity.ok(roomService.searchRoomByName(roomName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getRoomById")
    public ResponseEntity<?> getRoomById(@RequestParam Long roomId) {
        try {
            return ResponseEntity.ok(roomService.getRoomById(roomId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getRoomOverView")
    public ResponseEntity<?> getRoomOverView(@RequestParam String branch, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayStart, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayEnd) {
        try {
            return ResponseEntity.ok(roomService.getRoomOverView(branch, dayStart, dayEnd));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }

    @GetMapping("/getRoomByEmployee")
    public ResponseEntity<?> getRoomByEmployee(@RequestParam String phone) {
        try {
            return ResponseEntity.ok(roomService.getRoomByEmployee(phone));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/searchRoomByAttribute")
    public ResponseEntity<?> searchRoomByAttribute(@RequestParam(required = false) String branch, @RequestParam(defaultValue = "0") int capacity, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date timeStart, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date timeEnd, @RequestParam(defaultValue = "0", required = false) int price) {
        try {
            return ResponseEntity.ok(roomService.searchRoomByAttribute(branch, capacity, timeStart, timeEnd, price));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }

    @PutMapping("/updateRoom")
    public ResponseEntity<?> updateRoom(@RequestBody RoomDTO roomDTO) {
        try {
            return ResponseEntity.ok(roomService.updateRoom(roomDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/generateRoomQR")
    public ResponseEntity<?> generateQRCode(@RequestParam Long roomId) {
        try {

            String rawData = "roomId=" + roomId;

            // Mã hóa dữ liệu trước khi tạo QR
            String encryptedData = AESUtil.encrypt(rawData);

            // Tạo QR code chỉ chứa encryptedData
            String base64QRCode = QRCodeGenerator.generateQRCode(encryptedData, 300, 300);

            // Lưu QR code vào file PDF
            String pdfPath = saveQRCodeToPDF(base64QRCode, "QRCode_" + roomId + ".pdf");

            // Đọc file PDF
            File file = new File(pdfPath);
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            String relativePdfPath = "/QRCodeFiles/" + "QRCode_" + roomId + ".pdf";
            // Trả về cả base64 mã QR và file PDF cho frontend
            Map<String, Object> response = new HashMap<>();
            response.put("qrCode", "data:image/png;base64," + base64QRCode);
            response.put("pdfPath", relativePdfPath); // Cung cấp đường dẫn file PDF để tải về

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo mã QR", e);
        }
    }

    @GetMapping("/getRoomNotApprover")
    public ResponseEntity<?> getRoomNotApprover() {
        try {
            return ResponseEntity.ok(roomService.getRoomNotApprover());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            // Đọc file từ thư mục static
            Path filePath = Paths.get("src/main/resources/static/QRCodeFiles", fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_PDF) // Hoặc loại nội dung khác
                        .body(resource);
            } else {
                throw new RuntimeException("File not found");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("File not found: " + e.getMessage());
        }
    }
}
