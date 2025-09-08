package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.BenefitModel;
import br.fai.lds.lifebank.port.dao.benefit.BenefitDao;

import java.sql.Connection;
import java.util.List;
import java.util.logging.Logger;

public class BenefitPostgresDaoImpl implements BenefitDao {

    private static final Logger logger = Logger.getLogger(BenefitPostgresDaoImpl.class.getName());

    private final Connection connection;

    public BenefitPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(BenefitModel entity) {
        return 0;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public BenefitModel findByid(int id) {
        return null;
    }

    @Override
    public List<BenefitModel> findAll() {
        return List.of();
    }

    @Override
    public void update(int id, BenefitModel entity) {

    }
}
