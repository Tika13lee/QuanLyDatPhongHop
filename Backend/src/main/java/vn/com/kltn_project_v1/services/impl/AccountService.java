package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.component.JwtTokenUtil;
import vn.com.kltn_project_v1.configs.SecurityConfig;
import vn.com.kltn_project_v1.model.Account;
import vn.com.kltn_project_v1.repositories.AccountRepository;
import vn.com.kltn_project_v1.services.IAccount;
@Service
@RequiredArgsConstructor
public class AccountService implements IAccount {
    private final AccountRepository accountRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    @Override
    public String login(String userName, String password) {
        Account account = accountRepository.findAccountByUserName(userName).orElse(null);
        if (account == null) {
            return "Tài khoản không tồn tại";
        }
        if(!passwordEncoder.matches(password, account.getPassword())){
            return "Mật khẩu không đúng";
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userName, password,account.getAuthorities())
        );
    return jwtTokenUtil.generateToken(account);
    }

    @Override
    public String changePassword(String userName, String oldPassword, String newPassword) {
        Account account = accountRepository.findAccountByUserName(userName).orElse(null);
        if (account == null) {
            return "Tài khoản không tồn tại";
        }
        if(!passwordEncoder.matches(oldPassword, account.getPassword())){
            return "Mật khẩu không đúng";
        }
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        return "Đổi mật khẩu thành công";
    }
}
