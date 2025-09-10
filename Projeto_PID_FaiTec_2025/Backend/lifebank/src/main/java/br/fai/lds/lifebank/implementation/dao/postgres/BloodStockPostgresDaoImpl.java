package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.BloodStockModel;
import br.fai.lds.lifebank.domain.dto.UpdateLimitsBloodStockDto;
import br.fai.lds.lifebank.port.dao.bloodstock.BloodStockDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class BloodStockPostgresDaoImpl implements BloodStockDao {

    private static final Logger logger = Logger.getLogger(BloodStockPostgresDaoImpl.class.getName());

    private final Connection connection;

    public BloodStockPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public List<BloodStockModel> findByDonationLocationId(int donationLocationId) {
        final List<BloodStockModel> bloodStockList = new ArrayList<>();
        final String sql = "SELECT * FROM blood_stock WHERE donation_location_id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, donationLocationId);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                BloodStockModel bloodStock = mapResultSetToBloodStockModel(resultSet);
                bloodStockList.add(bloodStock);
            }

            resultSet.close();
            preparedStatement.close();
            return bloodStockList;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private BloodStockModel mapResultSetToBloodStockModel(ResultSet rs) throws SQLException {
        BloodStockModel bloodStock = new BloodStockModel();

        bloodStock.setId(rs.getInt("id"));
        bloodStock.setBloodType(rs.getString("blood_type"));
        bloodStock.setMinimumStock(rs.getBigDecimal("minimum_stock").doubleValue());
        bloodStock.setMaximumStock(rs.getBigDecimal("maximum_stock").doubleValue());
        bloodStock.setCurrentStock(rs.getBigDecimal("current_stock").doubleValue());
        bloodStock.setDonationLocationId(rs.getInt("donation_location_id"));

        return bloodStock;
    }

    @Override
    public void updateLimits(UpdateLimitsBloodStockDto data) {
        final String sql = "UPDATE blood_stock SET minimum_stock = ?, maximum_stock = ? WHERE id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setDouble(1, data.getMinimumStock());
            preparedStatement.setDouble(2, data.getMaximumStock());
            preparedStatement.setInt(3, data.getId());
            preparedStatement.executeUpdate();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
