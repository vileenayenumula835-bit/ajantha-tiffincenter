let cart = [];

function openMenuPopup() {
    document.getElementById('menuPopup').style.display = 'block';
}

function openCartPopup() {
    updateCartDisplay();
    document.getElementById('cartPopup').style.display = 'block';
}

function openOrderPopup() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    updateOrderSummary();
    document.getElementById('orderPopup').style.display = 'block';
    closePopup('cartPopup');
}

function openReceiptPopup() {
    document.getElementById('receiptPopup').style.display = 'block';
    closePopup('orderPopup');
}

function openThankYouPopup() {
    document.getElementById('thankyouPopup').style.display = 'block';
    closePopup('receiptPopup');
}

function closePopup(id) {
    document.getElementById(id).style.display = 'none';
}

function closeAllPopups() {
    document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
}

document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const item = this.parentElement;
        const name = item.dataset.name;
        const price = parseInt(item.dataset.price);

        const existing = cart.find(i => i.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, qty: 1 });
        }

        updateCartCount();

        btn.innerText = 'Added ✓';
        btn.style.background = '#2e7d32';
        setTimeout(() => {
            btn.innerText = 'Add to Cart';
            btn.style.background = '#4caf50';
        }, 800);
    });
});

function updateCartCount() {
    document.getElementById('cartCount').innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#999;">Your cart is empty</p>';
        cartSummary.style.display = 'none';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    ₹${item.price} x ${item.qty} = ₹${item.price * item.qty}
                </div>
                <div>
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${index})">✕</button>
                </div>
            </div>
        `;
    });

    document.getElementById('cartTotal').innerText = total;
    cartSummary.style.display = 'block';
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    updateCartDisplay();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
}

function updateOrderSummary() {
    const orderItemsList = document.getElementById('orderItemsList');
    let total = 0;
    orderItemsList.innerHTML = '';

    cart.forEach(item => {
        total += item.price * item.qty;
        orderItemsList.innerHTML += `<p>${item.name} x ${item.qty} = ₹${item.price * item.qty}</p>`;
    });

    document.getElementById('finalTotal').innerText = total;
}

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const payment = document.getElementById('payment').value;

    let total = 0;
    cart.forEach(item => { total += item.price * item.qty; });

    const orderId = 'AJ' + Date.now().toString().slice(-6);
    const orderDate = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('orderId').innerText = orderId;
    document.getElementById('orderDate').innerText = orderDate;
    document.getElementById('rName').innerText = name;
    document.getElementById('rPhone').innerText = phone;
    document.getElementById('rAddress').innerText = address;
    document.getElementById('rPayment').innerText = payment;
    document.getElementById('rTotal').innerText = total;

    const rItemsList = document.getElementById('rItemsList');
    rItemsList.innerHTML = '<p><strong>Items:</strong></p>';
    cart.forEach(item => {
        rItemsList.innerHTML += `<p>${item.name} x ${item.qty} = ₹${item.price * item.qty}</p>`;
    });

    openReceiptPopup();

    cart = [];
    updateCartCount();
    document.getElementById('orderForm').reset();
});

console.log("App Style Loaded - English Version");