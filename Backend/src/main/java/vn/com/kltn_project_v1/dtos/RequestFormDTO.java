package vn.com.kltn_project_v1.dtos;

import lombok.*;
import vn.com.kltn_project_v1.model.StatusRequestForm;
import vn.com.kltn_project_v1.model.TypeRequestForm;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RequestFormDTO {
    private Date timeRequest;
    private Date timeResponse;
    private StatusRequestForm statusRequestForm;
    private String reasonReject;
    private TypeRequestForm typeRequestForm;
    private ReservationDTO reservationDTO;
    private List<Long> reservationIds;
}
