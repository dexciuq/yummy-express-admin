const BASE_URL = 'http://46.101.154.239:8080/v1';

export const loginUser = async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        console.log(response)
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error(error);
    }
    return response.json();
};

export const logoutUser = async () => {
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('Access token is missing');
    }
    const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('Refresh token is missing');
    }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
};

export const getUserInfo = async () => {
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('Access token is missing');
    }
    const response = await fetch(`${BASE_URL}/profile/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
  };

const fetchWithAccessToken = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('Access token is missing');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }

    return response.json();
};

export const getProducts = async (params = {}) => {
    const url = new URL(`${BASE_URL}/products`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const response = await fetch(url.toString());
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getProduct = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const addProduct = async (product) => {
    product.price = product.price * 100;
    const response = await fetchWithAccessToken(`${BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const updateProduct = (id, product) => {
    product.price = product.price * 100;
    return fetchWithAccessToken(`${BASE_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    })
        .then(response => {
            console.log("Updating response", response)
            console.log("text", response.text)
            console.log("json", response.json)
            if (!response.ok) {
                console.log("Response is not ok")
                console.log("Not ok response", response)
                return response.text().then(error => {
                    console.error("Error response:", error);
                    throw new Error("Something went wrong");
                });
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error updating product in apijs", error);
            throw error;
        });
};


export const deleteProduct = async (id) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getOrders = async () => {
    const url = `${BASE_URL}/orders`;
    const response = await fetch(url);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getOrder = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/orders/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order');
        }
        return await response.json();
    } catch (error) {
        throw new Error('Error fetching order:', error);
    }
};

export async function updateOrder(orderId, orderData) {
    try {
        const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to update order');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateOrderItem = async (itemId, data) => {
    console.log(itemId, data)
    console.log(JSON.stringify(data))
    const response = await fetch(`${BASE_URL}/order-items/${itemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorMessage = `Failed to update order item with id ${itemId}`;
        throw new Error(errorMessage);
    }

    return await response.json();
};

export async function getStatuses() {
    try {
        const response = await fetch(`${BASE_URL}/statuses`);
        if (!response.ok) {
            throw new Error('Failed to fetch statuses');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getCategories = async () => {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getCategory = async (id) => {
    const response = await fetch(`${BASE_URL}/categories/${id}`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const addCategory = async (category) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const updateCategory = async (id, category) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const deleteCategory = async (id) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/categories/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getDiscounts = async () => {
    const response = await fetch(`${BASE_URL}/discounts`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getDiscount = async (id) => {
    const response = await fetch(`${BASE_URL}/discounts/${id}`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const addDiscount = async (discount) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/discounts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discount),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const updateDiscount = async (id, discount) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/discounts/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discount),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const deleteDiscount = async (id) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/discounts/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getUnits = async () => {
    const response = await fetch(`${BASE_URL}/units`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getUnit = async (id) => {
    const response = await fetch(`${BASE_URL}/units/${id}`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const addUnit = async (unit) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/units`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unit),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const updateUnit = async (id, unit) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/units/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unit),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const deleteUnit = async (id) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/units/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getBrands = async () => {
    const response = await fetch(`${BASE_URL}/brands`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getBrand = async (id) => {
    const response = await fetch(`${BASE_URL}/brands/${id}`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const addBrand = async (brand) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/brands`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(brand),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const updateBrand = async (id, brand) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/brands/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(brand),
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const deleteBrand = async (id) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/brands/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getCountries = async () => {
    const response = await fetch(`${BASE_URL}/countries`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

export const getCountry = async (id) => {
    const response = await fetch(`${BASE_URL}/countries/${id}`);
    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }
    return response.json();
};

const addCountry = async (country) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/countries`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(country),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }

    return response.json();
};

export const updateCountry = async (id, country) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/countries/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(country),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }

    return response.json();
};

export const deleteCountry = async (id) => {
    const response = await fetchWithAccessToken(`${BASE_URL}/countries/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Something went wrong");
    }

    return response.json();
};