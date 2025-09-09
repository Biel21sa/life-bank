package br.fai.lds.lifebank.port.service.authentication;

import br.fai.lds.lifebank.domain.UserModel;

public interface AuthenticationService {

    UserModel authenticate(final String email, final String password);

}
