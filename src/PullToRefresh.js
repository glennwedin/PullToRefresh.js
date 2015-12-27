var PTR = (function() {
	
	var inner = {
		el: null,
		callback: null,
		posStart: null,
		posNow: null,
		debug: document.getElementById("log"),
		notice: document.getElementById("msg"),
		dist: null,
		screenReady: true,
		cog: new Image(),
		rotation: 0,
		dragMsg: "Pull to refresh",
		updateMsg: "Updating ...",
		releaseMsg: "Release to refresh",
		
		setPullToRefresh: function(el ,callback) {
			inner.initRotatingImage();
			
			inner.el = document.getElementById(el);
			inner.callback = callback;
			
			inner.el.addEventListener('touchstart', inner.touchstart, false);
			inner.el.addEventListener('touchmove', inner.touchmove, false);
			inner.el.addEventListener('touchend', inner.touchend, false);
		},
		
		touchstart: function(e) {
			if(e.touches.length == 1) { // Only deal with one finger
				var touch = e.touches[0];
				inner.posStart = touch.clientY;
			}
		},
		
		touchmove: function(e) {
			if(e.touches.length == 1){ // Only deal with one finger
				var touch = e.touches[0]; // Get the information for finger #1
				var pos;
				inner.posNow = touch.clientY;
				
				inner.el.style.position = "absolute";
				inner.el.style.setProperty("-webkit-transition", "");
				inner.el.style.setProperty("transition", "");
				
				var dist = inner.posNow - inner.posStart;
						//inner.debug.innerHTML=window.scrollY;	
				if(dist > 0 && inner.screenReady) {
					e.preventDefault();	
					
					//inner.dist = dist;
					//Set drag resistance
     				var verdi = (dist/1.5) * (1 - (touch.clientY / 650));
					inner.dist = verdi;
					
					if(inner.dist < 50 && inner.dist > 20) {
						inner.notice.innerHTML=inner.dragMsg;
					}
					if(inner.dist >= 50) {
						inner.notice.innerHTML=inner.releaseMsg;
					}
						inner.el.style.top = verdi + "px";
				}
				//inner.debug.innerHTML=dist;
			}	
		},
		
		touchend: function() {
			inner.el.style.setProperty("-webkit-transition", "top .2s ease-in");
			inner.el.style.setProperty("transition", "top .2s ease-in");
				
			if(inner.dist >= 50) { //Dersom dist er over eller lik 100 skal den ikke slide hele veien tilbake
				inner.el.style.top="50px";
				//Spinneball her
				document.getElementById("mycanvas").style.opacity="1";
				inner.notice.innerHTML=inner.updateMsg;
				//Run callback - - which propably is ajax
				if(inner.callback) {
					inner.callback();
				}
				inner.dist = 0;
			} else {
				inner.dist = 0;
				inner.el.style.top="0px";
				inner.notice.innerHTML=inner.dragMsg;
			}
			
			//Sier ifra at appen er klar til å motta update scrolls igjen
			if(window.scrollY === 0) {
				inner.screenReady = true;	
			} else if(window.scrollY > 0) {
				inner.screenReady = false;
			}
		},
		
		//rotating image
		initRotatingImage: function() {
        	inner.cog.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK1JREFUeNqMVt1ZGzkUvVfS4IW1l8GO82w6IBXE7mCpAFMB+Pt4Z6iApALcAe4AU0HoAJfg7BPYHinnXmmciX+y0YdmJHnQ0bk/R5cvh5cUyFPwRD4EChgEvGWMB36R3+JaiTkmD5gOs8yNb25uLlerFf1pM2yIGA82TEY7xow1oj4GBU6S6yywPNG4JwDH+XGv0Whs7ndN8n97mmPsLCSYgy7ImPQE/pFDyAF+7L0fgTNFUDBcLal90taD1doQ/T6NT9DnW8zkT+jJuQVYukG3hifCVk/L3JOxMBa8VVlSp9MhHKLaB+zpNo1fdgEpmByuMqUAV5viOQLwXNax9KBAFNEEpN1pUwnQmvl6aTza6zNjrCKaymeyOdYAMgfg18iG4T/qw+AC94zvpzDjcwqOXo3VGH26H0xMZ7jPxgT0R2zUi4BYt6bAfEbJvJFZKA4ODgZ5nhcJLE9mk35X21vWC/TXKmiwr2xszoQd/PQv3t/QCzY2twpqBpb5FKOp+hCgzWaTWq0W1Xx0ij5An9WC5VtiLMwvNBrVaSGMvQk5jHQVPN7sb0HzAtE+QJrNgrcUNEARieWCut0ugR0tl8sKcJ5Ahc3jRviPK8ZGTaaBwGKyT+gTiwM4a3Jrba6MbeVXo5F4kp9shn29ndUYC9vLirGDXzRhrYhD8DME5Hkg22df5rDYS/RXmVIsaP/Q/SXs600YnifTjbeSWliEdTYb3QyTqYfdDKTL4B1KS6tVqf6SgGq3P9BvZGpvNIrPCgVKZlGlCDQDxJiCjVppCab05DJHzb+b1Gm36X80cVjLuzozexs0f6IgRkA5XRhzIixRL1+IzhwdHVHrn1Y9oXe1i10aKT6bGGhg1CKK+cT0zCGCs0oXTIogybJMw/779//o48duMvnO9rzLn+Kz8wgS5Shqo4njpCoOQA5Ajb8adHh4SMvVghaLhYb/HsBip88krNVISSEigOlhjmi0LziNhr6wOsgO9C1339vbGznnNAU2AM9Svk235cqKieKGkldAf7DGvTrjnjJnzyQoMu0ZTuZgUqvmlYR+f39XIE4uqCX1E/rDZpCYmKwOOmivAfYK9KF1AM7EdG4uAMLAOjmQideQXOJQkyUisqYiFRhtSFbxCxj8do0T30dmTvLhC+an0MZZVBHX09tBTG4qFigZEJEChjTIEwtRik81Qa7uOQU0IrYAe7FRjqYw6SlYjgAyN1GmHsFIGPfVnxzFuFITKEkfYK+oWZ5qKlIkcZ7UE92oXBmeIgIxtAO5UtSHqo9uiLW+sme5ejSIRASeAFR4LYy8MMzL1aq3EYWzJF28BgMEzGYpBkrMKelgl+P6uTcVY8NjLYyYPwMTCcufSaouH6al9xNJcjC82vDb9uVZKbrWIumNO+waVsu1TCC+Wxcg6xaSpsZSYM2wLO9/U8qZWH+wztQnsfAxV/E3MIKZVf1FsmJVV8mamhEmxZ0X7sSsABsGv1tZJGejmptU7FBUDYzPAXQBwFEEl+9+stFEroJEci2ELwIMmZuWoSTE9DYYcWVCjlJrZWMpeBhlAEqBiulPE84S3ixU5gSTwGGOdyEVNJXxA8nPevshwABHktBS1YoQ+QAAAABJRU5ErkJggg=='; // Set source path
        	setInterval(inner.drawRotatingImage,10);
		},
		
		//Function that  rotates the image
		drawRotatingImage: function() {
			var ctx = document.getElementById("mycanvas").getContext("2d");
			ctx.globalCompositeOperation = 'destination-over';
			ctx.save();
			ctx.clearRect(0,0,27,27);
			ctx.translate(13.5,13.5); // to get it in the origin
			inner.rotation +=1;
			ctx.rotate(inner.rotation*Math.PI/64); //rotate in origin
			ctx.translate(-13.5,-13.5); //put it back
			ctx.drawImage(inner.cog,0,0);
			ctx.restore();
		},
		
		setTopZero: function() {
			inner.el.style.top="0px";
			inner.notice.innerHTML=inner.dragMsg;
			document.getElementById("mycanvas").style.opacity="0";
		}
	
	}
	return {
		/*
		* Use to select element to pull to refresh
		* Set the DOM-element and a callback function
		*/
		setPullToRefresh: function(el, callback) {
			inner.setPullToRefresh(el, callback);	
		},
		
		/*
		*	Use in the end of your callback function. This resets the element no its normal state
		*
		*/
		setTopZero:  inner.setTopZero
	};
});