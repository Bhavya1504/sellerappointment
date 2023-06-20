document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const productNameInput = document.getElementById('productNameInput');
    const priceInput = document.getElementById('priceInput');
    const categorySelect = document.getElementById('categorySelect');
    const productList = document.getElementById('productList');
  
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const productName = productNameInput.value;
      const price = priceInput.value;
      const category = categorySelect.value;
  
      const product = {
        productName,
        price,
        category,
      };
  
      // Save to local storage
      let products = JSON.parse(localStorage.getItem('products')) || [];
      products.push(product);
      localStorage.setItem('products', JSON.stringify(products));
  
      // Save to MySQL database
      fetch('/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
        .then((response) => response.json())
        .then((data) => {
          // Refresh the product list
          displayProducts();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  
      // Clear the form inputs
      productNameInput.value = '';
      priceInput.value = '';
      categorySelect.value = '';
    });
  
    function displayProducts() {
      // Clear the product list
      productList.innerHTML = '';
  
      // Retrieve products from local storage
      let products = JSON.parse(localStorage.getItem('products')) || [];
  
      // Retrieve products from MySQL database
      fetch('/products')
        .then((response) => response.json())
        .then((data) => {
          products = data;
          localStorage.setItem('products', JSON.stringify(products));
  
          // Display products
          products.forEach((product) => {
            const productItem = document.createElement('div');
            productItem.id = `product-${product.id}`; // Set an ID for each product item
            productItem.innerHTML = `
              <p><strong>Name:</strong> ${product.productName}</p>
              <p><strong>Price:</strong> $${product.price}</p>
              <p><strong>Category:</strong> ${product.category}</p>
              <button onclick="updateProduct(${product.id})">Update</button>
              <button onclick="deleteProduct(${product.id})">Delete</button>
            `;
            productList.appendChild(productItem);
          });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  
    function deleteProduct(productId) {
      // Send a DELETE request to the server
      fetch(`/products/${productId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            // Delete the product from local storage
            const products = JSON.parse(localStorage.getItem('products'));
            const updatedProducts = products.filter((product) => product.id !== productId);
            localStorage.setItem('products', JSON.stringify(updatedProducts));
  
            // Remove the deleted product from the DOM
            const productElement = document.getElementById(`product-${productId}`);
            productElement.remove();
          }
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    }
  
    // Initial display of products
    displayProducts();
  });
  