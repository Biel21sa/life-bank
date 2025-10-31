package br.fai.lds.lifebank.port.service.messages;

import br.fai.lds.lifebank.domain.MessagesModel;
import br.fai.lds.lifebank.port.service.crud.CreateService;

public interface MessagesService extends CreateService<MessagesModel>, ReadConversationService {
}
