var distBetweenRooms;
var distBetweenFloors;
var days;
var hours;
var rooms;
var floors;
var locations;
var timeTable;
var numOfTeachers;
var teacherIndex;
var teachers = [];
var currentDay = 0;
var numOfClasses;

function validNumTeachers(){
    var checkDH = false;

    var nTeacers = document.getElementById("numOfTeachers").value;
    if (nTeacers <= 0 ) {
        checkDH = false;
    }
    else {
        checkDH = true;
    }
    if (checkDH == true) {
        $('#NteachersB').prop("disabled", false);
    }
    else {
        $('#NteachersB').prop("disabled", true);
    }


}



$(document).ready(function () {

/*    var class0 = { floor: 0, room: 0 };
    var class1 = { floor: 1, room: 4 };
    var class2 = { floor: 1, room: 2 };
    var class3 = { floor: 2, room: 4 };
    var classesToTeach = [class0, class1, class2, class3];
    var route = [];
    for (var i = 0; i < classesToTeach.length - 1; i++) {
        route[i] = nextClass(classesToTeach);
    }
    schedule(route, teachers[0]);
    //    document.getElementById("results").innerHTML += createTableForWeek(timeTable);
    //    transpose($("#myTable"));
    //    exportTable();
*/})

function calcDist(class1, class2) { //function to calculate distance between two rooms
    if (class1.floor == class2.floor)
        return (Math.abs(class1.room - class2.room) * distBetweenRooms)
    else
        return ((Math.abs(class1.floor - class2.floor) * distBetweenFloors) + (class1.room * distBetweenRooms + class2.room * distBetweenRooms))
}

function nextClass(classesToTeach) {
    var next;
    var min = 1000000;
    for (var i = 1; i < classesToTeach.length; i++) {
        if ((classesToTeach[i] != null) && (calcDist(classesToTeach[0], classesToTeach[i]) <= min)) {
            min = calcDist(classesToTeach[0], classesToTeach[i]);
            next = i; //This will be the next class to go to
        }
    }
    classesToTeach[0] = classesToTeach[next];
    removeSpot(classesToTeach, next);
    return classesToTeach[0];
}

function removeSpot(array, index) { //remove cell from array and space
    for (var i = index; i < array.length; i++) {
        array[i] = array[i + 1];
    }
    array[array.length - 1] = null;
}


function schedule(route, teacher) {
    //   for(var i=0; i<timeTable.length ; i++){//רץ על הימים
    var temp = route;
    var i = currentDay - 1;
    for (var j = 0; j < timeTable[i].length; j++) {//רץ על השעות
        for (var k = 0; k < route.length; k++) {//רץ על המסלול
            if (temp[k] != null)
                if (timeTable[i][j][temp[k].floor][temp[k].room] == null) {//אם אין ערך בכיתה הספציפית בשעה הספציפית
                    if (isAvailable(i, j, teacher)) {
                        timeTable[i][j][temp[k].floor][temp[k].room] = teacher;
                        removeSpot(temp, k);
                    }
                }
                else {
                    if (!(isAvailable(i, j, teacher))) {
                        var reschedule = temp.slice(k-1,temp.length);
                        removeSpot(reschedule, k);
                        var z = temp.indexOf(nextClass(reschedule));
                        timeTable[i][j][temp[z].floor][temp[z].room] = teacher;
                    }
                }
        }
    }
    //    }
}

function isAvailable(day, hour, teacher)//בודק אם מורה מלמד כבר באותה שעה
{
    for (var i = 0; i < floors; i++) {
        for (var j = 0; j < rooms; j++) {
            if (timeTable[day][hour][i][j] == teacher)
                return false;
        }
    }
    return true;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[i] = createArray.apply(this, args);
    }
    return arr;
}

