package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.dto.OrderDTOs.CreateOrderDTO;
import com.invictus.watches_final.dto.OrderDTOs.OrderDTO;
import com.invictus.watches_final.dto.WatchDTOs.AmountDTO;
import com.invictus.watches_final.exceptions.CustomExceptions.EmailNotVerifiedException;
import com.invictus.watches_final.exceptions.CustomExceptions.UserNotFoundException;
import com.invictus.watches_final.mapper.OrderMapper;
import com.invictus.watches_final.model.Cart;
import com.invictus.watches_final.model.Order;
import com.invictus.watches_final.model.OrderItem;
import com.invictus.watches_final.model.User;
import com.invictus.watches_final.model.enums.OrderStatus;
import com.invictus.watches_final.repository.CartRepo;
import com.invictus.watches_final.repository.OrderRepo;
import com.invictus.watches_final.repository.UserRepo;
import com.invictus.watches_final.security.enums.Roles;
import com.invictus.watches_final.services.IServices.IOrderService;
import com.invictus.watches_final.services.IServices.IStripeService;
import com.invictus.watches_final.services.IServices.IWatchService;
import com.stripe.model.checkout.Session;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements IOrderService {

    private final OrderRepo repo;
    private final UserRepo userRepo;
    private final CartRepo cartRepo;
    private final IWatchService watchService;
    private final IStripeService stripeService;

    @Transactional// ako nesto ne uspe u ovoj metodi onda se nece odraditi odraditi ostale promene ako negde zpane
    @Override
    public OrderDTO createOrder(CreateOrderDTO createOrderDTO) {

        // proveriti da li dohvatam username ili full name ako dodje do greske
        User user = getCurrentUser();

        if(!user.isVerified()){
            throw new EmailNotVerifiedException("You must verify your email before placing an order");
        }

        Cart cart = cartRepo.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

        if(cart.getItems().isEmpty()){
            throw new EntityNotFoundException("Cart is empty, cannot create order");
        }

        Order order = OrderMapper.dtoToEntity(createOrderDTO); // mozda greska ili staviti na staticku

        order.setStatus(OrderStatus.PENDING);
        order.setDateOfOrder(LocalDateTime.now());
        order.setUser(user);

        //treba voditi racuna oko orderItem i orderItemDTO tipa, mozda posle dodje do problema
        List<OrderItem>  orderItems = cart.getItems()
                .stream()
                .map(cartItem -> {
                        OrderItem orderItem = new OrderItem();
                        orderItem.setOrder(order);
                        orderItem.setWatch(cartItem.getWatch());
                        orderItem.setPrice(cartItem.getPrice());
                        orderItem.setAmount(cartItem.getAmount());
                        return orderItem;
                }).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        for(OrderItem item : orderItems){
            watchService.reduceStock(item.getWatch().getWatchID(), item.getAmount());
        }

        double total = cart.getItems()
                .stream().mapToDouble(i -> i.getPrice() * i.getAmount())
                .sum();  // ubacili smo racunanje konacnog ordera a za cart ce se racunati na frontu on fly

        order.setTotalAmount(total);

        repo.save(order);

        //brisemo cart posle izvrsenog ordera
        cart.getItems().clear();
        cartRepo.save(cart);


        return OrderMapper.entityToDTO(order);
    }

    @Override
    public OrderDTO getOrderForUser(UUID orderID) {

        User user = getCurrentUser();

        Order order = repo.findByOrderIDAndUser(orderID, user)//ovde prosledjujemo ceo user objekat i njegov poseban order id sto on pretrazuje
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        return OrderMapper.entityToDTO(order);
    }

    @Override
    public String createCheckoutSession(UUID orderID) {
        User user = getCurrentUser();

        Order order = repo.findByOrderID(orderID)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if(!order.getUser().equals(user)){
            throw new AccessDeniedException("You are not allowed to perform this action");
        }

        if(order.getStatus() != OrderStatus.PENDING){
            throw new IllegalStateException("Only pending orders can be paid");
        }

        Session session = stripeService.createCheckoutSession(order);

        order.setStripeSessionId(session.getId());
        repo.save(order);

        return session.getUrl();
    }

    @Transactional
    @Override
    public void markOrderAsPaid(UUID orderId) {
        Order order = repo.findByOrderID(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (order.getStatus() == OrderStatus.PAID) {
            return; // vec obradjeno, Stripe  da ponovi isti webhook
        }

        order.setStatus(OrderStatus.PAID);
        repo.save(order);
    }

    @Transactional
    @Override
    public void cancelExpiredOrders(){
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(30);
        List<Order> expiredOrders = repo.findByStatusAndDateOfOrderBefore(OrderStatus.PENDING, cutoff);

        for (Order order : expiredOrders){
            for(OrderItem item : order.getOrderItems()) {
                AmountDTO amountDTO = new AmountDTO(item.getAmount(),
                        item.getWatch().getWatchID().toString());
                watchService.addAmount(amountDTO);
            }
            order.setStatus(OrderStatus.CANCELLED);
            repo.save(order);
        }
    }

    @Override
    public Page<OrderDTO> getAllOrdersForUser(Pageable pageable) {

        User user = getCurrentUser();

        Page<Order>  orders = repo.findByUserOrderByDateOfOrderDesc(user, pageable);

        return orders.map(OrderMapper::entityToDTO);
    }

    @Override
    public Page<OrderDTO> getAllOrdersForUserByStatus(OrderStatus status, Pageable pageable) {

        User user = getCurrentUser();

        Page<Order> orders = repo.findByStatusAndUserOrderByDateOfOrderDesc(status, user, pageable);


        //zbog doslednosti koda da se vraca prazna lista

//        if (orders.isEmpty()) {
//            throw new EntityNotFoundException("No orders for this user with status: " + status);
//        }

        return orders.map(OrderMapper::entityToDTO);
    }

    @Override
    public OrderDTO getOrderByAdmin(UUID orderID) {

        Order order = repo.findByOrderID(orderID)
                .orElseThrow(() -> new EntityNotFoundException("Order not found")); //nema potree nista vise, dovoljno preko id a permision cemo srediit u security

        return OrderMapper.entityToDTO(order);
    }

    @Override
    public Page<OrderDTO> getAllOrdersForUserByAdmin(String username, Pageable pageable) {

        userRepo.findByUserName(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Page<Order> orders = repo.findByUserUserNameOrderByDateOfOrderDesc(username, pageable);
        return orders.map(OrderMapper::entityToDTO);
    }

    @Override
    public Page<OrderDTO> getAllOrdersForUserByAdminByStatus(String username, OrderStatus status, Pageable pageable) {

        userRepo.findByUserName(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Page<Order> orders = repo.findByUserUserNameAndStatusOrderByDateOfOrderDesc(username, status, pageable);
        return orders.map(OrderMapper::entityToDTO); // u slucaju praznih page on ce vratiti praznu listu koja se moze obraditi na frontu
    }

    @Transactional
    @Override
    public void cancelOrder(UUID orderId) {

        User user = getCurrentUser();

        Order order = repo.findByOrderID(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if(!order.getUser().equals(user) && user.getRole() != Roles.ADMIN_ROLE){
            throw new AccessDeniedException("You cannot cancel someone else's order"); // mozda los import
        }

        if(order.getStatus() == OrderStatus.PAID ||  order.getStatus() == OrderStatus.APPROVED) {
            throw new IllegalStateException("Cannot cancel a paid or approved order");
        }

        order.setStatus(OrderStatus.CANCELLED);
        repo.save(order);
        //dodati eventualno razlog

//    Vracanje proizvoda nazad u korpu

    }

    //Kada korisnik popunjava podatke (pre createOrder())
    //ovde jos nema kreiranog ordera, pa nema šta da se brise, dovoljno je samo da se prekine frontend flow / korpa ostaje netaknuta

    private User getCurrentUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepo.findByUserName(auth.getName())
                .orElseThrow(() -> new UserNotFoundException("Username not found"));
    }
}
