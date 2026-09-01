package com.smartcity.service;

import com.smartcity.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload folder", e);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            extension = originalFilename.substring(i);
        } else {
            extension = ".jpg";
        }

        // Validate allowed extensions
        String lowerExt = extension.toLowerCase();
        if (!lowerExt.equals(".jpg") && !lowerExt.equals(".jpeg") && !lowerExt.equals(".png") && !lowerExt.equals(".webp")) {
            throw new BadRequestException("Only JPG, JPEG, PNG, and WEBP images are allowed");
        }

        String uniqueFileName = UUID.randomUUID().toString() + extension;

        try {
            Path targetLocation = this.rootLocation.resolve(uniqueFileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/api/uploads/" + uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + uniqueFileName, ex);
        }
    }
}
