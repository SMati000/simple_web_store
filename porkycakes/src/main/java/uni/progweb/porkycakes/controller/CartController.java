package uni.progweb.porkycakes.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import uni.progweb.porkycakes.model.Cart;
import uni.progweb.porkycakes.model.OrderByProduct;
import uni.progweb.porkycakes.model.mapper.OrderByProductMapper;
import uni.progweb.porkycakes.model.request.OrderByProductReqDto;
import uni.progweb.porkycakes.repository.CartRepo;
import uni.progweb.porkycakes.repository.OrderByProductRepo;
import uni.progweb.porkycakes.utils.exceptions.ErrorCodes;
import uni.progweb.porkycakes.utils.exceptions.PorkyException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Validated
@RestController
@RequestMapping("/cart/{uid}")
public class CartController extends BaseController {
	@Autowired CartRepo cartRepo;
	@Autowired OrderByProductRepo orderByProductRepo;
	@Autowired OrderByProductMapper orderByProductMapper;

	@GetMapping
	@ResponseBody
	@PreAuthorize("hasRole('pc_customer') && #uid == authentication.principal.claims['email']")
	public Cart getCart(@PathVariable String uid) throws PorkyException {
		Optional<Cart> opCart = cartRepo.findById(uid);

		if(opCart.isEmpty()) {
			throw new PorkyException(ErrorCodes.CART_NOT_FOUND);
		}

		return opCart.get();
	}

	@PatchMapping
	@ResponseBody
	@PreAuthorize("hasRole('pc_customer') && #uid == authentication.principal.claims['email']")
	public Cart updateProduct(
			@PathVariable String uid,
			@RequestParam(required = false) boolean relative, // whether the amounts should be added to the existing ones or replaced
		    @RequestBody @Valid List<OrderByProductReqDto> productOrders
	) {
		Optional<Cart> opCart = cartRepo.findById(uid);

		Cart cart = opCart.orElse(new Cart(uid, new ArrayList<>()));

		List<Integer> ordersToDelete = new ArrayList<>();

		productOrders.forEach(orderByProductReqDto -> { // TODO improve queries for better performance
			Optional<OrderByProduct> opOrderByProduct = cartRepo.getOrderFromCart(uid, orderByProductReqDto.getProductId());

			OrderByProduct orderByProduct;
			if(opOrderByProduct.isPresent()) {
				orderByProduct = opOrderByProduct.get();

				if(relative) {
					orderByProduct.plus(orderByProductReqDto.getAmount());
				} else {
					orderByProduct.setAmount(orderByProductReqDto.getAmount());
				}

				if(orderByProduct.getAmount() == 0) {
					ordersToDelete.add(orderByProduct.getId());
					cart.removeProductOrder(orderByProduct.getId());
				}

				orderByProductRepo.save(orderByProduct);
			} else {
				orderByProduct = orderByProductMapper.fromRequestDto(orderByProductReqDto);
				orderByProductRepo.save(orderByProduct);
				cart.addProductOrder(orderByProduct);
			}
		});

		Cart modifiedCart = cartRepo.save(cart);
		orderByProductRepo.deleteAllById(ordersToDelete);
		return modifiedCart;
	}

	@DeleteMapping
	@PreAuthorize("hasRole('pc_customer') && #uid == authentication.principal.claims['email']")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void emptyCart(@PathVariable String uid) {
		Optional<Cart> opCart = cartRepo.findById(uid);

		if(opCart.isPresent()) {
			List<Integer> ordersToRemove = opCart.get().getProductOrders().stream().map(OrderByProduct::getId).toList();
			cartRepo.save(new Cart(uid, new ArrayList<>()));
			orderByProductRepo.deleteAllById(ordersToRemove);
		}
	}
}
