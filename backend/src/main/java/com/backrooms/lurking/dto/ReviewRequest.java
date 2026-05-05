package com.backrooms.lurking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotBlank
    @Size(max = 100)
    private String userName;

    @Min(1) @Max(5)
    private int rating;

    @NotBlank
    @Size(min = 10, max = 2000)
    private String text;

    private String userId;
}
