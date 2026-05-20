package com.shopease.controller;

import com.shopease.dto.OrderRequest;
import com.shopease.dto.OrderResponse;
import com.shopease.dto.OrderStatusUpdateRequest;
import com.shopease.dto.PageResponse;
import com.shopease.service.OrderService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@Path("/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class OrderResource {

    private final OrderService orderService;

    // POST /api/orders — place order from cart
    @POST
    public Response placeOrder(@Valid OrderRequest request) {
        OrderResponse order = orderService.placeOrder(request);
        return Response.status(Response.Status.CREATED).entity(order).build();
    }

    // GET /api/orders — current user's order history
    @GET
    public Response getMyOrders(
            @QueryParam("page") @DefaultValue("0")  int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        PageResponse<OrderResponse> orders = orderService.getMyOrders(page, size);
        return Response.ok(orders).build();
    }

    // GET /api/orders/{id} — order detail (owner or admin)
    @GET
    @Path("/{id}")
    public Response getOrder(@PathParam("id") Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return Response.ok(order).build();
    }

    // GET /api/orders/admin/all — all orders [ADMIN]
    @GET
    @Path("/admin/all")
    @RolesAllowed("ADMIN")
    public Response getAllOrders(
            @QueryParam("page") @DefaultValue("0")  int page,
            @QueryParam("size") @DefaultValue("20") int size
    ) {
        PageResponse<OrderResponse> orders = orderService.getAllOrders(page, size);
        return Response.ok(orders).build();
    }

    // PUT /api/orders/{id}/status — update status [ADMIN]
    @PUT
    @Path("/{id}/status")
    @RolesAllowed("ADMIN")
    public Response updateStatus(@PathParam("id") Long id, @Valid OrderStatusUpdateRequest request) {
        OrderResponse order = orderService.updateStatus(id, request.getStatus());
        return Response.ok(order).build();
    }
}
