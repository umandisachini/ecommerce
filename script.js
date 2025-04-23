// Initialize items array from localStorage
let items = JSON.parse(localStorage.getItem('items')) || [];

// Save to localStorage
function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
}

function searchItem() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    // Ensure latest items are loaded from localStorage before filtering
    items = JSON.parse(localStorage.getItem('items')) || [];

    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchInput));
    displayItems(filteredItems);
}

function displayItems(itemsList) {
    const itemList = document.getElementById('itemList');
    if (!itemList) return;
    itemList.innerHTML = ''; // Clear any previous results
    
    if (itemsList.length === 0) {
        itemList.innerHTML = '<p>No items found</p>';
        return;
    }

    itemsList.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <h3>${item.name}</h3><br/>
            <p><strong>ID:</strong> ${item.id}</p><br/>
            <p><strong>Price:</strong> €${item.price}</p><br/>
            <p><strong>Description:</strong> ${item.description}</p><br/>
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover;" /><br/>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        itemList.appendChild(itemElement);
    });
}

function insertItem(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const price = document.getElementById('price').value.trim();
    const description = document.getElementById('description').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim();

    // Validate image URL (check if it contains a valid image extension)
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const isValidImage = validImageExtensions.some(ext => imageUrl.toLowerCase().includes(ext));

    if (!isValidImage) {
        alert('Please enter a valid image URL (must contain .jpg, .jpeg, .png, or .gif)');
        return;
    }

    // Check if all fields are filled
    if (!name || !price || !description || !imageUrl) {
        alert("Please fill in all fields.");
        return;
    }

    // Create a new item object
    const newItem = {
        id: Date.now(), // Unique ID based on timestamp
        name: name,
        price: parseFloat(price).toFixed(2),
        description: description,
        imageUrl: imageUrl
    };

    // Add the new item to the items array
    items.push(newItem);

    // Save updated items back to localStorage
    saveItems();

    // Success message
    alert('Item inserted successfully!');

    // Reset form
    document.getElementById('insertForm').reset();
}

function updateItem() {
    const id = parseInt(document.getElementById('itemId').value);
    const newName = document.getElementById('newItemName').value;
    const newPrice = document.getElementById('newItemPrice').value;
    const newDescription = document.getElementById('newItemDescription').value;

    const item = items.find(item => item.id === id);
    if (item) {
        item.name = newName || item.name;
        item.price = newPrice || item.price;
        item.description = newDescription || item.description;
        saveItems();
        alert('Item updated successfully!');
    } else {
        alert('Item not found!');
    }
}

function deleteItem() {
    const id = parseInt(document.getElementById('deleteItemId').value);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items.splice(index, 1);
        saveItems();
        alert('Item deleted successfully!');
    } else {
        alert('Item not found!');
    }
}

function buyItem() {
    const id = parseInt(document.getElementById('buyItemId').value);
    const item = items.find(item => item.id === id);
    if (item) {
        alert(`You have bought ${item.name} for ${item.price}`);
    } else {
        alert('Item not found!');
    }
}

function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = items.find(item => item.id === id);
    if (item) {
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${item.name} added to cart!`);
    }
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cartItems');
    const totalElem = document.getElementById('totalPrice');

    if (!cartContainer || !totalElem) return;

    let total = 0;
    cartContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="cart-details">
                <h3>${item.name}</h3>
                <p>Price: €${price.toFixed(2)}</p>
                <p>Quantity: ${quantity}</p>
                <p>Total: €${itemTotal.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    totalElem.textContent = `Total: €${total.toFixed(2)}`;
}

function checkoutCart() {
    alert("Thank you for your purchase!");
    localStorage.removeItem('cart');
    location.reload();
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove item at that index
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Refresh cart view
}

// Auto-load cart if on cart page
if (document.location.pathname.includes('cart.html')) {
    loadCart();
}
