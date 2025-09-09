package br.fai.lds.lifebank.port.service.blood;

import br.fai.lds.lifebank.domain.dto.UpdateBloodsDto;

public interface UpdateBloodsService {

    void updateBloods(final UpdateBloodsDto data);
}
