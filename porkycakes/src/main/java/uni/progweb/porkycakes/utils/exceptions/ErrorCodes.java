package uni.progweb.porkycakes.utils.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCodes {
	/*
	 * 00: Generic errors
	 */
	SOMETHING_WENT_WRONG("0000", HttpStatus.INTERNAL_SERVER_ERROR, "Algo salio mal."),
	QUERY_PARAMS_MISSING("0001", HttpStatus.BAD_REQUEST, "Faltan query parameters."),
	VALIDATION_ERROR("0002", HttpStatus.BAD_REQUEST, "Body invalido."),
	MULTIPLE_VALIDATION_ERROR("0003", HttpStatus.BAD_REQUEST, "Bodies invalidos."),
	JSON_ERROR("0005", HttpStatus.BAD_REQUEST, "Formato del JSON invalido."),
	NOT_FOUND("0006", HttpStatus.NOT_FOUND, "%s no encontrado."),
	FORBIDDEN("0008", HttpStatus.FORBIDDEN, "Permisos insuficientes."),
	UNAUTHORIZED("0009", HttpStatus.UNAUTHORIZED, "Header de authorizacion requerido."),

	/*
	 * 01: Product
	 */
	PRODUCT_NOT_FOUND("0100", NOT_FOUND, "Producto"),
	EMPTY_PRODUCTS("0102", HttpStatus.BAD_REQUEST, "No ha enviado ningun producto."),
	NULL_NAME("0103", HttpStatus.BAD_REQUEST, "El nombre del producto no puede ser nulo."),
	NULL_PRICE("0104", HttpStatus.BAD_REQUEST, "Debe asignarle un precio al producto."),

	/*
	 * 02: Order
	 */
	ORDER_NOT_FOUND("0200", NOT_FOUND, "Orden"),
	NULL_DELIVERY_DATE("0201", HttpStatus.BAD_REQUEST, "La fecha de entrega de la Orden no puede ser nula."),
	EMPTY_ORDER("0202", HttpStatus.BAD_REQUEST, "La Orden debe contener, al menos, un producto."),

	/*
	 * 03: Cart
	 */
	CART_NOT_FOUND("0300", NOT_FOUND, "Carrito");

	private final String errorCode;
	private final HttpStatus statusCode;
	private final String message;

	ErrorCodes(String errorCode, HttpStatus statusCode, String message) {
		this.errorCode = errorCode;
		this.statusCode = statusCode;
		this.message = message;
	}

	ErrorCodes(String errorCode, ErrorCodes error, String... params) {
		this.errorCode = errorCode;
		this.statusCode = error.statusCode;
		this.message = String.format(error.message, (Object[]) params);
	}
}
