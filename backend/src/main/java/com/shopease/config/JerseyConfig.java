package com.shopease.config;

import com.shopease.controller.AuthResource;
import com.shopease.controller.CartResource;
import com.shopease.controller.CategoryResource;
import com.shopease.controller.OrderResource;
import com.shopease.controller.ProductResource;
import com.shopease.exception.GlobalExceptionMapper;
import com.shopease.exception.ValidationExceptionMapper;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.context.annotation.Configuration;

import jakarta.ws.rs.ApplicationPath;

@Configuration
@ApplicationPath("/api")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() {
        register(AuthResource.class);
        register(CategoryResource.class);
        register(ProductResource.class);
        register(CartResource.class);
        register(OrderResource.class);
        register(GlobalExceptionMapper.class);
        register(ValidationExceptionMapper.class);

        // Enable Jackson JSON support
        register(org.glassfish.jersey.jackson.JacksonFeature.class);

        // Enable multipart for image uploads
        register(MultiPartFeature.class);
    }
}
