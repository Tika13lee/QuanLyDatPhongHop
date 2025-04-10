package vn.com.kltn_project_v1.dtos.statistical;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DataStatisticalDTO {
    private String name;
    private int price;
    private int quantityReservation;
    private int quantityRoom;

    public DataStatisticalDTO(String name, int price, int quantityReservation) {
        this.name = name;
        this.price = price;
        this.quantityReservation = quantityReservation;
    }
}
