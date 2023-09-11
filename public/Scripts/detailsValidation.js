const detailsvalidation=()=>{
    let adtitle=document.getElementById("adtitle").value;
    let desc=document.getElementById("adddesc").value;
    let adage=document.getElementById("adage").value;
    let addprice=document.getElementById("addprice").value;
    let adpic1=document.getElementById("images1").value;
    let adpic2=document.getElementById("images2").value;
    let adpic3=document.getElementById("images3").value;

    let adadd1=document.getElementById("adln1").value;
    let adadd2=document.getElementById("adln2").value;
    let adadd3=document.getElementById("adln3").value;

    let adadd=adadd1+adadd2+adadd3;

    console.log(addprice);

    if (!adtitle.trim() || !desc.trim() || !adage.trim() || !adpic1.trim() || !adpic2.trim() || !adpic3.trim()) {
        document.getElementById("empty-warning").classList.remove("hidden");
        return false;
    }

    if(parseFloat(addprice)<=0) {
        document.getElementById("neg-warning").classList.remove("hidden");
        console.log(addprice);
        return false;

    }
    let pattern=/[!@#$%^&*]/;

    if(pattern.test(adtitle)||pattern.test(adage)) {
        document.getElementById("pat-warning").classList.remove("hidden");
        return false;
    }
    return true;
}