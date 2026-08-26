package com.invictus.watches_final.controllers;

import com.invictus.watches_final.dto.OrderDTOs.CreateOrderDTO;
import com.invictus.watches_final.dto.OrderDTOs.OrderDTO;
import com.invictus.watches_final.model.enums.OrderStatus;
import com.invictus.watches_final.services.IServices.IOrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/order")
public class OrderController {

   private final IOrderService service;

    @PreAuthorize("hasAuthority('USER_ROLE')")
    @PostMapping("/createOrder")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CreateOrderDTO createOrderDTO) {

        OrderDTO order = service.createOrder(createOrderDTO);
        return ResponseEntity.ok(order);
   }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @GetMapping("/getOrder/{orderID}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable("orderID") UUID orderID) {
        OrderDTO order = service.getOrderForUser(orderID);
        return ResponseEntity.ok(order);
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @GetMapping("/admin/getAllOrders")
    public ResponseEntity<Page<OrderDTO>> adminGetAllOrders(
            @RequestParam(required = false) OrderStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(service.getAllOrders(status, pageable));
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @GetMapping("/getAllOrders")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(Pageable pageable) {
        Page<OrderDTO> orders = service.getAllOrdersForUser(pageable);
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @GetMapping("/getOrdersByStatus")
    public ResponseEntity<Page<OrderDTO>> getOrdersByStatus(@RequestParam("status") OrderStatus status, Pageable pageable) {
        Page<OrderDTO> orders = service.getAllOrdersForUserByStatus(status, pageable);
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN_ROLE')")
    @GetMapping("/admin/getOrder/{orderID}")
    public ResponseEntity<OrderDTO> getOrderByAdmin(@PathVariable UUID orderID) {
        OrderDTO order = service.getOrderByAdmin(orderID);
        return ResponseEntity.ok(order);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN_ROLE')")
    @GetMapping("/admin/getAllOrders/{username}")
    public ResponseEntity<Page<OrderDTO>> getAllOrdersByAdminByUsername(@PathVariable String username, Pageable pageable) {
        Page<OrderDTO> orders = service.getAllOrdersForUserByAdmin(username, pageable);
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN_ROLE')")
    @GetMapping("/admin/getOrdersByStatus/{username}")
    public ResponseEntity<Page<OrderDTO>> getAllOrdersForUserByAdminByStatus(@PathVariable String username,
                                                                             @RequestParam OrderStatus status, Pageable pageable) {
        Page<OrderDTO> orders = service.getAllOrdersForUserByAdminByStatus(username, status, pageable);
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @PutMapping("/cancelOrder/{orderID}")
    public ResponseEntity<String> cancelOrder(@PathVariable("orderID") UUID orderID) {
        service.cancelOrder(orderID);
        return ResponseEntity.ok("You cancelled your order");
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @PostMapping("/checkout/{orderID}")
    public ResponseEntity<String> createCheckoutSession(@PathVariable UUID orderID) {
        String url = service.createCheckoutSession(orderID);
        return ResponseEntity.ok(url);
    }
}
