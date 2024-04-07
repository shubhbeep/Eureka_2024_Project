// Import required modules
const express = require('express');
const bodyParser = require('body-parser'); //Require further
// const axios = require('axios');
const ejs = require('ejs');
const path = require('path'); // Import the path module




// Create an Express application
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));



// Define routes

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile('/home/ambhi/Desktop/archive (3)/cleaned_dataset/public/index.html');
});
// Route for the form page
app.get('/form', (req, res) => {
  res.sendFile('/home/ambhi/Desktop/archive (3)/cleaned_dataset/public/form.html');
});
// Route for the about page
app.post('/form', (req, res) => {
    var Voltage_measured= req.body.Voltage_measured;
    var Current_measured = req.body.Current_measured;
    var Temperature_measured = req.body.Temperature_measured;
    var Current_load = req.body.Current_load;
    var Voltage_load = req.body.Voltage_load;
    var Time = req.body.Time;
    // Import the addon
    const tpAddon = require('./tp.node');

    // Call the function defined in the addon
    var result = tpAddon.predict([Voltage_measured, Current_measured, Temperature_measured, Current_load, Voltage_load, Time]);
    console.log(result);
    result = parseFloat(result.toFixed(10));
    console.log(result);
    var res_json = {"Result": result};

    var c_init = 1.6743050000;
    var no_of_cycles = 3000  //Lithium ion total cycles
    var degradation = ((c_init - result)/(c_init))*100;
    var RUL_degrade_cycles = ((degradation)/100)*(no_of_cycles);
    var RUL = no_of_cycles - RUL_degrade_cycles;
    var RUL_json = {"RUL": RUL};
    console.log(RUL);


    res.render("prediction",{"RUL": RUL,"life_remaining_perc": (100-degradation)});


    

    

});

// Route for the contact page
// app.get('/contact', (req, res) => {
//   res.send('This is the contact page');
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
