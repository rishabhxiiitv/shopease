package com.shopease.service;

import com.shopease.dto.PageResponse;
import com.shopease.dto.ProductRequest;
import com.shopease.dto.ProductResponse;
import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final S3Service s3Service;

    public PageResponse<ProductResponse> getProducts(String search, String categorySlug,
                                                      int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage = productRepository.findWithFilters(
                (search == null || search.isBlank()) ? null : search,
                (categorySlug == null || categorySlug.isBlank()) ? null : categorySlug,
                pageable
        );

        return toPageResponse(productPage);
    }

    public ProductResponse getProductById(Long id) {
        Product product = findActiveProduct(id);
        return toResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Category category = findCategory(request.getCategoryId());

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(category)
                .build();

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findActiveProduct(id);
        Category category = findCategory(request.getCategoryId());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);

        return toResponse(productRepository.save(product));
    }

    public ProductResponse uploadImage(Long id, InputStream inputStream,
                                        String filename, String contentType, long contentLength) {
        Product product = findActiveProduct(id);

        // Delete old image if exists
        if (product.getImageUrl() != null) {
            s3Service.deleteFile(product.getImageUrl());
        }

        String imageUrl = s3Service.uploadFile(inputStream, filename, contentType, contentLength);
        product.setImageUrl(imageUrl);

        return toResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = findActiveProduct(id);
        product.setIsActive(false);
        productRepository.save(product);
    }

    private Product findActiveProduct(Long id) {
        return productRepository.findById(id)
                .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
                .orElseThrow(() -> new jakarta.ws.rs.NotFoundException("Product not found: " + id));
    }

    private Category findCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + categoryId));
    }

    private PageResponse<ProductResponse> toPageResponse(Page<Product> page) {
        return PageResponse.<ProductResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public ProductResponse toResponse(Product product) {
        ProductResponse.ProductResponseBuilder builder = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt());

        if (product.getCategory() != null) {
            builder.categoryId(product.getCategory().getId())
                   .categoryName(product.getCategory().getName())
                   .categorySlug(product.getCategory().getSlug());
        }

        return builder.build();
    }
}
