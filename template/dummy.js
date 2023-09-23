const axios = require('axios');
const fs = require('fs');

// Function to read an image file and encode it as base64
function encodeImageAsBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

// Replace with the actual path to your image file
const imagePath = "C:\\Users\\kisho\\OneDrive\\Desktop\\MyWorks\\SIh Hackathon\\template\\set2\\Fake.jpg";

// Encode the image as base64
const base64Image = encodeImageAsBase64(imagePath);

// Define the API endpoint URL
const apiUrl = 'http://127.0.0.1:5000/api/match'; // Update with the correct URL

// Create a data object with the base64-encoded image
const requestData = {
  file: {
    data: base64Image,
  },
};

// Send the POST request with Axios
axios
  .post(apiUrl, requestData, { responseType: 'arraybuffer' }) // Set responseType to 'arraybuffer' to receive binary data
  .then((response) => {
    // Handle the success response here
    console.log('Response received');

    // Save the response image to a local file
    fs.writeFileSync('response-image.jpg', response.data);

    console.log('Response image saved as response-image.jpg');
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error('Error:');
  });