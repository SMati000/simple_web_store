import { useState, useEffect } from "react";
import { TextInput, Text, StyleSheet, ScrollView, TouchableOpacity, View, ToastAndroid } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { getProduct, postPatchProduct } from '@/api/productosApi'
import { categorias } from '@/constants/otras';
import { Colors, useThemeColors } from '@/constants/theme'
import * as ImagePicker from 'expo-image-picker'
import logger from "@/utils/logger";

export default function ProductoForm() {
  const router = useRouter();
  
  const accessToken = useSelector((state: any) => state.user.accessToken);
    
  const params = useLocalSearchParams();
  var productIdTemp = params.id as string | null

  const [productId, setProductId] = useState<string|null>(productIdTemp)
  const [local, setLocal] = useState({
    name: "", category: "", price: 0,
    description: "", stock: 0, rating: 0,
    image: "", minPrevReqDays: 0,
  });

  useEffect(() => {
    const fetchProducto = async (id: string) => {
      const data = await getProduct(id)
      setLocal(data);
    }

    if (productId) {
      fetchProducto(productId)
    }
  }, [productId]);

  const pickImage = async () => {
    // pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      logger.debug("Permisos para enviar notificationes: ", status)
      return;
    }

    // abrir selector
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const filename = result.assets[0].fileName
      setLocal({ ...local, image: filename ? `/productos/${filename}` : "" });
    }
  };

  const handleSubmit = async () => {
    logger.debug("producto: ", local)
    logger.debug("id producto: ", productId)

    if(!local.name) {
      ToastAndroid.showWithGravity('El producto debe tener un nombre', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      return;
    }

    if(!local.category) {
      ToastAndroid.showWithGravity('Debe seleccionar una categoría', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      return;
    }

    const result = await postPatchProduct(accessToken, local, productId)
    
    if(result) {
      setProductId(null)
      setLocal({
        name: "", category: "", price: 0,
        description: "", stock: 0, rating: 0,
        image: "", minPrevReqDays: 0,
      })
      router.replace('/(tabs)')
    } else {
      ToastAndroid.showWithGravity('Lo sentimos, ha habido un error', ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }
  };
  
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nombre del Producto</Text>
      <TextInput
        value={local.name}
        onChangeText={(t) => setLocal({ ...local, name: t })}
        style={styles.input}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.categories}>
      {categorias.map(cat => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.categoryButton,
            local.category.toLowerCase() === cat.toLowerCase() && styles.categoryButtonSelected
          ]}
          onPress={() => setLocal({ ...local, category: cat.toUpperCase() })}
        >
          <Text style={{color: colors.text}}>{cat}</Text>
        </TouchableOpacity>
      ))}
      </View>

      <Text style={styles.label}>Precio</Text>
      <TextInput
        value={String(local.price)}
        onChangeText={(t) => setLocal({ ...local, price: Number(t) })}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        value={local.description}
        onChangeText={(t) => setLocal({ ...local, description: t })}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <View>
        <Text style={styles.label}>Imagen</Text>
        
        {local.image && (
          <Text style={styles.sidenote}>{local.image}</Text>
        )}

        <TouchableOpacity
          style={styles.botonImg}
          onPress={pickImage}
        >
          <Text style={styles.botonTexto}>Elegir Imagen</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Stock</Text>
      <TextInput
        value={String(local.stock)}
        onChangeText={(t) => setLocal({ ...local, stock: Number(t) })}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Demora promedio (días)</Text>
      <TextInput
        value={String(local.minPrevReqDays)}
        onChangeText={(t) => setLocal({ ...local, minPrevReqDays: Number(t) })}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity 
        style={styles.botonGuardar}
        onPress={handleSubmit}
      >
        <Text style={styles.botonTexto}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
    gap: 12,
  },
  label: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.background2,
    borderRadius: 6,
    padding: 8,
    color: colors.text,
  },
  textArea: {
    color: colors.text,
    height: 100,
    textAlignVertical: "top",
  },
  categories: { flexDirection: 'row', marginBottom: 12 },
  categoryButton: {
    backgroundColor: colors.background,
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
  sidenote: {
    fontSize: 12,
    color: colors.text2,
    fontStyle: 'italic',
  },
  botonImg: {
    backgroundColor: colors.background3,
    borderWidth: 0.3,
    borderColor: colors.text,
    width: '100%',
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: 'center',
    alignItems: 'center'
  },
  botonGuardar: {
    backgroundColor: colors.tabIconDefault,
    width: '35%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center'
  },
  botonTexto: {
    fontWeight: 'bold',
    color: colors.text,
    fontSize: 16,
  },
});
