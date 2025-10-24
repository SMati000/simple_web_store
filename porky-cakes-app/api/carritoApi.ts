import Constants from 'expo-constants';
import logger from '@/utils/logger';

export const getCarrito = async (email: string, token: string) => {
  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/cart/${email}`
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  logger.info(`Request a API: GET ${endpoint} - HTTP Status: `, response.status)

  if (!response.ok) {
    if(response.status === 404) {
      logger.error('Carrito no encontrado');
    } else if(response.status === 401 || response.status === 403) {
      logger.error('Permiso denegado');
      logger.debug('Token: ', token)
    } else {
      logger.error('Ha ocurrido un error ', response);
    }

    return {};
  }

  return response.json();
};

export const patchCarrito = async (token: string, email: string, orders: any) => {
  return AddorPatchCarrito(token, email, orders, false)
}

export const addCarrito = async (token: string, email: string, orders: any) => {
  return AddorPatchCarrito(token, email, orders, true)
}

const AddorPatchCarrito = async (token: string, email: string, orders: any, relative: boolean) => {
  const requestBody = orders.productOrders?.map((order: any) => ({
    productId: order.product.id,
    amount: order.amount,
  }));

  if(requestBody === undefined || requestBody.length === 0) {
    return;
  }

  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/cart/${email}?relative=${relative}`
  const response = await fetch(endpoint, 
      {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
      }
  );
  
  logger.info(`Request a API: PATCH ${endpoint} - HTTP Status: `, response.status)

  if (response.status < 200 || response.status >= 300) {
    logger.error('Ha ocurrido un error ', response);
    return {};
  }

  return response.json()
};

export const vaciarCarrito = async (token: string, email: string) => {
  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/cart/${email}`
  const response = await fetch(endpoint, 
      {
          method: "DELETE",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
  );

  logger.info(`Request a API: DELETE ${endpoint} - HTTP Status: `, response.status)
  
  if (response.status < 200 || response.status >= 300) {
      logger.error('Ha ocurrido un error ', response);
  }
};
