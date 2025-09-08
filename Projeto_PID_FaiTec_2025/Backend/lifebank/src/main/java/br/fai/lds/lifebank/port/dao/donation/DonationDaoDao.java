package br.fai.lds.lifebank.port.dao.donation;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.port.dao.crud.CrudDao;

public interface DonationDaoDao extends CrudDao<DonationModel>, ReadByDonorCpfDao, ReadByDonationLocationIdDao {
}
