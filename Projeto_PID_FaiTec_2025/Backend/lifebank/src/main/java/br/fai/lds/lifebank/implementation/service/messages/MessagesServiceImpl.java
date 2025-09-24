package br.fai.lds.lifebank.implementation.service.messages;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.domain.MessagesModel;
import br.fai.lds.lifebank.port.dao.messages.MessagesDao;
import br.fai.lds.lifebank.port.service.messages.MessagesService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    @Override
    public List<MessagesModel> getConversation(int userId1, int userId2) {
        if (userId1 <= 0 || userId2 <= 0) {
            return new ArrayList<>();
        }

        List<MessagesModel> messages = messagesDao.getConversation(userId1, userId2);

        return messages;
    }
}
