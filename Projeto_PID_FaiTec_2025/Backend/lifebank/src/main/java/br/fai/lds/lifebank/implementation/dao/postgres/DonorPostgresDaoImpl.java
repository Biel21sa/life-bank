package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.port.dao.donor.DonorDao;

import java.sql.Connection;
import java.util.List;
import java.util.logging.Logger;

public class DonorPostgresDaoImpl implements DonorDao {

    private static final Logger logger = Logger.getLogger(DonorPostgresDaoImpl.class.getName());

    private final Connection connection;

    public DonorPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(DonorModel entity) {
        return 0;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public DonorModel findByid(int id) {
        return null;
    }

    @Override
    public List<DonorModel> findAll() {
        return List.of();
    }

    @Override
    public void update(int id, DonorModel entity) {

    }

    @Override
    public void deleteByCpf(String cpf) {

    }

    @Override
    public DonorModel findByCpf(String cpf) {
        return null;
    }
}
