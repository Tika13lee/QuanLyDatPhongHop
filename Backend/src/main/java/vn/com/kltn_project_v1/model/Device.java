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
    private String description;
    @ManyToOne
    @JoinColumn(name = "priceId")
    private Price price;
}
