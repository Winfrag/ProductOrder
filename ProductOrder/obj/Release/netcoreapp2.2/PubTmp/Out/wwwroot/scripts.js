//Hide Page until information is retrieved, so certain elements won't suddenly pop in
document.getElementById("inputFields").style.display = "none";

//Hooking up the button to the buttonClick function
document.getElementById("submitButton").addEventListener("click", buttonClick);
document.getElementById("contactCopy").addEventListener("click", copyContacts);
document.getElementById("productSelect").addEventListener("change", selectionChange);
document.getElementById("fileLinkCheck").addEventListener("change", checkboxChange);



var request = new XMLHttpRequest();
var sendPayload = new XMLHttpRequest();
request.open('GET', "api/values", true);
request.onerror = function() { document.getElementById("errorField").innerHTML = "An Error has occurred when attempting to access the PFL API"}

request.send();

var products;
var select;

//Received a response from the GET request, and ideally received the products JSON from the API
request.onload = function() {
  
  
    var root = JSON.parse(this.response);
	
	
	if ((request.status >= 200 && request.status < 400)) {
	
    products = root.results.data;
    //All the relevant information we need
    //Iterates through json for the needed product information
    products.forEach(product => {
        document.getElementById("productSelect").options.add(new Option(product.name, product.productID));
    })


    selectionChange();
    document.getElementById("inputFields").style.display = "block";
	}
	else
	{
	
	document.getElementById("errorField").innerHTML = "Error: Cannot Access PFL API."
		
		
	}
}

//Activates when the submit button is pressed
//Runs the function checkForErrors() to find any issues before the payload is generated.
function buttonClick() {
    checkForErrors();
}

//Activated from the use contact info button
//Copies all the text from contact information to shipping information
function copyContacts() {
    document.getElementById('firstNameShipping').value = document.getElementById('firstName').value;
    document.getElementById('lastNameShipping').value = document.getElementById('lastName').value
    document.getElementById('companyNameShipping').value = document.getElementById('companyName').value
    document.getElementById('addressShipping').value = document.getElementById('address').value
    document.getElementById('address2Shipping').value = document.getElementById('address2').value
    document.getElementById('cityShipping').value = document.getElementById('city').value
    document.getElementById('stateShipping').value = document.getElementById('state').value
    document.getElementById('postalCodeShipping').value = document.getElementById('postalCode').value
    document.getElementById('countryCodeShipping').value = document.getElementById('countryCode').value
    document.getElementById('phoneShipping').value = document.getElementById('phone').value





}

//Activates whenever we change the currently selected product
//Changes the picture along with any variable fields as needed
function selectionChange() {
    var imageURL;
    var imageDesc;

    //Update the select variable as the selected product is different
    select = document.getElementById("productSelect");

    //Reset the shipping methods on product change
    document.getElementById("shippingMethod").options.length = 0;




    products.forEach(product => {


        //Matching product IDs, any logic that needs to be done is done in here.
        if (product.productID == select.options[select.selectedIndex].value) {


            //Shipping Information Logic, Updates the available shipping types based off the selected product
            product.deliveredPrices.forEach(shippingType => {

                if (shippingType.country != null) {
                    var shippingDescription = shippingType.description + " " + shippingType.country
                }
                else {
                    var shippingDescription = shippingType.description
                }
                document.getElementById("shippingMethod").options.add(new Option(shippingDescription, shippingType.deliveryMethodCode));
            })

            //PDF Link Bar, if the hasTemplate evaluates to true, we hide it and turn it into an optional attribute
            if (product.hasTemplate == true) {

                document.getElementById("fileLink").value = ""
                document.getElementById("fileLinkContainer").style.display = "none";
                document.getElementById("optionalFileLink").style.display = "block";
                document.getElementById("fileLinkCheck").checked = false;

            }
            else {
                document.getElementById("fileLinkContainer").style.display = "block";
                document.getElementById("optionalFileLink").style.display = "none";
                document.getElementById("fileLinkCheck").checked = true;

            }


            //Quantity logic, based off minimum and step values
            if (product.quantityMinimum != null) { document.getElementById("quantity").min = product.quantityMinimum; }
            else { document.getElementById("quantity").min = 1 }
            if (product.quantityIncrement != null) { document.getElementById("quantity").step = product.quantityIncrement; }
            else { document.getElementById("quantity").step = 1}
            if (product.quantityDefault != null) { document.getElementById("quantity").value = product.quantityDefault; }
            else { document.getElementById("quantity").value = 1 }
            if (product.quantityMaximum != null) { document.getElementById("quantity").max = product.quantityMaximum; }
            else { document.getElementById("quantity").max = 1000000000000000 }

            //Updates the image url to our selected product
            imageURL = product.imageURL;
            imageDesc = product.description;

        }
    })

    //Updates the displayed image for the selected product
    show_image(imageURL, imageDesc);

}

