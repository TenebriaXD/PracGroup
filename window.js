var windowID = 0;
var openedWindows = [];

function CreateWindow()
{
	let win = new Window();

	let winHTML = 
	`<div id="window_${win.Id}" class="win-window">
		<div class="muffins-flex muffins-directionRow muffins-justifySpaceBetween win-resizeContainer win-container">
			<div id="windowResizeWidthLeft_${win.Id}" class="muffins-flex muffins-alignCenter win-resize win-resize-width"></div>
			<div id="windowResizeWidthRight_${win.Id}" class="muffins-flex muffins-alignCenter win-resize win-resize-width"></div>
		</div>
		<div class="muffins-flex muffins-directionColumn muffins-justifySpaceBetween win-resizeContainer win-container">
			<div id="windowResizeHeightTop_${win.Id}" class="muffins-flex muffins-alignCenter win-resize win-resize-height"></div>
			<div id="windowResizeHeightBottom_${win.Id}" class="muffins-flex muffins-alignCenter win-resize win-resize-height"></div>
		</div>
		<div class="muffins-flex muffins-directionRow muffins-justifySpaceBetween win-resizeContainer win-container">
			<div id="windowResizeTopLeft_${win.Id}" class="muffins-flex muffins-alignCenter win-resizeCorner win-resize-cornerNWSE"></div>
			<div id="windowResizeTopRight_${win.Id}" class="muffins-flex muffins-alignCenter win-resizeCorner win-resize-cornerNESW"></div>
		</div>
		<div class="muffins-flex muffins-directionRow muffins-justifySpaceBetween win-resizeContainer win-container">
			<div id="windowResizeBottomLeft_${win.Id}" class="muffins-flex muffins-alignEnd win-resizeCorner win-resize-cornerNESW"></div>
			<div id="windowResizeBottomRight_${win.Id}" class="muffins-flex muffins-alignEnd win-resizeCorner win-resize-cornerNWSE"></div>
		</div>
		<div class="muffins-flex muffins-directionRow muffins-justifySpaceBetween win-resizeContainer win-container">
			<div id="windowResizeTouch_${win.Id}" class="muffins-flex muffins-alignCenter win-resize-fill win-resizeCornerTouch win-resize-cornerNWSE"></div>
			<div class="muffins-flex muffins-alignCenter win-resizeCornerTouch win-resize-cornerNESW"></div>
		</div>
		<div class="win-appMount">
			<div id="windowTitleContainer_${win.Id}" class="muffins-flex muffins-justifyStart muffins-directionReversed muffins-alignStretch win-titleBar">
				<div id="windowClose_${win.Id}" class="muffins-flex muffins-alignCenter muffins-justifyCenter win-titleButton" tabindex="-1" role="button" id="close-btn" aria-label="Close">
					<svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
						<polygon fill="currentColor" fill-rule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon>
					</svg>
				</div>
				<div id="windowMaximize_${win.Id}" class="muffins-flex muffins-alignCenter muffins-justifyCenter win-titleButton" tabindex="-1" role="button" id="max-btn" aria-label="Maximize">
					<svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
						<rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect>
					</svg>
				</div>
				<div id="windowMinimize_${win.Id}" class="muffins-flex muffins-alignCenter muffins-justifyCenter win-titleButton" tabindex="-1" role="button" id="min-btn" aria-label="Minimize">
					<svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
						<rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
					</svg>
				</div>
				<div id="windowTitleBar_${win.Id}" class="muffins-flex muffins-alignCenter muffins-justifyCenter muffins-grow">
					<div id="windowText_${win.Id}" class="muffins-flex muffins-directionRow muffins-alignCenter win-container win-titleText">BRUH</div>
				</div>
			</div>

			<div class="win-container">
				<div class="win-appCover win-container" id="windowAppCover_${win.Id}">
				</div>
				<iframe class="win-container" id="windowIframe_${win.Id}" src=""></iframe>
			</div>
		</div>
	</div>`;

	document.getElementById("mainContainer").innerHTML += winHTML;

	openedWindows.push(win);
	UpdateWindows(true);

	win.LoadSrc("./site1/index.html");
}

function UpdateWindows(resetEventListeners)
{
	for (let i = 0; i < openedWindows.length; i++)
		openedWindows[i].Init(i, resetEventListeners, (i == openedWindows.length - 1));
}

