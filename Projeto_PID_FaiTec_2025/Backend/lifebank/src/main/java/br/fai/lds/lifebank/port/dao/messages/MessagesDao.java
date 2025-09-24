package br.fai.lds.lifebank.port.dao.messages;

import br.fai.lds.lifebank.domain.MessagesModel;
import br.fai.lds.lifebank.port.dao.crud.CreateDao;

public interface MessagesDao extends CreateDao<MessagesModel>, ReadConversationDao {
}
