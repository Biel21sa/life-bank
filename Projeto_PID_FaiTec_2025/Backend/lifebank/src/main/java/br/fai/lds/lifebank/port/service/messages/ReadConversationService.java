package br.fai.lds.lifebank.port.service.messages;

import br.fai.lds.lifebank.domain.MessagesModel;

import java.util.List;

public interface ReadConversationService {
    public List<MessagesModel> getConversation(final int userId1, final int userId2);
}
