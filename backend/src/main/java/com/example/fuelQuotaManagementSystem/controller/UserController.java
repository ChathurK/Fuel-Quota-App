package com.example.fuelQuotaManagementSystem.controller;

import com.example.fuelQuotaManagementSystem.dto.*;
import com.example.fuelQuotaManagementSystem.entity.User;
import com.example.fuelQuotaManagementSystem.entity.Role;
import com.example.fuelQuotaManagementSystem.repository.UserRepository;
import com.example.fuelQuotaManagementSystem.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get current user profile
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('STATION_OWNER') or hasRole('VEHICLE_OWNER')")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOptional = userRepository.findById(userDetails.getId());

            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("User not found!"));
            }

            User user = userOptional.get();

            // Convert Role enum to String with "ROLE_" prefix to match frontend expectations
            UserProfileResponse response = new UserProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhoneNumber(),
                    user.getRoles().stream()
                            .map(role -> "ROLE_" + role.name())
                            .collect(Collectors.toSet()),
                    user.getCreatedAt(),
                    user.getUpdatedAt() // Using updatedAt as lastLoginAt since User entity doesn't have lastLoginAt
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching profile: " + e.getMessage()));
        }
    }

    /**
     * Update user profile
     */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('STATION_OWNER') or hasRole('VEHICLE_OWNER')")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserProfileUpdateRequest request,
                                               Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOptional = userRepository.findById(userDetails.getId());

            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("User not found!"));
            }

            User user = userOptional.get();

            // Check if email is being changed and is not already taken
            if (!user.getEmail().equals(request.getEmail()) &&
                    userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Email is already in use!"));
            }

            // Update user fields
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());

            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error updating profile: " + e.getMessage()));
        }
    }

    /**
     * Change password
     */
    @PutMapping("/profile/password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('STATION_OWNER') or hasRole('VEHICLE_OWNER')")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOptional = userRepository.findById(userDetails.getId());

            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("User not found!"));
            }

            User user = userOptional.get();

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Current password is incorrect!"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error changing password: " + e.getMessage()));
        }
    }
}