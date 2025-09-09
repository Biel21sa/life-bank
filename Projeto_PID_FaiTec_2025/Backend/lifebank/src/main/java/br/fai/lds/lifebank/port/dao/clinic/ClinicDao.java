package br.fai.lds.lifebank.port.dao.clinic;

import br.fai.lds.lifebank.domain.ClinicModel;
import br.fai.lds.lifebank.port.dao.crud.CrudDao;

public interface ClinicDao extends CrudDao<ClinicModel>, ReadByCnpjDao {
}
