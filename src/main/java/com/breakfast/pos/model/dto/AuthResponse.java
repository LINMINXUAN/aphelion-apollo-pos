package com.breakfast.pos.model.dto;

public record AuthResponse(
        String token,
        String type, // Bearer
        String role,
        String username) {
    public AuthResponse(String token, String role, String username) {
        this(token, "Bearer", role, username);
    }
}
