/**
* This code was created to create a dynamic reporting form.
*  Updates the form depending on the selected reporting period.
*     1. Hides or shows section B.
*     2. Changes the form title
*     3. changes the form type
* Called upon reporting period selection or OpenExecute
*/


function HideAndShow()
{

// Helps to find the index of the hidden layer
// var aOCGs = this.getOCGs(); 
// for(var i=0; aOCGs && i<aOCGs.length;i++) { 
//     if(aOCGs[i].name == "SectionB") console.println(i); 
// }

// define hashes to map the quarter to the reporting month
var hash = new Object();
 hash["Nov-15"] = "Quarter 1";
 hash["Feb-16"] = "Quarter 2";
 hash["May-16"] = "Quarter 3";
 hash["Aug-16"] = "Quarter 4";

var backhash = new Object();
 backhash["Quarter 1"] = "Nov-15";
 backhash["Quarter 2"] = "Feb-16";
 backhash["Quarter 3"] = "May-16";
 backhash["Quarter 4"] = "Aug-16";

var formName = "A";
// Assig the report type to a variable
var reportType = this.getField("Form Type").value
// Assign the reporting period to meonth
month = this.getField("Reporting Period").value 


// If the reporting period is a quarter
if (month in hash) {
    // Change the Form Type field
    this.getField("Form Type").value = hash[month];
    // Change the title value
    formName += "Q";
    // Set section B fields to visible
    getField("Clients").display = display.visible;
    // Set section B template to visible
    this.getOCGs()[2].state = true;  
} else{
    var enactChange = 4;  // 4 works like a boolean value, set to yes
    if (reportType in backhash) {  // i.e. we're moving from quarterly
        // Let the user choose to clear the fields
        enactChange = app.alert("Changing the reporting period will clear all "
        + "values entered in Section B. Are you sure you want to proceed?",
         1, nType = 2);
    }
    if (enactChange == 4) {  // If the selection is yes
        // Change the Form Type field
        this.getField("Form Type").value = "Monthly";
        //Change the Title Values
        formName += "M"; 
        // Clear the field values
        this.resetForm(["Clients"]);
        // Set section B fields to not visible
        getField("Clients").display = display.hidden;
        // Set section B template to not visible
        this.getOCGs()[2].state = false;
    } else{  // If the selection is no
        event.value = backhash[reportType];  // Put the date back
        formName += "Q"  // Crappy fix
    }
}

// Calculate the Title
this.getField("Title").value = "Program Name\r"
    + this.getField("Form Type").value + " REPORTING FORM\r"
    + event.value.substr(0,3) + " 20" + event.value.substr(4,6) 
    + formName;
}