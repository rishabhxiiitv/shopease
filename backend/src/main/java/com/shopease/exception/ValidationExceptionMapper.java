package com.shopease.exception;

import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.HashMap;
import java.util.Map;

@Provider
public class ValidationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        Map<String, String> errors = new HashMap<>();

        exception.getConstraintViolations().forEach(cv -> {
            String field = cv.getPropertyPath().toString();
            // Strip method name prefix (e.g. "register.request.email" -> "email")
            if (field.contains(".")) {
                field = field.substring(field.lastIndexOf('.') + 1);
            }
            errors.put(field, cv.getMessage());
        });

        return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("errors", errors))
                .type(MediaType.APPLICATION_JSON)
                .build();
    }
}
