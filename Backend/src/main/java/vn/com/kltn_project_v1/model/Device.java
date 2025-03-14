package vn.com.kltn_project_v1.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long deviceId;
    @Column(columnDefinition = "NVARCHAR(255)")
    private String deviceName;
    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    public Device(String deviceName, String description) {
        this.deviceName = deviceName;
        this.description = description;
    }
}
