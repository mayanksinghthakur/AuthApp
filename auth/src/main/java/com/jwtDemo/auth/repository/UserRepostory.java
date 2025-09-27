package com.jwtDemo.auth.repository;

import com.jwtDemo.auth.entity.UserEntity;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface UserRepostory extends JpaRepository<UserEntity,Long> {

    Optional<UserEntity> findByEmail(String email);
    //return boolean weather email exists or not
    Boolean existsByEmail(String email);


}
