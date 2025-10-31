package br.fai.lds.lifebank.implementation.service.authentication.jwt;

import io.jsonwebtoken.Claims;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Profile("jwt")
@Component
public class JwtService {

    private final String secret = "XUFAE3FQG1RLBlgQ93fDSUlj4HfbKi4a1kFl1gDloOg=";

    public String getEmailFromToken(String valor){
        return "";
    }

    public Date getExpirationDateFromTOken(String token){
        return null;
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsTFunction){
        return null;
    }

    public Claims getAllClaimsFromToken(String token){
        return null;
    }

    public boolean tokenExpired(String token){
        return false;
    }

    public boolean validateToken(String token, UserDetails userDetails){
        return false;
    }

    public String generateToken(String Token, UserDetails userDetails){
        return "";
    }

    private String createToken(Map<String, Object> claims, String subjct){
        return "";
    }

}
