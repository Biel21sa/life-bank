package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.MessagesModel;
import br.fai.lds.lifebank.port.dao.messages.MessagesDao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class MessagesPostgresDaoImpl implements MessagesDao {

    private static final Logger logger = Logger.getLogger(MessagesPostgresDaoImpl.class.getName());

    private final Connection connection;

    public MessagesPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(MessagesModel entity) {
        final String sql = "INSERT INTO messages (sender_id, receiver_id, message, sent_at) " +
                "VALUES (?, ?, ?, ?) RETURNING id";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, entity.getSenderId());
            ps.setInt(2, entity.getReceiverId());
            ps.setString(3, entity.getMessage());

            if (entity.getSentAt() != null) {
                ps.setTimestamp(4, Timestamp.valueOf(entity.getSentAt()));
            } else {
                ps.setNull(4, java.sql.Types.TIMESTAMP);
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
            throw new RuntimeException("Erro ao criar mensagem", e);
        }
    }

    @Override
    public List<MessagesModel> getConversation(int userId1, int userId2) {
        final String sql = "SELECT * FROM messages " +
                "WHERE (sender_id = ? AND receiver_id = ?) " +
                "   OR (sender_id = ? AND receiver_id = ?) " +
                "ORDER BY sent_at ASC";

        List<MessagesModel> messages = new ArrayList<>();

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, userId1);
            ps.setInt(2, userId2);
            ps.setInt(3, userId2);
            ps.setInt(4, userId1);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                MessagesModel message = new MessagesModel();
                message.setId(rs.getInt("id"));
                message.setSenderId(rs.getInt("sender_id"));
                message.setReceiverId(rs.getInt("receiver_id"));
                message.setMessage(rs.getString("message"));
                message.setSentAt(rs.getTimestamp("sent_at").toLocalDateTime());

                messages.add(message);
            }

            rs.close();
            ps.close();
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar mensagens", e);
        }

        return messages;
    }
}
