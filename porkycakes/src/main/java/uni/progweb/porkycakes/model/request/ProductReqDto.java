package uni.progweb.porkycakes.model.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.validator.constraints.Range;
import uni.progweb.porkycakes.model.Category;

@Builder
@Getter
public class ProductReqDto {
	@Pattern(regexp = "(?U)[\\w ñ]+[.\\w ñ]*", message = "Must be an alphanumeric string")
	private String name;

	private Category category;

	@PositiveOrZero
	private Integer stock;

	@PositiveOrZero
	private Double price;

	@Range(min = 0, max = 5)
	private Integer rating;

	private String image;

	private String description;

	@Positive
	private Integer minPrevReqDays;
}
