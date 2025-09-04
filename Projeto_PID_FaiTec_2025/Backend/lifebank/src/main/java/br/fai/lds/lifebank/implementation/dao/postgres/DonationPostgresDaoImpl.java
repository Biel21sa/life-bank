package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;
import br.fai.lds.lifebank.port.dao.donation.DonationDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DonationPostgresDaoImpl implements DonationDao {

    private static final Logger logger = Logger.getLogger(DonationPostgresDaoImpl.class.getName());

    private final Connection connection;

    public DonationPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(DonationModel entity) {
        logger.log(Level.INFO, "Inserindo doação no banco de dados.");

        String sql = "INSERT INTO donation(blood_type, quantity, collection_date, validity_date, donor_cpf, location_id) ";
        sql += "VALUES (?, ?, ?, ?, ?, ?)";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            preparedStatement.setString(1, entity.getBloodType().name());
            preparedStatement.setInt(2, entity.getQuantity());
            preparedStatement.setDate(3, java.sql.Date.valueOf(entity.getCollectionDate()));
            preparedStatement.setDate(4, java.sql.Date.valueOf(entity.getValidityDate()));
            preparedStatement.setString(5, entity.getDonorCpf());
            preparedStatement.setInt(6, entity.getLocationId());

            preparedStatement.execute();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();
            int donationId = 0;
            if (resultSet.next()) {
                donationId = resultSet.getInt(1);
            }

            logger.log(Level.INFO, "Doação adicionada com sucesso. ID: " + donationId);

            resultSet.close();
            preparedStatement.close();

            return donationId;
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Problema ao adicionar a doação no banco de dados.");
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(int id) {
        logger.log(Level.INFO, "Preparando para remover a doação.");
        final String sql = "DELETE FROM donation WHERE id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            preparedStatement.execute();
            preparedStatement.close();
            logger.log(Level.INFO, "Doação removida com sucesso.");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public DonationModel findByid(int id) {
        final String sql = "SELECT * FROM donation WHERE id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                DonationModel donation = mapResultSetToDonationModel(resultSet);

                preparedStatement.close();
                resultSet.close();

                return donation;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<DonationModel> findAll() {
        final List<DonationModel> donations = new ArrayList<>();
        final String sql = "SELECT * FROM donation";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                DonationModel donation = mapResultSetToDonationModel(resultSet);
                donations.add(donation);
            }

            resultSet.close();
            preparedStatement.close();
            return donations;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, DonationModel entity) {
        String sql = "UPDATE donation SET "
                + "blood_type = ?, quantity = ?, collection_date = ?, validity_date = ?, "
                + "donor_cpf = ?, location_id = ? "
                + "WHERE id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, entity.getBloodType().name());
            preparedStatement.setInt(2, entity.getQuantity());
            preparedStatement.setDate(3, java.sql.Date.valueOf(entity.getCollectionDate()));
            preparedStatement.setDate(4, java.sql.Date.valueOf(entity.getValidityDate()));
            preparedStatement.setString(5, entity.getDonorCpf());
            preparedStatement.setInt(6, entity.getLocationId());
            preparedStatement.setInt(7, id);

            preparedStatement.executeUpdate();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DonationModel> findByDonorCpf(String cpf) {
        final List<DonationModel> donations = new ArrayList<>();
        final String sql = "SELECT * FROM donation WHERE donor_cpf = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, cpf);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                DonationModel donation = mapResultSetToDonationModel(resultSet);
                donations.add(donation);
            }

            resultSet.close();
            preparedStatement.close();
            return donations;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private DonationModel mapResultSetToDonationModel(ResultSet rs) throws SQLException {
        DonationModel donation = new DonationModel();

        donation.setId(rs.getInt("id"));
        donation.setBloodType(BloodType.valueOf(rs.getString("blood_type")));
        donation.setQuantity(rs.getInt("quantity"));
        donation.setCollectionDate(rs.getDate("collection_date").toLocalDate());
        donation.setValidityDate(rs.getDate("validity_date").toLocalDate());
        donation.setDonorCpf(rs.getString("donor_cpf"));
        donation.setLocationId(rs.getInt("location_id"));

        return donation;
    }
}
