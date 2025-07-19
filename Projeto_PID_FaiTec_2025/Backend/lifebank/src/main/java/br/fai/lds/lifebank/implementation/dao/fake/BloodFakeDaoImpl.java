package br.fai.lds.lifebank.implementation.dao.fake;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;
import br.fai.lds.lifebank.port.dao.blood.BloodDao;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class BloodFakeDaoImpl implements BloodDao {

    private final List<BloodModel> entities = new ArrayList<>();
    private static int ID = 0;

    public BloodFakeDaoImpl() {
        BloodModel entity1 = new BloodModel(getNextId(), BloodType.A_NEGATIVE, 200, LocalDate.of(2025, 7, 15), LocalDate.of(2025, 8, 29), 100, 500);

        entities.add(entity1);
    }

    private int getNextId() {
        ID += 1;
        return ID;
    }

    @Override
    public int create(BloodModel entity) {
        final int id = getNextId();
        entity.setId(id);
        entities.add(entity);
        return id;
    }

    @Override
    public BloodModel findByid(int id) {
        for (BloodModel entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public List<BloodModel> findAll() {
        return entities;
    }

    @Override
    public BloodModel findByType(BloodType bloodType) {
        for (BloodModel entity : entities) {
            if (Objects.equals(entity.getBloodType(), bloodType)) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public void update(int id, BloodModel entity) {
        for (BloodModel data : entities) {
            if (data.getId() == id) {
                data.setQuantity(entity.getQuantity());
                break;
            }
        }
    }

    @Override
    public void delete(int id) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            BloodModel entity = entities.get(i);
            if (entity.getId() == id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        BloodModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getBloodType() + " foi removida com sucesso");

    }
}

