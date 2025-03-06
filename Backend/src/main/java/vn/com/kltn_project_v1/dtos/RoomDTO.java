package vn.com.kltn_project_v1.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.com.kltn_project_v1.model.Device;
import vn.com.kltn_project_v1.model.TypeRoom;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter


public class RoomDTO {
    private String roomName;
    private int capacity;
    private String statusRoom;
    private TypeRoom typeRoom;
    private LocationDTO location;
    private int price;
    private List<String> imgs;
    private List<Room_DeviceDTO> room_deviceDTOS;


}
