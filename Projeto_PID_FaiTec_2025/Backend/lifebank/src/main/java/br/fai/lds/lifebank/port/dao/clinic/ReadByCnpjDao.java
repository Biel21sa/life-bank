package br.fai.lds.lifebank.port.dao.clinic;

import br.fai.lds.lifebank.domain.ClinicModel;

public interface ReadByCnpjDao {
    ClinicModel findByCnpj(String cnpj);
}
