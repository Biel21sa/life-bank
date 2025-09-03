package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.DonationLocationModel;
import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.dao.donationlocation.DonationLocationDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class DonationLocationPostgresDaoImpl implements DonationLocationDao {

    private static final Logger logger = Logger.getLogger(DonationLocationPostgresDaoImpl.class.getName());

    private final Connection connection;

    public DonationLocationPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(DonationLocationModel entity) {
        return 0;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public DonationLocationModel findByid(int id) {
        return null;
    }

    @Override
    public List<DonationLocationModel> findAll() {
        final List<DonationLocationModel> donationLocationArray = new ArrayList<>();

        final String sql = "SELECT * FROM donation_location; ";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                int entityId = resultSet.getInt("id");
                String name = resultSet.getString("name");
                String street = resultSet.getString("street");
                int number = resultSet.getInt("number");
                String neighborhood = resultSet.getString("neighborhood");
                String postalCode = resultSet.getString("postal_code");
                int municipalityId = resultSet.getInt("municipality_id");

                DonationLocationModel donationLocation = new DonationLocationModel();
                donationLocation.setId(entityId);
                donationLocation.setName(name);
                donationLocation.setStreet(street);
                donationLocation.setNumber(number);
                donationLocation.setNeighborhood(neighborhood);
                donationLocation.setPostalCode(postalCode);
                donationLocation.setMunicipality_id(municipalityId);

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

    }
}
