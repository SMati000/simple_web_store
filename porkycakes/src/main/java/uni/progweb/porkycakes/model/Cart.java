package uni.progweb.porkycakes.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
public class Cart {
	@Id
	private String user;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<OrderByProduct> productOrders;

	public void addProductOrder(OrderByProduct productOrder) {
		productOrders.add(productOrder);
	}

	public void removeProductOrder(Integer productOrderId) {
		productOrders.removeIf(o -> o.getId().equals(productOrderId));
	}
}
