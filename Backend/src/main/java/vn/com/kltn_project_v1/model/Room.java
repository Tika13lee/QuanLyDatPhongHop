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
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "priceRoomId")
    @JsonIgnore
    private PriceRoom priceRoom;
    @ElementCollection
    private List<String> imgs;
    @ManyToOne
    @JoinColumn(name = "approverId")
    private Employee approver;
    public int getPriceValue() {
        return priceRoom != null ? priceRoom.getValue() : null;
    }
}
