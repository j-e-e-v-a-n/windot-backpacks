document.addEventListener('DOMContentLoaded', (event) => {
    const listProductHTML = document.querySelector('.listProduct');
    const listCartHTML = document.querySelector('.listCart');
    const iconCart = document.querySelector('.icon-cart');
    const iconCartSpan = document.querySelector('.icon-cart span');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');
    const checkOutButton = document.querySelector('.checkOut');
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    const closeModal = document.querySelector('.closeModal');
    let products = [];
    let cart = [];
    let totalPriceElement = document.querySelector('#totalPrice');

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });
    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    const updateTotalPrice = () => {
        let total = 0;
        cart.forEach(item => {
            let product = products.find(p => p.id == item.product_id);
            if (product) {
                total += product.price * item.quantity;
            }
        });
        totalPriceElement.innerText = `Total Price: $${total.toFixed(2)}`;
    };

    const addDataToHTML = () => {
        listProductHTML.innerHTML = '';
        if (products.length > 0) {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="productImage">
                <div class="prqua">
                    <h2>${product.name}</h2>
                    <div class="price">$${product.price}</div>
                    <button class="addCart">Add To Cart</button>
                </div>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    };

    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('addCart')) {
            let id_product = positionClick.parentElement.parentElement.dataset.id;
            addToCart(id_product);
        } else if (positionClick.classList.contains('productImage')) {
            let id_product = positionClick.parentElement.dataset.id;
            showProductModal(id_product);
        }
    });

    const addToCart = (product_id) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
        if (cart.length <= 0) {
            cart = [{
                product_id: product_id,
                quantity: 1
            }];
        } else if (positionThisProductInCart < 0) {
            cart.push({
                product_id: product_id,
                quantity: 1
            });
        } else {
            cart[positionThisProductInCart].quantity += 1;
        }
        addCartToHTML();
        addCartToMemory();
        updateTotalPrice(); // Update total price
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

                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                let info = products[positionProduct];
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`;
            });
        }
        iconCartSpan.innerText = totalQuantity;
        updateTotalPrice(); // Update total price
    };

    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
            changeQuantityCart(product_id, type);
        }
    });

    const changeQuantityCart = (product_id, type) => {
        let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
        if (positionItemInCart >= 0) {
            if (type === 'plus') {
                cart[positionItemInCart].quantity += 1;
            } else {
                let newQuantity = cart[positionItemInCart].quantity - 1;
                if (newQuantity > 0) {
                    cart[positionItemInCart].quantity = newQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
            }
        }
        addCartToHTML();
        addCartToMemory();
        updateTotalPrice(); // Update total price
    };

    const generateWhatsAppLink = () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add products to your cart before checking out.');
            return;
        }

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

    const showProductModal = (product_id) => {
        let product = products.find(p => p.id == product_id);
        if (product) {
            modalImage.src = product.image;
            modalName.innerText = product.name;
            modalDescription.innerText = product.description || 'No description available.';
            modalPrice.innerText = `$${product.price}`;
            modal.style.display = "block";
        }
    };

    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    const initApp = () => {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                addDataToHTML();
                if (localStorage.getItem('cart')) {
                    cart = JSON.parse(localStorage.getItem('cart'));
                    addCartToHTML();
                    updateTotalPrice(); // Update total price on initialization
                }
            });
    };

    const search_animal = () => {
        const searchInput = document.getElementById('searchbar').value.toLowerCase();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput));
        listProductHTML.innerHTML = '';
        filteredProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="productImage">
            <div class="prqua">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>
            </div>`;
            listProductHTML.appendChild(newProduct);
        });
    };
    const priceSortSelect = document.getElementById('priceSort');

priceSortSelect.addEventListener('change', () => {
    const sortBy = priceSortSelect.value;
    if (sortBy === 'lowToHigh') {
        products.sort((a, b) => a.price - b.price); // Sort by ascending price
    } else if (sortBy === 'highToLow') {
        products.sort((a, b) => b.price - a.price); // Sort by descending price
    }
    addDataToHTML(); // Update the displayed products after sorting
});


    document.getElementById('searchbar').addEventListener('keyup', search_animal);

    initApp();
});
