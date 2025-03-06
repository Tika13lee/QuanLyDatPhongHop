package vn.com.kltn_project_v1.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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
    private Date timeApply;
    @Enumerated(EnumType.STRING)
    private Type type;

    public Price(int value, Date timeApply, Type type) {
        this.value = value;
        this.timeApply = timeApply;
        this.type = type;
    }
}
