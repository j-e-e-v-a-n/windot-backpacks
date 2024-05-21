let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let checkOutButton = document.querySelector('.checkOut');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        let id_product = event.target.parentElement.dataset.id;
        addToCart(id_product);
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex(value => value.product_id == product_id);
    if (positionThisProductInCart < 0) {
        cart.push({ product_id: product_id, quantity: 1 });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    updateCart();
};

const updateCart = () => {
    addCartToHTML();
    addCartToMemory();
    calculateTotalPrice();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let product = products.find(p => p.id == item.product_id);
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                <img src="${product.image}">
            </div>
            <div class="name">
                ${product.name}
            </div>
            <div class="price">$${product.price}</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div> `;
        });
    } else {
        listCartHTML.innerHTML = '<p>Your cart is empty.</p>';
    }
    iconCartSpan.innerText = totalQuantity;
    calculateTotalPrice();
};

listCartHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('minus') || event.target.classList.contains('plus')) {
        let product_id = event.target.parentElement.parentElement.dataset.id;
        let type = event.target.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex(value => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        if (type === 'plus') {
            cart[positionItemInCart].quantity += 1;
        } else {
            cart[positionItemInCart].quantity -= 1;
            if (cart[positionItemInCart].quantity <= 0) {
                cart.splice(positionItemInCart, 1);
            }
        }
        updateCart();
    }
};

const calculateTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach(item => {
        let product = products.find(p => p.id == item.product_id);
        if (product) {
            totalPrice += product.price * item.quantity;
        }
    });
    let totalPriceElement = document.querySelector('.totalPrice');
    if (!totalPriceElement) {
        totalPriceElement = document.createElement('div');
        totalPriceElement.classList.add('totalPrice');
        listCartHTML.appendChild(totalPriceElement);
    }
    totalPriceElement.innerHTML = `Total Price: $${totalPrice.toFixed(2)}`;
};

const generateWhatsAppLink = () => {
    let message = "I would like to know more about the following products:\n";
    cart.forEach(item => {
        let product = products.find(p => p.id == item.product_id);
        if (product) {
            message += `${product.name} - ${item.quantity}\n`;
        }
    });

    let phoneNumber = '8113064544';
    let encodedMessage = encodeURIComponent(message);
    let link = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(link, '_blank');
};  
checkOutButton.addEventListener('click', generateWhatsAppLink);

const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
                calculateTotalPrice();
            }
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            // Display user-friendly error message here
        });
};

initApp();
