var config = {
    apiKey: "AIzaSyCwj3nNjRTPn5PgTSa-rNyQzjCHSsekWDE",
    authDomain: "zane-bootcamp.firebaseapp.com",
    databaseURL: "https://zane-bootcamp.firebaseio.com",
    projectId: "zane-bootcamp",
    storageBucket: "zane-bootcamp.appspot.com",
    messagingSenderId: "486463334849"
};
firebase.initializeApp(config);

const DATABASE = firebase.database();
const ref = DATABASE.ref("travel");
    
$(document).on("click", "#submitButton", function(){
    event.preventDefault();
    let start = $("#start").val();
    let finish = $("#finish").val();
    if(start == "" & finish == ""){
        M.toast({
            html: 'Please enter some values!'
            
        })
        return 0;
    }
    ref.set({
        start: start,
        finish: finish
    });

    console.log(`Start of route: ${start}, end of route: ${finish}`);

});

$(document).on("click", "#directionsHeader", function(){
    var state = $(this).attr("data-state");
    if (state === "open") {
        $('.directionsDiv').addClass("scale-out");
        $(this).attr("data-state", "closed");
    } else {

        $('.directionsDiv').removeClass("scale-out");
        $(this).attr("data-state", "open");
    }

});

function initEverything(start, finish) {
        $("#mapDiv").empty();
        $("#weather-data").empty();
        let newMap = $("<div>").addClass("card mapCard z-depth-3").html(
            `<div class="card-image"><iframe frameborder = "0" height = "450px"style = "border:0; display:block; width:100%" src="https://www.google.com/maps/embed/v1/directions?origin=${start}&destination=${finish}&key=AIzaSyCU_10Ic1oE-JF170mFEgNs87rnjTRJbFE" allowfullscreen></iframe></div>
        `
        );
        $("#mapDiv").append(newMap);

        $("#start").val("");
        $("#finish").val("");
        let queryURL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${finish}&key=AIzaSyCU_10Ic1oE-JF170mFEgNs87rnjTRJbFE`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (direction) {
            let directions = direction.routes[0].legs;
            let steps = directions[0].steps;
            console.log(steps);
            $('.mapCard').append(`<div class="card-content" id="directionsHeader" data-state="open"><i class="material-icons">place</i> Directions</div>`);
            let directionsDiv = $("<div>").addClass("card scale-transition directionsDiv");
            directionsDiv.html(`
            <div class="card-content"><ul id="directionsList"></ul></div>`);
            $('#mapDiv').append(directionsDiv);
            steps.forEach(step => {
                let listItem = $('<li>');
                listItem.html(`In ${step.distance.text}, ${step.html_instructions}`);
                $('#directionsList').append(listItem);

            });
            console.log(directions);
            let lat = directions[0].end_location.lat;
            let lon = directions[0].end_location.lng;
            console.log(`Latitude: ${lat}, longitude: ${lon}`)

                let queryURL2 = "https://api.openweathermap.org/data/2.5/find?&APPID=b06819dc1e78aaad6ffe9488eb5b61d9&lat=" + lat + "&lon=" + lon;
        
                $.ajax({
                    url: queryURL2,
                    method: "GET"
                })
                .then(function(response) {
        
                console.log(response);
                let results = response;
        
                let mainTemp = parseInt(Math.floor(results.list[0].main.temp*(9/5) - 459.67));
                
                let rain = results.list[0].rain;
                let wind = results.list[0].wind.speed;
                let cloud = results.list[0].clouds.all;
                let snow = results.list[0].snow;
        
        
                console.log(mainTemp);
        
                console.log(parseInt(mainTemp));
        
                console.log(mainTemp);
        
                let weatherImg = "";
                let additionalImg = "";
        
                
                if (mainTemp > 40 && mainTemp < 60 && cloud === 0) {
                    weatherImg = "./assets/images/sunny.png"
                    additionalImg = "./assets/images/cold.png" 
                }

                else if (mainTemp > 65) {
                    weatherImg = "./assets/images/sunny.png"
                    additionalImg = "./assets/images/hot.png" 
                }

                else if (mainTemp > 65 && cloud === 0) {
                    weatherImg = "./assets/images/sunny.png"
                    additionalImg = "./assets/images/hot.png" 
                }

                else if (mainTemp > 65 && cloud > 0) {
                    weatherImg = "./assets/images/rainy.png"
                    additionalImg = "./assets/images/hot.png" 
                }

                else if (mainTemp > 65 && rain > 0) {
                    weatherImg = "./assets/images/rainy.png"
                    additionalImg = "./assets/images/hot.png" 
                }
        
                else if (mainTemp > 40 && mainTemp < 65 && cloud > 0) {
                    weatherImg = "./assets/images/sunny.png"
                    additionalImg = "./assets/images/clouds.png" 
                }
                
                else if (mainTemp > 80 && cloud > 0) {
                    weatherImg = "./assets/images/sunny-clouds.png" 
                    additionalImg = "./assets/images/hot.png" 
                }
        
                else if (mainTemp > 80 && cloud === 0) {
                    weatherImg = "./assets/images/sunny.png"
                }
        
                else if (mainTemp > 40 && mainTemp < 65 && snow > 0) {
                    weatherImg = "./assets/images/sunny.png"
                    additionalImg = "./assets/images/snow.png" 
                }
                
                
                let highTemp = Math.floor(results.list[0].main.temp_max*(9/5) - 459.67);
                let lowTemp = Math.floor(results.list[0].main.temp_min*(9/5) - 459.67);
        
                console.log(results);

                $('#weather-data').empty();
        


                $('#weather-data').append(
                    `
                    <div class="card z-depth-3">
                    <div class="card-image">
                    <div class="weather-row" style="background-color: 
                    #2660A1">
                    <div><img src="${weatherImg}" height="100px" width="100px" style="width: auto;"></div>
                    <div><img src="${additionalImg}"height="100px" width="100px" style="width: auto;"></div>
                    </div>
                    </div>
                    <h5>Temperature: ${mainTemp} °F</h5>
                    <h5>Highs: ${highTemp} °F</h5>
                    <h5>Lows: ${lowTemp} °F</h5>
                    <h5>Pressure: ${results.list[0].main.pressure}mm</h5>
                    </div>
                    
                    `
                )
                
         })
        
        
        
        })
        };
    
$(document).ready(function(){
    ref.on("value", function (snapshot) {
                console.log(snapshot.val());
        console.log(snapshot);
        let st = snapshot.val().start;
        let fn = snapshot.val().finish;
        initEverything(st, fn);
    });
    M.toast({
        html: 'Welcome back!'
    })

});