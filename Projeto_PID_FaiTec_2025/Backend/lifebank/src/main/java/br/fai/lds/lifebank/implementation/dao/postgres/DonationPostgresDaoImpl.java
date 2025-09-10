package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.DonationLocationModel;
import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.domain.dto.DonationByBloodTypeDto;
import br.fai.lds.lifebank.domain.dto.DonationEvolutionByBloodTypeDto;
import br.fai.lds.lifebank.domain.dto.DonationEvolutionDto;
import br.fai.lds.lifebank.port.dao.donation.DonationDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

        try {
            connection.setAutoCommit(false);

            // 1. Criar o registro de sangue
            int bloodId = insertBlood(entity.getBloodType(), entity.getQuantity(), entity.getExpirationDate(), entity.getDonorId(), entity.getDonationLocationId());

            // 2. Atualizar blood_stock
            updateBloodStock(entity.getBloodType(), entity.getQuantity(), entity.getDonationLocationId());

            // 3. Criar a doação
            String sql = "INSERT INTO donation(quantity, collection_date, expiration_date, donor_id, donation_location_id, blood_id) ";
            sql += "VALUES (?, ?, ?, ?, ?, ?)";

            PreparedStatement preparedStatement = connection.prepareStatement(sql,
                    PreparedStatement.RETURN_GENERATED_KEYS);

            preparedStatement.setBigDecimal(1, java.math.BigDecimal.valueOf(entity.getQuantity()));
            preparedStatement.setDate(2, java.sql.Date.valueOf(entity.getCollectionDate()));
            preparedStatement.setDate(3, java.sql.Date.valueOf(entity.getExpirationDate()));
            preparedStatement.setInt(4, entity.getDonorId());
            preparedStatement.setInt(5, entity.getDonationLocationId());
            preparedStatement.setInt(6, bloodId);

            preparedStatement.execute();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();
            int donationId = 0;
            if (resultSet.next()) {
                donationId = resultSet.getInt(1);
            }

            // 4. Criar o benefício
            insertBenefit(entity.getDonorId(), donationId);

            // 5. Atualizar data da última doação do doador
            updateDonorLastDonationDate(entity.getDonorId(), entity.getCollectionDate());

            connection.commit();
            logger.log(Level.INFO, "Doação adicionada com sucesso. ID: " + donationId);

            resultSet.close();
            preparedStatement.close();

            return donationId;
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Problema ao adicionar a doação no banco de dados.");
            try {
                connection.rollback();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
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
        final String sql = "SELECT d.*, b.blood_type, " +
                "dr.id as donor_id, dr.blood_type as donor_blood_type, dr.gender as donor_gender, dr.last_donation_date, " +
                "u.name as donor_name, u.email as donor_email, u.cpf as donor_cpf, u.phone as donor_phone, " +
                "dl.id as location_id, dl.name as location_name, dl.street as location_street, " +
                "dl.number as location_number, dl.neighborhood as location_neighborhood, dl.postal_code as location_postal_code " +
                "FROM donation d " +
                "JOIN blood b ON d.blood_id = b.id " +
                "JOIN donor dr ON d.donor_id = dr.id " +
                "JOIN user_model u ON dr.user_id = u.id " +
                "JOIN donation_location dl ON d.donation_location_id = dl.id " +
                "WHERE d.id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                DonationModel donation = mapResultSetToDonationModelComplete(resultSet);
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
        final String sql = "SELECT d.*, b.blood_type FROM donation d " +
                "JOIN blood b ON d.blood_id = b.id";

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
                + "quantity = ?, collection_date = ?, expiration_date = ?, "
                + "donor_id = ?, donation_location_id = ? "
                + "WHERE id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setBigDecimal(1, java.math.BigDecimal.valueOf(entity.getQuantity()));
            preparedStatement.setDate(2, java.sql.Date.valueOf(entity.getCollectionDate()));
            preparedStatement.setDate(3, java.sql.Date.valueOf(entity.getExpirationDate()));
            preparedStatement.setInt(4, entity.getDonorId());
            preparedStatement.setInt(5, entity.getDonationLocationId());
            preparedStatement.setInt(6, id);

            preparedStatement.executeUpdate();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DonationModel> findByDonorCpf(String cpf) {
        final List<DonationModel> donations = new ArrayList<>();
        final String sql = "SELECT d.*, b.blood_type FROM donation d " +
                "JOIN blood b ON d.blood_id = b.id " +
                "JOIN donor dr ON d.donor_id = dr.id " +
                "JOIN user_model u ON dr.user_id = u.id " +
                "WHERE u.cpf = ?";

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

    @Override
    public List<DonationModel> findByDonationLocationId(int donationLocationId) {
        final List<DonationModel> donations = new ArrayList<>();
        final String sql = "SELECT d.*, b.blood_type, u.name as donor_name, u.cpf as donor_cpf " +
                "FROM donation d " +
                "JOIN blood b ON d.blood_id = b.id " +
                "JOIN donor dr ON d.donor_id = dr.id " +
                "JOIN user_model u ON dr.user_id = u.id " +
                "WHERE d.donation_location_id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, donationLocationId);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                DonationModel donation = mapResultSetToDonationModelWithDonor(resultSet);
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
    public List<DonationModel> findByUserId(int userId) {
        final List<DonationModel> donations = new ArrayList<>();
        final String sql =
                "SELECT d.*, b.blood_type, u.name AS donor_name, u.cpf AS donor_cpf " +
                        "FROM donation d " +
                        "JOIN blood b ON d.blood_id = b.id " +
                        "JOIN donor dr ON d.donor_id = dr.id " +
                        "JOIN user_model u ON dr.user_id = u.id " +
                        "WHERE u.id = ?";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, userId);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                DonationModel donation = mapResultSetToDonationModelWithDonor(resultSet);
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
    public List<DonationEvolutionDto> getDonationEvolution(final int donationLocationId, final int year) {
        final List<DonationEvolutionDto> donations = new ArrayList<>();
        final String sql = "SELECT TO_CHAR(collection_date, 'Month') as month_name, " +
                "SUM(quantity) as total_quantity " +
                "FROM donation " +
                "WHERE EXTRACT(YEAR FROM collection_date) = ? " +
                "AND donation_location_id = ? " +
                "GROUP BY EXTRACT(MONTH FROM collection_date), TO_CHAR(collection_date, 'Month') " +
                "ORDER BY EXTRACT(MONTH FROM collection_date)";

        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setInt(1, year);
            preparedStatement.setInt(2, donationLocationId);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    DonationEvolutionDto evolution = new DonationEvolutionDto();
                    evolution.setMonth(resultSet.getString("month_name").trim());
                    evolution.setTotalLiters(resultSet.getDouble("total_quantity"));
                    donations.add(evolution);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return donations;
    }

    @Override
    public List<DonationByBloodTypeDto> getDonationByBloodType(int donationLocationId, int year) {
        final List<DonationByBloodTypeDto> donations = new ArrayList<>();
        final String sql = "SELECT b.blood_type, SUM(d.quantity) as total_quantity " +
                "FROM donation d " +
                "JOIN blood b ON d.blood_id = b.id " +
                "WHERE d.donation_location_id = ? AND EXTRACT(YEAR FROM d.collection_date) = ? " +
                "GROUP BY b.blood_type " +
                "ORDER BY b.blood_type";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, donationLocationId);
            preparedStatement.setInt(2, year);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                DonationByBloodTypeDto donation = new DonationByBloodTypeDto();
                donation.setBloodType(resultSet.getString("blood_type"));
                donation.setTotalLiters(resultSet.getDouble("total_quantity"));
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
    public List<DonationEvolutionByBloodTypeDto> getDonationEvolutionByBloodType(final int donationLocationId, final int year) {
        final Map<String, DonationEvolutionByBloodTypeDto> monthMap = new LinkedHashMap<>();
        final String sql = "SELECT TO_CHAR(d.collection_date, 'Month') AS month_name, " +
                "b.blood_type, " +
                "SUM(d.quantity) AS total_quantity " +
                "FROM donation d " +
                "JOIN blood b ON d.blood_id = b.id " +
                "WHERE EXTRACT(YEAR FROM d.collection_date) = ? " +
                "AND d.donation_location_id = ? " +
                "GROUP BY EXTRACT(MONTH FROM d.collection_date), TO_CHAR(d.collection_date, 'Month'), b.blood_type " +
                "ORDER BY EXTRACT(MONTH FROM d.collection_date)";

        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setInt(1, year);
            preparedStatement.setInt(2, donationLocationId);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    String month = resultSet.getString("month_name").trim();
                    String bloodType = resultSet.getString("blood_type");
                    double totalLiters = resultSet.getDouble("total_quantity");

                    // Se o mês ainda não existe, cria
                    monthMap.computeIfAbsent(month, m -> {
                        DonationEvolutionByBloodTypeDto dto = new DonationEvolutionByBloodTypeDto();
                        dto.setMonth(m);
                        dto.setData(new ArrayList<>());
                        return dto;
                    });

                    // Adiciona os dados de tipo sanguíneo
                    DonationByBloodTypeDto bloodDto = new DonationByBloodTypeDto();
                    bloodDto.setBloodType(bloodType);
                    bloodDto.setTotalLiters(totalLiters);

                    monthMap.get(month).getData().add(bloodDto);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return new ArrayList<>(monthMap.values());
    }


    private int insertBlood(String bloodType, Double quantity, LocalDate expirationDate, int donorId, int donationLocationId) throws SQLException {
        String sql = "INSERT INTO blood(blood_type, quantity, expiration_date, used, donor_id, donation_location_id) VALUES (?, ?, ?, FALSE, ?, ?) RETURNING id";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, bloodType);
            stmt.setDouble(2, quantity);
            stmt.setDate(3, java.sql.Date.valueOf(expirationDate));
            stmt.setInt(4, donorId);
            stmt.setInt(5, donationLocationId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
            throw new SQLException("Falha ao criar registro de sangue");
        }
    }

    private void updateBloodStock(String bloodType, Double quantity, int locationId) throws SQLException {
        String sql = "UPDATE blood_stock SET current_stock = current_stock + ? " +
                "WHERE blood_type = ? AND donation_location_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setDouble(1, quantity);
            stmt.setString(2, bloodType);
            stmt.setInt(3, locationId);
            stmt.executeUpdate();
        }
    }

    private void insertBenefit(int donorId, int donationId) throws SQLException {
        String sql = "INSERT INTO benefit(amount, expiration_date, description, used, donation_id, donor_id) " +
                "VALUES (?, ?, ?, FALSE, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setBigDecimal(1, java.math.BigDecimal.valueOf(50.00)); // Valor padrão do benefício
            stmt.setDate(2, java.sql.Date.valueOf(LocalDate.now().plusMonths(6))); // Expira em 6 meses
            stmt.setString(3, "Benefício por doação de sangue");
            stmt.setInt(4, donationId);
            stmt.setInt(5, donorId);
            stmt.executeUpdate();
        }
    }

    private void updateDonorLastDonationDate(int donorId, LocalDate donationDate) throws SQLException {
        String sql = "UPDATE donor SET last_donation_date = ? WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setDate(1, java.sql.Date.valueOf(donationDate));
            stmt.setInt(2, donorId);
            stmt.executeUpdate();
        }
    }

    private DonationModel mapResultSetToDonationModel(ResultSet rs) throws SQLException {
        DonationModel donation = new DonationModel();

        donation.setId(rs.getInt("id"));
        donation.setBloodType(rs.getString("blood_type"));
        donation.setQuantity(rs.getDouble("quantity"));
        donation.setCollectionDate(rs.getDate("collection_date").toLocalDate());
        donation.setExpirationDate(rs.getDate("expiration_date").toLocalDate());
        donation.setDonorId(rs.getInt("donor_id"));
        donation.setDonationLocationId(rs.getInt("donation_location_id"));

        return donation;
    }

    private DonationModel mapResultSetToDonationModelWithDonor(ResultSet rs) throws SQLException {
        DonationModel donation = new DonationModel();

        donation.setId(rs.getInt("id"));
        donation.setBloodType(rs.getString("blood_type"));
        donation.setQuantity(rs.getDouble("quantity"));
        donation.setCollectionDate(rs.getDate("collection_date").toLocalDate());
        donation.setExpirationDate(rs.getDate("expiration_date").toLocalDate());
        donation.setDonorId(rs.getInt("donor_id"));
        donation.setDonationLocationId(rs.getInt("donation_location_id"));
        donation.setDonorName(rs.getString("donor_name"));
        donation.setDonorCpf(rs.getString("donor_cpf"));

        return donation;
    }

    private DonationModel mapResultSetToDonationModelComplete(ResultSet rs) throws SQLException {
        DonationModel donation = new DonationModel();

        donation.setId(rs.getInt("id"));
        donation.setBloodType(rs.getString("blood_type"));
        donation.setQuantity(rs.getDouble("quantity"));
        donation.setCollectionDate(rs.getDate("collection_date").toLocalDate());
        donation.setExpirationDate(rs.getDate("expiration_date").toLocalDate());
        donation.setDonorId(rs.getInt("donor_id"));
        donation.setDonationLocationId(rs.getInt("donation_location_id"));

        // Criar objeto DonorModel completo
        DonorModel donor = new DonorModel();
        donor.setId(rs.getInt("donor_id"));
        donor.setBloodType(rs.getString("donor_blood_type"));
        donor.setGender(rs.getString("donor_gender"));
        if (rs.getDate("last_donation_date") != null) {
            donor.setLastDonationDate(rs.getDate("last_donation_date").toLocalDate());
        }

        UserModel user = new UserModel();
        user.setName(rs.getString("donor_name"));
        user.setEmail(rs.getString("donor_email"));
        user.setCpf(rs.getString("donor_cpf"));
        user.setPhone(rs.getString("donor_phone"));
        donor.setUser(user);
        donation.setDonor(donor);

        // Criar objeto DonationLocationModel completo
        DonationLocationModel location = new DonationLocationModel();
        location.setId(rs.getInt("location_id"));
        location.setName(rs.getString("location_name"));
        location.setStreet(rs.getString("location_street"));
        location.setNumber(rs.getInt("location_number"));
        location.setNeighborhood(rs.getString("location_neighborhood"));
        location.setPostalCode(rs.getString("location_postal_code"));
        donation.setDonationLocation(location);

        return donation;
    }
}
