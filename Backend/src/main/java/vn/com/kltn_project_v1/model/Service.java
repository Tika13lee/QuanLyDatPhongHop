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
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private long serviceId;
    private String serviceName;
    private String description;
     @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "priceServiceId")
    private PriceService priceService;

}
