
function getAllOrders(){
    clearSearchParams();
    setCurrentLocation('order_status');
    hideAllFragments("orders");
    fetch('/GetAllOrders')
        .then(response =>  response.json())
        .then(data => {
            console.log(data);
            data = data.listOfOrders;

            let filteredOrders = data.filter(order => order.status !== "Delivered");
            filteredOrders = filteredOrders.sort(function(a,b){
                let dateA = (a.order_date);
                let dateB = (b.order_date);

                // Compare the dates
                return dateA - dateB;
            });
            console.log(filteredOrders);
            displayOrderHistory(filteredOrders);
        })
        .catch(error => console.error('Error:', error));
}

function displayOrderHistory(orders){

    console.log(orders);
    const historyContainer = document.getElementById('orders');
    historyContainer.innerHTML = '';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        const orderInfo = document.createElement('div');
        orderInfo.textContent = `Order ID: ${order.orderId}, Date: ${order.order_date}, Status: ${order.status}`;
        const h1 = document.createElement('p');
        h1.textContent = `Total price: ${order.totalPrice}`;
        orderDiv.appendChild(orderInfo);
        orderDiv.appendChild(h1);

        // Select element for changing status
        const statusSelect = document.createElement('select');


        // Options for status
        const statusOptions = ["Pending", "Processing", "Shipping", "Delivered"];
        statusOptions.forEach(option => {
            const optionElem = document.createElement('option');
            optionElem.value = option;
            optionElem.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            statusSelect.appendChild(optionElem);
        });
        const changeStatusBtn = document.createElement('button');
        changeStatusBtn.textContent = 'Change Status';
        changeStatusBtn.addEventListener('click', () => {
            // Assuming you have a function to change the status
            changeOrderStatus(order.orderId, statusSelect.value);
        });
        orderDiv.appendChild(changeStatusBtn);
        // Set the selected option to the current status
        statusSelect.value = order.status;

        orderDiv.appendChild(statusSelect);

        const ad = document.createElement('div');
        ad.textContent = 'Address: ' + order.address;
        const name = document.createElement('div');
        name.textContent = 'Full name: ' + order.fullName;
        const user_id = document.createElement('div');
        user_id.textContent ='Client id: ' + order.clientId;

        orderDiv.appendChild(ad);
        orderDiv.appendChild(name);
        orderDiv.appendChild(user_id);

        const productsContainer = document.createElement('div');
        productsContainer.classList.add('products-container');
        let data = {

            products: order.products
        }

        fetch('/GetGoodsListById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type based on your data format
            },
            body: JSON.stringify(data) // Convert your data to JSON format
        })
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                data = data.productArrayList;
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
    });
}
function saveOrderStatus(orderId, status) {
    // Your implementation to save the status goes here
}

// Function to change the status of an order
function changeOrderStatus(orderId, new_status) {
    console.log("changeOrderStatus");
    let data = {
        orderId: orderId,
        status : new_status
    }

    fetch('/ChangeOrderStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(error => {
        // Handle any errors
        console.error('Error:', error);
    });
}