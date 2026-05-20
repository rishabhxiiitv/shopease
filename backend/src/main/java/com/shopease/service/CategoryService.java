package com.shopease.service;

import com.shopease.dto.CategoryDTO;
import com.shopease.model.Category;
import com.shopease.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsBySlug(dto.getSlug())) {
            throw new IllegalArgumentException("Category slug already exists: " + dto.getSlug());
        }

        Category category = Category.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .build();

        return toDTO(categoryRepository.save(category));
    }

    public CategoryDTO toDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }
}
