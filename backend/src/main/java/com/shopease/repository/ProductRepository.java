package com.shopease.repository;

import com.shopease.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByCategorySlugAndIsActiveTrue(String slug, Pageable pageable);

    @Query("""
            SELECT p FROM Product p
            WHERE p.isActive = true
            AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
            """)
    Page<Product> findWithFilters(
            @Param("search") String search,
            @Param("categorySlug") String categorySlug,
            Pageable pageable
    );
}
