package vn.com.kltn_project_v1.entityRespones;

import lombok.*;
import vn.com.kltn_project_v1.dtos.RoomDTO;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RoomRespone {
    private List<RoomDTO> roomDTOS;
    private int totalPage;
}
