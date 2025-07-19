package br.fai.lds.lifebank.implementation.dao.fake;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;
import br.fai.lds.lifebank.port.dao.donation.DonationDao;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class DonationFakeDaoImpl implements DonationDao {

    private final List<DonationModel> entities = new ArrayList<>();
    private static int ID = 0;

    public DonationFakeDaoImpl() {
        DonationModel entity1 = new DonationModel(getNextId(), BloodType.A_NEGATIVE, 200, LocalDate.of(2025, 7, 15), LocalDate.of(2025, 8, 29), "123", 1);

        entities.add(entity1);
    }

    private int getNextId() {
        ID += 1;
        return ID;
    }


    @Override
    public int create(DonationModel entity) {
        final int id = getNextId();
        entity.setId(id);
        entities.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            DonationModel entity = entities.get(i);
            if (entity.getId() == id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        DonationModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getId() + " foi removida com sucesso");
    }

    @Override
    public DonationModel findByid(int id) {
        for (DonationModel entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public List<DonationModel> findAll() {
        return entities;
    }

    @Override
    public void update(int id, DonationModel entity) {
        for (DonationModel data : entities) {
            if (data.getId() == id) {
                data.setQuantity(entity.getQuantity());
                break;
            }
        }
    }

    @Override
    public List<DonationModel> findByDonorCpf(String cpf) {
        List<DonationModel> foundDonations = new ArrayList<>();

        for (DonationModel entity : entities) {
            if (Objects.equals(entity.getDonorCpf(), cpf)) {
                foundDonations.add(entity);
            }
        }
        return foundDonations;
    }
}
