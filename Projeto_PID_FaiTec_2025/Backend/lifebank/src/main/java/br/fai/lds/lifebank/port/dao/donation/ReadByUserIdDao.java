package br.fai.lds.lifebank.port.dao.donation;

import br.fai.lds.lifebank.domain.DonationModel;

import java.util.List;

public interface ReadByUserIdDao {
    List<DonationModel> findByUserId(int userId);
}
