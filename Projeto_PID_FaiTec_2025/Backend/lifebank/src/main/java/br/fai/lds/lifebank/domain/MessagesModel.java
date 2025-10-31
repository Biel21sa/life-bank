package br.fai.lds.lifebank.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MessagesModel {

    private int id;
    private int senderId;
    private int receiverId;
    private String message;
    private LocalDateTime sentAt;

    public MessagesModel() {
    }

    public MessagesModel(int id, int senderId, int receiverId, String message, LocalDateTime sentAt) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.sentAt = sentAt;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(int receiverId) {
        this.receiverId = receiverId;
    }

    public int getSenderId() {
        return senderId;
    }

    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
