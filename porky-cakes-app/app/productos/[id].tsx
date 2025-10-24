import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, ScrollView,
  TouchableOpacity, ToastAndroid, TextInput } from 'react-native';
import React, { useState, useEffect  } from 'react';
import { useSelector } from 'react-redux';
import { Colors, useThemeColors } from '@/constants/theme';
import { images } from '@/constants/images';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ImageCarousel from '@/components/ui/carrusel-imgs'
import { getProduct, getProducts, deleteProduct } from '@/api/productosApi'
import HasAccess from '@/app/auth/hasAccess'
import { useHasAccess } from '@/hooks/use-has-access';
import { addCarrito } from '@/api/carritoApi';
import { postComentario, getComentariosPublicos, getComentariosPendientes, aprobarComentario } from '@/api/comentariosApi';
import { useRouter } from 'expo-router';
import logger from '@/utils/logger';

export default function ProductCard() {
  const router = useRouter();
  
  const params = useLocalSearchParams();
  const productId = params.id as string

  const [carrousel, setCarrousel] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
      name: '',
      category: '',
      stock: '',
      price: 0,
      rating: 0,
      image: '/productos/sin resultados.jpg',
      description: '',
      minPrevReqDays: '',
  });

  const [comentarios, setComentarios] = useState<any[]>([]);
  const [comentarioNuevo, setComentarioNuevo] = useState<string>("");

  const [error, setError] = useState('');
  
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const email = useSelector((state: any) => state.user.email);
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const userIsPremium = useHasAccess(["pc_customer_premium"])
  const userIsAdmin = useHasAccess(["pc_admin"])

  useEffect(() => {
    const handleUpdate = async () => {
      if(productId) {
        try {
          setFormData(await getProduct(productId));
          
          const comentarios = await getComentariosPublicos(productId)
          
          if(userIsAdmin) {
            const comentariosPendientes = await getComentariosPendientes(accessToken, productId)
            comentarios.push(...comentariosPendientes)
          }

          setComentarios(comentarios)

          if(userIsPremium || userIsAdmin) {
            const productos = await getProducts(null, null)
            setCarrousel(productos
              .sort(() => Math.random() - 0.5)
              .slice(0, 3)
              .map((p: any) => ({
                id: p.id,
                uri: p.image,
              }))
            )
          }
        } catch (err: any) {
          console.log(err.message);
          setError('Lo sentimos, ha ocurrido un error.');
          return;
        }
      }
    };

    handleUpdate();
  }, [productId]);

  const handleAnadirCarrito = async () => {
    const response = await addCarrito(
      accessToken, email, {productOrders: [{amount: 1, product: {id: productId}}]}
    )
    
    if (response.productOrders) {
      ToastAndroid.showWithGravity('Agregado al carrito!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      logger.debug("Error al agregar al carrito: ", response)
      ToastAndroid.showWithGravity('Ha ocurrido un error!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
  }

  const handleAprobarComentario = async (id: string, aprobar: boolean) => {
    aprobarComentario(accessToken, id, aprobar)

    if(aprobar) {
      ToastAndroid.showWithGravity('Comentario aprobado!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      setComentarios(comentarios.map(c => 
        c.id === id ? { ...c, approved: true } : c
      ));
    } else {
      ToastAndroid.showWithGravity('Comentario eliminado!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      setComentarios(comentarios.filter(c => c.id !== id));
    }
  }

  const handleEliminarProducto = async () => {
    const response = await deleteProduct(productId, accessToken)
    
    if(response) {
      router.replace('/(tabs)')
      ToastAndroid.showWithGravity('Producto eliminado con éxito!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      ToastAndroid.showWithGravity('Ha ocurrido un error!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
  }
  
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Image 
            source={images[formData.image as keyof typeof images]} 
            style={styles.image} 
            resizeMode="cover"
          />
          <Text style={styles.description}>Error: {error}</Text>;
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: insets.bottom+20 }}
    >
      <HasAccess allowedRoles={['pc_customer_premium', 'pc_admin']} visible={false}>
        <ImageCarousel imagenes={carrousel} />
      </HasAccess>

      <View style={styles.card}>
        <View style={{ maxHeight: 220 }}>
        <Image 
          source={images[formData.image as keyof typeof images]} 
          style={styles.image} 
          resizeMode="cover"
        />
        </View>
        <View style={styles.row}>
          <Text style={styles.stars}>
            {Array.from({ length: formData.rating }, (_, i) => (
              <IconSymbol key={`filled-${i}`} size={28} name="star-rate" color="#FFD700"/>
            ))}
            {Array.from({ length: 5 - formData.rating }, (_, i) => (
              <IconSymbol key={`empty-${i}`} size={28} name="star-border" color="#FFD700"/>
            ))}
          </Text>
          <Text style={styles.stock}>Stock: {formData.stock}</Text>
        </View>
        <Text style={styles.title}>{formData.name}</Text>
        <Text style={styles.price}>${formData.price}</Text>
        <Text style={styles.time}>Demora promedio de preparación: {formData.minPrevReqDays} días *</Text>
        <Text style={styles.sidenote}>
          * Aplica cuando no hay stock.
        </Text>
        <View style={styles.buttonRow}>
          <HasAccess allowedRoles={["pc_customer"]} visible={false}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={async () => handleAnadirCarrito()}
            >
              <Text style={styles.buttonText}>Agregar a carrito</Text>
            </TouchableOpacity>
          </HasAccess>
          <HasAccess allowedRoles={["pc_admin"]} visible={false}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push(`../(tabs)/productoForm?id=${productId}`)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={async () => {handleEliminarProducto()}}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </HasAccess>
        </View>
        <Text style={styles.description}>
          {formData.description}
        </Text>
      </View>

      <View>
        <Text style={styles.commentsTitle}>Comentarios</Text>
        
        <HasAccess
          allowedRoles={["pc_customer_premium"]}
          visible={false}
        >
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Escribe un comentario..."
              placeholderTextColor={colors.text2}
              value={comentarioNuevo}
              onChangeText={setComentarioNuevo}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                postComentario(accessToken, productId, comentarioNuevo)
                ToastAndroid.showWithGravity('Comentario pendiente de aprobación', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                setComentarioNuevo("")
              }}
            >
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </HasAccess>

        {/* Comments List */}
        {comentarios.length === 0 ? (
          <Text style={styles.noComments}>No hay comentarios aún.</Text>
        ) : (
          comentarios.map((comentario) => (
            <View key={comentario.id} style={styles.commentCard}>
              <Text style={styles.title}>{comentario.user}</Text>
              <Text style={styles.description}>{comentario.text}</Text>

              <HasAccess allowedRoles={["pc_admin"]} visible={false}>
                <View 
                  style={styles.commentActions}
                >
                  {comentario.approved ? null :
                  <TouchableOpacity 
                    onPress={() => handleAprobarComentario(comentario.id, true)}
                  >
                    <IconSymbol size={26} name="check" color={colors.tabIconDefault} />                    
                  </TouchableOpacity> 
                  }
                  <TouchableOpacity 
                    onPress={() => handleAprobarComentario(comentario.id, false)}
                  >
                    <IconSymbol size={26} name="close" color={colors.tabIconSelected} />
                  </TouchableOpacity>
                </View>
              </HasAccess>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: colors.background3,
  },
  card: {
    borderWidth: 1,
    backgroundColor: colors.background,
    borderColor: colors.background2,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    margin: 16,
  },
  image: {
    width: '100%',
    maxHeight: 220,
    borderRadius: 12,
    resizeMode: 'contain'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stars: {
    fontSize: 16,
  },
  stock: {
    fontSize: 14,
    color: colors.text2,
    paddingTop: 5
  },
  title: {
    fontWeight: 'bold',
    color: colors.text,
    fontSize: 16,
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    color: colors.text2,
    marginTop: 4,
  },
  time: {
    fontSize: 14,
    color: colors.text2,
    marginTop: 4,
  },
  sidenote: {
    fontSize: 12,
    color: colors.text2,
    fontStyle: 'italic',
    marginLeft: 5,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: colors.tabIconDefault,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: colors.tint,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text2,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addCommentContainer: {
    marginVertical: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.background2,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    backgroundColor: colors.background3,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  noComments: {
    textAlign: 'center',
    color: colors.text2,
    fontStyle: 'italic',
    marginTop: 16,
  },
  commentCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
