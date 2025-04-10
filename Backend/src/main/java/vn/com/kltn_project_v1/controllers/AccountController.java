package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.AccountDTO;
import vn.com.kltn_project_v1.services.IAccount;

@RestController
@RequestMapping("api/v1/account")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {
     @Autowired
     private IAccount accountService;
     @PostMapping("/login")
     public ResponseEntity<?> login(@RequestBody AccountDTO account) {
         String token = accountService.login(account.getUserName(), account.getPassword());
         if (token.equals("Tài khoản không tồn tại")) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(token);
         } else if (token.equals("Mật khẩu không đúng")) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(token);
         }
         return ResponseEntity.ok(token);
     }
}
