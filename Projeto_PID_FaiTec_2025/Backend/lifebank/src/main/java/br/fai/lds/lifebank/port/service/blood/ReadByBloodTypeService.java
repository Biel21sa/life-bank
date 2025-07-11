package br.fai.lds.lifebank.port.service.blood;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;

public interface ReadByBloodTypeService {
    BloodModel findByType(BloodType bloodType);
}
