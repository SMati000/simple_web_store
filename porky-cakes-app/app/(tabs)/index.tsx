import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Image, 
  TouchableOpacity, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Colors, useThemeColors } from '@/constants/theme'
import { images } from '@/constants/images';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '@/api/productosApi'
import logger from '@/utils/logger';
import { sumarProductosVisitados } from '@/redux/userSlice';
import { enviarNotification } from '@/utils/notifications';
import { categorias } from '@/constants/otras';

export default function ProductTab() {
  const router = useRouter();
  const dispatch = useDispatch();

  const username = useSelector((state: any) => state.user.username)
  const productosVisitados = useSelector((state: any) => state.user.productosVisitados)

  const [products, setProducts] = useState<any[]>([]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null);
      try {
        const data = await getProducts(search, selectedCategory);
        setProducts(data);

        logger.debug("search: ", search)
        logger.debug("selectedCategory: ", selectedCategory)
      } catch (err: any) {
        setError(err.message || 'Error fetching products');
      }
    };

    fetchProducts();
  }, [search, selectedCategory]);

  const onRefresh = useCallback(async () => { // permite al usuario refrescar
    setRefreshing(true);

    const data = await getProducts(search, selectedCategory);
    setProducts(data);
    setSelectedCategory(null)

    setRefreshing(false);
  }, []);

  const handleAbrirProducto = (id: string) => {
    router.push(`../productos/${id}`)

    if(!username) {
      dispatch(sumarProductosVisitados())
    }
  }

  useEffect(() => {
    const notificar = async () => {
      await enviarNotification("Te gusta lo que ves? Registrate!")
      logger.debug("Notification local enviada")
    }

    logger.debug("Productos visitados: ", productosVisitados)
    if(productosVisitados > 0 && productosVisitados%4 === 0) {
      notificar()
    }
  }, [productosVisitados]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      { username ?
        <Text style={styles.welcomeText}>Bienvenido, {username}!</Text> :
        <Text style={styles.welcomeText}>Bienvenido a Porky Cakes!</Text> }

      <TextInput
        placeholder="Buscar"
        placeholderTextColor={colors.text2}
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      <View style={styles.categories}>
        {categorias.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonSelected
            ]}
            onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            <Text style={{color: colors.text}}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text>Error: {error}</Text>}

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Pressable style={({ pressed }) => [
            styles.productCard,
            pressed && styles.productCardPressed
          ]} onPress={() => handleAbrirProducto(item.id)}>
            <Image source={images[item.image as keyof typeof images]} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <Text>
                {Array.from({ length: item.rating }, (_, i) => (
                  <IconSymbol key={`filled-${i}`} size={28} name="star-rate" color="#FFD700"/>
                ))}
                {Array.from({ length: 5 - item.rating }, (_, i) => (
                  <IconSymbol key={`empty-${i}`} size={28} name="star-border" color="#FFD700"/>
                ))}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  welcomeText: { fontSize: 18, color: colors.text, fontWeight: 'bold', marginBottom: 10 },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.background2,
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  categories: { flexDirection: 'row', marginBottom: 12 },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.background2,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: colors.background2,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: colors.background,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 0.3,
    borderColor: colors.background2,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  productCardPressed: {
    backgroundColor: colors.background3,
  },
  productImage: { width: '30%', maxWidth: 120, maxHeight: 100, borderRadius: 12, marginRight: 12 },
  productInfo: { flex: 1 },
  productTitle: { fontSize: 16, color: colors.text, fontWeight: 'bold' },
  productPrice: { fontSize: 14, color: colors.text, marginVertical: 4 },
});
