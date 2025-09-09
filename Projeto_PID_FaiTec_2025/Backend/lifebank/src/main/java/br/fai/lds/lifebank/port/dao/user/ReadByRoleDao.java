package br.fai.lds.lifebank.port.dao.user;

import br.fai.lds.lifebank.domain.UserModel;

import java.util.List;

public interface ReadByRoleDao {

    List<UserModel> findByRole(final String role);
}
