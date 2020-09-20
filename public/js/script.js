/* For Signup Page */
var uPass = document.getElementById("u-pass");
var uPassConfirm = document.getElementById("u-pass-confirm");
// Password Show Hide by Eye
function viewPassword() {
    var pStatus = document.getElementById("pass-eye");

    if (uPass.type && uPassConfirm.type == "password") {
        uPass.type = "text";
        uPassConfirm.type = "text";
        pStatus.className = "fa fa-eye-slash";
    } else {
        uPass.type = "password";
        uPassConfirm.type = "password";
        pStatus.className = "fa fa-eye";
    }
}

// Match password for color
function matchPass() {
    if (uPass.value === uPassConfirm.value) {
        document.getElementById("labelConfirm").innerHTML = "Password Matched ✔️";
        uPassConfirm.style.color = "#034d22";
        labelConfirm.style.color = "#034d22";
    } else {
        document.getElementById("labelConfirm").innerHTML = "Password Not Matched ❌";
        uPassConfirm.style.color = "#c0392b";
        labelConfirm.style.color = "#c0392b";
    }
}

// Confirm  Password Validate
function validatePassword() {
    if (uPass.value != uPassConfirm.value) {
        uPassConfirm.setCustomValidity("Passwords Don't Match");
    } else {
        uPassConfirm.setCustomValidity('');
    }
}

uPass.onchange = validatePassword();
// uPassConfirm.onkeyup = matchPass;

uPass.onkeyup = function () {
    var smallLetter = /[a-z]/g;
    var capitalLetter = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var all = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;

    // Validate all things same time
    if (uPass.value.match(all)) {
        document.getElementById("pass-strength").style.color = "#034d22";
        uPass.style.color = "#034d22";
    } else {
        // Validate three things same time
        if (
            uPass.value.match(smallLetter) &&
            uPass.value.match(capitalLetter) &&
            uPass.value.match(numbers)
        ) {
            document.getElementById("pass-strength").style.color = "#e67e22";
            uPass.style.color = "#e67e22";
        } else {
            // Validate two things same time
            if (
                (uPass.value.match(smallLetter) &&
                    uPass.value.match(capitalLetter)) ||
                (uPass.value.match(smallLetter) && uPass.value.match(numbers)) ||
                (uPass.value.match(capitalLetter) && uPass.value.match(numbers))
            ) {
                document.getElementById("pass-strength").style.color = "#f39c12";
                uPass.style.color = "#f39c12";
            } else {
                // Validate one things same time
                if (
                    uPass.value.match(smallLetter) ||
                    uPass.value.match(capitalLetter) ||
                    uPass.value.match(numbers)
                ) {
                    document.getElementById("pass-strength").style.color = "#c0392b";
                    uPass.style.color = "#c0392b";
                } else {
                    document.getElementById("pass-strength").style.color = "#39394d";
                    uPass.style.color = "#39394d";
                }
            }
        }
    }
    // Match Pass for u-pass input field
    matchPass();
};

uPassConfirm.onkeyup = function () {
    // These two function call Match Pass for u-pass input field
    matchPass();
    validatePassword();
};

//Validate Email with right pattern
function validateEmail(mail) {
    var eVStatus = document.getElementById("email-check");
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
        eVStatus.className = "fas fa-check-circle";
        return true;
    }

    eVStatus.className = "fas fa-times-circle";
    return false;
}

// UserName Change with Full_Name & remove all spaces
function edValueKeyPress() {
    var fName = document.getElementById("fName");
    var str = fName.value;

    var userName = document.getElementById("uname");
    userName.value = str.replace(/\s/g, "");
}

// User_Name remove all spaces
function AvoidSpace(event) {
    var k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
}

// Reset icons for Email & UName
function resetEmail(duckMail) {
    document.getElementById("email").value = "";
}

function resetUName(username) {
    document.getElementById("uname").value = "";
}

/* Dashboard for Chat_Room */
// Too generate random room keys
// function generate_key() {
//     function randomString(len, arr) {
//         var ans = '';
//         for (var i = len; i > 0; i--) {
//             ans +=
//                 arr[Math.floor(Math.random() * arr.length)];
//         }
//         return ans;
//     }
//     document.getElementById('rKey').value = randomString(7, '12345abc');
// }

// Alert Window for remove account
function removeAlert() {
    var r = confirm("Are you Sure about that! This can Delete Your Account 😥");
    if (r == true) {
        document.getElementById("removeUser").href = "/dashboard/delete";
    } else {
        document.getElementById("removeUser").href = "/dashboard";
    }
}