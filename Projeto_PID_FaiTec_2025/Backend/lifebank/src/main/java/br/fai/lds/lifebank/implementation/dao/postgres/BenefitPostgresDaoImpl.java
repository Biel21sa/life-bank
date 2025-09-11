package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.BenefitModel;
import br.fai.lds.lifebank.port.dao.benefit.BenefitDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
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

    @Override
    public List<BenefitModel> findByUserId(int userId) {
        final List<BenefitModel> benefits = new ArrayList<>();
        final String sql = "SELECT b.* FROM benefit b " +
                "JOIN donor d ON b.donor_id = d.id " +
                "JOIN user_model u ON d.user_id = u.id " +
                "WHERE u.id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, userId);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                BenefitModel benefit = mapResultSetToBenefitModel(resultSet);
                benefits.add(benefit);
            }

            resultSet.close();
            preparedStatement.close();
            return benefits;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateBenefitStatus(int id) {
        final String sql = "UPDATE benefit SET used = TRUE WHERE id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);

            int rowsUpdated = preparedStatement.executeUpdate();

            preparedStatement.close();

            if (rowsUpdated == 0) {
                throw new RuntimeException("Nenhum benefício encontrado com o ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar benefício com ID: " + id, e);
        }
    }


    @Override
    public List<BenefitModel> findByDonorCpf(String cpf) {
        final List<BenefitModel> benefits = new ArrayList<>();
        final String sql = "SELECT b.* FROM benefit b " +
                "JOIN donor d ON b.donor_id = d.id " +
                "JOIN user_model u ON d.user_id = u.id " +
                "WHERE u.cpf = ? and b.used = FALSE and b.expiration_date >= CURRENT_DATE";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, cpf);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                BenefitModel benefit = mapResultSetToBenefitModel(resultSet);
                benefits.add(benefit);
            }

            resultSet.close();
            preparedStatement.close();
            return benefits;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private BenefitModel mapResultSetToBenefitModel(ResultSet rs) throws SQLException {
        BenefitModel benefit = new BenefitModel();

        benefit.setId(rs.getInt("id"));
        benefit.setAmount(rs.getBigDecimal("amount").doubleValue());
        benefit.setExpirationDate(rs.getDate("expiration_date").toLocalDate());
        benefit.setDescription(rs.getString("description"));
        benefit.setDonationId(rs.getInt("donation_id"));
        benefit.setDonorId(rs.getInt("donor_id"));

        return benefit;
    }
}
