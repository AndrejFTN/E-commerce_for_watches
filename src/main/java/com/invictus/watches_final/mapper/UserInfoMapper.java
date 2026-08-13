package com.invictus.watches_final.mapper;

import com.invictus.watches_final.dto.AccountDTOs.UserInfoDTO;
import com.invictus.watches_final.model.User;

public class UserInfoMapper {

    public static UserInfoDTO entityToDTO(User user){

        UserInfoDTO userInfoDTO = new UserInfoDTO();

        userInfoDTO.setEmail(user.getEmail());
        userInfoDTO.setFullName(user.getFullName());
        userInfoDTO.setPhone(user.getPhone());
        userInfoDTO.setUserName(user.getUserName());
        userInfoDTO.setVerified(user.isVerified());

        return userInfoDTO;
    }
}
