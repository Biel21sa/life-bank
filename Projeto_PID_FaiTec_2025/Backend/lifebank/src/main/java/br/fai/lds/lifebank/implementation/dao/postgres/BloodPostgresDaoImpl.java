package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;
import br.fai.lds.lifebank.port.dao.blood.BloodDao;

import java.sql.Connection;
import java.util.List;
import java.util.logging.Logger;

public class BloodPostgresDaoImpl implements BloodDao {

    private static final Logger logger = Logger.getLogger(BloodPostgresDaoImpl.class.getName());

    private final Connection connection;

    public BloodPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public BloodModel findByType(BloodType bloodType) {
        return null;
    }

    @Override
    public int create(BloodModel entity) {
        return 0;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public BloodModel findByid(int id) {
        return null;
    }

    @Override
    public List<BloodModel> findAll() {
        return List.of();
    }

    @Override
    public void update(int id, BloodModel entity) {

    }
}
