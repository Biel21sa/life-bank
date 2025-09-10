package br.fai.lds.lifebank.implementation.service.donation;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.domain.dto.DonationByBloodTypeDto;
import br.fai.lds.lifebank.domain.dto.DonationEvolutionByBloodTypeDto;
import br.fai.lds.lifebank.domain.dto.DonationEvolutionDto;
import br.fai.lds.lifebank.port.dao.donation.DonationDao;
import br.fai.lds.lifebank.port.service.donation.DonationService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DonationServiceImpl implements DonationService {

    private final DonationDao donationDao;

    public DonationServiceImpl(DonationDao donationDao) {
        this.donationDao = donationDao;
    }

    @Override
    public int create(DonationModel entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }

        if (    entity.getQuantity() <= -1 ||
                entity.getDonorId() <= 0 ||
                entity.getDonationLocationId() <= 0) {
            return invalidResponse;
        }

        final int id = donationDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        donationDao.delete(id);
    }

    @Override
    public DonationModel findByid(int id) {
        if (id < 0) {
            return null;
        }

        DonationModel entity = donationDao.findByid(id);
        return entity;
    }

    @Override
    public List<DonationModel> findAll() {
        final List<DonationModel> entities = donationDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, DonationModel entity) {
        if (id != entity.getId()) {
            return;
        }

        DonationModel donationModel = findByid(id);
        if (donationModel == null) {
            return;
        }

        donationDao.update(id, entity);
    }

    @Override
    public List<DonationModel> findByDonorCpf(String cpf) {
        if (cpf == null) {
            return new ArrayList<>();
        }

        List<DonationModel> donations = donationDao.findByDonorCpf(cpf);

        return donations;
    }

    @Override
    public List<DonationModel> findByDonationLocationId(int id) {
        if (id == 0) {
            return new ArrayList<>();
        }

        List<DonationModel> donations = donationDao.findByDonationLocationId(id);

        return donations;
    }

    @Override
    public List<DonationEvolutionDto> getDonationEvolution(int donationLocationId, int year) {
        if (year == 0 || donationLocationId <= 0) {
            return new ArrayList<>();
        }

        List<DonationEvolutionDto> donations = donationDao.getDonationEvolution(donationLocationId, year);

        return donations;
    }

    @Override
    public List<DonationByBloodTypeDto> getDonationByBloodType(int donationLocationId, int year) {
        if (year == 0 || donationLocationId <= 0) {
            return new ArrayList<>();
        }

        List<DonationByBloodTypeDto> donations = donationDao.getDonationByBloodType(donationLocationId, year);

        return donations;
    }

    @Override
    public List<DonationEvolutionByBloodTypeDto> getDonationEvolutionByBloodType(int donationLocationId, int year) {
        if (year == 0 || donationLocationId <= 0) {
            return new ArrayList<>();
        }

        List<DonationEvolutionByBloodTypeDto> donations = donationDao.getDonationEvolutionByBloodType(donationLocationId, year);

        return donations;
    }
}
