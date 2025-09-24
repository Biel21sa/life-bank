package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.MessagesModel;
import br.fai.lds.lifebank.port.dao.messages.MessagesDao;

import java.sql.Connection;
import java.util.logging.Logger;

public class MessagesPostgresDaoImpl implements MessagesDao {

    private static final Logger logger = Logger.getLogger(MessagesPostgresDaoImpl.class.getName());

    private final Connection connection;

    public MessagesPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(MessagesModel entity) {
        return 0;
    }
}
