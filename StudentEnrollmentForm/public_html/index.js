/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const connToken = "90935017|-31949211437685186|90958851";
const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";

$(document).ready(function () {
    $("#rollNo").focus();
    $("#rollNo").on("change", checkRollNo);
});

function checkRollNo() {
    let rollNoVar = $("#rollNo").val();
    if (rollNoVar === "") {
        alert("Roll No is required");
        resetForm();
        return;
    }

    let getReqStr = createGET_BY_KEYRequest(connToken, dbName, relName, JSON.stringify({rollNo: rollNoVar}));
    jQuery.ajaxSetup({async: false});
    let resultObj = executeCommandAtGivenBaseUrl(getReqStr, "http://api.login2explore.com:5577", "/api/irl");
    jQuery.ajaxSetup({async: true});

    if (resultObj.status === 400) {
        // New record
        enableSaveMode();
    } else if (resultObj.status === 200) {
        // Existing record
        fillData(resultObj.data);
        enableUpdateMode();
    }
}

function enableSaveMode() {
    $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", false);
    $("#saveBtn, #resetBtn").prop("disabled", false);
    $("#updateBtn").prop("disabled", true);
    $("#fullName").focus();
}

function enableUpdateMode() {
    $("#rollNo").prop("disabled", true);
    $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", false);
    $("#updateBtn, #resetBtn").prop("disabled", true);
    $("#updateBtn, #resetBtn").prop("disabled", false);
    $("#fullName").focus();
}

function validateAndGetFormData() {
    let rollNoVar = $("#rollNo").val();
    let fullNameVar = $("#fullName").val();
    let studentClassVar = $("#studentClass").val();
    let birthDateVar = $("#birthDate").val();
    let addressVar = $("#address").val();
    let enrollDateVar = $("#enrollDate").val();

    if (!rollNoVar || !fullNameVar || !studentClassVar || !birthDateVar || !addressVar || !enrollDateVar) {
        alert("All fields are required");
        return "";
    }

    let jsonStrObj = {
        rollNo: rollNoVar,
        fullName: fullNameVar,
        studentClass: studentClassVar,
        birthDate: birthDateVar,
        address: addressVar,
        enrollDate: enrollDateVar
    };
    return JSON.stringify(jsonStrObj);
}

function saveStudent() {
    let jsonStr = validateAndGetFormData();
    if (jsonStr === "")
        return;

    let putReqStr = createPUTRequest(connToken, jsonStr, dbName, relName);
    jQuery.ajaxSetup({async: false});
    let resultObj = executeCommandAtGivenBaseUrl(putReqStr, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});
    alert("Record Saved Successfully!");
    resetForm();
}

function updateStudent() {
    let jsonStr = validateAndGetFormData();
    if (jsonStr === "")
        return;

    let updateReqStr = createUPDATERecordRequest(connToken, jsonStr, dbName, relName, JSON.stringify({rollNo: $("#rollNo").val()}));
    jQuery.ajaxSetup({async: false});
    let resultObj = executeCommandAtGivenBaseUrl(updateReqStr, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});
    alert("Record Updated Successfully!");
    resetForm();
}

function fillData(data) {
    let record = JSON.parse(data).record;
    $("#fullName").val(record.fullName);
    $("#studentClass").val(record.studentClass);
    $("#birthDate").val(record.birthDate);
    $("#address").val(record.address);
    $("#enrollDate").val(record.enrollDate);
}

function resetForm() {
    $("#studentForm")[0].reset();
    $("#rollNo").prop("disabled", false);
    $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", true);
    $("#saveBtn, #updateBtn, #resetBtn").prop("disabled", true);
    $("#rollNo").focus();
}