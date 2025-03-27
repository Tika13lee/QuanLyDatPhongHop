package vn.com.kltn_project_v1.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.com.kltn_project_v1.model.Frequency;
import vn.com.kltn_project_v1.model.StatusReservation;

import java.util.Date;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDTO {
    private long reservationId;
    private Date time;
    private Date timeStart;
    private Date timeEnd;
    private String note;
    private String description;
    private String title;
    private Frequency frequency;
    private List<Date> timeFinishFrequency;
    private long bookerId;
    private long roomId;
    private List<Long> employeeIds;
    private List<Long> serviceIds;
    private StatusReservation statusReservation;
    private List<String> filePaths;

}
