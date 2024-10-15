package uni.progweb.porkycakes.utils.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCodes {
	/*
	 * 0x: Generic errors
	 */
	SOMETHING_WENT_WRONG("00", HttpStatus.INTERNAL_SERVER_ERROR, "Algo salio mal."),
	FORBIDDEN("01", HttpStatus.FORBIDDEN, "Permisos insuficientes."),
	UNAUTHORIZED("02", HttpStatus.UNAUTHORIZED, "Header de authorizacion requerido."),

	/*
	 * 1x: Product
	 */
	PRODUCT_NOT_FOUND("10", HttpStatus.NOT_FOUND, "Producto no encontrado"),
	EMPTY_PRODUCTS("11", HttpStatus.BAD_REQUEST, "No ha enviado ningun producto."),
	NULL_NAME("12", HttpStatus.BAD_REQUEST, "El nombre del producto no puede ser nulo."),
	NULL_PRICE("13", HttpStatus.BAD_REQUEST, "Debe asignarle un precio al producto."),

	/*
	 * 2x: Order
	 */
	ORDER_NOT_FOUND("20", HttpStatus.NOT_FOUND, "Orden  no encontrado"),
	NULL_DELIVERY_DATE("21", HttpStatus.BAD_REQUEST, "La fecha de entrega de la Orden no puede ser nula."),
	EMPTY_ORDER("22", HttpStatus.BAD_REQUEST, "La Orden debe contener, al menos, un producto."),

	/*
	 * 3x: Cart
	 */
	CART_NOT_FOUND("30", HttpStatus.NOT_FOUND, "Carrito  no encontrado");

	private final String errorCode;
	private final HttpStatus statusCode;
	private final String message;

	ErrorCodes(String errorCode, HttpStatus statusCode, String message) {
		this.errorCode = errorCode;
		this.statusCode = statusCode;
		this.message = message;
	}
}
