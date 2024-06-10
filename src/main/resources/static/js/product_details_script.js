
function setCurrentProductParam(id) {
    var url = new URL(window.location.href);

    url.searchParams.set('product_id', id);
    window.history.replaceState({}, '', url);
    console.log("here");
}
async function displayProductDetails(product) {
    clearSearchParams();
    setCurrentLocation('product_details');
    setCurrentProductParam(product.product_id);

    hideAllFragments("product-details");

    var goodDetailsElement = document.getElementById('goodDetails');
    goodDetailsElement.innerHTML = "";


    var good = {
        name: product.name,
        price: product.price,
        description: product.description,
        imageData: product.imageData
    };
    console.log(product);
    //console.log("displayGoodDetails");

    const productDiv = document.createElement('div');
    const textContent = document.createElement('div');
    productDiv.classList.add('product-details');
    textContent.classList.add('product-text')
    const image = document.createElement('img');
    image.src = "data:image/jpeg;base64," + product.imageData ;

    image.alt = product.name;
    image.classList.add('product-image');
    productDiv.appendChild(image);

    const productName = document.createElement('span');
    productName.textContent = 'Product Name: ' + product.name;
    textContent.appendChild(productName);

    const price = document.createElement('span');
    price.textContent = 'Price: $' + product.price;
    const btn = document.createElement('button');
    btn.addEventListener("click", function (){
        addToCart(product);
    })
    btn.textContent = "Add to Cart";
    btn.classList.add("add-to-cart-button");
    textContent.appendChild(price);
    textContent.appendChild(btn);
    productDiv.appendChild(textContent);
    goodDetailsElement.appendChild(productDiv);


    window.productId = product.productId;
    console.log("window " + window.productId);
    const good_id = window.productId;

    await fetchReviews(product.productId);
}



async function fetchReviews( good_id){
    console.log(good_id);
    const data = {
        goodId: good_id
    };
    fetch('/GetReviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type based on your data format
        },
        body: JSON.stringify(data) // Convert your data to JSON format
    })
        .then(response =>  response.json())
        .then(data => {
            console.log(data);
            renderExistingReviews(data.listOfReviews);
        })
        .catch(error => console.error('Error:', error));
}



function renderExistingReviews(reviews) {

    //console.log(reviews);

    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = "";

    reviews.forEach(review => {
        console.log(review);
        let fullName = null;
        let data = {
            userId :    (review.clientid)
        }
        fetch('/GetUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type based on your data format
            },
            body: JSON.stringify(data) // Convert your data to JSON format
        })
            .then(response => response.json()) // Parse the JSON response
            .then(async data => {
                data = data.response;
                const obj = JSON.parse(data);
                console.log(obj);
                const full_name = obj.user_metadata.full_name;

                // Create a container for the review content
                const reviewContent = document.createElement("div");
                reviewContent.classList.add("review-content");

                // Display the author's full name
                const authorName = document.createElement("div");
                authorName.classList.add("author-name");
                role = await getUserRole();
                if(role==="Admin"){
                    authorName.innerHTML = full_name + "(" + review.clientid + ")";
                }
                else {
                    authorName.innerHTML = full_name;
                }
                authorName.style.fontSize = "12px"; // Smaller font size
                authorName.style.color = "#888"; // Shade of gray

                // Display the review grade as stars
                const ratingStars = document.createElement("div");
                ratingStars.classList.add("rating-stars");
                for (let i = 0; i < review.stars; i++) {
                    const starIcon = document.createElement("span");
                    starIcon.innerHTML = "&#9733;"; // Star symbol
                    ratingStars.appendChild(starIcon);
                }

                // Display the review text
                const reviewText = document.createElement("div");
                reviewText.textContent = review.text;

                // Append all elements to the review content container
                reviewContent.appendChild(authorName);
                reviewContent.appendChild(ratingStars);
                reviewContent.appendChild(reviewText);

                // Create a list item for the review content
                const listItem = document.createElement("div");
                listItem.appendChild(reviewContent);

                // Append the list item to the reviews list
                reviewsList.appendChild(listItem);
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
    });
}


function getSelectedStars() {
    // Get all star elements
    var stars = document.querySelectorAll('.rating  .radio-btn');

    // Initialize counter for selected stars
    var selectedStars = 0;

    // Iterate over star elements
    stars.forEach(function(star) {
        // Check if the star is checked
        if (star.checked) {
            console.log("here");
            console.log(star.value);
            // Increment the counter if the star is checked
            selectedStars =  star.value;
        }
    });

    // Return the number of selected stars
    return selectedStars;
}
async function addReview() {
    const stars = document.querySelectorAll('.rating input[type="radio"]');
    let selectedRating = getSelectedStars();


    var text = document.getElementById('review').value;

    document.getElementById('review').value = '';
    stars.forEach(function (star) {
        // Check if the star is checked
        if (star.checked) {
            star.checked = false;
        }
    });

    const accessToken = await accessCode();

    let data = {
        userToken : getUserIdFromToken(userId),
        goodId: window.productId,
        text: text,
        rating: selectedRating
    }
    console.log(data);
    fetch('/AddReview', {
        method: 'POST',

        body: JSON.stringify(data)
    })
        .then(function (response) {
            //console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        });
}

