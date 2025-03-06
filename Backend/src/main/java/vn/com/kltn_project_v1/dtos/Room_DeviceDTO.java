package vn.com.kltn_project_v1.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Room_DeviceDTO {
    private Long deviceId;
    private int quantity;
}
