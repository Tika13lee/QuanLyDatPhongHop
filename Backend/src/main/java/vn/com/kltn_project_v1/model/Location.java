package vn.com.kltn_project_v1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long locationId;
    private String branch;
    private String building;
    private String floor;
    private String number;

    @OneToOne(mappedBy = "location",fetch = FetchType.LAZY)
    @JsonIgnore
    private Room room;

    public Location(String branch, String building, String floor, String number) {
        this.branch = branch;
        this.building = building;
        this.floor = floor;
        this.number = number;
    }
}
