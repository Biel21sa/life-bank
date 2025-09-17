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
        final String sql = "INSERT INTO benefit (amount, expiration_date, description, donation_id, donor_id, used) " +
                "VALUES (?, ?, ?, ?, ?, FALSE) RETURNING id";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setBigDecimal(1, java.math.BigDecimal.valueOf(entity.getAmount()));
            ps.setDate(2, java.sql.Date.valueOf(entity.getExpirationDate()));
            ps.setString(3, entity.getDescription());
            ps.setInt(4, entity.getDonationId());
            ps.setInt(5, entity.getDonorId());

            ResultSet rs = ps.executeQuery();
            int generatedId = 0;
            if (rs.next()) {
                generatedId = rs.getInt("id");
            }

            rs.close();
            ps.close();
            return generatedId;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao criar benefício", e);
        }
    }

    @Override
    public void delete(int id) {
        final String sql = "DELETE FROM benefit WHERE id = ?";
        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, id);
            int rows = ps.executeUpdate();
            ps.close();

            if (rows == 0) {
                logger.warning("Nenhum benefício encontrado para deletar com ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao deletar benefício com ID: " + id, e);
        }
    }

    @Override
    public BenefitModel findByid(int id) {
        final String sql = "SELECT * FROM benefit WHERE id = ?";
        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            BenefitModel benefit = null;
            if (rs.next()) {
                benefit = mapResultSetToBenefitModel(rs);
            }

            rs.close();
            ps.close();
            return benefit;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar benefício com ID: " + id, e);
        }
    }

    @Override
    public List<BenefitModel> findAll() {
        final List<BenefitModel> benefits = new ArrayList<>();
        final String sql = "SELECT * FROM benefit";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                BenefitModel benefit = mapResultSetToBenefitModel(rs);
                benefits.add(benefit);
            }

            rs.close();
            ps.close();
            return benefits;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar todos os benefícios", e);
        }
    }

    @Override
    public void update(int id, BenefitModel entity) {
        final String sql = "UPDATE benefit SET amount = ?, expiration_date = ?, description = ?, donation_id = ?, donor_id = ?, used = ? " +
                "WHERE id = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setBigDecimal(1, java.math.BigDecimal.valueOf(entity.getAmount()));
            ps.setDate(2, java.sql.Date.valueOf(entity.getExpirationDate()));
            ps.setString(3, entity.getDescription());
            ps.setInt(4, entity.getDonationId());
            ps.setInt(5, entity.getDonorId());
            ps.setBoolean(6, entity.isUsed());
            ps.setInt(7, id);

            int rows = ps.executeUpdate();
            ps.close();

            if (rows == 0) {
                throw new RuntimeException("Nenhum benefício encontrado para atualizar com ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar benefício com ID: " + id, e);
        }
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
