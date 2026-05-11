package com.backrooms.lurking.repository;

import com.backrooms.lurking.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {}
