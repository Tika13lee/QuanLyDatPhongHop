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
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long departmentId;

    private String depName;
    @OneToOne
    @JoinColumn(name = "locationId")
    private Location location;

    public Department(String depName, Location location) {
        this.depName = depName;
        this.location = location;
    }
}
