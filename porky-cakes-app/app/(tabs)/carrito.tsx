import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Colors, useThemeColors } from '@/constants/theme'
import { images } from '@/constants/images';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCarrito, metodosEnvio } from '@/hooks/ui-hooks/use-carrito';
import { useHasAccess } from '@/hooks/use-has-access';
import logger from '@/utils/logger';

export default function Carrito() {
  const {
    cart,
    refreshing,
    onRefresh,
    cambiarCantidad,
    selectedME,
    setSelectedME,
    comprar
  } = useCarrito();

  const colors = useThemeColors();
  const styles = createStyles(colors);

  const userIsPremium = useHasAccess(["pc_customer_premium"])

  const subtotal = cart.productOrders?.reduce((sum: number, item: any) => sum + item.product.price * item.amount, 0) ?? 0
  const descuento = userIsPremium ? subtotal * 0.1 : 0
  const costoEnvio = selectedME?.costo ?? 0

  if(cart?.user === undefined || cart?.productOrders?.length === 0 || cart?.productOrders?.every((order: any) => order.amount === 0)) {
    return (
    <View style={styles.container}>
      <ScrollView 
        style={{ alignSelf: 'center', margin: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.heading}>Tu Carrito esta vacío</Text>
        <Image
          source={images['/productos/sin resultados.jpg']}
        />
      </ScrollView>
    </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tu Carrito</Text>

      <FlatList
        data={cart.productOrders}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          item.amount === 0 ? null :
          <View style={styles.productCard}>
            <Image
              source={images[item.product.image as keyof typeof images]}
              style={styles.productImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.text}>Precio: ${item.product.price}</Text>
              <Text style={styles.text}>Total: ${item.product.price * item.amount}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => item.amount > 1 ? cambiarCantidad(item.id, item.amount-1) : null}
                >
                  <Text style={styles.qtyButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtyText}>{item.amount}</Text>

                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => cambiarCantidad(item.id, item.amount+1)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={{ paddingHorizontal: 10 }} 
              onPress={() => cambiarCantidad(item.id, 0)}
            >
              <IconSymbol size={24} name="delete" color={colors.tabIconSelected} />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.subheading}>Seleccione el método de envío</Text>

        <View style={styles.shippingMethods}>
          {metodosEnvio.map(mEnvio => (
            <TouchableOpacity
              key={mEnvio.nombre}
              style={[
                styles.shippingButton,
                selectedME === mEnvio && { backgroundColor: colors.background2 },
              ]}
              onPress={() => {
                setSelectedME(selectedME === mEnvio ?  null : mEnvio)
                logger.debug("selectedME", selectedME)
              }}
            >
              <Text style={styles.text}>{mEnvio.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.heading}>
          Total: ${subtotal-descuento+costoEnvio}
        </Text>
        <Text style={styles.sidenote}>
          Subtotal: ${subtotal}
        </Text>
        {userIsPremium ? 
          <Text style={styles.sidenote}>Por ser premium, tiene -10%! (-${descuento})</Text>
          : null
        }
        <Text style={styles.sidenote}>
          {selectedME ? `Costo de envío: $${selectedME.costo}` : ""}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.buyButton}
        onPress={() => {comprar()}}
      >
        <Text style={styles.buyButtonText}>Comprar</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },

  heading: {
    fontSize: 22,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginVertical: 2,
  },
  sidenote: {
    fontSize: 12,
    color: colors.text2,
    fontStyle: 'italic',
  },

  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.background2,
    padding: 8,
    marginBottom: 8,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '30%',
    maxWidth: 120,
    maxHeight: 100,
    resizeMode: 'contain',
    borderRadius: 10,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.background2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: 'bold',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: colors.text,
  },

  shippingMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  shippingButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.background2,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: colors.tabIconDefault,
    width: '35%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
    alignItems: 'center'
  },
  buyButtonText: {
    fontWeight: 'bold',
    color: colors.text,
    fontSize: 16,
  },
});

