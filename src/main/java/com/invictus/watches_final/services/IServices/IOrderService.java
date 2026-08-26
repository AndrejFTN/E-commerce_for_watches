package com.invictus.watches_final.services.IServices;

import com.invictus.watches_final.dto.OrderDTOs.CreateOrderDTO;
import com.invictus.watches_final.dto.OrderDTOs.OrderDTO;
import com.invictus.watches_final.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IOrderService {

    OrderDTO createOrder(CreateOrderDTO orderDTO);

    void markOrderAsPaid(UUID orderId);

    OrderDTO getOrderForUser(UUID orderID);

    void cancelExpiredOrders();

    Page<OrderDTO> getAllOrders(OrderStatus status, Pageable pageable);

    String createCheckoutSession(UUID orderId);

    Page<OrderDTO> getAllOrdersForUser(Pageable pageable);

    Page<OrderDTO> getAllOrdersForUserByStatus(OrderStatus status, Pageable pageable);

    OrderDTO getOrderByAdmin(UUID orderID);

    Page<OrderDTO> getAllOrdersForUserByAdmin(String username, Pageable pageable);

    Page<OrderDTO> getAllOrdersForUserByAdminByStatus(String username, OrderStatus status, Pageable pageable);

    void cancelOrder(UUID orderId);
}
