package uni.progweb.porkycakes.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import uni.progweb.porkycakes.model.Category;
import uni.progweb.porkycakes.model.Product;
import java.util.List;

public interface ProductRepo extends CrudRepository<Product, Integer> {
	@Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
	List<Product> searchByName(@Param("name") String name);

	@Query("SELECT p FROM Product p WHERE p.category = :category")
	List<Product> searchByCategory(@Param("category") Category category);
}
