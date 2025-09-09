package br.fai.lds.lifebank.port.service.blood;

import br.fai.lds.lifebank.domain.BloodModel;

import java.util.List;

public interface ReadByDonationLocationIdService {

    List<BloodModel> findByDonationLocationId(int id);
}
