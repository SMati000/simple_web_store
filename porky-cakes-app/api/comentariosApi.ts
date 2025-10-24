import Constants from 'expo-constants';
import logger from '@/utils/logger';

export const postComentario = async (token: string, productId: string, comentario: string) => {
  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/comments`

  const response = await fetch(endpoint,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: productId,
        text: comentario
      })
    }
  );

  logger.info(`Request a API: POST ${endpoint} - HTTP Status: `, response.status)

  if (response.status < 200 || response.status >= 300) {
    logger.error('Ha ocurrido un error ', response);
    return null;
  }

  return response.json();
}

export const getComentariosPublicos = async (productId: string) => {
  return getComentarios(null, productId, true)
}

export const getComentariosPendientes = async (token: string, productId: string) => {
  return getComentarios(token, productId, false)
}

const getComentarios = async (token: string|null, productId: string, approved: boolean) => {
  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/comments?productId=${productId}&approved=${approved}`
  
  const headers: Record<string, string> = {'Content-Type': 'application/json'}
  
  if(token) {
    headers.Authorization = `Bearer ${token}` 
  }

  const response = await fetch(endpoint,
    {
      method: "GET",
      headers: headers
    }
  );

  logger.info(`Request a API: GET ${endpoint} - HTTP Status: `, response.status)

  if (!response.ok) {
    logger.error('Ha ocurrido un error ', response);
    return null;
  }

  return response.json();
};

export const aprobarComentario = async (token: string, idComment: string, aprobado: boolean) => {
  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/comments/${idComment}?approve=${aprobado}`
  const response = await fetch(endpoint,
    {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );

  logger.info(`Request a API: PATCH ${endpoint} - HTTP Status: `, response.status)

  if (!response.ok) {
    logger.error('Ha ocurrido un error ', response);
    return null;
  }

  return {};
};
