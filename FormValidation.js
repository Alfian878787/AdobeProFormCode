/**
* Contains the validation scripts for a publicly available reporting form
* This script is called after a commit to specific cells
* The form creator needs to call the appropriate function under Format, custom:
*    e.g. issueWarning(ValidateContracts, 'Please enter a valid value.').
*/
/**
* Checks the format of a field entry to see if it confirms to one of three
*    possibleformats
* <p>
* A blank field is okay
* @param vendorIdField (formField) the field that is being validated
* @return (bool) true if matches, false if note
*/
function ValidateVendor(vendorIdField, val) {
 if (!val) return true;
 return AFExactMatch(/\d{14}/, val);  // should be 14 digits
}


/**
* Checks the format of a field entry to see if it confirms to one of three
*    possibleformats
* <p>
* A blank field is okay
* @param contractField (formField) the field that is being validated
* @return (bool) true if matches, false if note
*/
function ValidateContracts(contractsField, val) {
    if (!val) return true;  
  
    // Set up array of regular expressions  
    var aRE = [  
       /^201\d-\d{6}-\d{3}\D$/,  // 2016-999999-999A
       /^201\d-\d{6}-\d{3}$/,    // 2016-999999-999
       /^201\d-\d{6}$/         // 2016-999999  
    ];  
  
    // See if string matches any of the regular expressions in the array  
    return AFExactMatch(aRE, val);  
}


/**
* Maps the category column number to the total column number.
* Checks to see that the value of the category cell is smaller than the value
*    of the corresponding total cell.
* @param categoryCell (formField) a cell from the servcie category columns
* @return (bool) true if the field is empty or less than the total value; false
*    if the field is greater than the total
*/
function ValidateClients(categoryCell, val) {
    // Map the category column number to the total column number
    if (!val) return true;
    var CatToTotalMap = new Object();
      CatToTotalMap["6"] = "2";
      CatToTotalMap["2"] = "3";
      CatToTotalMap["3"] = "4";
    //Makes a variable for the category
    //Takes the number from the cat cell to get the correct total
    //Gets the corresponding Total cell
    var total = this.getField("Totals." + CatToTotalMap[
        categoryCell.target.name.substr(8, 1)] + "_Z1").value;
    // Checks if the fields are blank and, if so, returns true because that's OK
    if (!(total.length < 1) && !(val <= total)) return false;
    return true;
}


/**
* Makes sure Client totals are less than total overall and more than any totals
*    from the category column
* <p>
* Creates an array out of all category cells and then
*    Loops through the array and checks if the cells are in the column that
*    corresponds to that total.
* Checks each category cell value to make sure total > cat
* @param totalCell (formField) a cell from the Totals row
* @return (bool) true if the total value is empty or greater than any category
*    value; false if the total value is less than the category value
*/
function ValidateTotals(totalCell, total) {
    //  Maps the total cell number to the category column number
    var totalToCatMap = new Object();
        totalToCatMap["2"] = "6";
        totalToCatMap["3"] = "2";
        totalToCatMap["4"] = "3";

    if(!total) return true; // if the total cell is blank, it's okay
    else {
        var totalCellNumber = totalCell.target.name.substr(7, 1);
        var clientsArray = this.getField("Clients").getArray();
        for(var j = 0; j < clientsArray.length; j++) {
            var catCell = clientsArray[j];
            if (catCell.name.substr(8,1) == totalToCatMap[totalCellNumber]) {
                var val = catCell.value;
                if(!(val.length < 1) && !(val <= total)) return false;
            }
        }
        return true;
    }
}


/**
* Check upon commit.
* If validation is false, alert the user and reject the value
* @param func (function) tests validation
* @param msg (string) warning message to pass to app.alert
* @return event.rc(event?) will let the application know if it should commit
*   the value
*/
function issueWarning(func, msg) {
    event.rc = true;
    if (event.willCommit) {
        if (!func(event, event.value)){
            app.alert(msg, 1);
            console.println("trigger for: " + msg);
            event.rc = false;
        }
    }
}


//Loops through all the document fields
//Checks if they are client fields or totals
//Runs the validation for that type of field
n_fields = this.numFields;
for (i=0; i<n_fields; i++) {
    var fieldName = this.getNthFieldName(i);
    var myField = this.getField(fieldName);
    var callback;
    myField.setAction('Format', "")
    myField.setAction('Calculate', "")
    myField.setAction('Validate', "")
    if (fieldName.substr(0,16) == "Reporting Period"){
        myField.setAction('Calculate',"HideAndShow();")
    }
    else if (fieldName.substr(0,15) == "Header_VendorID"){ 
        callback = "issueWarning(ValidateVendor, 'Please enter a valid value (14 digits).');";
    }
    else if (fieldName.substr(0,21) == "Header_ContractNumber"){ 
        callback = "issueWarning(ValidateContracts, 'Please enter a valid value.');";
    }
    else if (fieldName.substr(0, 7) == "Clients"){ 
        callback = "issueWarning(ValidateClients, 'Service category YTD totals cannot exceed total number of clients.');";
    }
    else if (fieldName.substr(0, 6) == "Totals"){ 
        callback = "issueWarning(ValidateTotals, 'Service category YTD totals cannot exceed total number of clients.');";
    }
    else callback = "";
    myField.setAction('Keystroke', callback)
}