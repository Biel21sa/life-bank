package br.fai.lds.lifebank.port.service.user;

import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.service.crud.CrudService;

public interface UserService extends CrudService<UserModel>, ReadByEmailService, UpdatePasswordService {


}
