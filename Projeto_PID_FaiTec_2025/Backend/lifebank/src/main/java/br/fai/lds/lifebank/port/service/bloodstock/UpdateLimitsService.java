package br.fai.lds.lifebank.port.service.bloodstock;

import br.fai.lds.lifebank.domain.dto.UpdateLimitsBloodStockDto;

public interface UpdateLimitsService {

    void updateLimits(final UpdateLimitsBloodStockDto data);
}
