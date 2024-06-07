import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { deleteProduct } from "../../services/Api";

export default function DeleteProduct() {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const deleteProd = async () => {
      try {
        await deleteProduct(id);
        history.push("/"); // Redirect to product list or other page after deletion
      } catch (error) {
        console.error("Error deleting product", error);
      }
    };

    deleteProd();
  }, [id, history]);

  return (
    <div>
      <h1>Deleting Product...</h1>
    </div>
  );
}
