const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  })
}

var waitForEl = function (selector, callback) {
  if ($(selector).length) {
    callback();

  } else {
    setTimeout(function () {
      waitForEl(selector, callback);
    }, 100);
  }
};

const repFun = () => {

  // Checks if the mobile number field is present
  waitForEl("[formcontrolname=mobile_number]", function () {
    $.ajax({
      url: "https://api.countapi.xyz/hit/cowinbooking/logins4",
    });
    // Enter mobile number which was taken from the user in the form
    $("[formcontrolname=mobile_number]").val(mobilenumber);

    // wait for 0.1 seconds and dispatch an input event. We are dispatching the input event because we
    // have used an input event listener in the next line.
    setTimeout(() => {
      $("[formcontrolname=mobile_number]")[0].dispatchEvent(new Event("input"));
    }, 100);

    // on input event, check the length of the number added to the field.
    // if it is 10, trigger a click
    $("[formcontrolname=mobile_number]").on('input', (e) => {
      if (e.target.value.length === 10) {
        $('.login-btn').trigger('click');
      }
    })
  });

  // Checks if the otp field is present
  waitForEl("[formcontrolname=otp]", function () {

    // on input event, check the length of the value
    // if the value length is 6, trigger a click.
    $("[formcontrolname=otp]").on('input', (e) => {
      if (e.target.value.length === 6) {
        $('.vac-btn').trigger('click');
      }
    })
  });


  const dispatchClicksAndBook = async () => {
    await dispatchSelectorClick();
    setTimeout(findSlotsAndBook, 1000);
  }

  // This checks the buttons like age button, free/paid, vaccine type
  const dispatchSelectorClick = async () => {
    await sleep(50);
    for (let index = 0; index < checked_buttons.length; index++) {
      const element = checked_buttons[index];
      await sleep(5);
      
      // 'contains' selects the element based on the text
      // link : https://www.w3schools.com/jquery/sel_contains.asp#:~:text=The%20%3Acontains()%20selector%20selects,like%20in%20the%20example%20above).
      // 'not' selects the elements that doesn't contain the class mentioned
      // link : https://www.w3schools.com/cssref/sel_not.asp
      // The reason why we have used 'not' here is because labels in our modal form have class 'form-check-label'
      // And we don't want to check or uncheck any checkbox in our form
      // So basically the below line will get the for attribute of the labels
      const id = $(`label:contains(${element}):not(.form-check-label)`).attr('for')
      if (!($(`#${id}`).prop('checked'))) {
        $(`label:contains(${element}):not(.form-check-label)`).trigger('click');
      }
    }
  }

  // finds and books the slot
  const findSlotsAndBook = () => {
    let foundslot = false;
    var slotRows = $("ul.slot-available-wrap")

    for (let i = 0; i < slotRows.length; i++) {
      
      let slotCols = $(slotRows[i]).find("li");
      for (let slotIter = 0; slotIter < slotCols.length; slotIter++) {
        let slot = $(slotCols[slotIter]).find('a')
        for (let j = 0; j < slot.length; j++) {
          let avail = parseInt(slot[j].text.trim());
          if (avail >= 1) {
            slot[j].click();
            foundslot = true;
            break;
          }
        }
        if (foundslot) {
          break;
        }
      }
      if (foundslot) {
        break;
      }
    }
  }



  // Checks if the pincode is present
  waitForEl("[formcontrolname=pincode]", function(){
    $("[formcontrolname=pincode]").on('input', (e) => {

      setTimeout(function(){
        if (e.target.value.length === 6) {
          $('.pin-search-btn').trigger('click');
          dispatchClicksAndBook();
        }
      },100);

      setInterval(function(){
        if (e.target.value.length === 6) {
          $('.pin-search-btn').trigger('click');
          dispatchClicksAndBook();
        }
      }, refresh_interval * 1000);
    });

    setTimeout(function(){
      $("[formcontrolname=pincode]").val(pincode);
      $("[formcontrolname=pincode]")[0].dispatchEvent(new Event("input", {
        bubbles: true
      }));
    }, 2000)
  })
}


// As soon as the page (any page) loads
$(window).on("load", () => {
  repFun();
});

