package br.fai.lds.lifebank.port.dao.blood;

import br.fai.lds.lifebank.domain.BloodModel;

import java.util.List;

public interface ReadByDonationLocationIdDao {

    List<BloodModel> findByDonationLocationId(int id);
}
