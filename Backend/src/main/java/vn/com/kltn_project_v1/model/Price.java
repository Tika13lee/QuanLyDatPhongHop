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
    private int value;
    private Date timeStart;
    private Date timeEnd;
    @OneToMany(mappedBy = "price")
    private List<PriceRoom> priceRoom;
    @OneToMany(mappedBy = "price")
    private List<PriceService> priceService;

}
