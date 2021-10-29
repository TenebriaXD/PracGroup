var $WindowID = 0;
var Window = function()
{
	this.Id = $WindowID; $WindowID++;

	this.DOM = {
		window: null,
		close: null,
		maximize: null,
		minimize: null,
		titleBar: null,
		iframe: null,
		appCover: null
	};

	this.Init = function()
	{
		this.DOM.close = document.getElementById("windowClose_" + this.Id);
		this.DOM.maximize = document.getElementById("windowMaximize_" + this.Id);
		this.DOM.minimize = document.getElementById("windowMinimize_" + this.Id);
		this.DOM.window = document.getElementById("window_" + this.Id);
		this.DOM.titleBar = document.getElementById("windowTitleBar_" + this.Id);
		this.DOM.iframe = document.getElementById("windowIframe_" + this.Id);
		this.DOM.appCover = document.getElementById("windowAppCover_" + this.Id);

		this.DOM.close.addEventListener("click", (event) => {
			this.Close();
		}, false);

		this.DOM.titleBar.addEventListener("mousedown", this.Drag.Open, false);
		this.DOM.titleBar.addEventListener("touchstart", this.Drag.TouchStart, false);

		this.DOM.iframe.setAttribute("src", "./site1/index.html");
	};

	this.Close = function()
	{
		this.DOM.window.remove();
	};

	this.Drag = {
		start: { x:0, y:0 },

		DOMUpdate: (eventX, eventY) =>
		{
			if (eventX < 10 || eventX > window.innerWidth - 10) eventX = this.Drag.start.x;

			let posX = this.Drag.start.x - eventX;
		    let posY = this.Drag.start.y - eventY;

		    posX = this.DOM.window.offsetLeft - posX;
		    posY = this.DOM.window.offsetTop - posY;

		    this.Drag.start.x = eventX;
		    if (posY < 40) 
		    	posY = 40; 
		    else if (posY > window.innerHeight - 22) 
		    	posY = window.innerHeight - 22;
		    else 
		    	this.Drag.start.y = eventY;

			this.DOM.window.style.left = posX + "px";
			this.DOM.window.style.top = posY + "px";
		},

		TouchStart: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.start.x = event.changedTouches[0].clientX;
			this.Drag.start.y = event.changedTouches[0].clientY;

			this.DOM.appCover.style.display = "block";

			document.ontouchmove = this.Drag.TouchUpdate;
			document.ontouchend = this.Drag.TouchClose;
		},
		TouchUpdate: (event) => {
			event = event || window.event;

			this.Drag.DOMUpdate(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		},
		TouchClose: (event) => {
			this.DOM.appCover.style.display = "none";

			document.ontouchmove = null;
    		document.ontouchend = null;
		},

		Open: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.start.x = event.clientX;
			this.Drag.start.y = event.clientY;

			this.DOM.appCover.style.display = "block";

			document.onmousemove = this.Drag.Update;
			document.onmouseup = this.Drag.Close;
		},
		Update: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.DOMUpdate(event.clientX, event.clientY);
		},
		Close: (event) => {
			this.DOM.appCover.style.display = "none";

			document.onmouseup = null;
    		document.onmousemove = null;
		}
	};
}