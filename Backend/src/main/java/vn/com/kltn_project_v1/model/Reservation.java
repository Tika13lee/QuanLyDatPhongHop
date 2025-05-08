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
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long reservationId;
    private Date time;
    private Date timeStart;
    private Date timeEnd;
    private Date timeCheckIn;
    private Date timeCheckOut;
    private Date timeCancel;
    private String note;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> filePaths;
    private String description;
    private String title;
    private int total;
    @Enumerated(EnumType.STRING)
    private Frequency frequency;
    @Enumerated(EnumType.STRING)
    private StatusReservation statusReservation;
    @ManyToOne
    @JoinColumn(name = "bookerId")
    private Employee booker;
    @ManyToMany
    @JoinTable(
            name = "reservation_employee",
            joinColumns = @JoinColumn(name = "reservationId"),
            inverseJoinColumns = @JoinColumn(name = "employeeId")
    )
    @ToString.Exclude
    private List<Employee> attendants;
    @ManyToMany
    @JoinTable(
            name = "reservation_service",
            joinColumns = @JoinColumn(name = "reservationId"),
            inverseJoinColumns = @JoinColumn(name = "serviceId")
    )
    @ToString.Exclude
    private List<Service> services;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancleReservationId")
    @ToString.Exclude
    private CancelReservation cancelReservation;
    @ManyToOne
    @JoinColumn(name = "roomId")
    private Room room;

    public Reservation(Date time, Date timeStart, Date timeEnd, Date timeCheckIn, Date timeCheckOut, String note, List<String> filePaths, String description, String title, Frequency frequency, StatusReservation statusReservation, Employee booker, List<Employee> attendants, List<Service> services, CancelReservation cancelReservation, Room room) {
        this.time = time;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.timeCheckIn = timeCheckIn;
        this.timeCheckOut = timeCheckOut;
        this.note = note;
        this.filePaths = filePaths;
        this.description = description;
        this.title = title;
        this.frequency = frequency;
        this.statusReservation = statusReservation;
        this.booker = booker;
        this.attendants = attendants;
        this.services = services;
        this.cancelReservation = cancelReservation;
        this.room = room;
    }
}
