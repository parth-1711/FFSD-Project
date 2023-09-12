const offerValidation=()=>{
    let offerAmount=document.getElementById("formControlLg").value;
    let expectedPrice = document.getElementById("pricecard").innerHTML;
    let btn = document.getElementById("contactsellerbtn");
    let price=parseInt(expectedPrice.substring(1,expectedPrice.length-1));
    if (offerAmount<=0) {
        document.getElementById("warning").classList.remove("hidden");
        // validoffer=false;
        // console.log(parseInt(expectedPrice.substring(1,expectedPrice.length-1)));
        return false;
    }
    else if(offerAmount<=0.75*price)
    {
        document.getElementById("warning2").classList.remove("hidden");
        // validoffer=false;
        return false;
    }
    validoffer=true;
    btn.style.color='black';
    btn.style.background="lightgreen";
    btn.style.transform="scale(1.1)";
    setTimeout(()=>{
        btn.style.background='rgb(111, 20, 197)';
        btn.style.color='white';
        btn.style.transform="scale(0.95)";
      },1000)
    setTimeout(()=>{
        return true;
    },1500);
    
}
