package br.fai.lds.lifebank.port.service.clinic;

import br.fai.lds.lifebank.domain.ClinicModel;

public interface ReadByCnpjService {
    ClinicModel findByCnpj(String cnpj);
}
