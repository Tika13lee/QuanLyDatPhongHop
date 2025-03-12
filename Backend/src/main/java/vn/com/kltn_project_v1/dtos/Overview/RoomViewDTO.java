package vn.com.kltn_project_v1.dtos.Overview;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomViewDTO {
    private Long roomId;
    private String roomName;
    private List<ReservationViewDTO> reservationViewDTOS;
}
