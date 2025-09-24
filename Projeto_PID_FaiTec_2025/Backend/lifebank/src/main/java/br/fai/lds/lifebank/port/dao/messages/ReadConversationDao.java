package br.fai.lds.lifebank.port.dao.messages;

import br.fai.lds.lifebank.domain.MessagesModel;

import java.util.List;

public interface ReadConversationDao {
    public List<MessagesModel> getConversation(final int userId1, final int userId2);
}
