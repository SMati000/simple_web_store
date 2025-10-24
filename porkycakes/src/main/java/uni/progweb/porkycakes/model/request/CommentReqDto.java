package uni.progweb.porkycakes.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CommentReqDto {
	@NotNull private Integer productId;
	@NotBlank private String text;
}
