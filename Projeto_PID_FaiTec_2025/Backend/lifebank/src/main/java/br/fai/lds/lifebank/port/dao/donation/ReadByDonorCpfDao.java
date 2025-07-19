package br.fai.lds.lifebank.port.dao.donation;

import br.fai.lds.lifebank.domain.DonationModel;

import java.util.List;

public interface ReadByDonorCpfDao {
    List<DonationModel> findByDonorCpf(String cpf);
}
