package br.fai.lds.lifebank.port.dao.bloodstock;

import br.fai.lds.lifebank.domain.BloodStockModel;

import java.util.List;

public interface ReadByDonationLocationIdDao {

    List<BloodStockModel> findByDonationLocationId(int id);
}
