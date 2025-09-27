package com.jwtDemo.auth.controller;

import com.jwtDemo.auth.io.ProfileRequest;
import com.jwtDemo.auth.io.ProfileResponse;
import com.jwtDemo.auth.service.EmailService;
import com.jwtDemo.auth.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor

public class profilrController {

    private final ProfileService profileService;
    private final EmailService emailService;
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    //valid will validate the profileRequest bean as per the fields and than  bind the values into the  profile request object
    public ProfileResponse register(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createProfile(request);

        emailService.sendWelcomeEmail(response.getEmail(),response.getName());
        //TODO :send welcome email
        return response;
    }

//    this was for testing purpose
//    @GetMapping("/test")
//    public String test(){
//        return "Auth is working";
//
//    }


    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name")String email ){
        return profileService.getProfile(email);

    }
}
