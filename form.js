const buttonCheckboxMapping = {
    age18checkbox: {
        labelId: "age18checkboxlabel",
        label: "18 & Above",
        checked: false
    },
    age18to44checkbox: {
        labelId: "age18to44checkboxlabel",
        label: "18-44 Only",
        checked: false
    },
    age45checkbox: {
        labelId: "age45checkboxlabel",
        label: "45 & Above",
        checked: false
    },
    covishieldcheckbox: {
        labelId: "covishieldcheckboxlabel",
        label: "Covishield",
        checked: false
    },
    covaxincheckbox: {
        labelId: "covaxincheckboxlabel",
        label: "Covaxin",
        checked: false
    },
    sputnikcheckbox: {
        labelId: "sputnikcheckboxlabel",
        label: "Sputnik V",
        checked: false
    },
    freecheckbox: {
        labelId: "freecheckboxlabel",
        label: "Free",
        checked: false
    },
    paidcheckbox: {
        labelId: "paidcheckboxlabel",
        label: "Paid",
        checked: false
    }
}


let mobilenumber = window.localStorage.getItem("mobile");
let pincode = window.localStorage.getItem("pincode");
let timeslotind = window.localStorage.getItem("timeslot");
let selected_button_checkbox = window.localStorage.getItem("selectedbuttoncheckboxes")
let autorefreshinterval = window.localStorage.getItem("autorefreshinterval");

let checked_buttons = [];

const setCheckedButtons = (selected_button_checkbox) => {
    checked_buttons = [];
    for (let i = 0; i < selected_button_checkbox.length; i++) {
        if (buttonCheckboxMapping[selected_button_checkbox[i]]) {
            buttonCheckboxMapping[selected_button_checkbox[i]].checked = true;
            checked_buttons.push(buttonCheckboxMapping[selected_button_checkbox[i]].label)
        }
    }
}

try {
    selected_button_checkbox = JSON.parse(selected_button_checkbox)
    setCheckedButtons(selected_button_checkbox)
} catch (error) {
    console.log('There was an error setting the filter checkboxes')
}

refresh_interval = parseInt(autorefreshinterval);
if (isNaN(refresh_interval)) refresh_interval = 15;

const createInput = (id, style, type, value, className) => {
    let retel = document.createElement("input");
    retel.id = id;
    retel.type = type;
    retel.style = style;
    retel.value = value;
    retel.className = className
    return retel;
}

const createLabel = (id, forid, labelText, style, className = "form-label") => {
    let retel = document.createElement("label");
    retel.id = id;
    retel.setAttribute("for", forid);
    retel.appendChild(document.createTextNode(labelText));
    retel.style = style;
    retel.className = className
    return retel;
}

const createWarningText = (warningtext, style) => {
    let retel = document.createElement('div');
    retel.className = "form-text"
    retel.appendChild(document.createTextNode(warningtext));
    retel.style = style;
    return retel;
}

const createSelectInput = (id, style, value) => {
    let retel = document.createElement("select");
    retel.style = style;
    retel.id = id;
    retel.value = value;
    retel.className = 'form-select';
    return retel;
}

const createSelectOptions = (id, text, value, selected) => {
    let retel = document.createElement("option");
    retel.id = id;
    retel.value = value;
    retel.appendChild(document.createTextNode(text));
    if (selected) retel.selected = true;
    return retel;
}

