package vn.com.kltn_project_v1.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CancelReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long cancelId;
    @Column(columnDefinition = "")
    private String reason;
    private Date time;
}
