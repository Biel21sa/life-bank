package br.fai.lds.lifebank.port.service.clinic;

import br.fai.lds.lifebank.domain.ClinicModel;
import br.fai.lds.lifebank.port.service.crud.CrudService;

public interface ClinicService extends CrudService<ClinicModel>, ReadByCnpjService {
}
