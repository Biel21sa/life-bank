package br.fai.lds.lifebank.port.service.bloodstock;

import br.fai.lds.lifebank.domain.BloodStockModel;

import java.util.List;

public interface ReadByDonationLocationIdService {

    List<BloodStockModel> findByDonationLocationId(int id);
}
