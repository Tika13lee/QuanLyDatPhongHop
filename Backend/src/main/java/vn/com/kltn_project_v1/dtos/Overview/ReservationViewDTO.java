package vn.com.kltn_project_v1.dtos.Overview;

import jakarta.persistence.Entity;
import lombok.*;
import vn.com.kltn_project_v1.model.Frequency;
import vn.com.kltn_project_v1.model.StatusReservation;

import java.util.Date;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReservationViewDTO {
    private Long reservationId;
    private String title;
    private Date timeStart;
    private Date timeEnd;
    private StatusReservation statusReservation;
    private Date time;
    private String img;
    private String nameBooker;
    private String note;
    private Frequency frequency;
    private Date timeApprove;
}
