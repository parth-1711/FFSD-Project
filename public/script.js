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

function buttonAnimation() 
{
    const btn = document.getElementsByClassName("submitRequest");

    btn.style.transform = "rotate(360deg)";
    btn.style.transform="scale(1.05)";
    btn.style.background = "lightgreen";

}