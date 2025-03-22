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
@Table(name = "price_room",
        uniqueConstraints = @UniqueConstraint(columnNames = {"roomId", "priceId"}))
@ToString
public class PriceRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long priceRoomId;
    private int value;
    @OneToOne
    @ToString.Exclude
    @JsonIgnore
    @JoinColumn(name = "roomId")
    private Room room;
    @ManyToOne
    @JsonIgnore
    @ToString.Exclude
    @JoinColumn(name = "priceId")
    private Price price;
    public String getRoomName() {
        return room != null ? room.getRoomName() : null;
    }

}
