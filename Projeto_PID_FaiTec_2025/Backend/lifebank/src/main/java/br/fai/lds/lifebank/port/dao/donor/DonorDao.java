package br.fai.lds.lifebank.port.dao.donor;

import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.port.dao.crud.CrudDao;

public interface DonorDao extends CrudDao<DonorModel>, DeleteByCpfDao, ReadByCpfDao {
}
