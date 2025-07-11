package br.fai.lds.lifebank.port.dao.blood;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.port.dao.crud.CrudDao;


public interface BloodDao extends CrudDao<BloodModel>, ReadByBloodTypeDao {


}

