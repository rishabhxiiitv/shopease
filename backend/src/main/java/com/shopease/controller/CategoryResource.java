package com.shopease.controller;

import com.shopease.dto.CategoryDTO;
import com.shopease.service.CategoryService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class CategoryResource {

    private final CategoryService categoryService;

    @GET
    public Response getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return Response.ok(categories).build();
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response createCategory(@Valid CategoryDTO dto) {
        CategoryDTO created = categoryService.createCategory(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
