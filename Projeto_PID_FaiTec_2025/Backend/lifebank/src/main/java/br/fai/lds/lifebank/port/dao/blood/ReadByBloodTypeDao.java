package br.fai.lds.lifebank.port.dao.blood;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;

public interface ReadByBloodTypeDao {
    BloodModel findByType(BloodType bloodType);
}
