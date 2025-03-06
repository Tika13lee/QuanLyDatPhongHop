package vn.com.kltn_project_v1.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.com.kltn_project_v1.model.Frequency;

import java.util.Date;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDTO {
    private Date time;
    private Date timeStart;
    private Date timeEnd;
    private String note;
    private String description;
    private String title;
    private int total;
    private Frequency frequency;
    private long bookerId;
    private long roomId;
    private List<Long> employeeIds;
    private List<Long> serviceIds;

}
