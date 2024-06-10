let cartItemCount = 0;
let cartItems = [];

function fetchBasket(){
    console.log("fetchBasket");
    let data = {
        userId: "auth0|6626b904e9b671d81727a673"
    }
    fetch('/FetchBasket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type based on your data format
        },
        body: JSON.stringify(data) // Convert your data to JSON format
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            data = data.productsInBasket;
            console.log(data);
            cartItems = data;
            cartItemCount = data.length;
            console.log(data.length);
            document.getElementById('cartItemCount').textContent = cartItemCount;
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });



}

function addToCart(product) {
    cartItemCount++;
    console.log(cartItemCount);
    cartItems.push({ name: product.name, price: product.price,productId: product.productId,imageData: product.imageData });
    document.getElementById('cartItemCount').textContent = cartItemCount;
    console.log('Added ' + product.name + ' to cart. Price: $' + product.price + " " + product.productId);
    console.log(cartItems[cartItems.length -1]);
    const data = {
        productId: product.productId,
        userId: getUserIdFromToken(userId)
    };
    fetch('/AddItemToBasket', {
        method: 'POST',

        body: JSON.stringify(data)
    })
        .then(function(response) {
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        });

}

function displayBasketItems() {
    let res = countDuplicates(cartItems);
    console.log(res);
    var basketItemsContainer = document.getElementById('basketItemsContainer');
    basketItemsContainer.innerHTML = ''; // Clear previous content

    if (cartItems.length === 0) {
        basketItemsContainer.textContent = 'No items added';
    } else {
        res.forEach(function(element, index) {
            const item = element.product;
            const itemElement = document.createElement('div');
            itemElement.onclick = function (){
                displayProductDetails(item);
            }

            const imgElement = document.createElement('img');
            imgElement.src = "data:image/jpeg;base64," + item.imageData ;
            imgElement.style.maxWidth = '100px';
            imgElement.style.maxHeight = '100px';
            imgElement.alt = item.name; // Set alt text for accessibility

            itemElement.appendChild(imgElement);

            // Create and append name and price text
            const itemInfo = document.createElement('div');
            itemInfo.textContent = item.name + ' - $' + item.price;
            const quantity = document.createElement('p');
            quantity.textContent = 'Quantity: ' + element.quantity;



            // Create remove button using Bootstrap's cross icon
            const removeButton = document.createElement('button');
            removeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-times" viewBox="0 0 16 16"><path d="M3.854 3.146a.5.5 0 0 1 0 .708L8.207 8l-4.353 4.146a.5.5 0 0 1-.708-.708L7.793 8 3.146 3.854a.5.5 0 0 1 0-.708z"/><path d="M12.854 3.146a.5.5 0 0 0-.708 0L8 7.793l-4.146-4.647a.5.5 0 1 0-.708.708L7.293 8l-4.647 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.647a.5.5 0 0 0 .708-.708L8.707 8l4.647-4.146a.5.5 0 0 0 0-.708z"/></svg>';
            removeButton.classList.add('btn', 'remove-button'); // Add Bootstrap button classes
            removeButton.onclick = function() {
                removeItemFromCart(index);
            };
            removeButton.style.padding = '5px'
            itemInfo.appendChild(removeButton);

            itemInfo.appendChild(quantity);
            itemElement.appendChild(itemInfo);
            basketItemsContainer.appendChild(itemElement);
        });
    }

    basketItemsContainer.classList.add('show'); // Show the container

    // Add event listener to hide basket items list when mouse moves away from both basket icon and basket items list
    basketItemsContainer.addEventListener('mouseleave', hideBasketItems);
}
function hideBasketItems() {
    var basketItemsContainer = document.getElementById('basketItemsContainer');
    basketItemsContainer.classList.remove('show'); // Hide the container
}

function removeItemFromCart(index) {
    console.log(getUserIdFromToken(userId));
    const data = {
        productId: cartItems[index].productId,
        userId: getUserIdFromToken(userId)
    };
     //console.log('removeItemFromCart');
    // Remove item from cartItems array
    cartItems.splice(index, 1);
    // Update cartItemCount
    cartItemCount--;
    document.getElementById('cartItemCount').textContent = cartItemCount;
    // Display updated basket items
    displayBasketItems();

    fetch('/RemoveItemFromBasket', {
        method: 'POST',

        body: JSON.stringify(data)
    })
        .then(function(response) {
            //console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        });
}