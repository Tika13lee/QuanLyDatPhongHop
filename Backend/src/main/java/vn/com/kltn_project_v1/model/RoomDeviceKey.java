package vn.com.kltn_project_v1.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Embeddable

public class RoomDeviceKey implements Serializable {
    @ManyToOne
    @JoinColumn(name = "roomId")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "deviceId")
    private Device device;
}
