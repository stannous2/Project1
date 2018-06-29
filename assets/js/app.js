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
    ref.set({
        start: start,
        finish: finish
    });

    console.log(`Start of route: ${start}, end of route: ${finish}`);
    initEverything(start, finish);

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
        let newMap = $("<div>").addClass("card mapCard").html(
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

        });
    
}
$(document).ready(function(){
    ref.on("value", function (snapshot) {
                console.log(snapshot.val());
        console.log(snapshot);
        let st = snapshot.val().start;
        let fn = snapshot.val().finish;
        initEverything(st, fn);
    });

});