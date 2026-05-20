package com.shopease.controller;

import com.shopease.dto.CartItemRequest;
import com.shopease.dto.CartResponse;
import com.shopease.service.CartService;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@Path("/cart")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class CartResource {

    private final CartService cartService;

    // GET /api/cart
    @GET
    public Response getCart() {
        CartResponse cart = cartService.getCart();
        return Response.ok(cart).build();
    }

    // POST /api/cart/add
    @POST
    @Path("/add")
    public Response addItem(@Valid CartItemRequest request) {
        CartResponse cart = cartService.addItem(request);
        return Response.ok(cart).build();
    }

    // PUT /api/cart/update
    @PUT
    @Path("/update")
    public Response updateItem(@Valid CartItemRequest request) {
        CartResponse cart = cartService.updateItem(request);
        return Response.ok(cart).build();
    }

    // DELETE /api/cart/remove/{productId}
    @DELETE
    @Path("/remove/{productId}")
    public Response removeItem(@PathParam("productId") Long productId) {
        CartResponse cart = cartService.removeItem(productId);
        return Response.ok(cart).build();
    }
}
