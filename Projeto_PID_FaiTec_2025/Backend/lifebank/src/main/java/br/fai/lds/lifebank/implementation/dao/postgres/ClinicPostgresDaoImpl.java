package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.ClinicModel;
import br.fai.lds.lifebank.port.dao.clinic.ClinicDao;

import java.sql.Connection;
import java.util.List;
import java.util.logging.Logger;

public class ClinicPostgresDaoImpl implements ClinicDao {

    private static final Logger logger = Logger.getLogger(ClinicPostgresDaoImpl.class.getName());

    private final Connection connection;

    public ClinicPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public ClinicModel findByCnpj(String cnpj) {
        return null;
    }

    @Override
    public int create(ClinicModel entity) {
        return 0;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public ClinicModel findByid(int id) {
        return null;
    }

    @Override
    public List<ClinicModel> findAll() {
        return List.of();
    }

    @Override
    public void update(int id, ClinicModel entity) {

    }
}
