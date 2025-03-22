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
@ToString
public class PriceService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long priceServiceId;
    private int value;
    @OneToOne
    @JsonIgnore
    @ToString.Exclude
    @JoinColumn(name = "serviceId")
    private Service service;
    @ManyToOne
    @JsonIgnore
    @ToString.Exclude
    @JoinColumn(name = "priceId")
    private Price price;

}
