package com.backrooms.lurking.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/download")
public class DownloadController {

    @Value("${app.game.file-path:}")
    private String localFilePath;

    @Value("${app.game.download-url:https://drive.usercontent.google.com/download?id=1M8HYMarU7bxuWN2x9kFwY0iSO3sbb_wt&export=download&confirm=t}")
    private String remoteDownloadUrl;

    @GetMapping("/game")
    public ResponseEntity<Resource> downloadGame(HttpServletResponse response) throws IOException {

        // Si existe el archivo local lo sirve directamente (perfil dev)
        if (localFilePath != null && !localFilePath.isBlank()) {
            File file = new File(localFilePath);
            if (file.exists() && file.isFile()) {
                Resource resource = new FileSystemResource(file);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"LurkingInTheShadows-Windows.zip\"")
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(file.length()))
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            }
        }

        // Fallback: redirect a Google Drive (perfil prod)
        response.sendRedirect(remoteDownloadUrl);
        return null;
    }
}
