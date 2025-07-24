package br.fai.lds.lifebank.port.service.donor;

import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.port.service.crud.CrudService;

public interface DonorService extends CrudService<DonorModel>, DeleteByCpfService, ReadByCpfService {
}
