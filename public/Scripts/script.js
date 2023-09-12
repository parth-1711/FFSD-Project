function validation() {
    var uname=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    if (uname==="" || password==="") {
        document.getElementById("submit-btn").disabled=true;
    }
    const passwordExpr = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
    if (passwordExpr.test(password) ) {
        document.getElementById("submit-btn").disabled=false;
        document.getElementById("submit-btn").classList.remove("hidden");
        document.getElementById("warning").classList.add("hidden");
    }
    else{
        document.getElementById("warning").classList.remove("hidden");
    }
    // console.log(uname);
    // console.log(password);
}

  function checkEmailAvailability() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    const emailAvailabilitySpan = document.getElementById('email-availability');

    if (email.trim() === '') {
      emailAvailabilitySpan.textContent = '';
      return;
    }

    // Send an Ajax request to the server to check email availability
    fetch('/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.available) {
          emailAvailabilitySpan.textContent = 'Email is available.';
        } else {
          emailAvailabilitySpan.textContent = 'Email is already registered.';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  

function checkEmail(email) {
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}$');
    let emailStatusDiv = document.getElementById("email-status");

    if (regex.test(email)) {
        emailStatusDiv.classList.add('hidden');

        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                let res = JSON.parse(xhr.response);
                if (!res["isNotpresent"]) {
                    emailStatusDiv.style.color = 'red'
                    emailStatusDiv.style.fontSize = "10px"
                    emailStatusDiv.innerText = "Email is already taken. Please choose another.";
                    emailStatusDiv.classList.remove('hidden');
                }
            }
        };

        xhr.open('GET', `http://localhost:80/signupajax/${email}`);
        xhr.send();
        return true;
    } else {
        emailStatusDiv.innerText = "Please enter a valid email address.";
        emailStatusDiv.classList.remove('hidden');
        return false;
    }
}

// async function deleteUser()
// {
//     let userName = document.getElementById("username");

//       let resp = await fetch(`/ConfirmRemoval/${userName}`,{
//           method:'POST',
//           headers:
//           {
//             'Content-Type':'application/json',
//           },
//           body: JSON.stringify({userName}),
//         })

// }

function buttonAnimation()
{
  let btn = document.getElementById("contactsellerbtn");
  btn.style.color='black';
  btn.style.background="lightgreen";
  btn.style.transform="scale(1.1)";
  setTimeout(()=>{
    btn.style.background='rgb(111, 20, 197)';
    btn.style.color='white';
    btn.style.transform="scale(0.95)";
  },1000)
}