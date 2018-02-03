
//////////////////////////////////////////////////////////////////
// Amazon EComm
/////////////////////////////////////////////////////////////////

let key = "AKIAJZ34I7JQLVVJXRKA",
	secret = "xjbHfzkNcG23hKj2ZNcho1+eVs/dUXuGdaLABlXl",
	associate = "krlyric-20",
	searchterm = ("cute boots").trim().replace(/\s/g,'%20'), //.replace(/\W/g, ''),
	datetime = new Date().toISOString().replace(/\:/g, '%3A'),
	responsegroup = ("Images,ItemAttributes,Offers,Reviews").replace(/\,/g, '%2C'),
	toSign = "GET\n"
		 + "webservices.amazon.com\n" + "/onca/xml\n" 
		 + "AWSAccessKeyId=" + key 
		 + "&AssociateTag=" + associate 
		 + "&Keywords=" + searchterm 
		 + "&Operation=ItemSearch&ResponseGroup=" + responsegroup 
		 + "&SearchIndex=All&Service=AWSECommerceService&Timestamp=" + datetime ,
	signature = CryptoJS.HmacSHA256(toSign, secret).toString( CryptoJS.enc.Base64 )
	 			.replace(/\=/g,'%3D').replace(/\+/g, '%2B'),
	finalUrl = toSign.replace(/\n/g, '').replace('onca/xmlAWSAccessKeyId','onca/xml?AWSAccessKeyId')
	.replace('GET','http://') + "&Signature=" + signature,
	finalUrlToo = toSign.replace(/\n/g, '').replace('onca/xmlAWSAccessKeyId','onca/xml?AWSAccessKeyId')
	.replace('GET','https://') + "&Signature=" + signature;
 
 console.log(finalUrl);

 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
 	console.log(this.responseText);
    if (this.readyState == 4 && this.status == 200) {
      console.log('final from ajax', this.responseText );
    }
  };
 xhttp.open('GET', finalUrl);
 xhttp.send();

 $.ajax(finalUrl).then(d => console.log('http', d));
 $.ajax(finalUrlToo).then(d => console.log('https', d));

/////////////////////////////////////////////////////////////////
// Bitcoin lookup
/////////////////////////////////////////////////////////////////

let bitCoinP; 
function bitCoinPrice() {
	let t;
	$.get('https://api.coinbase.com/v2/prices/BTC-USD/buy')
	.then((data)=>{
		t = data.data.amount;
		bitCoinP = data.data.amount;
	});
	return t;
}

function bitCoinPrice2(){
	$.ajax('https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=1')
	.then((data)=>{
		console.log(data[0].price_usd);
	});
}