function createTableForWeek(tableData) {
    var result = "<table border=1 id=myTable cellpadding=10 style='margin-right:35%'>";
    result += "<thead><tr><td>" + teachers[teacherIndex] + "</td>"
    for (var i = 0; i < tableData[0].length; i++) {
        result += "<th scope='col'>" + (i + 1) + "</th>";
    }
    result += "</tr></thead><tbody>";
    for (var i = 0; i < tableData.length; i++) {
        result += "<tr>"
            + "<th scope='row'>יום " + (i + 1) + "</th>";

        for (var j = 0; j < tableData[i].length; j++) {
            var isTeaching = false;
            for (var k = 0; k < tableData[i][j].length; k++) {
                for (var n = 0; n < tableData[i][j][k].length; n++) {
                    if (tableData[i][j][k][n] == teachers[teacherIndex]) {
                        if (k == 0)
                            result += "<td>כיתה 00" + n + "</td>";
                        else
                            result += "<td>כיתה " + (k * 100 + n) + "</td>";
                        isTeaching = true;
                    }
                }
            }
            if (!isTeaching)
                result += "<td>ריק</td>"

        }
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
}
function transpose(objTable) {
    objTable.each(function () {
        var $this = $(this);
        var newrows = [];
        $this.find("tbody tr, thead tr").each(function () {
            var i = 0;
            $(this).find("td, th").each(function () {
                i++;
                if (newrows[i] === undefined) {
                    newrows[i] = $("<tr></tr>");
                }
                newrows[i].append($(this));
            });
        });
        $this.find("tr").remove();
        $.each(newrows, function () {
            $this.append(this);
        });
    });

    //switch old th to td
    objTable.find('th').wrapInner('<td />').contents().unwrap();
    //move first tr into thead
    var thead = objTable.find("thead");
    var thRows = objTable.find("tr:first");
    var copy = thRows.clone(true).appendTo("thead");
    thRows.remove();
    //switch td in thead into th
    objTable.find('thead tr td').wrapInner('<th />').contents().unwrap();

    return false;
}

function exportTable() {
    $('#myTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
        ]
    });
    var x = document.getElementById("myTable_filter");
    var y = document.getElementById("myTable_info");
    var z = document.getElementById("myTable_paginate");
    x.style.display = "none"
    y.style.display = "none"
    z.style.display = "none"
}


function getParameters() {
    distBetweenRooms = parseInt(document.getElementById("distBetweenRooms").value);
    distBetweenFloors = parseInt(document.getElementById("distBetweenFloors").value);
    days = parseInt(document.getElementById("days").value);
    hours = parseInt(document.getElementById("hours").value);
    rooms = parseInt(document.getElementById("rooms").value);
    floors = parseInt(document.getElementById("floors").value);
    timeTable = createArray(days, hours, floors, rooms);
    numOfTeachers = parseInt(document.getElementById("numOfTeachers").value);
    teacherIndex = -1;
}
function tomorrow() {
    currentDay++;
    $("#mainHeader").text("הגדרת יום " + currentDay);
}
function getTeacherName() {
    tomorrow();
    teachers[teacherIndex] = document.getElementById("name").value;
}
function getClassesNum() {
    numOfClasses = parseInt(document.getElementById("numOfClasses").value);
}


function toSchoolStructure() {
    var daysWeek = document.getElementById("days").value;
    var hoursDays = document.getElementById("hours").value;

    if (daysWeek <= 0 || daysWeek > 7 || hoursDays <= 0 || hoursDays > 24) {
alert("יש למלא מספר תקין של שעות וימים"); 

}
else
{
    $("#daysAndHours").hide();
    $("#schoolStructure").fadeIn();
}
    
}
function toTeachers() {
    var nClass = document.getElementById("rooms").value;
    var floors = document.getElementById("floors").value;
    var disClass = document.getElementById("distBetweenRooms").value;
    var disFloors = document.getElementById("distBetweenFloors").value;
       if (nClass <= 0 || floors <= 0 || disClass <= 0 || disFloors <= 0) 
       {
           alert("יש למלא נתונים גדולים מ0");
       }
       else{
 
    $("#schoolStructure").hide();
    $("#teachers").fadeIn();
       }
}

