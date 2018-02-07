$.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

//////////////////////////////////////////////////////////////////
// Amazon EComm
/////////////////////////////////////////////////////////////////

 function amazonPrice(searchFor){
 	searchFor = searchFor || 'bitcoins';
 	showLoader();
 	ga('send', 'event', 'search', 'search', searchFor);
 	dataLayer.push({'event': 'search', 'term': searchFor});

	let key = "AKIAJZ34I7JQLVVJXRKA",
		secret = "xjbHfzkNcG23hKj2ZNcho1+eVs/dUXuGdaLABlXl",
		associate = "krlyric-20",
		searchterm = (searchFor).trim().replace(/\s/g,'%20'), //.replace(/\W/g, ''),
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

	 $.ajax(finalUrl).then(d =>{
	 	$('.cards-holder').empty();
	 	// console.log('http', d);
	 	// console.log(d.documentElement.getElementsByTagName('Item'));
	 	for(let xitem of d.documentElement.getElementsByTagName('Item')){
	 		let item = {};
	 		item.url = xitem.getElementsByTagName('DetailPageURL')[0].textContent;
	 		item.pic = xitem.getElementsByTagName('MediumImage')[0].firstElementChild.innerHTML;
	 		item.name = xitem.getElementsByTagName('Title')[0].textContent;
	 		item.price = xitem.getElementsByTagName('FormattedPrice')[0].textContent;
	 		item.rawprice = xitem.getElementsByTagName('Amount')[0].textContent;
	 		item.rawprice = parseFloat( item.rawprice ) / 100 ;
	 		// item.desc = {};
	 		// for(let i = 0, x = xitem.getElementsByTagName('Feature').length; i < x ; i++){
	 		// 	item.desc[i] = xitem.getElementsByTagName('Feature')[i].textContent;
	 		// }

	 		$('.cards-holder').append( makeFrag(item) );
	 	}
	 });
}

 function makeFrag( itemObj ){
 	return `<div class="card horizontal">
 	<div class="card-image">
    	<img src="${ itemObj.pic }">
	</div>
 	<p class="card-body center">At ${itemObj.price}, you could could buy <span class="totalNum jumper">${ Math.floor(bitCoinP / itemObj.rawprice) }</span> 
 	<a class="amazonLink" href="${itemObj.url}" target="blank">${itemObj.name}</a>
 	</p>
 	</div>`;
 }

 function showLoader(){
 	return $('.cards-holder').html(`<div class="preloader-wrapper big active center">
		<div class="spinner-layer spinner-green-only">
		<div class="circle-clipper left">
		<div class="circle"></div>
		</div><div class="gap-patch">
		<div class="circle"></div>
		</div><div class="circle-clipper right">
		<div class="circle"></div>
		</div>
		</div>
		</div>`);
 }
$('.chip').click(function(){
	$('#search-for').val( this.textContent );
	amazonPrice( this.textContent );
});

/////////////////////////////////////////////////////////////////
// Bitcoin lookup
/////////////////////////////////////////////////////////////////

let bitCoinP; 
function bitCoinPrice(){
	$.ajax('https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=1')
	.then((data)=>{
		console.log(data[0].price_usd);
		bitCoinP = data[0].price_usd;
		return $('.btcoin').html(`Bitcoin is trending at <span class="btcoin-val">$${bitCoinP}</span>`);
	})
	.then(()=>{
		amazonPrice( $('#search-for').val() || 'bitcoins' );
	});
}
bitCoinPrice();