package br.fai.lds.lifebank.port.dao.donation;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.port.dao.crud.CrudDao;

public interface DonationDao extends CrudDao<DonationModel>, ReadByDonorCpfDao,
        ReadByDonationLocationIdDao, GetReportsDao,
        ReadByUserIdDao {
}
