var currentPage = 1;
var itemsPerPage = 15;
var role;
var userId = "auth0|6626b904e9b671d81727a673";
window.onload =  async function () {
    role = "Admin";
    console.log(role);
    let location = getParameterByName('location');
    let data;
    console.log(location);



    fetchBasket();
    console.log(cartItems);
    await displayHeader();
    if (location === "product_details") {

        let product_id = getParameterByName("product_id");
        console.log(product_id);
        data = {products: [product_id]};
        fetch('/GetGoodById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type based on your data format
            },
            body: JSON.stringify(data) // Convert your data to JSON format
        })
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                displayProductDetails(data[0]);
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });

    }
    else if(location==="order_status"){
        getAllOrders();
    }
    else if(location==="items_in_cart"){
        fetch('/FetchBasket')
            .then(response =>  response.json())
            .then(data => {

                cartItems = data;
                console.log(cartItems);
                cartItemCount = data.length;
                console.log(data.length);
                document.getElementById('cartItemCount').textContent = cartItemCount;
                showBasketItems();
            })
            .catch(error => console.error('Error:', error));

    }
    else if(location ==="order_history"){
        showOrdersHistory();
    }
    else{
        await displayMainPage();
    }


};
async function displayMainPage() {
    clearSearchParams();
    hideAllFragments("home");
    var res = null;

    currentPage = getParameterByName('page');
    if (currentPage === null || isNaN(currentPage)) {
        currentPage = 1;
    } else {
        currentPage = parseInt(currentPage);
    }

    await fetchData();

    document.getElementById('loadMoreButton').addEventListener('click', loadMoreGoods);
    document.getElementById('previousPageButton').addEventListener('click', previousPage);
}

function displayGoods(products) {
    var goodsGridElement = document.getElementById('goodsGrid');

    // Clear existing content
    goodsGridElement.innerHTML = '';

    // Calculate start and end index for current page
    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = currentPage * itemsPerPage;

    // Loop through the list of goods and create div containers
    for (var i = startIndex; i < Math.min(endIndex, products.length); i++) {
        var product = products[i];
        const div = document.createElement('div');
        div.classList.add('good');

        console.log(product);
        div.innerHTML = '<div class="good-image"><img src="data:image/jpeg;base64,' + product.imageData + '" alt="' + product.name + '"></div>' +
            '<div class="good-details">' +
            '<div class="good-name">' + product.name + '</div>' +
            '<div class="good-price">$' + product.price + '</div>' +
            '</div>';
        (function (product) {
            // Add event listener to call "foo" method when div is clicked and pass the good object
            div.addEventListener('click', function () {
                console.log('here');
                displayProductDetails(product);
            });
        })(product);
        goodsGridElement.appendChild(div);
    }

    // Show or hide the load more button based on pagination
    var loadMoreButton = document.getElementById('loadMoreButton');
    if (endIndex < products.length) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }

    // Enable or disable the previous page button based on current page
    var previousPageButton = document.getElementById('previousPageButton');
    if (currentPage > 1) {
        previousPageButton.disabled = false;
    } else {
        previousPageButton.disabled = true;
    }
}

function loadMoreGoods() {
    currentPage++;
    setCurrentPageParam(currentPage);
    fetchData();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        setCurrentPageParam(currentPage);
        fetchData();
    }
}

function fetchData() {
    fetch('/GoodServlet')
        .then(response =>  response.json())
        .then(data => {
            console.log(data.listOfProducts);
            displayGoods(data.listOfProducts);
        })
        .catch(error => console.error('Error:', error));
}



function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Function to set the current page URL parameter
function setCurrentPageParam(pageNumber) {
    var url = new URL(window.location.href);
    url.searchParams.set('page', pageNumber);
    window.history.replaceState({}, '', url);
}



async function getUserRole() {
    let role;
    //var userId = "${profile.get('sub')}"
    let data = {
        userId: userId
    }
    await fetch('/GetUserRole', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(async response => await response.json()) // Parse the JSON response
        .then(data => {
            console.log(data);
            data  = data.response;
            const obj = JSON.parse(data);
            console.log(obj);
            role = obj[0].name;
            console.log(role);
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
    return role;
}

async function  displayHeader(){
    role = "Admin";
    console.log(role);
    if(role==="Admin"){
        document.getElementById("get-all-orders").style.display = 'block';
        document.getElementById('additem').style.display = 'block';
    }

}