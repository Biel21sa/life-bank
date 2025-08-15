package br.fai.lds.lifebank.implementation.service.clinic;

import br.fai.lds.lifebank.domain.ClinicModel;
import br.fai.lds.lifebank.port.dao.clinic.ClinicDao;
import br.fai.lds.lifebank.port.service.clinic.ClinicService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClinicServiceImpl implements ClinicService {

    private final ClinicDao clinicDao;

    public ClinicServiceImpl(ClinicDao clinicDao) {
        this.clinicDao = clinicDao;
    }

    @Override
    public ClinicModel findByCnpj(String cnpj) {
        if (cnpj.isEmpty()) {
            return null;
        }

        ClinicModel entity = clinicDao.findByCnpj(cnpj);
        return entity;
    }

    @Override
    public int create(ClinicModel entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }

        if (entity.getName() == null || entity.getCnpj() == null) {
            return invalidResponse;
        }

        final int id = clinicDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        clinicDao.delete(id);
    }

    @Override
    public ClinicModel findByid(int id) {
        if (id < 0) {
            return null;
        }

        ClinicModel entity = clinicDao.findByid(id);
        return entity;
    }

    @Override
    public List<ClinicModel> findAll() {
        final List<ClinicModel> entities = clinicDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, ClinicModel entity) {
        if (id != entity.getId()) {
            return;
        }

        ClinicModel clinicModel = findByid(id);
        if (clinicModel == null) {
            return;
        }

        clinicDao.update(id, entity);
    }
}
