package br.fai.lds.lifebank.port.dao.user;

import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.dao.crud.CrudDao;

public interface UserDao extends CrudDao<UserModel>, ReadByEmailDao, UpdatePasswordDao {
}
