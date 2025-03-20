package vn.com.kltn_project_v1.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RequestForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long requestFormId;
    private Date timeRequest;
    private Date timeResponse;
    private String note;

    @Enumerated(EnumType.STRING)
    private StatusRequestForm statusRequestForm;
    private String title;
    private String reasonReject;
    @Enumerated(EnumType.STRING)
    private TypeRequestForm typeRequestForm;
    @ManyToMany
    @JoinTable(
            name = "requestForm_reservations",
            joinColumns = @JoinColumn(name = "requestFormId"),
            inverseJoinColumns = @JoinColumn(name = "reservationId")
    )
    @ToString.Exclude
    private List<Reservation> reservations;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "requestReservationId")
    private RequestReservation requestReservation;

}
