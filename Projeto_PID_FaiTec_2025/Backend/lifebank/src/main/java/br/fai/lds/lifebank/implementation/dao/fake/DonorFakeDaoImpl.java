package br.fai.lds.lifebank.implementation.dao.fake;

import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;
import br.fai.lds.lifebank.port.dao.crud.CrudDao;
import br.fai.lds.lifebank.port.dao.donor.DonorDao;

import java.util.ArrayList;
import java.util.List;

public class DonorFakeDaoImpl implements DonorDao {

    private final List<DonorModel> entities = new ArrayList<>();
    private static int ID = 0;

    public DonorFakeDaoImpl() {
        DonorModel entity1 = new DonorModel(getNextId(), "O-", "MASCULINO");

        entities.add(entity1);
    }

    private int getNextId() {
        ID += 1;
        return ID;
    }

    @Override
    public int create(DonorModel entity) {
        final int id = getNextId();
        entity.setId(id);
        entities.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            DonorModel entity = entities.get(i);
            if (entity.getId() == id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        DonorModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getBloodType() + " foi removida com sucesso");
    }

    @Override
    public DonorModel findByid(int id) {
        for (DonorModel entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public List<DonorModel> findAll() {
        return entities;
    }

    @Override
    public void update(int id, DonorModel entity) {
        for (DonorModel data : entities) {
            if (data.getId() == id) {
                data.setGender(entity.getGender());
                break;
            }
        }
    }
}
