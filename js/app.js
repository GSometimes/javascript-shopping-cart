// select elements

const products = document.querySelector('.products');
const cartItems = document.querySelector('.cart-items');
const subtotal = document.querySelector('.subtotal');
const productNode = document.getElementById('product');
const priceNode = document.getElementById('price');
const descriptionNode = document.getElementById('description');
const form = document.querySelector('#form');

// const totalItemsInCart = document.querySelector('.total-items-in-cart');
// render products on page
let storeProducts = JSON.parse(localStorage.getItem('INVENTORY')) || [];
let cart = JSON.parse(localStorage.getItem('CART')) || [];

function renderProducts() {
  products.innerHTML = '';
  storeProducts.length > 0 &&
    storeProducts.forEach((product) => {
      products.innerHTML += `
        <div class="item">
            <div class="item-container">
                <div class="desc">
                    <h2>${product.product}</h2>
                    <h2><small>$</small>${product.price}</h2>
                    <p>${product.description}</p>
                </div>
            </div>
            <div class="add-remove-product">
              <div class="add-to-cart" onclick="addToCart(${product.id})">+ Add to Cart + </div>
              <div class="remove-from-list" onclick="removeProduct(${product.id})">  - Delete -</div>
            </div>

        </div>
        `;
    });
}

renderProducts();

// cart array

// let cart = [];
updateCart();

// add to cart

function addToCart(id) {
  // check if product already exists in cart
  if (cart.some((item) => item.id === id)) {
    changeNumberOfUnits('plus', id);
  } else {
    const item = storeProducts.find((product) => product.id === id);
    console.log('item', item); // test

    cart.push({
      ...item,
      numberOfUnits: 1,
    });
    console.log('cart', cart); // test
  }
  updateCart();
}

// update cart

function updateCart() {
  // console.log('cart was updated'); // test

  renderCartItems();
  renderSubTotal();

  // save cart to local storage
  localStorage.setItem('CART', JSON.stringify(cart));
}

// calculate and render subtotal

function renderSubTotal() {
  let totalPrice = 0;
  let totalItems = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItems += item.numberOfUnits;
  });

  subtotal.innerHTML = `Subtotal (${totalItems} items): $${totalPrice.toFixed(
    2
  )}`;
  //   console.log("total items count", totalItems, totalItemsInCart);
  // totalItemsInCart.innerHTML = totalItems;
}

// remove item from cart
function removeItemFromCart(id) {
  cart = cart.filter((item) => {
    return item.id !== id;
  });

  updateCart();
}

// remove item from product array
function removeProduct(id) {
  storeProducts = storeProducts.filter((product) => {
    return product.id !== id;
  });

  renderProducts();
}

// render cart item

function renderCartItems() {
  cartItems.innerHTML = ''; // clear cart element
  cart.forEach((item) => {
    cartItems.innerHTML += `
        <div class="cart-item">
            <div class="desc" onclick="removeItemFromCart(${item.id})">
                <h4>${item.product}</h4>
                <div class="unit-price">
                  <small>$</small>${item.price}
                </div>
            </div>
            <div class="units">
              <div class="btn-wrapper">
                <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})">-</div>
                <div class="number">${item.numberOfUnits}</div>
                <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>
                </div>
                <div class="remove-from-cart" onclick="removeItemFromCart(${item.id})">- Delete -</div>
            </div>
        </div>
        `;
  });
}

// change number of units for an item

function changeNumberOfUnits(action, id) {
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;

    if (item.id === id) {
      // if (action === 'minus' && numberOfUnits === 1) {
      //   // remove product
      //   // delete cartItems.item;
      //   removeItemFromCart(item.id);
      // }
      if (action === 'minus' && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === 'plus') {
        numberOfUnits++;
      }
    }
    return {
      ...item,
      numberOfUnits,
    };
  });

  updateCart();
}

// sorting functions

// ascending function

function sortASC(products) {
  storeProducts.sort((a, b) => (b.product > a.product ? -1 : 1));
  console.log({ storeProducts });
  renderProducts();
}

// descending function

function sortDSC() {
  storeProducts.sort((a, b) => (a.product > b.product ? -1 : 1));
  console.log({ storeProducts });
  renderProducts();
}

function addItem() {
  const myProduct = {
    product: productNode.value,
    price: priceNode.value,
    description: descriptionNode.value,
    id: new Date().getTime(),
  };

  storeProducts.push(myProduct);
  renderProducts();
  localStorage.setItem('INVENTORY', JSON.stringify(storeProducts));
  form.reset();
}

form.onsubmit = function (e) {
  e.preventDefault();

  validateForm() && addItem();
};

function validateForm() {
  // console.log('is this logging', product.value, price.value, description.value);

  function validateProduct() {
    if (/[[a-zA-Z]+\s?[:punct:]?]*/g.test(product.value)) {
      console.log('product validated', product.value);
      return true;
    }
  }
  function validatePrice() {
    if (/^[\d]*[\.]?[\d]{1,2}$/.test(price.value)) {
      console.log('price validated', price.value);
      return true;
    }
  }
  function validateDescription() {
    if (/[[a-zA-Z]+\s?[:punct:]?]*/g.test(description.value)) {
      console.log('description validated', description.value);
      return true;
    }
  }
  if (validateProduct() && validatePrice() && validateDescription()) {
    return true;
  } else {
    alert('Form not validated');
    return false;
  }
}
