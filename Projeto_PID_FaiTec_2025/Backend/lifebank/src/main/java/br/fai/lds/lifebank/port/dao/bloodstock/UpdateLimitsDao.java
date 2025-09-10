package br.fai.lds.lifebank.port.dao.bloodstock;

import br.fai.lds.lifebank.domain.dto.UpdateLimitsBloodStockDto;

public interface UpdateLimitsDao {

    void updateLimits(final UpdateLimitsBloodStockDto data);
}
