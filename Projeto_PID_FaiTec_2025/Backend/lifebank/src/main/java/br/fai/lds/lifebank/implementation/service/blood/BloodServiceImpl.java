package br.fai.lds.lifebank.implementation.service.blood;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;
import br.fai.lds.lifebank.port.dao.blood.BloodDao;
import br.fai.lds.lifebank.port.service.blood.BloodService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodServiceImpl implements BloodService {

    private final BloodDao bloodDao;

    public BloodServiceImpl(BloodDao bloodDao) {
        this.bloodDao = bloodDao;
    }

    @Override
    public int create(BloodModel entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }

        if (entity.getBloodType() == null ||
                entity.getQuantity() <= 0 ||
                entity.getValidity() == null) {
            return invalidResponse;
        }

        final int id = bloodDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        bloodDao.delete(id);
    }

    @Override
    public BloodModel findByid(int id) {
        if (id < 0) {
            return null;
        }

        BloodModel entity = bloodDao.findByid(id);
        return entity;
    }

    @Override
    public List<BloodModel> findAll() {
        final List<BloodModel> entities = bloodDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, BloodModel entity) {
        if (id != entity.getId()) {
            return;
        }

        BloodModel bloodModel = findByid(id);
        if (bloodModel == null) {
            return;
        }

        bloodDao.update(id, entity);
    }

    @Override
    public BloodModel findByType(BloodType bloodType) {
        if (bloodType == null) {
            return null;
        }

        BloodModel entity = bloodDao.findByType(bloodType);
        return entity;
    }
}
