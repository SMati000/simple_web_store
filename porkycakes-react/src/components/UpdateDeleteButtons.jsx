import React from 'react';

import { useSelector } from "react-redux";

import { Button } from 'react-bootstrap';

import HasAccess from "./HasAccess";

const deleteProduct = async (productId, token) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, 
      {
          method: "DELETE",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
  );
  
  if (response.status < 200 || response.status >= 300) {
      throw new Error('Ha ocurrido un error');
  }
}

const UpdateDeleteButtons = ({productId}) => {
  const accessToken = useSelector((state) => state.user.accessToken);

  const handleDelete = async (e) => {
    try {
      await deleteProduct(productId, accessToken);
    } catch (err) {
      console.log(err.message);
      return;
    }

    window.location.reload();
  }

  return <HasAccess allowedRoles={['pc_admin']} visible={false}>
    <div>
      <Button variant="primary" className="btn-sm" href={`/upload?product_id=${productId}`}>
          Editar
      </Button>
      <Button variant="danger" className="btn-sm ms-1" onClick={handleDelete}>
          Eliminar
      </Button>
    </div>  
  </HasAccess>
}

export default UpdateDeleteButtons;