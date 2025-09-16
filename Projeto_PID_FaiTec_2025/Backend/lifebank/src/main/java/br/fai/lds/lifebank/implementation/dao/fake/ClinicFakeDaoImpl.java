package br.fai.lds.lifebank.implementation.dao.fake;

import br.fai.lds.lifebank.domain.ClinicModel;
import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.port.dao.clinic.ClinicDao;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ClinicFakeDaoImpl implements ClinicDao {

    private final List<ClinicModel> entities = new ArrayList<>();
    private static int ID = 0;

    public ClinicFakeDaoImpl() {
        ClinicModel entity1 = new ClinicModel(getNextId(), "1000.200/01", "Clínica Saúde", "Rua da perdição", "Bairro Ipiranga", "7");

        entities.add(entity1);
    }

    private int getNextId() {
        ID += 1;
        return ID;
    }

    @Override
    public ClinicModel findByCnpj(String cnpj) {
        for (ClinicModel entity : entities) {
            if (Objects.equals(entity.getCnpj(), cnpj)) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public int create(ClinicModel entity) {
        final int id = getNextId();
        entity.setId(id);
        entities.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            ClinicModel entity = entities.get(i);
            if (entity.getId() == id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        ClinicModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getName() + " foi removida com sucesso");
    }

    @Override
    public ClinicModel findByid(int id) {
        for (ClinicModel entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public List<ClinicModel> findAll() {
        return entities;
    }

    @Override
    public void update(int id, ClinicModel entity) {
        for (ClinicModel data : entities) {
            if (data.getId() == id) {
                data.setName(entity.getName());
                break;
            }
        }
    }
}
