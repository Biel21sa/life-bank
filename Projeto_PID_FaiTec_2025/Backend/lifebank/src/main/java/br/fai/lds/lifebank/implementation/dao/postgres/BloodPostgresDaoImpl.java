package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.dto.UpdateBloodsDto;
import br.fai.lds.lifebank.port.dao.blood.BloodDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class BloodPostgresDaoImpl implements BloodDao {

    private static final Logger logger = Logger.getLogger(BloodPostgresDaoImpl.class.getName());

    private final Connection connection;

    public BloodPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public BloodModel findByType(String bloodType) {
        final String sql = "SELECT * FROM blood WHERE blood_type = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, bloodType);
            ResultSet rs = ps.executeQuery();

            BloodModel blood = null;
            if (rs.next()) {
                blood = mapResultSetToBloodModel(rs);
            }

            rs.close();
            ps.close();
            return blood;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar sangue do tipo: " + bloodType, e);
        }
    }

    @Override
    public int create(BloodModel entity) {
        final String sql = "INSERT INTO blood (blood_type, quantity) VALUES (?, ?) RETURNING id";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, entity.getBloodType());
            ps.setBigDecimal(2, java.math.BigDecimal.valueOf(entity.getQuantity()));

            ResultSet rs = ps.executeQuery();
            int generatedId = 0;
            if (rs.next()) {
                generatedId = rs.getInt("id");
            }

            rs.close();
            ps.close();
            return generatedId;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao criar registro de sangue", e);
        }
    }

    @Override
    public void delete(int id) {
        final String sql = "DELETE FROM blood WHERE id = ?";
        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, id);

            int rows = ps.executeUpdate();
            ps.close();

            if (rows == 0) {
                throw new RuntimeException("Nenhum registro de sangue encontrado com ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao deletar registro de sangue com ID: " + id, e);
        }
    }

    @Override
    public List<BloodModel> findAll() {
        final List<BloodModel> bloodList = new ArrayList<>();
        final String sql = "SELECT * FROM blood";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                BloodModel blood = mapResultSetToBloodModel(rs);
                bloodList.add(blood);
            }

            rs.close();
            ps.close();
            return bloodList;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar todos os registros de sangue", e);
        }
    }

    @Override
    public void update(int id, BloodModel entity) {
        final String sql = "UPDATE blood SET blood_type = ?, quantity = ? WHERE id = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, entity.getBloodType());
            ps.setBigDecimal(2, java.math.BigDecimal.valueOf(entity.getQuantity()));
            ps.setInt(3, id);

            int rows = ps.executeUpdate();
            ps.close();

            if (rows == 0) {
                throw new RuntimeException("Nenhum registro de sangue encontrado para atualizar com ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar registro de sangue com ID: " + id, e);
        }
    }

    @Override
    public BloodModel findByid(int id) {
        final String sql = "SELECT * FROM blood WHERE id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                BloodModel blood = mapResultSetToBloodModel(resultSet);
                resultSet.close();
                preparedStatement.close();
                return blood;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<BloodModel> findByDonationLocationId(int donationLocationId) {
        final List<BloodModel> bloodList = new ArrayList<>();
        final String sql = "SELECT * FROM blood " +
                "WHERE donation_location_id = ? " +
                "AND used = FALSE ";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, donationLocationId);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                BloodModel blood = mapResultSetToBloodModel(resultSet);
                bloodList.add(blood);
            }

            resultSet.close();
            preparedStatement.close();
            return bloodList;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateBloods(UpdateBloodsDto data) {
        try {
            connection.setAutoCommit(false);

            for (int bloodId : data.getBloodIds()) {
                // 1. Buscar informações do sangue
                BloodModel blood = getBloodInfo(bloodId);

                // 2. Atualizar o sangue como usado
                updateBloodAsUsed(bloodId, data.getReason());

                // 3. Atualizar o estoque
                updateBloodStock(blood.getBloodType(), blood.getQuantity(), blood.getDonationLocationId());
            }

            connection.commit();
        } catch (SQLException e) {
            try {
                connection.rollback();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            throw new RuntimeException(e);
        }
    }

    private BloodModel getBloodInfo(int bloodId) throws SQLException {
        String sql = "SELECT blood_type, quantity, donation_location_id FROM blood WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, bloodId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                BloodModel blood = new BloodModel();
                blood.setBloodType(rs.getString("blood_type"));
                blood.setQuantity(rs.getBigDecimal("quantity").doubleValue());
                blood.setDonationLocationId(rs.getInt("donation_location_id"));
                return blood;
            }
            throw new SQLException("Sangue não encontrado: " + bloodId);
        }
    }

    private void updateBloodAsUsed(int bloodId, String reason) throws SQLException {
        String sql = "UPDATE blood SET used = TRUE, reason = ? WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, reason);
            stmt.setInt(2, bloodId);
            stmt.executeUpdate();
        }
    }

    private void updateBloodStock(String bloodType, double quantity, int locationId) throws SQLException {
        String sql = "UPDATE blood_stock SET current_stock = current_stock - ? " +
                "WHERE blood_type = ? AND donation_location_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setDouble(1, quantity);
            stmt.setString(2, bloodType);
            stmt.setInt(3, locationId);
            stmt.executeUpdate();
        }
    }

    private BloodModel mapResultSetToBloodModel(ResultSet rs) throws SQLException {
        BloodModel blood = new BloodModel();

        blood.setId(rs.getInt("id"));
        blood.setBloodType(rs.getString("blood_type"));
        blood.setQuantity(rs.getBigDecimal("quantity").doubleValue());
        blood.setExpirationDate(rs.getDate("expiration_date").toLocalDate());
        blood.setReason(rs.getString("reason"));
        blood.setUsed(rs.getBoolean("used"));
        blood.setDonorId(rs.getInt("donor_id"));
        blood.setDonationLocationId(rs.getInt("donation_location_id"));

        return blood;
    }
}
