package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.port.dao.donation.DonationDao;

import java.sql.Connection;
import java.util.List;
import java.util.logging.Logger;

public class DonationPostgresDaoImpl implements DonationDao {

    private static final Logger logger = Logger.getLogger(DonationPostgresDaoImpl.class.getName());

    private final Connection connection;

    public DonationPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(DonationModel entity) {
        return 0;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public DonationModel findByid(int id) {
        return null;
    }

    @Override
    public List<DonationModel> findAll() {
        return List.of();
    }

    @Override
    public void update(int id, DonationModel entity) {

    }

    @Override
    public List<DonationModel> findByDonorCpf(String cpf) {
        return List.of();
    }
}
