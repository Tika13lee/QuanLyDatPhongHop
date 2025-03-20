package vn.com.kltn_project_v1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    private String floor;
    @ManyToOne
    @JoinColumn(name = "buildingId")
    private Building building;
    @OneToMany(mappedBy = "location",fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Room> room;


}
