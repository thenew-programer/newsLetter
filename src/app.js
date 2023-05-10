const express = require('express');
const parser = require('body-parser');
const https = require('https');

const PORT = 3000;
// App config
const app = express();
app.use(express.static("../public"));
app.use(parser.urlencoded({ extended: true }));


// MailChimp cordinates
let status = 0;
const list_id = '76b3dd9a29';
const api_key = '3682d566592fe5898279c01282fe8073-us17';
const url = 'https://us17.api.mailchimp.com/3.0/lists/' + list_id;
const options = {
	method: 'POST',
	auth: 'user:' + api_key
};


// get method
app.get("/", (req, res) => {
	console.log("root route working...");
	res.sendFile(__dirname + '/signup.html');
});

// Post method
app.post('/signup', (req, res) => {
	console.log("sign Up post request...");

	// Parsing member data
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;

	// Member details
	const data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				}
			}
		]
	};
	// Turning the data to a json object
	const jsonData = JSON.stringify(data);


	// API request
	const request = https.request(url, options, (response) => {

		console.log('Status:', response.statusCode);
		if (response.statusCode === 200) {
			// SHow the user a nice page telling him that his sign up 
			// complited successfully
			res.sendFile(__dirname + '/success.html');
		} else {
			// Show the user that his sign up goes wrong and he needs to repeat
			res.sendFile(__dirname + '/failure.html');
		}


		response.on('data', (data) => {
			console.log(JSON.parse(data));
		})
	})

	// Sending the data to the newsletter provider.
	request.write(jsonData);
	request.end();

});


app.post("/failure", (req, res) => {
	res.redirect("/");
});





// Server listening
app.listen(process.env.PORT || PORT, () => {
	console.log("Server is running on port 3000...");
});
