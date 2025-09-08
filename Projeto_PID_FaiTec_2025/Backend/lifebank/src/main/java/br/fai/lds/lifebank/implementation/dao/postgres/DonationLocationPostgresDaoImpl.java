package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.DonationLocationModel;
import br.fai.lds.lifebank.domain.MunicipalityModel;
import br.fai.lds.lifebank.port.dao.donationlocation.DonationLocationDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DonationLocationPostgresDaoImpl implements DonationLocationDao {

    private static final Logger logger = Logger.getLogger(DonationLocationPostgresDaoImpl.class.getName());

    private final Connection connection;

    public DonationLocationPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(DonationLocationModel entity) {
        logger.log(Level.INFO, "Inserindo local de doação no banco de dados.");

        try {
            connection.setAutoCommit(false);
            
            String sql = "INSERT INTO donation_location(name, street, number, neighborhood, postal_code, municipality_id) ";
            sql += "VALUES (?, ?, ?, ?, ?, ?)";
            
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getStreet());
            preparedStatement.setInt(3, entity.getNumber());
            preparedStatement.setString(4, entity.getNeighborhood());
            preparedStatement.setString(5, entity.getPostalCode());
            preparedStatement.setInt(6, entity.getMunicipalityId());

            preparedStatement.execute();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();
            int locationId = 0;
            if (resultSet.next()) {
                locationId = resultSet.getInt(1);
            }
            
            // Criar blood_stock para todos os tipos de sangue
            createBloodStockForAllTypes(locationId);
            
            connection.commit();
            logger.log(Level.INFO, "Local de doação adicionado com sucesso. ID: " + locationId);

            resultSet.close();
            preparedStatement.close();

            return locationId;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Problema ao adicionar o local de doação no banco de dados.");
            try {
                connection.rollback();
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(int id) {
        logger.log(Level.INFO, "Preparando para remover o local de doação.");
        
        try {
            String deleteSql = "DELETE FROM donation_location WHERE id = ?";
            PreparedStatement deleteStatement = connection.prepareStatement(deleteSql);
            deleteStatement.setInt(1, id);
            deleteStatement.execute();
            deleteStatement.close();
            
            logger.log(Level.INFO, "Local de doação removido com sucesso.");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public DonationLocationModel findByid(int id) {
        final String sql = "SELECT dl.*, m.name as m_name, m.state as m_state " +
                          "FROM donation_location dl " +
                          "LEFT JOIN municipality m ON dl.municipality_id = m.id " +
                          "WHERE dl.id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                DonationLocationModel donationLocation = mapResultSetToDonationLocationModel(resultSet);

                resultSet.close();
                preparedStatement.close();
                return donationLocation;
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<DonationLocationModel> findAll() {
        final List<DonationLocationModel> donationLocationArray = new ArrayList<>();
        final String sql = "SELECT dl.*, m.name as m_name, m.state as m_state " +
                          "FROM donation_location dl " +
                          "LEFT JOIN municipality m ON dl.municipality_id = m.id";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                DonationLocationModel donationLocation = mapResultSetToDonationLocationModel(resultSet);
                donationLocationArray.add(donationLocation);
            }
            resultSet.close();
            preparedStatement.close();
            return donationLocationArray;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, DonationLocationModel entity) {
        String sql = "UPDATE donation_location SET "
                + "name = ?, street = ?, number = ?, neighborhood = ?, "
                + "postal_code = ?, municipality_id = ? "
                + "WHERE id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getStreet());
            preparedStatement.setInt(3, entity.getNumber());
            preparedStatement.setString(4, entity.getNeighborhood());
            preparedStatement.setString(5, entity.getPostalCode());
            preparedStatement.setInt(6, entity.getMunicipalityId());
            preparedStatement.setInt(7, id);

            preparedStatement.executeUpdate();
            preparedStatement.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void createBloodStockForAllTypes(int locationId) throws SQLException {
        String[] bloodTypes = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        String sql = "INSERT INTO blood_stock(blood_type, minimum_stock, maximum_stock, current_stock, donation_location_id) " +
                    "VALUES (?, 0, 1000, 0, ?)";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            for (String bloodType : bloodTypes) {
                stmt.setString(1, bloodType);
                stmt.setInt(2, locationId);
                stmt.executeUpdate();
            }
        }
    }
    
    private DonationLocationModel mapResultSetToDonationLocationModel(ResultSet rs) throws SQLException {
        DonationLocationModel donationLocation = new DonationLocationModel();
        
        donationLocation.setId(rs.getInt("id"));
        donationLocation.setName(rs.getString("name"));
        donationLocation.setStreet(rs.getString("street"));
        donationLocation.setNumber(rs.getInt("number"));
        donationLocation.setNeighborhood(rs.getString("neighborhood"));
        donationLocation.setPostalCode(rs.getString("postal_code"));
        donationLocation.setMunicipalityId(rs.getInt("municipality_id"));
        
        // Mapear Municipality completo se existir
        if (rs.getObject("m_name") != null) {
            MunicipalityModel municipality = new MunicipalityModel();
            municipality.setId(rs.getInt("municipality_id"));
            municipality.setName(rs.getString("m_name"));
            municipality.setState(rs.getString("m_state"));
            donationLocation.setMunicipality(municipality);
        }
        
        return donationLocation;
    }
}
