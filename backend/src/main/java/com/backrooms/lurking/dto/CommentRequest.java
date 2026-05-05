package com.backrooms.lurking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank
    private String reviewId;

    @NotBlank
    @Size(max = 100)
    private String userName;

    @NotBlank
    @Size(min = 1, max = 1000)
    private String content;

    private String userId;
}
