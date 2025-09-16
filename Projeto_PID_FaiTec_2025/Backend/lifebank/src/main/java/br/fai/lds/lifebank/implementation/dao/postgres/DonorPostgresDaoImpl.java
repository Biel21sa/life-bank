package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.dao.donor.DonorDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
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
        final String sql = "INSERT INTO donor (blood_type, user_id, gender, last_donation_date) " +
                "VALUES (?, ?, ?, ?) RETURNING id";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, entity.getBloodType());
            ps.setInt(2, entity.getUserId());
            ps.setString(3, entity.getGender());

            if (entity.getLastDonationDate() != null) {
                ps.setDate(4, java.sql.Date.valueOf(entity.getLastDonationDate()));
            } else {
                ps.setNull(4, java.sql.Types.DATE);
            }

            ResultSet rs = ps.executeQuery();
            int generatedId = 0;
            if (rs.next()) {
                generatedId = rs.getInt("id");
            }

            rs.close();
            ps.close();
            return generatedId;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao criar doador", e);
        }
    }

    @Override
    public void delete(int id) {
        final String sql = "DELETE FROM donor WHERE id = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, id);

            int rows = ps.executeUpdate();
            ps.close();

            if (rows == 0) {
                throw new RuntimeException("Nenhum doador encontrado para deletar com ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao deletar doador com ID: " + id, e);
        }
    }

    @Override
    public void update(int id, DonorModel entity) {
        final String sql = "UPDATE donor SET blood_type = ?, user_id = ?, gender = ?, last_donation_date = ? " +
                "WHERE id = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, entity.getBloodType());
            ps.setInt(2, entity.getUserId());
            ps.setString(3, entity.getGender());

            if (entity.getLastDonationDate() != null) {
                ps.setDate(4, java.sql.Date.valueOf(entity.getLastDonationDate()));
            } else {
                ps.setNull(4, java.sql.Types.DATE);
            }

            ps.setInt(5, id);

            int rows = ps.executeUpdate();
            ps.close();

            if (rows == 0) {
                throw new RuntimeException("Nenhum doador encontrado para atualizar com ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar doador com ID: " + id, e);
        }
    }

    @Override
    public DonorModel findByid(int id) {
        final String sql = "SELECT d.*, u.name, u.email, u.cpf, u.phone, " +
                "CASE " +
                "WHEN (d.gender = 'MASCULINO' AND (d.last_donation_date IS NULL OR d.last_donation_date <= CURRENT_DATE - INTERVAL '60 days')) " +
                "OR (d.gender = 'FEMININO' AND (d.last_donation_date IS NULL OR d.last_donation_date <= CURRENT_DATE - INTERVAL '90 days')) " +
                "THEN TRUE ELSE FALSE END AS apto " +
                "FROM donor d " +
                "JOIN user_model u ON d.user_id = u.id " +
                "WHERE d.id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                DonorModel donor = mapResultSetToDonorModel(resultSet);
                preparedStatement.close();
                resultSet.close();
                return donor;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<DonorModel> findAll() {
        final List<DonorModel> donors = new ArrayList<>();
        final String sql = "SELECT d.*, u.name, u.email, u.cpf, u.phone, " +
                "CASE " +
                "WHEN (d.gender = 'MASCULINO' AND (d.last_donation_date IS NULL OR d.last_donation_date <= CURRENT_DATE - INTERVAL '60 days')) " +
                "OR (d.gender = 'FEMININO' AND (d.last_donation_date IS NULL OR d.last_donation_date <= CURRENT_DATE - INTERVAL '90 days')) " +
                "THEN TRUE ELSE FALSE END AS apto " +
                "FROM donor d " +
                "JOIN user_model u ON d.user_id = u.id";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                DonorModel donor = mapResultSetToDonorModel(resultSet);
                donors.add(donor);
            }

            resultSet.close();
            preparedStatement.close();
            return donors;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private DonorModel mapResultSetToDonorModel(ResultSet rs) throws SQLException {
        DonorModel donor = new DonorModel();

        donor.setId(rs.getInt("id"));
        donor.setBloodType(rs.getString("blood_type"));
        donor.setUserId(rs.getInt("user_id"));
        donor.setGender(rs.getString("gender"));
        donor.setApto(rs.getBoolean("apto"));

        if (rs.getDate("last_donation_date") != null) {
            donor.setLastDonationDate(rs.getDate("last_donation_date").toLocalDate());
        }

        // Mapear dados básicos do usuário
        UserModel user = new UserModel();
        user.setId(rs.getInt("user_id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setCpf(rs.getString("cpf"));
        user.setPhone(rs.getString("phone"));
        donor.setUser(user);

        return donor;
    }
}
