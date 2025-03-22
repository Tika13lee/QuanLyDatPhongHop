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
public class Price {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long priceId;
    private boolean isActive;
    private Date timeStart;
    private Date timeEnd;
    @OneToMany(mappedBy = "price",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<PriceRoom> priceRoom;
    @OneToMany(mappedBy = "price",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<PriceService> priceService;
}
