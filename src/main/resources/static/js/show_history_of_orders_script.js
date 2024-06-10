let showDeliveredOnly = false;
function showOrdersHistory() {
    clearSearchParams();
    setCurrentLocation("order_history");
    setCurrentClientId(16);
    hideAllFragments("history-of-orders");


    let data = {
        userId : getUserIdFromToken(userId)
    }
    fetch('/FetchOrders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type based on your data format
        },
        body: JSON.stringify(data) // Convert your data to JSON format
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            data = data.listOfOrders;
            console.log(data);
            displayOrderHistoryOfUser(data);
            console.log(data);
            data.sort(function (a, b) {

                let dateA = (a.order_date);
                let dateB = (b.order_date);

                // Compare the dates
                return dateA - dateB;
            });
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
    console.log("showOrdersHistory");
}
function toggleDeliveredOrders() {
    showDeliveredOnly = !showDeliveredOnly;
    const button = document.getElementById('toggle-delivered-orders');
    if (showDeliveredOnly) {
        button.textContent = 'Show All Orders';
        filterOrdersByStatus('Delivered');
    } else {
        button.textContent = 'Show Delivered Orders';
        showOrdersHistory();
    }
}

function filterOrdersByStatus(status) {
    let data = {
        userId : getUserIdFromToken(userId)
    }
    hideAllFragments("history-of-orders");
    fetch('/FetchOrders', {
        method: 'POST',
            headers: {
            'Content-Type': 'application/json', // Set the content type based on your data format
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            data = data.listOfOrders
            const filteredOrders = data.filter(order => order.status === status);
            displayOrderHistoryOfUser(filteredOrders);
        })
        .catch(error => console.error('Error:', error));
}
function displayOrderHistoryOfUser(orders){
    console.log("displayOrderHistoryOfUser");
    const historyContainer = document.getElementById('history-of-orders-container');
    historyContainer.innerHTML = '';

    orders.forEach(order => {
        console.log(order);
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        const orderInfo = document.createElement('div');
        orderInfo.innerHTML = `<p class="order-info">Order ID: ${order.orderId}, Date: ${order.orderDate}, Status: ${order.status}</p>`;
        const h1 = document.createElement('p');
        h1.textContent = `Total price: ${order.totalPrice}`;
        orderDiv.appendChild(orderInfo);
        orderDiv.appendChild(h1);
        const ad = document.createElement('div');
        ad.textContent = 'Address: ' + order.address;
        const name = document.createElement('div');
        name.textContent = 'Full name: ' + order.fullName;


        orderDiv.appendChild(ad);
        orderDiv.appendChild(name);
        const productsContainer = document.createElement('div');
        productsContainer.classList.add('products-container');
        let data = {
            products: order.products
        }

        console.log(data);
        fetch('/GetGoodsListById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type based on your data format
            },
            body: JSON.stringify(data) // Convert your data to JSON format
        })
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                console.log(data);
                data = data.productArrayList;
                console.log(data);
                let res = countDuplicates(data);

                console.log(res);
                res.forEach(element => {
                    console.log(element);
                    displayOneProduct(element.product,element.quantity, productsContainer);
                })


            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
        orderDiv.appendChild(productsContainer);
        historyContainer.appendChild(orderDiv);
        console.log(order);

    });
}

function displayOneProduct(product,quantity, container){
    const productDiv = document.createElement('div');
    const textContent = document.createElement('div');
    productDiv.onclick = function (){
        displayProductDetails(product);
    }
    productDiv.classList.add('product');
    textContent.classList.add('product-text')
    const image = document.createElement('img');
    image.src = "data:image/jpeg;base64," + product.imageData ;
    image.style.maxWidth = '100px';
    image.style.maxHeight = '100px';
    image.alt = product.name;
    image.classList.add('product-image');
    productDiv.appendChild(image);

    const productName = document.createElement('span');
    productName.textContent = 'Product Name: ' + product.name;
    textContent.appendChild(productName);

    const price = document.createElement('span');
    price.textContent = 'Price: $' + product.price;
    textContent.appendChild(price);
    const q = document.createElement('span');
    q.textContent = 'Quantity: ' + quantity;
    textContent.appendChild(q);


    productDiv.appendChild(textContent);
    container.appendChild(productDiv);
}