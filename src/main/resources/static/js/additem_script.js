async function addItem() {
    // Retrieve values from form
    var itemName = document.getElementById('itemName').value;
    var itemPrice = document.getElementById('itemPrice').value;
    var itemQuantity = document.getElementById('itemQuantity').value;
    var itemDescription = document.getElementById('itemDescription').value;
    var fileInput = document.getElementById('fileUploader');
    var file = fileInput.files[0];
    const base64String = await imageToBase64(file);
    console.log(base64String);
    console.log(itemName, itemPrice, itemQuantity, itemDescription);
    let data = {
        name: itemName,
        price: itemPrice,

        description: itemDescription,
        imageData: base64String
    }
    console.log(data);
    fetch('http://localhost:3000/AddProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        });
    $('#successMessage').addClass('show');
    setTimeout(function () {
        $('#successMessage').removeClass('show');
    }, 3000); // Hide after 3 seconds

    // Fade out the success message after a delay
    setTimeout(function () {
        $('#successMessage').css('opacity', 0);
    }, 2000); // Fade out over 2 seconds, adjust as needed
    $('#addItemModal').modal('hide');


    document.getElementById('addItemForm').reset();

}

var fileInput = document.getElementById('fileUploader');
var fileDropArea = document.getElementById('fileDropArea');

// Prevent default behavior (open file in browser)
fileDropArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    fileDropArea.classList.add('dragover');
});

// Handle drag leave
fileDropArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    fileDropArea.classList.remove('dragover');
});

// Handle file drop
fileDropArea.addEventListener('drop', function(e) {
    e.preventDefault();
    fileDropArea.classList.remove('dragover');
    var files = e.dataTransfer.files;
    handleFiles(files);
});

// Handle file selection from input
fileInput.addEventListener('change', function(e) {
    var files = e.target.files;
    handleFiles(files);
});


function handleFiles(files) {
    var fileList = files;

    console.log(fileList);
}