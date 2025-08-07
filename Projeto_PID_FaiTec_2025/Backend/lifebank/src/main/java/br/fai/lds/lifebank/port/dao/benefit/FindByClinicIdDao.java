package br.fai.lds.lifebank.port.dao.benefit;

import br.fai.lds.lifebank.domain.BenefitModel;

import java.util.List;

public interface FindByClinicIdDao {
    List<BenefitModel> findByClinicId(int clinicId);
}
