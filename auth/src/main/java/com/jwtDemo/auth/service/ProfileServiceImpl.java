package com.jwtDemo.auth.service;

import com.jwtDemo.auth.entity.UserEntity;
import com.jwtDemo.auth.io.ProfileRequest;
import com.jwtDemo.auth.io.ProfileResponse;
import com.jwtDemo.auth.repository.UserRepostory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import static com.jwtDemo.auth.entity.UserEntity.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileServiceImpl implements  ProfileService {
    private final UserRepostory userRepostory;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    //creating profile for the user
    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity newProfile = convertToUserEntity(request);
        if(!userRepostory.existsByEmail(request.getEmail())){
            newProfile=userRepostory.save(newProfile);
            return convertToProfileResponse(newProfile);
        }else {
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already Exists");
        }




    }

    @Override
    public ProfileResponse getProfile(String email) {
      UserEntity existingUser=  userRepostory.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("username not found"+email));
        return convertToProfileResponse(existingUser);
    }



    private ProfileResponse convertToProfileResponse(UserEntity newProfile) {
        return ProfileResponse.builder().name(newProfile.getName()).email(newProfile.getEmail()).userId(newProfile.getUserId()).isAccountVerified(newProfile.getIsAccountVerified()).build();
    }


    private UserEntity convertToUserEntity(ProfileRequest request) {
           return UserEntity.builder().email(request.getEmail()).userId(UUID.randomUUID().toString()).name(request.getName()).password(passwordEncoder.encode(request.getPassword())).isAccountVerified(false).resetOtpExpireAt(0L).verifyOtp(null
            ).verifyOtpExpireAt(0L).resetOtp(null).build();

    }

    //for resetting the password
    @Override
    public void sendResetOtp(String email) {
    //using email getting details of profile
        UserEntity existingUserEntity=userRepostory.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("username not found!"+email));
        //generate  //6 digit otp
        String otp=String.valueOf(ThreadLocalRandom.current().nextInt(100000,1000000));

        //calculate expiry time for otp as 15 minutes
        long expiryTime=System.currentTimeMillis()+(15*60*1000);

        //once we get otp we will reset password
        existingUserEntity.setResetOtp(otp);
        existingUserEntity.setResetOtpExpireAt(expiryTime);

        //saving it to database
        userRepostory.save(existingUserEntity);

        try{
            //resting otp mail
    emailService.sendResetOtpEmail(existingUserEntity.getEmail(),otp);
        }catch(Exception ex){
         throw  new RuntimeException("unable to send email! ");
        }
    }

    @Override
    public void ResetPassword(String email, String otp, String newPassword) {
        UserEntity exsitingUser=userRepostory.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("username not found"+email));
        if(exsitingUser.getResetOtp()==null||!exsitingUser.getResetOtp().equals(otp)){
            throw  new RuntimeException(("Invalid Otp"));
        }

        //if otp is expired
        if(exsitingUser.getResetOtpExpireAt()<System.currentTimeMillis()){
            throw  new RuntimeException(("Otp expired"));
        }

        exsitingUser.setPassword(passwordEncoder.encode(newPassword));
        exsitingUser.setResetOtp(null);
        exsitingUser.setResetOtpExpireAt(0L);

        userRepostory.save(exsitingUser);
    }

    @Override
    public void sendOtp(String email) {
   UserEntity exsistingUser= userRepostory.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("user not found"+email));

   if(exsistingUser.getIsAccountVerified()!=null&& exsistingUser.getIsAccountVerified()){
       return;
   }
   //generater thhe 6 digit otp
        String otp=String.valueOf(ThreadLocalRandom.current().nextInt(100000,1000000));

        //calculate expiry time for otp as 24 hours minutes
        long expiryTime=System.currentTimeMillis()+(24*60*60*1000);

        //update user entity
        exsistingUser.setVerifyOtp(otp);
        exsistingUser.setVerifyOtpExpireAt(expiryTime);

        //save to database
        userRepostory.save(exsistingUser);
        try{
            emailService.sendOtpEmail(exsistingUser.getEmail(),otp);
        }catch (Exception e){
        throw new RuntimeException("unable to send email");
        }
    }

    @Override
    public void verifyOtp(String email, String otp) {

       UserEntity existingUser= userRepostory.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("user not found: "+email));
       if(existingUser.getVerifyOtp()==null||!existingUser.getVerifyOtp().equals(otp)){
           throw new RuntimeException("Invalid OTP");
       }

       if(existingUser.getVerifyOtpExpireAt()<System.currentTimeMillis()){
           throw new RuntimeException("Otp Expired");
       }

       existingUser.setIsAccountVerified(true);
       existingUser.setVerifyOtp(null);
       existingUser.setVerifyOtpExpireAt(0L);
       userRepostory.save(existingUser);
    }



}

