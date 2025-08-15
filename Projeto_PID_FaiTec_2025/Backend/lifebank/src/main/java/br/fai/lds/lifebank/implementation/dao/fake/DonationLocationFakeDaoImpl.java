package br.fai.lds.lifebank.implementation.dao.fake;

import br.fai.lds.lifebank.domain.DonationLocationModel;
import br.fai.lds.lifebank.port.dao.donationlocation.DonationLocationDao;

import java.util.ArrayList;
import java.util.List;

public class DonationLocationFakeDaoImpl implements DonationLocationDao {

    private final List<DonationLocationModel> entities = new ArrayList<>();
    private static int ID = 0;

    public DonationLocationFakeDaoImpl() {
        DonationLocationModel entity1 = new DonationLocationModel(getNextId(), "Hospital Saúde", "Rua da loucura", "Bairro Sangue", 7);

        entities.add(entity1);
    }

    private int getNextId() {
        ID += 1;
        return ID;
    }


    @Override
    public int create(DonationLocationModel entity) {
        final int id = getNextId();
        entity.setId(id);
        entities.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            DonationLocationModel entity = entities.get(i);
            if (entity.getId() == id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        DonationLocationModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getName() + " foi removida com sucesso");
    }

    @Override
    public DonationLocationModel findByid(int id) {
        for (DonationLocationModel entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public List<DonationLocationModel> findAll() {
        return entities;
    }

    @Override
    public void update(int id, DonationLocationModel entity) {
        for (DonationLocationModel data : entities) {
            if (data.getId() == id) {
                data.setName(entity.getName());
                break;
            }
        }
    }
}
