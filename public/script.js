function validation() {
    var uname=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    if (uname==="" || password==="") {
        document.getElementById("submit-btn").disabled=true;
    }
    if (uname!=="" && password!=="" && password.length>=5) {
        document.getElementById("submit-btn").disabled=false;
        document.getElementById("submit-btn").classList.remove("hidden");
    }
    console.log(uname);
    console.log(password);
}