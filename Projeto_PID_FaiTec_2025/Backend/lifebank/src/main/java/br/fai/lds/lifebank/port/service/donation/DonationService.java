package br.fai.lds.lifebank.port.service.donation;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.port.service.crud.CrudService;

public interface DonationService extends CrudService<DonationModel>, ReadByDonorCpfService, ReadByDonationLocationIdService {
}
