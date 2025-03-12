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
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long logId;

    private String action;
    private Date time;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accountId")
    private Account account;
}
