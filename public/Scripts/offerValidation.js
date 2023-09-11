const offerValidation=()=>{
    let offerAmount=document.getElementById("formControlLg").value;
    if (offerAmount<=0) {
        document.getElementById("warning").classList.remove("hidden");
        return false;
    }
    return true;
}