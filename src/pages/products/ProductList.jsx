import { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../../services/Api.js";
import { useNavigate } from "react-router-dom";
import { Loader } from "@mantine/core";
import ProductCard from "../../components/product-card/ProductCard.jsx";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleGet = (id) => {
    navigate(`/products/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/update-product/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await deleteProduct(id);
    console.log(response.message);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      console.log("Fetched products:", data.products);
      if (data && data.products) {
        setProducts(data.products);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader color="#5FCC55" size="xl" />;
  }

  return (
    <div>
      <h1>Product List</h1>
      <button className="bg-success text-white" onClick={handleAddProduct}>
        Add Product
      </button>
      <ul style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onGet={handleGet}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
