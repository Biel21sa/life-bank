package br.fai.lds.lifebank.implementation.dao.fake;

import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;
import br.fai.lds.lifebank.port.dao.donor.DonorDao;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class DonorFakeDaoImpl implements DonorDao {

    private final List<DonorModel> entities = new ArrayList<>();
    private static int ID = 0;

    public DonorFakeDaoImpl() {
        DonorModel entity1 = new DonorModel(getNextId(), "120.120.123-10", BloodType.A_NEGATIVE, true);

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
        System.out.println("A entidade: " + removeEntity.getCpf() + " foi removida com sucesso");
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
                data.setApto(entity.isApto());
                break;
            }
        }
    }

    @Override
    public void deleteByCpf(String cpf) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            DonorModel entity = entities.get(i);
            if (Objects.equals(entity.getCpf(), cpf)) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        DonorModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getCpf() + " foi removida com sucesso");
    }

    @Override
    public DonorModel findByCpf(String cpf) {
        for (DonorModel entity : entities) {
            if (Objects.equals(entity.getCpf(), cpf)) {
                return entity;
            }
        }
        return null;
    }
}
