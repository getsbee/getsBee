package com.ssafy.getsbee.domain.highlight.dto.request;

import jakarta.validation.Valid;

public record UpdateHighlightRequest(
        @Valid
        String color
) {
}
