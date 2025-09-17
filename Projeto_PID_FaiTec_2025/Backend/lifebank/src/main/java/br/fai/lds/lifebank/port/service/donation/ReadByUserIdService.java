package br.fai.lds.lifebank.port.service.donation;

import br.fai.lds.lifebank.domain.DonationModel;

import java.util.List;

public interface ReadByUserIdService {
    List<DonationModel> findByUserId(int userId);
}
