var sumbit = document.getElementById("submit");
sumbit.addEventListener('click', function(e) {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var token = getParameterByName("code");
    console.log(name, email,address);
    var formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('token', token);
    sendData(formData);
});
function sendData(data){
fetch('http://localhost:5454/portal/home/custom_login', {
    method: 'POST',

    body: data
})
    .then(function(response) {
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    });
}