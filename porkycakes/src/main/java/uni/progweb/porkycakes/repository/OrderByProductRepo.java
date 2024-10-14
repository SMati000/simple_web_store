package uni.progweb.porkycakes.repository;

import org.springframework.data.repository.CrudRepository;
import uni.progweb.porkycakes.model.OrderByProduct;

public interface OrderByProductRepo extends CrudRepository<OrderByProduct, Integer> {}