//Helper function for selectionChange
//Swaps out the given product's picture when called
function show_image(src, alt) {
    var div = document.getElementById("imageContainer");

    //Cleans any existing images out of the div before we add new ones
    while (div.firstChild) div.removeChild(div.firstChild);




    var img = document.createElement("img");
    img.src = src;
    img.alt = alt;

    div.appendChild(img);
}





//Activates whenever the 'include PDF link' checkbox is changed
//Hides the element when it's disabled
function checkboxChange() {
    if (document.getElementById("fileLinkCheck").checked) {
        document.getElementById("fileLinkContainer").style.display = "block";
    }
    else {
        document.getElementById("fileLinkContainer").style.display = "none";
    }






}


//Checks for basic errors on the front end
//If no errors are found, we proceed to generate a payload (createPayload())
//Otherwise the errors are printed at the bottom of the page.
function checkForErrors() {
    var errorString = "";
    //first name, last name, address1, City, PostalCode, CountryCode, Phone are all required
    if (isEmpty(document.getElementById('firstName').value)) {
        errorString += "First name is required for contact information. <br />";
    }
    if (isEmpty(document.getElementById('lastName').value)) {
        errorString += "Last name is required for contact information. <br />";
    }
    if (isEmpty(document.getElementById('address').value)) {
        errorString += "A primary address is required for contact information. <br />";
    }
    if (isEmpty(document.getElementById('city').value)) {
        errorString += "A city is required for contact information. <br />";
    }
    if (isEmpty(document.getElementById('postalCode').value)) {
        errorString += "A postal code is required for contact information. <br />";
    }
    if (isEmpty(document.getElementById('countryCode').value)) {
        errorString += "A country is required for contact information. <br />";
    }
    else {
        if (!allLetter(document.getElementById('countryCode'))) {
            errorString += "A country is required and must be either the full Country name, or the two-character or three-character abbreviation for contact information <br />";
        }

    }

    if (isEmpty(document.getElementById('phone').value)) {
        errorString += "A phone number is required for contact information. <br />";
    }
    else {
        if (!isPhoneNumber(document.getElementById('phone'))) { errorString += "That is not a valid phone number for contact information. <br />"; }
    }
    if (!allLetter(document.getElementById('state')) && !isEmpty(document.getElementById('state').value)) {
        errorString += "State must be either the full State name, or the two-character abbreviation for shipping information <br />";
    }
    if (!validateEmail(document.getElementById('email'))) {
        errorString += "A valid email address is required. <br />";
    }

    //If the PDF file is required or enabled by the checkbox, we check for a .pdf extension.
    if (!checkForPDF(document.getElementById('fileLink')) && document.getElementById("fileLinkCheck").checked == true) {
        errorString += "The given url isn't a .pdf file. <br />";
    }


    //Do the same for shipping fields
    if (isEmpty(document.getElementById('firstNameShipping').value)) {
        errorString += "First name is required for shipping information. <br />";
    }
    if (isEmpty(document.getElementById('lastNameShipping').value)) {
        errorString += "Last name is required for shipping information. <br />";
    }
    if (isEmpty(document.getElementById('addressShipping').value)) {
        errorString += "A primary address is required for shipping information. <br />";
    }
    if (isEmpty(document.getElementById('cityShipping').value)) {
        errorString += "A city is required for shipping information. <br />";
    }
    if (isEmpty(document.getElementById('postalCodeShipping').value)) {
        errorString += "A postal code is required for shipping information. <br />";
    }
    if (isEmpty(document.getElementById('countryCodeShipping').value)) {
        errorString += "A country is required for shipping information. <br />";
    }
    else {
        if (!allLetter(document.getElementById('countryCodeShipping'))) {
            errorString += "A country is required and must be either the full Country name, or the two-character or three-character abbreviation for shipping information <br />";
        }
    }
    if (isEmpty(document.getElementById('phoneShipping').value)) {
        errorString += "A phone number is required for shipping information. <br />";
    }
    else {
        if (!isPhoneNumber(document.getElementById('phone'))) { errorString += "That is not a valid phone number for shipping information. <br />"; }
    }
    if (!allLetter(document.getElementById('stateShipping')) && !isEmpty(document.getElementById('stateShipping').value)) {
        errorString += "State must be either the full State name, or the two-character abbreviation for shipping information <br />";
    }



    //If the string is empty (no errors), we continue, otherwise, print out the errors.
    if (errorString == "") {
        createPayload();
    }
    else {
        document.getElementById("replyContainer").innerHTML = errorString;
    }

}

