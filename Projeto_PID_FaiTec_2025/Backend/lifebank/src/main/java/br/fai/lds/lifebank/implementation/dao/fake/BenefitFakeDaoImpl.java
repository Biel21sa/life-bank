package br.fai.lds.lifebank.implementation.dao.fake;

import br.fai.lds.lifebank.domain.BenefitModel;
import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.port.dao.benefit.BenefitDao;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class BenefitFakeDaoImpl implements BenefitDao {

    private final List<BenefitModel> entities = new ArrayList<>();
    private static int ID = 0;

    public BenefitFakeDaoImpl() {
        BenefitModel entity1 = new BenefitModel(getNextId(), "Benefício", 150.00, LocalDate.parse("2025-08-07"), 1, 1);

        entities.add(entity1);
    }

    private int getNextId() {
        ID += 1;
        return ID;
    }

    @Override
    public int create(BenefitModel entity) {
        final int id = getNextId();
        entity.setId(id);
        entities.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            BenefitModel entity = entities.get(i);
            if (entity.getId() == id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        BenefitModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getDescription() + " foi removida com sucesso");
    }

    @Override
    public BenefitModel findByid(int id) {
        for (BenefitModel entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public List<BenefitModel> findAll() {
        return entities;
    }

    @Override
    public void update(int id, BenefitModel entity) {
        for (BenefitModel data : entities) {
            if (data.getId() == id) {
                data.setDescription(entity.getDescription());
                break;
            }
        }
    }

    @Override
    public List<BenefitModel> findByUserId(int userId) {
        return null;
    }
}
