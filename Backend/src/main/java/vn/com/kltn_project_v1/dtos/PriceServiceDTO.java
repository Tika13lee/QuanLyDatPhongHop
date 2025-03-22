package vn.com.kltn_project_v1.dtos;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PriceServiceDTO implements Serializable {
    private int value;
    private Long serviceId;
}