package com.backrooms.lurking.controller;

import com.backrooms.lurking.model.UserProfile;
import com.backrooms.lurking.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileRepository profileRepository;

    /** Obtener perfil público por userId */
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(
            profileRepository.findById(userId)
                .orElse(UserProfile.builder().userId(userId).avatarUrl(null).build())
        );
    }

    /** Actualizar avatar del usuario autenticado */
    @PutMapping("/me")
    public ResponseEntity<UserProfile> updateAvatar(
            @RequestBody Map<String, String> body,
            @RequestAttribute(name = "userId", required = false) String jwtUserId,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String headerUserId) {

        String resolvedId = (jwtUserId != null && !jwtUserId.isBlank()) ? jwtUserId : headerUserId;
        if (resolvedId.isBlank()) return ResponseEntity.status(401).build();

        String avatarUrl = body.get("avatarUrl");
        UserProfile profile = profileRepository.findById(resolvedId)
                .orElse(UserProfile.builder().userId(resolvedId).build());
        profile.setAvatarUrl(avatarUrl);
        return ResponseEntity.ok(profileRepository.save(profile));
    }
}
