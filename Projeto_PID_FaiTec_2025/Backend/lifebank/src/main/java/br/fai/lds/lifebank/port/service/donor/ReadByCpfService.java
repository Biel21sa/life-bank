package br.fai.lds.lifebank.port.service.donor;

import br.fai.lds.lifebank.domain.DonorModel;

public interface ReadByCpfService {
    DonorModel findByCpf(String cpf);
}
