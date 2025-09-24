package br.fai.lds.lifebank.implementation.service.messages;

import br.fai.lds.lifebank.domain.MessagesModel;
import br.fai.lds.lifebank.port.dao.messages.MessagesDao;
import br.fai.lds.lifebank.port.service.messages.MessagesService;
import org.springframework.stereotype.Service;

@Service
public class MessagesServiceImpl implements MessagesService {

    private final MessagesDao messagesDao;

    public MessagesServiceImpl(MessagesDao messagesDao) {
        this.messagesDao = messagesDao;
    }

    @Override
    public int create(MessagesModel entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }

        if (entity.getReceiverId() <= 0 || entity.getSenderId() <= 0) {
            return invalidResponse;
        }

        final int id = messagesDao.create(entity);
        return id;
    }
}
