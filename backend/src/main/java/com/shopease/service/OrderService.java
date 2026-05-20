package com.shopease.service;

import com.shopease.dto.OrderItemResponse;
import com.shopease.dto.OrderRequest;
import com.shopease.dto.OrderResponse;
import com.shopease.dto.PageResponse;
import com.shopease.model.*;
import com.shopease.repository.OrderRepository;
import com.shopease.security.SecurityUtils;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final SecurityUtils securityUtils;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        User user = securityUtils.getCurrentUser();
        Cart cart = cartService.getOrCreateCart(user);

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        // Build order items & calculate total
        Order order = Order.builder()
                .user(user)
                .address(request.getAddress())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for: " + product.getName());
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            order.getItems().add(orderItem);

            // Decrement stock
            product.setStock(product.getStock() - cartItem.getQuantity());

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotalAmount(total);
        orderRepository.save(order);

        // Clear cart after placing order
        cartService.clearCart(cart.getId());

        return toResponse(order);
    }

    public PageResponse<OrderResponse> getMyOrders(int page, int size) {
        User user = securityUtils.getCurrentUser();
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(
                user.getId(), PageRequest.of(page, size)
        );
        return toPageResponse(orders);
    }

    public OrderResponse getOrderById(Long id) {
        User user = securityUtils.getCurrentUser();
        Order order = findOrder(id);

        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isOwner = order.getUser().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException("Access denied");
        }

        return toResponse(order);
    }

    // Admin: get all orders
    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        Page<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return toPageResponse(orders);
    }

    // Admin: update order status
    @Transactional
    public OrderResponse updateStatus(Long id, String status) {
        Order order = findOrder(id);

        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        order.setUpdatedAt(LocalDateTime.now());
        return toResponse(orderRepository.save(order));
    }

    private Order findOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
    }

    private PageResponse<OrderResponse> toPageResponse(Page<Order> page) {
        return PageResponse.<OrderResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(this::toItemResponse)
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getUser().getName())
                .customerEmail(order.getUser().getEmail())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .address(order.getAddress())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemResponse.builder()
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .imageUrl(item.getProduct().getImageUrl())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(subtotal)
                .build();
    }
}
