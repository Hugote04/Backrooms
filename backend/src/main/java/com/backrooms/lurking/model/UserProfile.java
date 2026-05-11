package com.backrooms.lurking.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "avatar_url", length = 1000)
    private String avatarUrl;
}
