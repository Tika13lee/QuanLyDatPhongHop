package vn.com.kltn_project_v1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@ToString

public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long accountId;
    @Column(columnDefinition = "")
    private String userName;
    @Column(columnDefinition = "")
    private String password;
    @Column(columnDefinition = "boolean default false")
    private boolean role; // true: admin, false: user
    @JsonIgnore
    @OneToOne(mappedBy = "account")
    private Employee employee;

    public Account() {
    }

    @Override
    // roleEntity -> roleImpl
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of((GrantedAuthority) () -> "ROLE_" + (role ? "ADMIN" : "USER"));
    }
    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
