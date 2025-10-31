package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.domain.dto.AuthenticationDto;
import br.fai.lds.lifebank.port.service.authentication.AuthenticationService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("jwt")
@RestController
@RequestMapping("/authenticate")
public class JwtAuthenticationRestController {

    private final AuthenticationService authenticationService;

    public JwtAuthenticationRestController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping
    public ResponseEntity<UserModel> authenticate(@RequestBody final AuthenticationDto authenticationDto) {

        UserModel authenticatedUser = authenticationService.authenticate(
                authenticationDto.getEmail(),
                authenticationDto.getPassword());

        if(authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(authenticatedUser);
    }

}
