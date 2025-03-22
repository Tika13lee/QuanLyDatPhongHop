package vn.com.kltn_project_v1.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long roomId;
    private String roomName;
    private int capacity;
    @Enumerated(EnumType.STRING)
    private StatusRoom statusRoom;
    @Enumerated(EnumType.STRING)
    private TypeRoom typeRoom;
    @ManyToOne
    @JoinColumn(name = "locationId")
    private Location location;
    @OneToOne
    @JoinColumn(name = "priceRoomId")
    private PriceRoom priceRoom;
    @ElementCollection
    private List<String> imgs;
    @ManyToOne
    @JoinColumn(name = "approverId")
    private Employee approver;

}