const createForm = () => {

    // basic styles : reused
    let textLabelStyles = "color: black";
    let warnLabelStyles = "color: red";

    // parent div for form
    let wrapperDiv = document.createElement("div");
    wrapperDiv.id = "formWrapper";

    // mobile number input field
    let mobileinputid = "data-mob";
    let mobileInput = createInput(mobileinputid, "", "number", mobilenumber, 'form-control');
    let mobileLabel = createLabel("mobileinputlabel", mobileinputid, "Mobile number", textLabelStyles);
    let mobileNumberWarn = createWarningText(
        "You will have to enter the 10th digit in the actual website form to proceed with automation.",
        warnLabelStyles
    )

    // pin code field
    let pincodeinputid = "pincodeinput";
    let pincodeinput = createInput(pincodeinputid, "", "number", pincode, 'form-control');
    let pincodelabel = createLabel("pincodeinputlabel", pincodeinputid, "PIN Code", textLabelStyles);
    let pincodewarn = createWarningText("You will have to enter the 6th digit in the actual website form manually to proceed with automation.", warnLabelStyles);

    let autorefreshintervalid = "autorefreshintervalinput";
    let autorefreshintervalinput = createInput(autorefreshintervalid, "", "number", autorefreshinterval, 'form-control');
    let autorefreshintervallabel = createLabel("autorefreshintervallabel", autorefreshintervalid, "Refresh interval (seconds)", textLabelStyles);
    let autorefreshintervalinputwarn = createWarningText("Setting this value to a very low number may cause too many refreshes in short time span leading to 'Something Went Wrong Errors'. Default = 15", warnLabelStyles);
    autorefreshintervalinput.min = 1;

    let timeslotinputid = "timeslotinput";
    let timeSlotSelector = createSelectInput(timeslotinputid, "", timeslotind)
    let one = createSelectOptions("timeSlot-1", "Slot 1: 9:00 am to 11:00 am", '1', timeslotind === '1')
    let two = createSelectOptions("timeSlot-2", "Slot 2: 11:00 am to 1:00 pm", '2', timeslotind === '2')
    let three = createSelectOptions("timeSlot-3", "Slot 3: 1:00 pm to 3:00 pm", '3', timeslotind === '3')
    let four = createSelectOptions("timeSlot-4", "Slot 4: 3:00 pm to 5:00 pm", '4', timeslotind === '4')
    timeSlotSelector.appendChild(one)
    timeSlotSelector.appendChild(two)
    timeSlotSelector.appendChild(three)
    timeSlotSelector.appendChild(four)
    let timeslotlabel = createLabel("timeslotinputlabel", timeslotinputid, "Enter time slot preference: ", textLabelStyles);
    let timeslotwarn = createWarningText("If the preferred slot is not available, first slot will be selected automatically.", warnLabelStyles);

    let buttonCheckBoxes = []
    for (const key in buttonCheckboxMapping) {
        //wrapInDivWithClassName([wrapInDivWithClassName([age18CheckboxButton, age18CheckboxLabel], 'form-check')], 'col')
        let button = createInput(key, "", "checkbox", "", "form-check-input");
        button.checked = buttonCheckboxMapping[key].checked;
        let label = createLabel(buttonCheckboxMapping[key].labelId, key, buttonCheckboxMapping[key].label, textLabelStyles, "form-check-label")
        buttonCheckBoxes.push(wrapInDivWithClassName([wrapInDivWithClassName([button, label], 'form-check')], 'col'))
    }
    let buttonCheckboxLabel = createLabel("", "", "Select Filters", textLabelStyles)

    // add components to wrapper div
    // For bootstrap check : https://getbootstrap.com/docs/5.0/forms/layout/ 

    wrapperDiv.appendChild(wrapInDivWithClassName(
        [
            wrapInDivWithClassName([mobileLabel, mobileInput], "col"),
            wrapInDivWithClassName([pincodelabel, pincodeinput], "col")
        ], 'row mb-3'))

    wrapperDiv.appendChild(wrapInDivWithClassName(
        [
            wrapInDivWithClassName([timeslotlabel, timeSlotSelector, timeslotwarn], "col"),
            wrapInDivWithClassName([autorefreshintervallabel, autorefreshintervalinput, autorefreshintervalinputwarn], 'col')
        ], 'row mb-3'))

    wrapperDiv.appendChild(wrapInDivWithClassName([buttonCheckboxLabel].concat(buttonCheckBoxes), 'row mb-3'))

    // add form
    document.getElementById('form-modal-body').appendChild(wrapperDiv)
}

const wrapInDivWithClassName = (children, className) => {
    let divWrapper = document.createElement('div')
    divWrapper.className = className;
    for (var i = 0; i < children.length; i++) divWrapper.appendChild(children[i])
    return divWrapper;
}

const createHideShowButton = () => {
    $("#formWrapper").hide();
    let formShowHide = document.createElement("button");
    formShowHide.id = "formshowhidebutton";
    formShowHide.appendChild(document.createTextNode("click to edit the autofill inputs"));
    formShowHide.style = "background: red; position: sticky; top:0; left: 0; font-size: 32px; border-radius: 20px;";
    document.body.appendChild(formShowHide);
    $('#formshowhidebutton').on('click', () => {
        $("#formWrapper").toggle();
    })
}

const bindSubmitButtonToSaveInfo = () => {
    let submitbtn = document.getElementById("data-submit");
    submitbtn.addEventListener("click", () => {
        mobilenumber = document.getElementById("data-mob").value;
        pincode = document.getElementById("pincodeinput").value;
        timeslotind = document.getElementById("timeslotinput").value;
        autorefreshinterval = document.getElementById("autorefreshintervalinput").value;
        selected_button_checkbox = []
        for (const key in buttonCheckboxMapping) {
            let button_checkbox = document.getElementById(key);
            buttonCheckboxMapping[key].checked = button_checkbox.checked;
            if (button_checkbox.checked) {
                selected_button_checkbox.push(key)
            }
        }
        window.localStorage.setItem("mobile", mobilenumber);
        window.localStorage.setItem("pincode", pincode);
        window.localStorage.setItem("timeslot", timeslotind);
        window.localStorage.setItem("selectedbuttoncheckboxes", JSON.stringify(selected_button_checkbox))
        window.localStorage.setItem("autorefreshinterval", autorefreshinterval);
        window.location.reload();
    })
}

// Outline of the form
// This is known as modal
// Link : https://getbootstrap.com/docs/4.0/components/modal/#live-demo 
const createModal = () => {
    let wrapperDiv = document.createElement("div");
    wrapperDiv.className = "modal fade";
    wrapperDiv.id = 'form-modal'
    let modal = `
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          
          <div clsss="row">
            <div class="col">
              <h5 class="modal-title">Autofill Input Form</h5>
            </div>
            
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" id="form-modal-body">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="data-submit" data-bs-dismiss="modal">Save changes</button>
        </div>
      </div>
    </div>
    `
    wrapperDiv.innerHTML = modal;

    document.body.appendChild(wrapperDiv);
}

// The red button on the top left corner
const createModalHideShowButton = () => {
    let wrapperDiv = document.createElement("div");
    let button = `
    <button type="button" class="btn btn-danger btn-lg" style="position:absolute; top:2%; left: 2%;" data-bs-toggle="modal" data-bs-target="#form-modal"><span class="row"><span id="cb-btn-title">Edit Auto Fill Inputs</span><span id="cb-timer"></span></span></button>`
    wrapperDiv.innerHTML = button;
    document.body.appendChild(wrapperDiv);
}


const createFormAndOthers = () => {
    createModal();
    createModalHideShowButton();
    createForm();
    bindSubmitButtonToSaveInfo();
}

createFormAndOthers();