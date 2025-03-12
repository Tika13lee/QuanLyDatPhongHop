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
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long tokenId;
    private String token;
    private String tokenType;
    private Date expiryDate;
    private boolean revoked;
    private boolean expired;
    @ManyToOne
    @JoinColumn(name = "accountId")
    private Account account;

}
