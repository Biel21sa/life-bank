package br.fai.lds.lifebank.implementation.service.donor;

import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.port.dao.donor.DonorDao;
import br.fai.lds.lifebank.port.service.donor.DonorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonorServiceImpl implements DonorService {

    private final DonorDao donorDao;

    public DonorServiceImpl(DonorDao donorDao) {
        this.donorDao = donorDao;
    }

    @Override
    public int create(DonorModel entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }

        if (entity.getBloodType() == null || entity.getCpf() == null) {
            return invalidResponse;
        }

        final int id = donorDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        donorDao.delete(id);
    }

    @Override
    public DonorModel findByid(int id) {
        if (id < 0) {
            return null;
        }

        DonorModel entity = donorDao.findByid(id);
        return entity;
    }

    @Override
    public List<DonorModel> findAll() {
        final List<DonorModel> entities = donorDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, DonorModel entity) {
        if (id != entity.getId()) {
            return;
        }

        DonorModel bloodModel = findByid(id);
        if (bloodModel == null) {
            return;
        }

        donorDao.update(id, entity);
    }

    @Override
    public void deleteByCpf(String cpf) {
        if (cpf.isEmpty()) {
            return;
        }

        donorDao.deleteByCpf(cpf);
    }

    @Override
    public DonorModel findByCpf(String cpf) {
        if (cpf.isEmpty()) {
            return null;
        }

        DonorModel entity = donorDao.findByCpf(cpf);
        return entity;
    }
}
