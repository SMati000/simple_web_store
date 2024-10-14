package uni.progweb.porkycakes.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import uni.progweb.porkycakes.model.Cart;
import uni.progweb.porkycakes.model.OrderByProduct;
import java.util.Optional;

public interface CartRepo extends CrudRepository<Cart, String> {
	@Query("SELECT po FROM Cart c JOIN c.productOrders po WHERE c.user = :userId AND po.product.id = :productId")
	Optional<OrderByProduct> getOrderFromCart(String userId, Integer productId);
}