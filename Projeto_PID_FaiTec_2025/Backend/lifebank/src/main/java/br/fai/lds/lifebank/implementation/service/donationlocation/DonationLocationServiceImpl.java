package br.fai.lds.lifebank.implementation.service.donationlocation;

import br.fai.lds.lifebank.domain.DonationLocationModel;
import br.fai.lds.lifebank.port.dao.donationlocation.DonationLocationDao;
import br.fai.lds.lifebank.port.service.donationlocation.DonationLocationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationLocationServiceImpl implements DonationLocationService {

    private final DonationLocationDao donationLocationDao;

    public DonationLocationServiceImpl(DonationLocationDao donationLocationDao) {
        this.donationLocationDao = donationLocationDao;
    }


    @Override
    public int create(DonationLocationModel entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }

        if (entity.getName() == null || entity.getAddress() == null) {
            return invalidResponse;
        }

        final int id = donationLocationDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        donationLocationDao.delete(id);
    }

    @Override
    public DonationLocationModel findByid(int id) {
        if (id < 0) {
            return null;
        }

        DonationLocationModel entity = donationLocationDao.findByid(id);
        return entity;
    }

    @Override
    public List<DonationLocationModel> findAll() {
        final List<DonationLocationModel> entities = donationLocationDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, DonationLocationModel entity) {
        if (id != entity.getId()) {
            return;
        }

        DonationLocationModel clinicModel = findByid(id);
        if (clinicModel == null) {
            return;
        }

        donationLocationDao.update(id, entity);
    }
}
