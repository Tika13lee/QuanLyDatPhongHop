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
    @JsonIgnore
    private long accountId;
    @Column(columnDefinition = "")
    @JsonIgnore
    private String userName;
    @Column(columnDefinition = "")
    @JsonIgnore
    private String password;
    @Column(columnDefinition = "boolean default false")
    private boolean role; // true: admin, false: user
    @JsonIgnore
    @OneToOne(mappedBy = "account")
    private Employee employee;

    public Account() {
    }

    public Account(String userName, String password, boolean role) {
        this.userName = userName;
        this.password = password;
        this.role = role;
    }

    @Override
    @JsonIgnore
    // roleEntity -> roleImpl
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of((GrantedAuthority) () -> "ROLE_" + (role ? "ADMIN" : "USER"));
    }
    @Override
    @JsonIgnore
    public String getPassword() {
        return "";
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return userName;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}
