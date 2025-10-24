import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppState, ToastAndroid } from 'react-native';
import { getCarrito, patchCarrito, vaciarCarrito } from '@/api/carritoApi';
import { useSelector } from 'react-redux';
import * as LocalAuthentication from 'expo-local-authentication';
import logger from '@/utils/logger';

interface tipoEnvio {
  nombre: string,
  costo: number
}

export const metodosEnvio: tipoEnvio[] = [
  {nombre: 'Estandar', costo: 500}, 
  {nombre: 'Express', costo: 1000}
];

export const useCarrito = () => {
  const email = useSelector((state: any) => state.user.email);
  const accessToken = useSelector((state: any) => state.user.accessToken);

  const [cart, setCart] = useState<any>({});
  const cartRef = useRef({ current: cart, dirty: false });

  const [selectedME, setSelectedME] = useState<tipoEnvio | null>(null);

  const appState = useRef(AppState.currentState);

  const [refreshing, setRefreshing] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      if(!accessToken) { return; }
      const fetchedCart = await getCarrito(email, accessToken);
      setCart(fetchedCart);
      logger.debug("carrito: ", fetchedCart)
    } catch (err: any) {
      console.log(err.message);
    }
  }, [email, accessToken]);

  const onRefresh = useCallback(async () => { // permite al usuario refrescar
    setRefreshing(true);

    logger.debug("Dirty cart: ", cartRef.current.dirty)

    await guardarCarrito()
    await fetchCart();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      logger.debug("current appState: ", appState.current)
      logger.debug("next appState: ", nextAppState)

      if (nextAppState !== 'active') { // guardar si el usuario sale/minimiza la app
        guardarCarrito();
      } else if (nextAppState === 'active') { // refrescar si el usuario vuelve a la app en esta view
        fetchCart();
      }
    });

    return () => subscription.remove();
  }, [appState, email, accessToken]);

  useFocusEffect( // guardar el carrito cuando el usuario navega a otra view
    useCallback(() => {
      fetchCart();

      return () => {
        logger.debug("Return on useFocusEffect")
        guardarCarrito();
      };
    }, [email, accessToken])
  );

  useEffect(() => {
    cartRef.current = { // guardar el carrito sin afectar el valor de 'dirty'
      ...cartRef.current,
      ...cart,
    };
    
    logger.debug("carrito: ", cart)
  }, [cart]);

  const cambiarCantidad = (orderId: string, newQuantity: number) => {
    setCart((prevCart: any) => ({
      ...prevCart,
      productOrders: prevCart.productOrders.map((item: any) => {
        if (item.id === orderId) {
          return { ...item, amount: newQuantity };
        }
        return item;
      }),
    }));

    cartRef.current.dirty = true; // cambios en la app no persistidos
  };

  const guardarCarrito = useCallback(async () => {
    if (cartRef.current.dirty) {
      await patchCarrito(accessToken, email, cartRef.current);
      cartRef.current.dirty = false;
    }
  }, [email, accessToken])

  const comprar = useCallback(async () => {
    logger.debug("selectedME: ", selectedME)

    if(!selectedME) {
      ToastAndroid.showWithGravity('Debe seleccionar un método de envío', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      return;
    }

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autorice su compra",
      disableDeviceFallback: false, // permite usar PIN si no hay biometría
      fallbackLabel: "Use su PIN/Patrón",
    });

    if (auth.success) {
      logger.debug("Autorizacion compra exitosa")
    } else {
      logger.debug("Autorizacion compra fallida")
      return;
    }

    vaciarCarrito(accessToken, email);
    setCart({'user': email, 'productOrders': []});
    setSelectedME(null)
    ToastAndroid.showWithGravity('Compra realizada con éxito!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  }, [email, accessToken, selectedME]);

  return {
    cart,
    refreshing,
    onRefresh,
    cambiarCantidad,
    selectedME,
    setSelectedME,
    comprar
  };
}
