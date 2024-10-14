package uni.progweb.porkycakes.utils.exceptions;

import java.util.Iterator;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.FieldError;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Path.Node;

@AllArgsConstructor
@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ValidationError {

	private String field;
	private String path;
	private String reason;

	public static ValidationError fromFieldError(FieldError fieldError) {
		return new ValidationError(fieldError.getField(), fieldError.getDefaultMessage(), null);
	}

	public static ValidationError fromConstraintViolation(ConstraintViolation<?> violation) {
		String message = violation.getMessage();
		String path = "";

		Iterator<Node> nodes = violation.getPropertyPath().iterator();
		Node node = nodes.next();

		boolean firstFind = false;
		while (nodes.hasNext()) {
			if (!firstFind && node.toString().matches(".*\\[[0-9]+\\].*")) {
				String name = node.toString();
				path += name.substring(name.indexOf("[") + 1, name.indexOf("]"));
				firstFind = true;
			}

			node = nodes.next();
		}

		String field = node.getName();

		return new ValidationError(field, message, path);
	}
}
