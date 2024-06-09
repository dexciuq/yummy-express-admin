import { useState, useEffect, useRef } from "react";
import {
  getBrands,
  getCategories,
  getCountries,
  getDiscounts,
  getUnits,
} from "../../services/Api";

export default function ProductForm({
  product,
  setProduct,
  handleSubmit,
  formTitle,
  submitButtonLabel,
}) {
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);

  const priceRef = useRef(null);
  const quantityRef = useRef(null);
  const stepRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.categories);

        const discountsResponse = await getDiscounts();
        setDiscounts(discountsResponse.discounts);

        const unitsResponse = await getUnits();
        setUnits(unitsResponse.units);

        const brandsResponse = await getBrands();
        setBrands(brandsResponse.brands);

        const countriesResponse = await getCountries();
        setCountries(countriesResponse.countries);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
    };

    const priceInput = priceRef.current;
    const quantityInput = quantityRef.current;
    const stepInput = stepRef.current;

    if (priceInput && quantityInput && stepInput) {
      priceInput.addEventListener("wheel", handleWheel, { passive: false });
      quantityInput.addEventListener("wheel", handleWheel, { passive: false });
      stepInput.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (priceInput && quantityInput && stepInput) {
        priceInput.removeEventListener("wheel", handleWheel);
        quantityInput.removeEventListener("wheel", handleWheel);
        stepInput.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === "number" || type === "select-one" ? parseInt(value, 10) : value;
    const updatedStep =
      name === "step" && value !== "" ? parseFloat(value) : value;
    setProduct({
      ...product,
      [name]: name === "step" ? updatedStep : updatedValue,
    });
  };

  const isFormValid = () => {
    return (
      product.category_id !== "" &&
      product.discount_id !== "" &&
      product.unit_id !== "" &&
      product.brand_id !== "" &&
      product.country_id !== ""
    );
  };

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      handleSubmit(e);
    } else {
      alert("Please select values for all dropdowns before submitting.");
    }
  };

  return (
    <div style={{marginBottom: "50px"}} className="container">
      <h1 className="myH1">{formTitle}</h1>
      <form onSubmit={handleSubmitWithValidation}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={product.name}
            autoComplete="off"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            min={0}
            onChange={handleChange}
            ref={priceRef}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            className="form-control"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            name="category_id"
            className="form-control"
            value={product.category_id}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>UPC:</label>
          <input
            type="text"
            name="upc"
            className="form-control"
            value={product.upc}
            autoComplete="off"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Discount:</label>
          <select
            name="discount_id"
            className="form-control"
            value={product.discount_id}
            onChange={handleChange}
          >
            <option value="">Select Discount</option>
            {discounts.map((discount) => (
              <option key={discount.id} value={discount.id}>
                {discount.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            value={product.quantity}
            onChange={handleChange}
            ref={quantityRef}
            required
          />
        </div>
        <div className="form-group">
          <label>Unit:</label>
          <select
            name="unit_id"
            className="form-control"
            value={product.unit_id}
            onChange={handleChange}
          >
            <option value="">Select Unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input
            type="text"
            name="image"
            className="form-control"
            value={product.image}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Brand:</label>
          <select
            name="brand_id"
            className="form-control"
            value={product.brand_id}
            onChange={handleChange}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Country:</label>
          <select
            name="country_id"
            className="form-control"
            value={product.country_id}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Step:</label>
          <input
            type="number"
            step="0.01"
            name="step"
            min="0"
            className="form-control"
            value={product.step}
            onChange={handleChange}
            ref={stepRef}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary myButton"
          style={{
            backgroundColor: "#5FCC55",
            border: "none",
          }}
        >
          {submitButtonLabel}
        </button>
      </form>
    </div>
  );
}
