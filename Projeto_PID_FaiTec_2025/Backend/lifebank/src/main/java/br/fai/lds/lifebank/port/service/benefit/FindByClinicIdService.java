package br.fai.lds.lifebank.port.service.benefit;

import br.fai.lds.lifebank.domain.BenefitModel;

import java.util.List;

public interface FindByClinicIdService {
    List<BenefitModel> findByClinicId(int clinicId);
}
