package com.smartcity.service;

import com.smartcity.entity.Notification;
import com.smartcity.entity.User;
import com.smartcity.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public Notification createNotification(User recipient, String title, String message, String type, Long complaintId, String complaintNumber) {
        if (recipient == null) return null;
        
        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .type(type)
                .relatedComplaintId(complaintId)
                .relatedComplaintNumber(complaintNumber)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getRecentNotifications(Long userId) {
        return notificationRepository.findTop15ByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getAllNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getRecipient().getId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }
}
