package br.fai.lds.lifebank.port.service.donation;

import br.fai.lds.lifebank.domain.DonationModel;

import java.util.List;

public interface ReadByDonorCpfService {
    List<DonationModel> findByDonorCpf(String cpf);
}
