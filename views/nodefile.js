var http=require('http');

function fun1() {
    alert("runing");
    
    var product_name="PlayStation 4 - Slim";
    var locat = "Chennai, Tamilnadu " 

    var image_path="ps4.png";
    var price = 32000;
    var desc="Description";
    
    //title
    document.getElementById("titlecard").innerHTML=product_name;
    document.getElementById("title_loactioncard").innerHTML=locat;
    // image
    var img = document.createElement('img');
    
    img.src="/images/PS4-Slim.png"
    img.style.height="100%";
    img.style.margin="auto";
    img.id="imagecardchild";
    
    document.getElementById("imagecard").appendChild(img);
    
    document.getElementById("pricecard").innerHTML+="₹ ";
    
    
    document.getElementById("pricecard").innerHTML+=price;
    

    // seller info
    document.getElementById("selleroverviewcard").innerHTML+="SELLER :";
    
   

}

let initialpointer=0;

function previmage() {
    alert("ok");
    if (initialpointer<=0) {
        return;
    }
    else {
        initialpointer--;
        src="images.jpeg";
        document.getElementById("imagecard").img.src=src;
        document.getElementById("imagecard").img.height="";
    }
}

function nextimage() {
    
    
    src="images.jpeg";
    
    document.getElementById("imagecardchild").src=src;
    
}
