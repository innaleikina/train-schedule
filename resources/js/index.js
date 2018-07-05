$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDhZZrNhGjsrW-6raDlFcNMq1V5x2vdaIM",
        authDomain: "train-scheduler-65987.firebaseapp.com",
        databaseURL: "https://train-scheduler-65987.firebaseio.com",
        projectId: "train-scheduler-65987",
        storageBucket: "",
        messagingSenderId: "151017274389"
    };
    firebase.initializeApp(config);

    function logIn() {
        function newLogInHappened(user) {
            if (user) {
                display(user);
            } else {
                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithRedirect(provider);
            }
        }

        firebase.auth().onAuthStateChanged(newLogInHappened);
    }

    function display(user) {
        $("#clientName").text(user.displayName);
    }

    window.onload = logIn;

    var database = firebase.database();

    var trainNum = 4;

    var trainsArr = [
        train = {
            name: "Apple Express",
            destination: "New York",
            startTime: "1:30",
            frequency: "25"
        },

        train2 = {
            name: "Windy Express",
            destination: "Chicago",
            startTime: "12:00",
            frequency: "120"
        },

        train3 = {
            name: "Sunny Express",
            destination: "San Francisco",
            startTime: "13:15",
            frequency: "15"
        },

        train4 = {
            name: "Foreign Express",
            destination: "Montreal",
            startTime: "17:12",
            frequency: "1440"
        }
    ]

    $("#form-submit-btn").on("click", function (event) {
        event.preventDefault();
        trainNum++;
        var newTrain = "train" + trainNum;
        // console.log(newTrain);
        trainsArr.push(newTrain = {
            name: $("#name-input").val().trim(),
            destination: $("#destination-input").val().trim(),
            startTime: $("#start-time-input").val().trim(),
            frequency: $("#frequency-input").val().trim()

        })
        // console.log(newTrain);
        console.log(trainsArr);
        for (var i = 0; i < trainsArr.length; i++) {
            if (i >= 4) {
                database.ref().push(trainsArr[i]);
                // console.log("its greater than4")
            }
        }

    })

    //display existing trains
    for (var i = 0; i < trainsArr.length; i++) {
        var startTimeConverted = moment(trainsArr[i].startTime, "HH:mm").subtract(1, "years");
        // console.log(firstTimeConverted);

        var diffTime = moment().diff(moment(startTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);


        // Time apart (remainder)
        var remainder = diffTime % trainsArr[i].frequency;
        // console.log(remainder);

        // Minute Until Train
        var minutesTillTrain = trainsArr[i].frequency - remainder;
        // console.log("MINUTES TILL TRAIN: " + minutesTillTrain);

        // Next Train
        var nextTrain = moment().add(minutesTillTrain, "minutes").format("ddd,  MMMM Do hA");
        //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


        var newRow = $("<tr>").append(
            $("<td>").text(trainsArr[i].name),
            $("<td>").text(trainsArr[i].destination),
            $("<td>").text(trainsArr[i].frequency + "m"),
            $("<td>").text(nextTrain),
            $("<td>").text(minutesTillTrain + "m")
        );

        // Append the new row to the table
        $("table").append(newRow);

    }


    //get info from the database 
    database.ref().on("child_added", function (childSnapshot) {
        // console.log(childSnapshot.val());

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var startTime = childSnapshot.val().startTime;
        var frequency = childSnapshot.val().frequency;

        var startTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
        // console.log(firstTimeConverted);

        var diffTime = moment().diff(moment(startTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);


        // Time apart (remainder)
        var remainder = diffTime % frequency;
        // console.log(remainder);

        // Minute Until Train
        var minutesTillTrain = frequency - remainder;

        //console.log("MINUTES TILL TRAIN: " + minutesTillTrain);

        // Next Train
        var nextTrain = moment().add(minutesTillTrain, "minutes").format("ddd,  MMMM Do hA");
        // nextTrain = moment().format("ddd,hA");



        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),

            $("<td>").text(frequency + "m"),
            $("<td>").text(nextTrain),
            $("<td>").text(minutesTillTrain + "m")


        );

        // Append the new row to the table
        $("table").append(newRow);
    });


});