//Helper Function for checkForErrors
//Checks if the string is empty, and isn't made up of whitespace
function isEmpty(str) {
    return !str.replace(/\s+/, '').length;
}

//Helper Function for checkForErrors
//Checks for valid phone number sequences
function isPhoneNumber(inputtxt) {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if ((inputtxt.value.match(phoneno))) {
        return true;
    }
    else {
        return false;
    }
}

//Helper Function for checkForErrors
//Checks that the string only contains letters and spaces
//Contains at least 2 letters
function allLetter(inputtxt) {
    var letters = /^[a-zA-Z][a-zA-Z]+[a-zA-Z\s]*$/;
    if (inputtxt.value.match(letters)) {
        return true;
    }
    else {
        return false;
    }
}

//Helper Function for checkForErrors
//Checks for a valid email address
function validateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.value.match(mailformat)) {
        return true;
    }
    else {
        return false;
    }
}


//Helper Function for checkForErrors
//Checks for a basic pdf extension on the url given
function checkForPDF(inputText) {
    var pdfExtension = /^.+\.pdf$/i;
    if (inputText.value.match(pdfExtension)) {
        return true;
    }
    else {
        return false;
    }
}

//Performed after checkForErrors() is successful
//Collects all the information from the text fields, and converts it into a JSON format.
//With the new JSON object, we send the payload through the API and wait for the response
function createPayload() {

    
	//JSON payload
    var payload = {

    "partnerOrderReference" : Math.floor(Math.random() * 999999), //Random Number according to the c# code


    "orderCustomer" : {
        "FirstName": document.getElementById('firstName').value,
        "LastName": document.getElementById('lastName').value,
        "CompanyName": document.getElementById('companyName').value,
        "Address1": document.getElementById('address').value,
        "Address2": document.getElementById('address2').value,
        "City": document.getElementById('city').value,
        "State": document.getElementById('state').value,
        "PostalCode": document.getElementById('postalCode').value,
        "CountryCode": document.getElementById('countryCode').value,
        "Email": document.getElementById('email').value,
        "Phone": document.getElementById('phone').value
    },

    "items" : [ {
        "ItemSequenceNumber": "1",
        "ProductID": select.options[select.selectedIndex].value,
        "Quantity": document.getElementById('quantity').value,
        "ItemFile": document.getElementById("fileLink").value
    } ],

    "shipments" : [ {
        "ShipmentSequenceNumber": "1",
        "FirstName": document.getElementById('firstNameShipping').value,
        "LastName": document.getElementById('lastNameShipping').value,
        "CompanyName": document.getElementById('companyNameShipping').value,
        "Address1": document.getElementById('addressShipping').value,
        "Address2": document.getElementById('address2Shipping').value,
        "City": document.getElementById('cityShipping').value,
        "State": document.getElementById('stateShipping').value,
        "PostalCode": document.getElementById('postalCodeShipping').value,
        "CountryCode": document.getElementById('countryCodeShipping').value,
        "Phone": document.getElementById('phoneShipping').value,
        "ShippingMethod": document.getElementById("shippingMethod").options[document.getElementById("shippingMethod").selectedIndex].value
        }
        ]


    }


    sendPayload.open('POST', "api/values", true);
    sendPayload.setRequestHeader('Content-Type', 'application/json');
    sendPayload.send(JSON.stringify(payload));



}

//Payload sent, waiting on response
//Print out the given order number if the payload is successful
//Otherwise if an error gets past the front-end, we can print out the error directly from the API
sendPayload.onload = function () {

    var orderReply = JSON.parse(this.response);




    //Response successful and we receive an order number
    //sendPayload.status is the internal API
    //orderReply.meta.statusCode is the received PFL API
    if (sendPayload.status == 200 && orderReply.meta.statusCode == 200) {
        document.getElementById("replyContainer").innerHTML = "<span style=\"color:black\">" + "Order Successfully Received. Your Order Number is " + orderReply.results.data.orderNumber + "</span>";
    }
    //Response failed, we will print out all the resulting errors instead.
    else {
        var errorString = "";

        orderReply.results.errors.forEach(error => {
            errorString = errorString + error.dataElementErrors + "<br />";
        })

        document.getElementById("replyContainer").innerHTML = "There was an error in sending out your information." + "<br />" + errorString + "<br />"

    }
}