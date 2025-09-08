package br.fai.lds.lifebank.implementation.service.benefit;

import br.fai.lds.lifebank.domain.BenefitModel;
import br.fai.lds.lifebank.port.dao.benefit.BenefitDao;
import br.fai.lds.lifebank.port.service.benefit.BenefitService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BenefitServiceImpl implements BenefitService {

    private final BenefitDao benefitDao;

    public BenefitServiceImpl(BenefitDao benefitDao) {
        this.benefitDao = benefitDao;
    }

    @Override
    public int create(BenefitModel entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }

        if (entity.getDescription() == null ||
                entity.getDonorId() <= 0 ||
                entity.getExpirationDate() == null) {
            return invalidResponse;
        }

        final int id = benefitDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        benefitDao.delete(id);
    }

    @Override
    public BenefitModel findByid(int id) {
        if (id < 0) {
            return null;
        }

        BenefitModel entity = benefitDao.findByid(id);
        return entity;
    }

    @Override
    public List<BenefitModel> findAll() {
        final List<BenefitModel> entities = benefitDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, BenefitModel entity) {
        if (id != entity.getId()) {
            return;
        }

        BenefitModel benefitModel = findByid(id);
        if (benefitModel == null) {
            return;
        }

        benefitDao.update(id, entity);
    }
}
