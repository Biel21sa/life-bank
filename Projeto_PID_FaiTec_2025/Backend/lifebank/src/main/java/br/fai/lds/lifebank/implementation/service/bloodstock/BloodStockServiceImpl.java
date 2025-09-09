package br.fai.lds.lifebank.implementation.service.bloodstock;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.BloodStockModel;
import br.fai.lds.lifebank.port.dao.bloodstock.BloodStockDao;
import br.fai.lds.lifebank.port.service.bloodstock.BloodStockService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BloodStockServiceImpl implements BloodStockService {

    private final BloodStockDao bloodStockDao;

    public BloodStockServiceImpl(BloodStockDao bloodStockDao) {
        this.bloodStockDao = bloodStockDao;
    }


    @Override
    public List<BloodStockModel> findByDonationLocationId(int id) {
        if (id == 0) {
            return new ArrayList<>();
        }

        List<BloodStockModel> entities = bloodStockDao.findByDonationLocationId(id);

        return entities;
    }
}
