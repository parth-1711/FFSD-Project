function validation() {
    var uname=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    if (uname==="" || password==="") {
        return false;
    }
    if (uname!=="" && password!=="") {
        document.getElementById("submit-btn").classList.remove("hidden");
    }
    console.log(uname);
    console.log(password);
}