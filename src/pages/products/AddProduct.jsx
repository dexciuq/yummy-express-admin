import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/Api";
import ProductForm from "../../components/product-form/ProductForm";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category_id: 0,
    upc: "",
    discount_id: 0,
    quantity: 0,
    unit_id: 0,
    image: "",
    brand_id: 0,
    country_id: 0,
    step: 0.0,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(product);
      navigate("/products");
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  return (
    <ProductForm
      product={product}
      setProduct={setProduct}
      handleSubmit={handleSubmit}
      formTitle="Add Product"
      submitButtonLabel="Add Product"
    />
  );
}
