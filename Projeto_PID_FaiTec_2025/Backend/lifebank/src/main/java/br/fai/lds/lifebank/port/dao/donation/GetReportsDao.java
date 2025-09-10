package br.fai.lds.lifebank.port.dao.donation;

import br.fai.lds.lifebank.domain.dto.DonationByBloodTypeDto;
import br.fai.lds.lifebank.domain.dto.DonationEvolutionByBloodTypeDto;
import br.fai.lds.lifebank.domain.dto.DonationEvolutionDto;

import java.util.List;

public interface GetReportsDao {

    public List<DonationEvolutionDto> getDonationEvolution(final int donationLocationId, final int year);

    public List<DonationByBloodTypeDto> getDonationByBloodType(final int donationLocationId, final int year);

    public List<DonationEvolutionByBloodTypeDto> getDonationEvolutionByBloodType(final int donationLocationId, final int year);
}
