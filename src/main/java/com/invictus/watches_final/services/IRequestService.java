package com.invictus.watches_final.services;

import com.invictus.watches_final.dto.AccountDTOs.RequestDTO;

public interface IRequestService {

    String sendRequest(RequestDTO requestDTO);
}
