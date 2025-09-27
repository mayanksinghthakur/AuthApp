package com.jwtDemo.auth.service;

import com.jwtDemo.auth.io.ProfileRequest;
import com.jwtDemo.auth.io.ProfileResponse;

import java.net.PasswordAuthentication;

public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest request);

    ProfileResponse getProfile(String email);

    void sendResetOtp(String email);

    void ResetPassword(String email,String otp,String newPassword);

    void sendOtp(String email);
    void verifyOtp(String email,String otp);



}
