package vn.com.kltn_project_v1.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Room_Device {
    @EmbeddedId
    private RoomDeviceKey room_deviceId;
    private int quantity;
}
