package uni.progweb.porkycakes.utils.exceptions;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class ValidationErrorResponse extends ErrorResponse {

	private List<ValidationError> errors;

	public ValidationErrorResponse(String code, String message, List<ValidationError> errors) {
		super(code, message);
		this.errors = errors;
	}

	public ValidationErrorResponse(ErrorCodes error, List<ValidationError> errors) {
		super(error);
		this.errors = errors;
	}
}
