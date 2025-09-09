package br.fai.lds.lifebank.port.service.blood;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.port.service.crud.CrudService;

public interface BloodService extends CrudService<BloodModel>, ReadByBloodTypeService, ReadByDonationLocationIdService, UpdateBloodsService {
}
