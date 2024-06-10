function setCurrentClientId(id){
    var url = new URL(window.location.href);

    url.searchParams.set('client_id', id);
    window.history.replaceState({}, '', url);

}
 function showBasketItems() {

    clearSearchParams();
    setCurrentLocation('items_in_cart');

    hideAllFragments("itemsInCart");

    console.log("showBasketItems");

    displayItems(cartItems);

    console.log(cartItems);
}

function displayItems(data){
    const container = document.getElementById('itemsInCartContainer');
    const textContent = document.createElement('div');
    container.innerHTML = '';
    let res = countDuplicates(data);
    res.forEach(item => {
        displayOneProduct(item.product,item.quantity, container);
    });
    // Display the checkout section after items are loaded
    document.getElementById('checkoutSection').style.display = 'block';
    let price =0;
    for(let i =0; i < cartItems.length; i++){
        price+=cartItems[i].price;
    }
    let currentDate = new Date();
    document.getElementById('totalPrice').textContent = price + "$";
    document.getElementById('orderDate').textContent = currentDate.toLocaleDateString();
}
function displayConfirmation(cost) {
    return new Promise((resolve, reject) => {
        const confirmationDialog = document.getElementById("confirmationDialog");
        const addressInput = document.getElementById("addressInput");

        const confirmBtn = document.getElementById("confirmBtn");
        const cancelBtn = document.getElementById("cancelBtn");

        confirmBtn.addEventListener("click", () => {
            const address = addressInput.value.trim();
            if (address.length < 5) {
                alert("Please enter a valid address (at least 5 characters).");
                return; // Prevent further execution
            }
            console.log(address);
            resolve(address); // Pass the address as resolved value
            confirmationDialog.style.display = "none";
        });

        cancelBtn.addEventListener("click", () => {
            reject("Purchase canceled by user");
            confirmationDialog.style.display = "none";
        });

        confirmationDialog.style.display = "block";
    });
}

function buy() {
    let price =0;
    for(let i =0; i < cartItems.length; i++){
        price+=cartItems[i].price;
    }
    displayConfirmation(price)
        .then(async (address) => {
            // User confirmed, proceed with purchase logic
            let currentDate = new Date();
            console.log(currentDate.getHours());
            const obj = await getUserData();
            console.log(obj);
            const json_obj = JSON.parse(obj);
            console.log(json_obj);
            const full_name = json_obj.user_metadata.full_name;
            console.log('Address '+ address);
            console.log(obj);
            products_ids = [];
            for (let i=0; i < cartItems.length;i++){
                products_ids.push(cartItems[i].productId);
            }
            const d = {
                products: products_ids,
                date: currentDate,
                userId: getUserIdFromToken(userId),
                address: address,
                fullName: full_name
            };
            console.log(full_name);
            console.log(d);
            fetch('/MakeOrder', {
                method: 'POST',
                body: JSON.stringify(d)
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                });
            cartItems = [];
            cartItemCount = 0;


        })
        .catch((error) => {
            // User canceled the purchase
            console.log(error);
        });
}