package br.fai.lds.lifebank.domain.dto;

public class JwtTokenDto {
    private String token;

    public JwtTokenDto(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
