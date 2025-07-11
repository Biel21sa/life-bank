package br.fai.lds.lifebank.port.service.user;

import br.fai.lds.lifebank.domain.UserModel;

public interface ReadByEmailService {

    UserModel findByEmail(final String email);

}
