package br.fai.lds.lifebank.port.service.user;

import br.fai.lds.lifebank.domain.UserModel;

import java.util.List;

public interface ReadByRoleService {

   List<UserModel> findByRole(final String role);
}
