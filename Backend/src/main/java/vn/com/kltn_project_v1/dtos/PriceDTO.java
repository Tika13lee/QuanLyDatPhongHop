package vn.com.kltn_project_v1.dtos;

import lombok.*;

import java.util.Date;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PriceDTO {
    private boolean isActive;
    private Date timeStart;
    private Date timeEnd;
    private List<PriceRoomDTO> priceRooms;
    private List<PriceServiceDTO> priceServices;
}
