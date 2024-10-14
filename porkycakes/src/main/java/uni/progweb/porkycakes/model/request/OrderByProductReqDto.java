package uni.progweb.porkycakes.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class OrderByProductReqDto {
	@NotNull
	private Integer productId;

	private int amount; // to remove from the cart, send negative values
}
