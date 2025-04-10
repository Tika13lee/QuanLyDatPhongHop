package vn.com.kltn_project_v1.component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.com.kltn_project_v1.model.Account;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {
    @Value("${jwt.expirationTime}")
    private int expirationTime ;
    @Value("${jwt.secretKey}")
    private String secretKey;
    public String generateToken(Account account) {
        Map<String, String> claims = new HashMap<>();
        claims.put("userName",  account.getUsername());
        claims.put("role", account.getRole().name());
        try {
            String token = Jwts.builder()
                    .setClaims(claims)
                    .setSubject(account.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expirationTime * 1000))
                    .signWith(getSigningKey(),SignatureAlgorithm.HS256)
                    .compact();
            System.out.println(1);
            return token;
        }catch (Exception e){
            System.out.println(2);
            System.out.println(e.getMessage());
            return null;
        }
    }
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return io.jsonwebtoken.security.Keys.hmacShaKeyFor(keyBytes);
    }
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public  <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getClaims(token);
        return claimsResolver.apply(claims);
    }
    public boolean isTokenExpired(String token) {
        Date expirationDate = this.extractClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }
}
