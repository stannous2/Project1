// let queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin=UC%20San%20Diego%20(UCSD)%20Extension%20-%20University%20City%20Center,%206256%20Greenwich%20Dr,%20San%20Diego,%20CA%2092122%20Extension&destination=9315%20Lamar%20St.&key=AIzaSyCU_10Ic1oE-JF170mFEgNs87rnjTRJbFE";
// $.ajax({
//     url: "https://cors-anywhere.herokuapp.com/" + queryURL,
//     method: "GET"
// }).then(function (direction) {

//     steps.forEach(step => {
//         let newDiv = $("<p>").html(`In ${step.distance.text}, ${step.html_instructions}`);
//         $('.directionsDiv').append(newDiv);
//     });
// })
    
$(document).on("click", "#submitButton", function(){
    event.preventDefault();
    $("#mapDiv").empty();
    let start = $("#start").val();
    let finish = $("#finish").val();
    console.log(`Start of route: ${start}, end of route: ${finish}`);
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
    }).then(function(direction){
        let directions = direction.routes[0].legs;
        let steps = directions[0].steps;
        console.log(steps);
        $('.mapCard').append(`<div class="card-content" id="directionsHeader" data-state="open"><i class="material-icons">place</i> Directions</div>`);
        let directionsDiv = $("<div>").addClass("card scale-transition directionsDiv");
        directionsDiv.html( `
            <div class="card-content"><ul id="directionsList"></ul></div>`);
        $('#mapDiv').append(directionsDiv);
        steps.forEach(step => {
            let listItem = $('<li>');
            listItem.html(`In ${step.distance.text}, ${step.html_instructions}`);
            $('#directionsList').append(listItem);
            
        });
        initThing();
    });
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

})
