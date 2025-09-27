package com.jwtDemo.auth.io;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest {

    @NotBlank(message = "name should be entered" )
    private String name;
    @Email(message = "email should be valid" )
    private String email;


    @NotNull
    @Size(min = 6 ,message = "password should be atleast 6 characters")
    private String password;
}
