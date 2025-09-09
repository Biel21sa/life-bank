package br.fai.lds.lifebank.port.dao.blood;

import br.fai.lds.lifebank.domain.dto.UpdateBloodsDto;

public interface UpdateBloodsDao {

    void updateBloods(final UpdateBloodsDto data);
}
