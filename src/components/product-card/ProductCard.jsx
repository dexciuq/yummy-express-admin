import { useState } from "react";
import { Text, Modal, Button, Image } from "@mantine/core";
import classes from "./ProductCard.module.css";

export default function ProductCard({ product, onGet, onEdit, onDelete }) {
  const [modalOpened, setModalOpened] = useState(false);

  const handleMenuClick = () => {
    setModalOpened(true);
    console.log(
      `Clicked for product: ${product.name}, modal opened: ${modalOpened}`
    );
  };

  const formatPrice = (price) => {
    const tenge = Math.floor(price / 100);
    const tiyn = price % 100;
    return `${tenge}.${tiyn.toString().padStart(2, "0")}₸`;
  };

  return (
    <>
      <div className={`${classes.wrapper} border border-info`}>
        <div className={classes.maininfo}>
          <div className={classes.productimage}>
            <Image
              src={product.image}
              className={classes.productimage}
              alt={name}
              fit="contain"
            />
          </div>
          {/*<img src={product.image} className={classes.productimage} alt={product.name} />*/}
          <div className={classes.maininfo2}>
            <div className={classes.nameandcategorywithbutton}>
              <div className={classes.nameandcategory}>
                <div className={classes.productname}>{product.name}</div>
                <div className={classes.productcategory}>
                  {product.category_name}
                </div>
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-secondary"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{
                    backgroundColor: "#5FCC55",
                    border: "none",
                  }}
                >
                  <i className="fa-solid fa-ellipsis" />
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div
                    className="dropdown-item"
                    style={{
                      cursor: 'default',
                    }}
                    onClick={() => onGet(product.id)}
                  >
                    Get information
                  </div>
                  <div
                    className="dropdown-item"
                    style={{
                      cursor: 'default',
                    }}
                    onClick={() => onEdit(product.id)}
                  >
                    Update
                  </div>
                  <div
                    className="dropdown-item"
                    style={{
                      cursor: 'default',
                    }}
                    onClick={() => handleMenuClick()}
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.productprice}>
              {formatPrice(product.price)}
            </div>
          </div>
        </div>
      </div>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text style={{ fontSize: "24px" }}>Delete</Text>}
        centered
      >
        <div>
          <Text>
            Are you sure you want to delete this product? Name: {product.name}
          </Text>
          <Button color="red" mt="md" onClick={() => onDelete(product.id)}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
