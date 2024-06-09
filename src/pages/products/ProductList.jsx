import { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../../services/Api.js";
import { useNavigate } from "react-router-dom";
import { Loader } from "@mantine/core";
import ProductCard from "../../components/product-card/ProductCard.jsx";
import classes from "./ProductList.module.css";

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

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        {/* <h1 className={classes.title}>Product List</h1> */}
        <button className={classes.addButton} onClick={handleAddProduct}>
          Add Product
        </button>
      </header>
      {loading ? (
        <div className={classes.loaderContainer}>
          <Loader color="#5FCC55" size="xl" />
        </div>
      ) : (
        <ul className={classes.productList}>
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
      )}
    </div>
  );
}