var Window = function()
{
	this.Id = windowID; windowID++;

	this.focus;

	this.DOM = {
		window: null,
		windowText: null,

		titleContainer: null,
		titleBar: null,
		close: null,
		maximize: null,
		minimize: null,

		resize: {
			touch: null,

			widthLeft: null,
			widthRight: null,
			heightTop: null,
			heightBottom: null,

			topLeft: null,
			topRight: null,
			bottomLeft: null,
			bottomRight: null
		},

		iframe: null,
		appCover: null
	};

	this.transform = {
		maximized: false,
		top: null,
		left: null,
		width: null,
		height: null
	};

	this.Init = function(focus, resetEventListeners, isFocus)
	{
		this.focus = focus;

		this.DOM.close = document.getElementById("windowClose_" + this.Id);
		this.DOM.maximize = document.getElementById("windowMaximize_" + this.Id);
		this.DOM.minimize = document.getElementById("windowMinimize_" + this.Id);
		this.DOM.window = document.getElementById("window_" + this.Id);
		this.DOM.windowText = document.getElementById("windowText_" + this.Id);
		if (platformMobile) this.DOM.windowText.style.marginLeft = "32px";
		this.DOM.titleBar = document.getElementById("windowTitleBar_" + this.Id);
		this.DOM.titleContainer = document.getElementById("windowTitleContainer_" + this.Id);
		this.DOM.iframe = document.getElementById("windowIframe_" + this.Id);
		this.DOM.appCover = document.getElementById("windowAppCover_" + this.Id);

		this.DOM.resize.touch = document.getElementById("windowResizeTouch_" + this.Id);
		if (platformMobile) this.DOM.resize.touch.style.display = "block"; else this.DOM.resize.touch.style.display = "none";
		this.DOM.resize.widthLeft = document.getElementById("windowResizeWidthLeft_" + this.Id);
		this.DOM.resize.widthRight = document.getElementById("windowResizeWidthRight_" + this.Id);
		this.DOM.resize.heightTop = document.getElementById("windowResizeHeightTop_" + this.Id);
		this.DOM.resize.heightBottom = document.getElementById("windowResizeHeightBottom_" + this.Id);
		this.DOM.resize.topLeft = document.getElementById("windowResizeTopLeft_" + this.Id);
		this.DOM.resize.topRight = document.getElementById("windowResizeTopRight_" + this.Id);
		this.DOM.resize.bottomLeft = document.getElementById("windowResizeBottomLeft_" + this.Id);
		this.DOM.resize.bottomRight = document.getElementById("windowResizeBottomRight_" + this.Id);

		if (resetEventListeners) this.InitEventListeners();
		if (isFocus) this.Release(); else this.Block();

		this.SetFocus(focus);
	};

	this.InitEventListeners = function()
	{
		if (!platformMobile)
		{
			this.DOM.resize.widthLeft.addEventListener("mousedown", (event) => { this.Focus(); this.Resize.Open(event, true, false, false, false); }, false);
			this.DOM.resize.widthRight.addEventListener("mousedown", (event) => { this.Focus(); this.Resize.Open(event, false, true, false, false); }, false);
			this.DOM.resize.heightTop.addEventListener("mousedown", (event) => { this.Focus(); this.Resize.Open(event, false, false, true, false); }, false);
			this.DOM.resize.heightBottom.addEventListener("mousedown", (event) => { this.Focus(); this.Resize.Open(event, false, false, false, true); }, false);
		
			this.DOM.resize.topLeft.addEventListener("mousedown", (event) => { this.Focus(); this.Resize.Open(event, true, false, true, false); }, false);
			this.DOM.resize.topRight.addEventListener("mousedown", (event) => { this.Focus(); this.Resize.Open(event, false, true, true, false); }, false);
			this.DOM.resize.bottomLeft.addEventListener("mousedown", (event) => { this.Focus(); this.Resize.Open(event, true, false, false, true); }, false);
			this.DOM.resize.bottomRight.addEventListener("mousedown", (event) => { this.Focus(); this.Resize.Open(event, false, true, false, true); }, false);
		
			this.DOM.titleBar.addEventListener("mousedown", (event) => { this.Focus(); this.Drag.Open(event); }, false);
		}
		else
		{
			this.DOM.resize.touch.addEventListener("touchstart", (event) => { this.Focus(); this.Resize.TouchStart(event); }, false);

			this.DOM.titleBar.addEventListener("touchstart", (event) => { this.Focus(); this.Drag.TouchStart(event); }, false);
		}

		this.DOM.appCover.addEventListener("click", (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Focus();
		});

		this.DOM.close.addEventListener("click", (event) => {
			event = event || window.event;
			event.preventDefault();

			openedWindows.splice(this.focus, 1);
			this.Close();
		}, false);
		this.DOM.maximize.addEventListener("click", (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Focus();
			this.Maximize();
		}, false);
		this.DOM.minimize.addEventListener("click", (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Minimize();
		}, false);
	}

	this.LoadSrc = function(src)
	{
		this.DOM.windowText.innerHTML = src;
		this.DOM.iframe.setAttribute("src", src);
	}

	this.SetFocus = function(focus)
	{
		focus *= 6;
		this.DOM.window.style.zIndex = focus.toString();
		this.DOM.appCover.style.zIndex = (focus + 1).toString();

		this.DOM.titleContainer.style.zIndex = (focus + 2).toString();

		this.DOM.resize.widthLeft.style.zIndex = (focus + 3).toString();
		this.DOM.resize.widthRight.style.zIndex = (focus + 3).toString();
		this.DOM.resize.heightTop.style.zIndex = (focus + 3).toString();
		this.DOM.resize.heightBottom.style.zIndex = (focus + 3).toString();
		
		this.DOM.resize.topLeft.style.zIndex = (focus + 4).toString();
		this.DOM.resize.topRight.style.zIndex = (focus + 4).toString();
		this.DOM.resize.bottomLeft.style.zIndex = (focus + 4).toString();
		this.DOM.resize.bottomRight.style.zIndex = (focus + 4).toString();

		this.DOM.resize.touch.style.zIndex = (focus + 6).toString();
	}

	this.Focus = function()
	{
		openedWindows.splice(this.focus, 1);
		openedWindows.push(this);
		UpdateWindows(false);
	}

	this.Close = function()
	{
		this.DOM.window.remove();
	};
	this.Maximize = function()
	{
		if (this.transform.maximized == false)
		{
			this.transform.maximized = true;
			this.transform.top = this.DOM.window.style.top;
			this.transform.left = this.DOM.window.style.left;
			this.transform.width = this.DOM.window.style.width;
			this.transform.height = this.DOM.window.style.height;

			this.DOM.window.style.top = "40px";
			this.DOM.window.style.left = "0px";
			this.DOM.window.style.width = (window.innerWidth) + "px";
			this.DOM.window.style.height = (window.innerHeight - 40) + "px";
		}
		else
		{
			this.transform.maximized = false;
			this.DOM.window.style.top = this.transform.top;
			this.DOM.window.style.left = this.transform.left;
			this.DOM.window.style.width = this.transform.width;
			this.DOM.window.style.height = this.transform.height;
		}
	};
	this.Minimize = function()
	{
		this.DOM.window.style.display = "none";
	};

	this.Block = function()
	{
		this.DOM.appCover.style.display = "block";
	};

	this.Release = function()
	{
		this.DOM.appCover.style.display = "none";
	};

	this.Resize = {
		start: { x:0, y:0 },

		Update: (clientX, clientY, left, right, top, bottom) => {
			if (left || right)
			{
				if (clientX > 0 && clientX < window.innerWidth)
				{
					let posX = this.Resize.start.x - clientX;

					width = this.DOM.window.clientWidth + (left ? posX : -posX);
					posX = this.DOM.window.offsetLeft - posX;

					if (width < 100)
						width = 100;
					else
					{
						this.Resize.start.x = clientX;

						if (left) this.DOM.window.style.left = posX + "px";
						this.DOM.window.style.width = width + "px";
					}
				}
			}
			if (top || bottom)
			{
				if (clientY > 40 && clientY < window.innerHeight)
				{
					let posY = this.Resize.start.y - clientY;

					height = this.DOM.window.clientHeight + (top ? posY : -posY);
					posY = this.DOM.window.offsetTop - posY;

					if (height < 100)
						height = 100;
					else
					{
						this.Resize.start.y = clientY;

						if (top) this.DOM.window.style.top = posY + "px";
						this.DOM.window.style.height = height + "px";
					}
				}
			}
		},

		TouchStart: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Resize.start.x = event.clientX;
			this.Resize.start.y = event.clientY;

			this.Block();

			document.ontouchmove = (event) => { this.Resize.Update(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true, false, true, false); };
			document.ontouchend = this.Resize.Close;
		},
		TouchClose: (event) => {
			this.Release();

			document.ontouchmove = null;
    		document.ontouchend = null;
		},

		Open: (event, left, right, top, bottom) => {
			event = event || window.event;
			event.preventDefault();

			this.Resize.start.x = event.clientX;
			this.Resize.start.y = event.clientY;

			this.Block();

			document.onmousemove = (event) => { this.Resize.Update(event.clientX, event.clientY, left, right, top, bottom); };
			document.onmouseup = this.Resize.Close;
		},
		Close: (event) => {
			this.Release();

			document.onmouseup = null;
    		document.onmousemove = null;
		}
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

			this.Block();

			document.ontouchmove = this.Drag.TouchUpdate;
			document.ontouchend = this.Drag.TouchClose;
		},
		TouchUpdate: (event) => {
			event = event || window.event;

			this.Drag.DOMUpdate(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		},
		TouchClose: (event) => {
			this.Release();

			document.ontouchmove = null;
    		document.ontouchend = null;
		},

		Open: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.start.x = event.clientX;
			this.Drag.start.y = event.clientY;

			this.Block();

			document.onmousemove = this.Drag.Update;
			document.onmouseup = this.Drag.Close;
		},
		Update: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.DOMUpdate(event.clientX, event.clientY);
		},
		Close: (event) => {
			this.Release();

			document.onmouseup = null;
    		document.onmousemove = null;
		}
	};
}