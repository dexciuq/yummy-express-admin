import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../services/Api";
import ProductForm from "../../components/product-form/ProductForm";

export default function UpdateProduct() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        data.product.price = data.product.price / 100;
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, product);
      navigate("/");
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  return (
    <ProductForm
      product={product}
      setProduct={setProduct}
      handleSubmit={handleSubmit}
      formTitle="Update Product"
      submitButtonLabel="Update Product"
    />
  );
}
