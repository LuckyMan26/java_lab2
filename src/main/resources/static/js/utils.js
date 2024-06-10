function hideAllFragments(name){
    document.getElementById('itemsInCart').style.display = 'none';
    document.getElementById('home').style.display = 'none';
    document.getElementById('product-details').style.display = 'none';
    document.getElementById('history-of-orders').style.display = 'none';
    document.getElementById('orders').style.display = 'none';

    document.getElementById(name).style.display = 'block';

}
const compareDates = (a, b) => {
    return new Date(b.order_date) - new Date(a.order_date);
};
function getElementFromCart(product_id, collection){
    let res;
    console.log(collection);
    collection.forEach(element => {
        console.log(element);
        if(element.productId.toString()===product_id.toString()){

            res = element;
        }
    });
    return res
}
function parseDate(dateString) {
    const months = {
        "янв.": 0, "февр.": 1, "мар.": 2, "апр.": 3, "мая": 4, "июн.": 5,
        "июл.": 6, "авг.": 7, "сент.": 8, "окт.": 9, "нояб.": 10, "дек.": 11
    };

    const [monthStr, day, year] = dateString.split(' ');
    const month = months[monthStr];

    return new Date(year, month, day.replace(',', ''));
}
const countDuplicates = (arr) => {
    // Let's use a JavaScript object to keep track of counts
    const counts = {};

    // Loop through each element in the array
    arr.forEach((value) => {

        // If the value is encountered for the first time, set the count to 1
        if (!counts[value.productId]) {
            counts[value.productId] = 1;
        } else {
            // If the value has been seen before, increment the count
            counts[value.productId]++;
        }
    });
    const res = [];
    Object.keys(counts).forEach((object) =>{
        res.push({product: getElementFromCart(object, arr), quantity: counts[object]});
        });

    return res;
};

function setCurrentLocation(location_name) {
    var url = new URL(window.location.href);
    url.searchParams.set('location', location_name);
    window.history.replaceState({}, '', url);

}
function clearSearchParams() {
    var url = new URL(window.location.href);

    // Get a copy of all search parameters
    var searchParamsCopy = new URLSearchParams(url.search);

    // Loop through each search parameter in the copy and delete it
    searchParamsCopy.forEach((value, key) => {
        if(key!=="userId" && key!=="accessToken"){
            url.searchParams.delete(key);
        }

    });

    window.history.replaceState({}, '', url);

    console.log("Search parameters cleared");
}

async function accessCode() {
    const url = '/GetAccessToken';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // rethrow the error
    }
}

async function getUserData() {
    let res;
    try {
        const accessToken = await accessCode();
        console.log(accessToken);
        const data = {
            userId: getUserIdFromToken(userId)
        };
        console.log(data);
        const response = await fetch('/GetUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const userData = await response.json();
        console.log(userData);
        res = userData.response;
    } catch (error) {
        console.error('Error:', error);
    }
    return res;
}

function getUserIdFromToken(userId) {


    // Split the token into its parts
    const tokenParts = userId.split('.');

    // Decode the payload (the second part of the token)
    const payload = JSON.parse(atob(tokenParts[1]));

    // Extract the user ID from the payload
    const res = payload.sub; // 'sub' is the standard claim for the subject (user ID)
    console.log(res);
    return res;
}

function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}