package com.shopease.controller;

import com.shopease.dto.PageResponse;
import com.shopease.dto.ProductRequest;
import com.shopease.dto.ProductResponse;
import com.shopease.service.ProductService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class ProductResource {

    private final ProductService productService;

    // GET /api/products?search=&category=&page=0&size=12&sortBy=createdAt&sortDir=desc
    @GET
    public Response getProducts(
            @QueryParam("search")   @DefaultValue("")           String search,
            @QueryParam("category") @DefaultValue("")           String categorySlug,
            @QueryParam("page")     @DefaultValue("0")          int page,
            @QueryParam("size")     @DefaultValue("12")         int size,
            @QueryParam("sortBy")   @DefaultValue("createdAt")  String sortBy,
            @QueryParam("sortDir")  @DefaultValue("desc")       String sortDir
    ) {
        PageResponse<ProductResponse> result = productService.getProducts(
                search, categorySlug, page, size, sortBy, sortDir
        );
        return Response.ok(result).build();
    }

    // GET /api/products/{id}
    @GET
    @Path("/{id}")
    public Response getProduct(@PathParam("id") Long id) {
        return Response.ok(productService.getProductById(id)).build();
    }

    // POST /api/products  [ADMIN]
    @POST
    @RolesAllowed("ADMIN")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createProduct(@Valid ProductRequest request) {
        ProductResponse created = productService.createProduct(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    // PUT /api/products/{id}  [ADMIN]
    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProduct(@PathParam("id") Long id, @Valid ProductRequest request) {
        return Response.ok(productService.updateProduct(id, request)).build();
    }

    // POST /api/products/{id}/image  [ADMIN] — multipart file upload → S3
    @POST
    @Path("/{id}/image")
    @RolesAllowed("ADMIN")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadImage(
            @PathParam("id") Long id,
            @FormDataParam("file") InputStream fileStream,
            @FormDataParam("file") FormDataContentDisposition fileDetails
    ) {
        String filename    = fileDetails.getFileName();
        String contentType = fileDetails.getType() != null ? fileDetails.getType() : "image/jpeg";
        long   size        = fileDetails.getSize();

        ProductResponse updated = productService.uploadImage(id, fileStream, filename, contentType, size);
        return Response.ok(updated).build();
    }

    // DELETE /api/products/{id}  [ADMIN] — soft delete
    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deleteProduct(@PathParam("id") Long id) {
        productService.deleteProduct(id);
        return Response.noContent().build();
    }
}
