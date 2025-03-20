package vn.com.kltn_project_v1.dtos;

import lombok.*;
import vn.com.kltn_project_v1.model.StatusRequestForm;
import vn.com.kltn_project_v1.model.TypeRequestForm;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RequestFormDTO {
    private Date timeRequest;
    private Date timeResponse;
    private String note;
    private StatusRequestForm statusRequestForm;
    private String title;
    private String reasonReject;
    private TypeRequestForm typeRequestForm;
    private ReservationDTO reservationDTO;
}
