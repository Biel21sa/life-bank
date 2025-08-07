package br.fai.lds.lifebank.port.service.benefit;

import br.fai.lds.lifebank.domain.BenefitModel;
import br.fai.lds.lifebank.port.service.crud.CrudService;

public interface BenefitService extends CrudService<BenefitModel>, FindByClinicIdService {
}
