package br.fai.lds.lifebank.port.dao.donor;

import br.fai.lds.lifebank.domain.DonorModel;

public interface ReadByCpfDao {
    DonorModel findByCpf(String cpf);
}