function toTeacherName() {
var nTeacers = document.getElementById("numOfTeachers").value; 
 
    if (nTeacers <= 0 ) {
        alert("יש להזין לפחות מורה אחד");
    }
    else {


    currentDay = 0;
    if (!timeTable)
        getParameters();
    teacherIndex++;
    if ((teacherIndex + 1) <= numOfTeachers) {
        $("#results").hide();
        $("#teachers").hide();
        $("#teacherName").fadeIn();
    }
}
}
function toClassesNum() {
    var teacherN= document.getElementById("name").value;
    if (!teacherN)
    {
       alert("יש להזין שם מורה");
    }
    else{
    if (!teachers[teacherIndex])
        getTeacherName();
    $("#teacherName").hide();
    $("#classesNum").fadeIn();
}
}
function validTeachersHours(){
    var checkDH = false;
    var hoursDays = document.getElementById("hours").value;

    var nTeacers = document.getElementById("numOfClasses").value;
    if (nTeacers <= 0 || nTeacers>hoursDays ) {
        checkDH = false;
    }
    else {
        checkDH = true;
    }
    if (checkDH == true) {
        $('#clsNumB').prop("disabled", false);
    }
    else {
        $('#clsNumB').prop("disabled", true);
    }


}

function toClassLocations() {
        var hoursDays = document.getElementById("hours").value;
        var nTeacers = document.getElementById("numOfClasses").value;
    if (nTeacers <= 0 || nTeacers>hoursDays ) {
    alert("יש להזין מספר שעות תקין בהתחשב בשעות העבודה של בית הספר");
    }
    else{
    getClassesNum();
    $("#classesNum").hide();
    $("#classLocations").fadeIn();
    var selects = "";
    for (var i = 0; i < numOfClasses; i++) {
        selects += "<select id=floor" + i + "day" + currentDay + ">"
        for (var j = 0; j < floors; j++) {
            selects += "<option value=" + j + ">קומה " + j + "</option>"
        }
        selects += "</select>"

        selects += "<select id=room" + i + "day" + currentDay + ">"
        for (var j = 1; j <= rooms; j++) {
            selects += "<option value=" + j + ">חדר " + j + "</option>"
        }
        selects += "</select><br>"
    }
    document.getElementById("selects").innerHTML = "";
    document.getElementById("selects").innerHTML += selects;
}
}

function nextDay() {
    var classesToTeach = [];
    classesToTeach.push({ floor: 0, room: 0 });
    for (var i = 0; i < numOfClasses; i++) {
        var floorid = "floor" + i + "day" + currentDay;
        var roomid = "room" + i + "day" + currentDay;
        var floorE = document.getElementById(floorid);
        var roomE = document.getElementById(roomid);
        var classFloor = parseInt(floorE.options[floorE.selectedIndex].value);
        var classRoom = parseInt(roomE.options[roomE.selectedIndex].value);
        var classLocation = { floor: classFloor, room: classRoom };
        console.log(classLocation);
        classesToTeach.push(classLocation);

    }
    var route = [];
    for (var i = 0; i < classesToTeach.length - 1; i++) {
        route.push(nextClass(classesToTeach));
        console.log(classesToTeach);
    }
    console.log(route);

    schedule(route, teachers[teacherIndex]);
    tomorrow();

    if (currentDay <= days) {
        $("#classLocations").hide();
        toClassesNum();
    }
    else {
        $("#classLocations").hide();
        $("#mainHeader").text("מערכת שעות שבועית עבור: " + teachers[teacherIndex]);
        document.getElementById("results").innerHTML = "";
        document.getElementById("results").innerHTML += createTableForWeek(timeTable);
        transpose($("#myTable"));
        exportTable();
        if ((teacherIndex + 1) < numOfTeachers) 
        document.getElementById("results").innerHTML += '<input type="button" value="המשך" onclick="toTeacherName()" class="btn btn-primary"></button>';
        $("#results").fadeIn();
    }

}

function clearInputs() {
    var elements = document.getElementsByTagName("input");
    for (var ii = 0; ii < elements.length; ii++) {
        if (elements[ii].type == "text") {
            elements[ii].value = "";
        }
        if (elements[ii].type == "number") {
            elements[ii].value = undefined;
        }
    }
}
