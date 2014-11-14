if(dpUI===undefined)var dpUI={data:{},helper:{},options:{},versions:{}};
dpUI.helper.data2obj=function(e){if(e===undefined)return false;var t={};for(var n=0;n<e.attributes.length;n++){if((e.attributes[n].nodeName+"").indexOf("data-")>-1){var r=(e.attributes[n].nodeName+"").substring(5);var i=e.attributes[n].value;if(i.toLowerCase()=="true")i=true;else if(i.toLowerCase()=="false")i=false;else if(parseFloat(i)+""==i)i=parseFloat(i);t[r]=i}}return t};
dpUI.helper.formatter=function(n, format){
	if(!format||format.length==0)return n+"";
	var w = Math.floor(n);
	var d = n-w;
	var b = format.indexOf(".");
	var a = ((format.length-b)-1);
	w=w+"";
	while(w.length<b)w="0"+w;
	d=Math.round( d*Math.pow(10,a) )+"";
	while(d.length<a)d+="0";
	return w+"."+d;
};
dpUI.helper.betterParseFloat = function(s){
	if(isNaN(parseFloat(s))){
		if(s.length<2)return parseFloat(s);
		return dpUI.helper.betterParseFloat(s.substring(1));
	} else return parseFloat(s);
};
dpUI.versions.numberPicker = "2.0.0";
dpUI.numberPicker = function(selector, options){
	var defaults = {
		start: 1,
		min: false,
		max: false,
		step: 1,
		format: false,
		formatter: function(x){return x;},
		incrementaText: "+",
		decrementaText: "-",
		
		onReady: function(){},
		onMin: function(){},
		onMax: function(){},
		beforeincrementa: function(){},
		beforedecrementa: function(){},
		beforeChange: function(){},
		afterincrementa: function(){},
		afterdecrementa: function(){},
		afterChange: function(){}
	};
	$(selector).each(function(){
		var el = this;
		var np = $(el);
		el.options = $.extend(defaults, options);
		el.options = $.extend(el.options, dpUI.helper.data2obj(el));
		el.number = dpUI.helper.betterParseFloat(el.options.start);
		np.addClass("spinner-numeri").html("<button class='spinner-numeri-decrementa'>"+el.options.decrementaText+"</button><input type='text' class='spinner-numeri-input' /><button class='spinner-numeri-incrementa'>"+el.options.incrementaText+"</button>");
		var input = np.find(".spinner-numeri-input");
		input.val(el.options.formatter(dpUI.helper.formatter(el.number, el.options.format)));
		if(el.options.min!==false&&el.options.start==el.options.min)np.addClass("spinner-numeri-min");
		if(el.options.max!==false&&el.options.start==el.options.max)np.addClass("spinner-numeri-max");
		
		function set(num){
			num = dpUI.helper.betterParseFloat(num);
			if(isNaN(num)) num = el.number;
			np.removeClass("spinner-numeri-min").removeClass("spinner-numeri-max");
			el.options.beforeChange.call(el,el,el.number);
			if(el.options.min!==false&&num<=el.options.min){
				np.addClass("spinner-numeri-min");
				el.number = el.options.min;
			} else if(el.options.max!==false&&num>=el.options.max){
				np.addClass("spinner-numeri-max");
				el.number = el.options.max;
			} else {
				el.number = num;
			}
			input.val(el.options.formatter(dpUI.helper.formatter(el.number, el.options.format)));
			el.options.afterChange.call(el,el,el.number);
		};
		el.set = function(number){
			set(number);
		};
		el.incrementa = function(){
			el.options.beforeincrementa.call(el,el,el.number);
			set(el.number+el.options.step);
			el.options.afterincrementa.call(el,el,el.number);
		};
		el.decrementa = function(){
			el.options.beforedecrementa.call(el,el,el.number);
			set(el.number-el.options.step);
			el.options.afterdecrementa.call(el,el,el.number);
		};
		np.find(".spinner-numeri-decrementa").on("click", el.decrementa);
		np.find(".spinner-numeri-incrementa").on("click", el.incrementa);
		input.on("change", function(){
			el.set(input.val());
		});
	});
};
(function($){
	$.fn.dpNumberPicker = function(options){
		if(typeof(options)=="string"){
			if(options.toLowerCase()=="incrementa")this.each(function(){this.incrementa();});
			else if(options.toLowerCase()=="decrementa")this.each(function(){this.decrementa();});
			else if(options.toLowerCase()=="set"&&arguments.length>1){
				var n = arguments[1];
				this.each(function(){this.set(n)});
			}
		} else dpUI.numberPicker(this.selector, options);
	};
}(jQuery));