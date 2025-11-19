package com.capibara.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO para respuesta de autenticación (login/register)
 * IE3.3.1 - Autenticación JWT
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String name;
    private String email;
    private Set<String> roles;
    private String token;
    private String type = "Bearer";

    public AuthResponse(Long id, String name, String email, Set<String> roles, String token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.token = token;
    }
}
