import Constants from 'expo-constants';
import logger from '@/utils/logger';

export const getProducts = async (searchTerm: string | null, dropdownValue: string | null) => {
  const params = new URLSearchParams();
  if (searchTerm) params.append('name', searchTerm);
  if (dropdownValue) params.append('category', dropdownValue);

  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/products?${params.toString()}`
  const response = await fetch(endpoint);
  
  logger.info(`Request a API: GET ${endpoint} - HTTP Status: `, response.status)
  
  if (!response.ok) {
    logger.error('Ha ocurrido un error ', response);
  }
  return response.json();
};

export const getProduct = async (productId: string) => {
    const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/products/${productId}`
    const response = await fetch(endpoint);

    logger.info(`Request a API: GET ${endpoint} - HTTP Status: `, response.status)

    if (!response.ok) {
      logger.error('Ha ocurrido un error ', response);
    }

    return response.json();
};

export const postPatchProduct = async (token: string, product: any, productId: string | null) => {
  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/products${productId ? `/${productId}` : ''}`
  
  const method = productId ? "PATCH" : "POST"
  const response = await fetch(endpoint, 
    {
      method: method,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productId ? product : [product])
    }
  );
  
  logger.info(`Request a API: ${method} ${endpoint} - HTTP Status: `, response.status)
  
  if (response.status < 200 || response.status >= 300) {
    logger.error('Ha ocurrido un error ', response);
    return null;
  }

  return response.json();
}

export const deleteProduct = async (productId: string, token: string) => {
  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/products/${productId}`
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
    return null
  }

  return {}
}
