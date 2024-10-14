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
import uni.progweb.porkycakes.model.Category;
import uni.progweb.porkycakes.model.Product;
import uni.progweb.porkycakes.model.mapper.ProductMapper;
import uni.progweb.porkycakes.model.request.ProductReqDto;
import uni.progweb.porkycakes.repository.ProductRepo;
import uni.progweb.porkycakes.utils.exceptions.ErrorCodes;
import uni.progweb.porkycakes.utils.exceptions.PorkyException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Validated
@RestController
@RequestMapping("/products")
public class ProductController extends BaseController {
	@Autowired ProductRepo productRepo;
	@Autowired ProductMapper productMapper;

	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('pc_admin')")
	public List<Product> createProducts(@RequestBody @Valid List<ProductReqDto> productsDto) throws PorkyException {
		if(productsDto == null || productsDto.isEmpty()) {
			throw new PorkyException(ErrorCodes.EMPTY_PRODUCTS);
		}

		if(productsDto.stream().anyMatch(p -> p.getName() == null || p.getName().isEmpty())) {
			throw new PorkyException(ErrorCodes.NULL_NAME);
		}

		if(productsDto.stream().anyMatch(p -> p.getPrice() == null || p.getPrice() == 0)) {
			throw new PorkyException(ErrorCodes.NULL_PRICE);
		}

		List<Product> products = productMapper.fromRequestDtoList(productsDto);
		products.forEach(p -> p.setRating(0)); // no tiene sentido que el admin modifique el rating
		productRepo.saveAll(products);

		return products;
	}

	@GetMapping("/{pid}")
	@ResponseBody
	public Product getProduct(@PathVariable Integer pid) throws PorkyException {
		Optional<Product> opProduct = productRepo.findById(pid);

		if(opProduct.isEmpty()) {
			throw new PorkyException(ErrorCodes.PRODUCT_NOT_FOUND);
		}

		return opProduct.get();
	}

	@GetMapping
	@ResponseBody
	public List<Product> getProducts(
		@RequestParam(name = "name", required = false) String name,
		@RequestParam(name = "category", required = false) Category category
	) throws PorkyException {
		List<Product> products = new ArrayList<>();
		boolean noFilters = true;

		if(name != null && !name.isEmpty()) {
			noFilters = false;
			products = productRepo.searchByName(name);
		}

		if(category != null) {
			noFilters = false;
			if(products.isEmpty()) {
				products = productRepo.searchByCategory(category);
			} else {
				products = products.stream().filter(p -> p.getCategory() == category).toList();
			}
		}

		if(noFilters) {
			productRepo.findAll().forEach(products::add);
		}

		return products;
	}

	@PatchMapping("/{pid}")
	@ResponseBody
	@PreAuthorize("hasRole('pc_admin')")
	public Product updateProduct(@PathVariable Integer pid, @RequestBody @Valid ProductReqDto productDto) throws PorkyException {
		Optional<Product> opProduct = productRepo.findById(pid);

		if(opProduct.isEmpty()) {
			throw new PorkyException(ErrorCodes.PRODUCT_NOT_FOUND);
		}

		Product product = opProduct.get();

		if(productDto.getName() != null && !productDto.getName().isEmpty()) {
			product.setName(productDto.getName());
		}

		if(productDto.getCategory() != null) {
			product.setCategory(productDto.getCategory());
		}

		if(productDto.getStock() != null) {
			product.setStock(productDto.getStock());
		}

		if(productDto.getPrice() != null) {
			product.setPrice(productDto.getPrice());
		}

		if(productDto.getImage() != null && !productDto.getImage().isEmpty()) {
			product.setImage(productDto.getImage());
		}

		if(productDto.getDescription() != null && !productDto.getDescription().isEmpty()) {
			product.setDescription(productDto.getDescription());
		}

		if(productDto.getMinPrevReqDays() != null) {
			product.setMinPrevReqDays(productDto.getMinPrevReqDays());
		}

		product = productRepo.save(product);
		return product;
	}

	@DeleteMapping("/{pid}")
	@ResponseBody
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('pc_admin')")
	public void deleteProduct(@PathVariable Integer pid) throws PorkyException {
		Optional<Product> opProduct = productRepo.findById(pid);

		if(opProduct.isEmpty()) {
			throw new PorkyException(ErrorCodes.PRODUCT_NOT_FOUND);
		}

		productRepo.deleteById(pid);
	}
}
