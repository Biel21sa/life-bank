package br.fai.lds.lifebank.port.dao.user;

import br.fai.lds.lifebank.domain.UserModel;

public interface ReadByEmailDao {

    UserModel findByEmail(final String email);

}
