package vn.com.kltn_project_v1.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RequestReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long requestReservationId;
    private Date time;
    private Date timeStart;
    private Date timeEnd;
    private String note;
    private String description;
    private String title;
    private Frequency frequency;
    @ElementCollection
    private List<Date> timeFinishFrequency;
    private long bookerId;
    private long roomId;
    @ElementCollection
    private List<Long> employeeIds;
    @ElementCollection
    private List<Long> serviceIds;
    @ElementCollection
    private List<String> filePaths;
}
