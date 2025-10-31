package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.MessagesModel;
import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.service.messages.MessagesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessagesRestController {

    private final MessagesService messagesService;

    public MessagesRestController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @PostMapping
    public ResponseEntity<UserModel> create(@RequestBody final MessagesModel data) {
        final int id = messagesService.create(data);

        final URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping("/{userId1}/{userId2}")
    public ResponseEntity<List<MessagesModel>> getConversation(@PathVariable final int userId1, @PathVariable final int userId2) {

        List<MessagesModel> messages = messagesService.getConversation(userId1, userId2);
        return messages == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(messages);
    }
}
