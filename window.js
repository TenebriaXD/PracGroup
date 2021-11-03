var openedWindows = []; // Stores all opened windows.

/**
 * Creates a window with the given src and name.
 *
 * @param {string} src The page src to be used by the window.
 * @param {string} windowName The unique process name of the window.
 */
function CreateWindow(src, windowName)
{
	let win = new Window(windowName);
	win.Init();

	openedWindows.push(win);
	UpdateWindows();

	win.LoadSrc(src);
}

/**
 * Updates the rendering of all windows.
 */
function UpdateWindows()
{
	for (let i = 0; i < openedWindows.length; i++)
		openedWindows[i].SetFocus(i);
}

/**
 * Updates the window sizes when the page is resized.
 */
function UpdateWindowSize()
{
	for (let i = 0; i < openedWindows.length; i++)
		openedWindows[i].OnResize();
}

/** @class Window representing a window. */
var Window = function(windowName)
{
	/**
	 * Creates an instance of Window.
	 *
	 * @param {string} windowName The unique process name of the window.
	 */

	this.focus;
	this.windowName = windowName;

	// Object containing HTML DOM elements for the window.
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
		init: false,
		src: null,
		maximized: false,
		minimized: false,
		top: null,
		left: null,
		width: null,
		height: null
	};

	/**
	 * Creates the HTML DOM elements for the window.
	 */
	this.CreateDOM = function()
	{
		let fragment = document.createDocumentFragment();
		
		this.DOM.window = document.createElement("div");
		this.DOM.window.setAttribute("class", "win-window");

		let windowResizeWidth = document.createElement("div");
		windowResizeWidth.setAttribute("class", "muffins-flex muffins-directionRow muffins-justifySpaceBetween win-resizeContainer win-container");
		
		this.DOM.resize.widthLeft = document.createElement("div");
		this.DOM.resize.widthLeft.setAttribute("class", "muffins-flex muffins-alignCenter win-resize win-resize-width");

		this.DOM.resize.widthRight = document.createElement("div");
		this.DOM.resize.widthRight.setAttribute("class", "muffins-flex muffins-alignCenter win-resize win-resize-width");

		let windowResizeHeight = document.createElement("div");
		windowResizeHeight.setAttribute("class", "muffins-flex muffins-directionColumn muffins-justifySpaceBetween win-resizeContainer win-container");
		
		this.DOM.resize.heightTop = document.createElement("div");
		this.DOM.resize.heightTop.setAttribute("class", "muffins-flex muffins-alignCenter win-resize win-resize-height");

		this.DOM.resize.heightBottom = document.createElement("div");
		this.DOM.resize.heightBottom.setAttribute("class", "muffins-flex muffins-alignCenter win-resize win-resize-height");
		
		let windowResizeTop = document.createElement("div");
		windowResizeTop.setAttribute("class", "muffins-flex muffins-directionRow muffins-justifySpaceBetween win-resizeContainer win-container");

		this.DOM.resize.topLeft = document.createElement("div");
		this.DOM.resize.topLeft.setAttribute("class", "muffins-flex muffins-alignCenter win-resizeCorner win-resize-cornerNWSE");

		this.DOM.resize.topRight = document.createElement("div");
		this.DOM.resize.topRight.setAttribute("class", "muffins-flex muffins-alignCenter win-resizeCorner win-resize-cornerNESW");

		let windowResizeBottom = document.createElement("div");
		windowResizeBottom.setAttribute("class", "muffins-flex muffins-directionRow muffins-justifySpaceBetween win-resizeContainer win-container");

		this.DOM.resize.bottomLeft = document.createElement("div");
		this.DOM.resize.bottomLeft.setAttribute("class", "muffins-flex muffins-alignEnd win-resizeCorner win-resize-cornerNESW");

		this.DOM.resize.bottomRight = document.createElement("div");
		this.DOM.resize.bottomRight.setAttribute("class", "muffins-flex muffins-alignEnd win-resizeCorner win-resize-cornerNWSE");

		let windowResizeTouch = document.createElement("div");
		windowResizeTouch.setAttribute("class", "muffins-flex muffins-directionRow muffins-justifySpaceBetween win-resizeContainer win-container");

		this.DOM.resize.touch = document.createElement("div");
		this.DOM.resize.touch.setAttribute("class", "muffins-flex muffins-alignCenter win-resize-fill win-resizeCornerTouch win-resize-cornerNWSE");
		if (platformMobile) this.DOM.resize.touch.style.display = "block"; else this.DOM.resize.touch.style.display = "none";

		let tempResizeTouch = document.createElement("div");
		tempResizeTouch.setAttribute("class", "muffins-flex muffins-alignCenter win-resizeCornerTouch");

		let appMount = document.createElement("div");
		appMount.setAttribute("class", "win-appMount");

		this.DOM.titleContainer = document.createElement("div");
		this.DOM.titleContainer.setAttribute("class", "muffins-flex muffins-justifyStart muffins-directionReversed muffins-alignStretch win-titleBar");

		let buttonClassList = "muffins-flex muffins-alignCenter muffins-justifyCenter win-titleButton";
		let svgNameSpace = "http://www.w3.org/2000/svg";

		this.DOM.close = document.createElement("div");
		this.DOM.close.setAttribute("class", buttonClassList);
		let svgDOMClose = document.createElementNS(svgNameSpace, "svg");
		svgDOMClose.setAttribute("aria-hidden", "false");
		svgDOMClose.setAttribute("width", "12");
		svgDOMClose.setAttribute("height", "12");
		svgDOMClose.setAttribute("viewBox", "0 0 12 12");
		let svgClose = document.createElementNS(svgNameSpace, "polygon");
		svgClose.setAttribute("fill", "currentColor");
		svgClose.setAttribute("fill-rule", "evenodd");
		svgClose.setAttribute("points", "11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1");
		svgDOMClose.appendChild(svgClose);
		this.DOM.close.appendChild(svgDOMClose);

		this.DOM.maximize = document.createElement("div");
		this.DOM.maximize.setAttribute("class", buttonClassList);
		let svgDOMMaximize = document.createElementNS(svgNameSpace, "svg");
		svgDOMMaximize.setAttribute("aria-hidden", "false");
		svgDOMMaximize.setAttribute("width", "12");
		svgDOMMaximize.setAttribute("height", "12");
		svgDOMMaximize.setAttribute("viewBox", "0 0 12 12");
		let svgMaximize = document.createElementNS(svgNameSpace, "rect");
		svgMaximize.setAttribute("width", "9");
		svgMaximize.setAttribute("height", "9");
		svgMaximize.setAttribute("x", "1.5");
		svgMaximize.setAttribute("y", "1.5");
		svgMaximize.setAttribute("fill", "none");
		svgMaximize.setAttribute("stroke", "currentColor");
		svgDOMMaximize.appendChild(svgMaximize);
		this.DOM.maximize.appendChild(svgDOMMaximize);

		this.DOM.minimize = document.createElement("div");
		this.DOM.minimize.setAttribute("class", buttonClassList);
		let svgDOMMinimize = document.createElementNS(svgNameSpace, "svg");
		svgDOMMinimize.setAttribute("aria-hidden", "false");
		svgDOMMinimize.setAttribute("width", "12");
		svgDOMMinimize.setAttribute("height", "12");
		svgDOMMinimize.setAttribute("viewBox", "0 0 12 12");
		let svgMinimize = document.createElementNS(svgNameSpace, "rect");
		svgMinimize.setAttribute("fill", "currentColor");
		svgMinimize.setAttribute("width", "10");
		svgMinimize.setAttribute("height", "1");
		svgMinimize.setAttribute("x", "1");
		svgMinimize.setAttribute("y", "6");
		svgDOMMinimize.appendChild(svgMinimize);
		this.DOM.minimize.appendChild(svgDOMMinimize);

		this.DOM.titleBar = document.createElement("div");
		this.DOM.titleBar.setAttribute("class", "muffins-flex muffins-alignCenter muffins-justifyCenter muffins-grow");
		this.DOM.windowText = document.createElement("div");
		this.DOM.windowText.setAttribute("class", "muffins-flex muffins-directionRow muffins-alignCenter win-container win-titleText");
		if (platformMobile) this.DOM.windowText.style.marginLeft = "32px";
		this.DOM.titleBar.appendChild(this.DOM.windowText);

		let windowContainer = document.createElement("div");
		windowContainer.setAttribute("class", "win-container");

		this.DOM.appCover = document.createElement("div");
		this.DOM.appCover.setAttribute("class", "win-appCover win-container");

		this.DOM.iframe = document.createElement("iframe");
		this.DOM.iframe.setAttribute("class", "win-container");

		windowResizeWidth.appendChild(this.DOM.resize.widthLeft);
		windowResizeWidth.appendChild(this.DOM.resize.widthRight);
		this.DOM.window.appendChild(windowResizeWidth);

		windowResizeHeight.appendChild(this.DOM.resize.heightTop);
		windowResizeHeight.appendChild(this.DOM.resize.heightBottom);
		this.DOM.window.appendChild(windowResizeHeight);

		windowResizeTop.appendChild(this.DOM.resize.topLeft);
		windowResizeTop.appendChild(this.DOM.resize.topRight);
		this.DOM.window.appendChild(windowResizeTop);

		windowResizeBottom.appendChild(this.DOM.resize.bottomLeft);
		windowResizeBottom.appendChild(this.DOM.resize.bottomRight);
		this.DOM.window.appendChild(windowResizeBottom);

		windowResizeTouch.appendChild(this.DOM.resize.touch);
		windowResizeTouch.appendChild(tempResizeTouch);
		this.DOM.window.appendChild(windowResizeTouch);

		this.DOM.titleContainer.appendChild(this.DOM.close);
		this.DOM.titleContainer.appendChild(this.DOM.maximize);
		this.DOM.titleContainer.appendChild(this.DOM.minimize);
		this.DOM.titleContainer.appendChild(this.DOM.titleBar);
		appMount.appendChild(this.DOM.titleContainer);

		windowContainer.appendChild(this.DOM.appCover);
		windowContainer.appendChild(this.DOM.iframe);
		appMount.appendChild(windowContainer);

		this.DOM.window.appendChild(appMount);

		fragment.appendChild(this.DOM.window);

		document.getElementById("mainContainer").appendChild(fragment);
	}

	/**
	 * Initializes the Window object.
	 */
	this.Init = function()
	{
		this.CreateDOM();
		this.InitEventListeners();
	};

	/**
	 * Creates the necessary event listeners for the Window object.
	 */
	this.InitEventListeners = function()
	{
		// Event listeners for resizing and dragging windows.
		if (!platformMobile)
		{
			// On desktop devices provide edge drag.
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
			// On mobile devices provide a corner drag.
			this.DOM.resize.touch.addEventListener("touchstart", (event) => { this.Focus(); this.Resize.TouchStart(event); }, false);

			this.DOM.titleBar.addEventListener("touchstart", (event) => { this.Focus(); this.Drag.TouchStart(event); }, false);
		}

		// Event listener for focusing on a window.
		this.DOM.appCover.addEventListener("click", (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Focus();
		});

		// Event listeners for close, maximize, minimize controls.
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

	/**
	 * Loads src into window iframe.
	 */
	this.LoadSrc = function(src)
	{
		this.transform.src = src;
		this.DOM.windowText.innerHTML = src;
		this.DOM.iframe.src = src;
	}

	/**
	 * Sets a window as the focus.
	 */
	this.SetFocus = function(focus)
	{
		this.focus = focus;

		focus = desktopApps.length + focus * 6;
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

	/**
	 * Changes a window to be the focus.
	 */
	this.Focus = function()
	{
		if (this.transform.minimized)
			this.Minimize();
		openedWindows.splice(this.focus, 1);
		openedWindows.push(this);
		UpdateWindows();
	}

	/**
	 * Make sure the window is in a valid position and size when the webpage is resized.
	 */
	this.OnResize = function()
	{
		if (this.transform.maximized == true)
		{
			this.DOM.window.style.top = titleBar.height + "px";
			this.DOM.window.style.left = "0px";
			this.DOM.window.style.width = (window.innerWidth) + "px";
			this.DOM.window.style.height = (window.innerHeight - titleBar.height) + "px";
		}
		else
		{
			if (this.DOM.window.offsetTop > window.innerHeight - 22)
			{
				this.DOM.window.style.top = (window.innerHeight - 22) + "px";
			}
			if (this.DOM.window.offsetLeft > window.innerWidth - 10)
			{
				this.DOM.window.style.left = (window.innerWidth - 10) + "px";
			}
		}
	};

	/**
	 * Closes the window.
	 */
	this.Close = function()
	{
		this.DOM.window.remove();
	};

	/**
	 * Maximizes the window.
	 */
	this.Maximize = function()
	{
		if (this.transform.maximized == false)
		{
			this.transform.maximized = true;
			this.transform.top = this.DOM.window.style.top;
			this.transform.left = this.DOM.window.style.left;
			this.transform.width = this.DOM.window.style.width;
			this.transform.height = this.DOM.window.style.height;

			this.DOM.window.style.top = titleBar.height + "px";
			this.DOM.window.style.left = "0px";
			this.DOM.window.style.width = (window.innerWidth) + "px";
			this.DOM.window.style.height = (window.innerHeight - titleBar.height) + "px";
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

	/**
	 * Minimizes the window.
	 */
	this.Minimize = function()
	{
		if (this.transform.minimized)
			this.DOM.window.style.display = "block";
		else
			this.DOM.window.style.display = "none";
		this.transform.minimized = !this.transform.minimized;
	};

	/**
	 * Blocks the window iframe from being controlled.
	 */
	this.Block = function()
	{
		for (let i = 0; i < openedWindows.length; i++)
			openedWindows[i].DOM.appCover.style.display = "block";
	};

	/**
	 * Releases the window iframe for control.
	 */
	this.Release = function()
	{
		for (let i = 0; i < openedWindows.length; i++)
			openedWindows[i].DOM.appCover.style.display = "none";
	};

	/**
	 * Resize object for performing resize actions on the window.
	 */
	this.Resize = {
		start: { x:0, y:0 }, // Start position of drag.

		/**
		 * Performs resize on window DOM elements given the drag operation.
		 *
		 * @param {number} clientX X position of cursor / touch performing the drag.
		 * @param {number} clientY Y position of cursor / touch performing the drag.
		 * @param {bool} left True if the left side of the window is being resized.
		 * @param {bool} right True if the right side of the window is being resized.
		 * @param {bool} top True if the top side of the window is being resized.
		 * @param {bool} bottom True if the bottom side of the window is being resized.
		 */
		Update: (clientX, clientY, left, right, top, bottom) => {
			this.transform.maximized = false;

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
				if (clientY > titleBar.height && clientY < window.innerHeight)
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

		/**
		 * Initializes touch resize controls triggered by touch event.
		 *
		 * @param {object} event EventListener event object.
		 */
		TouchStart: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Resize.start.x = event.clientX;
			this.Resize.start.y = event.clientY;

			this.Block();

			document.ontouchmove = (event) => { this.Resize.Update(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true, false, true, false); };
			document.ontouchend = this.Resize.Close;
		},

		/**
		 * Ends touch resize controls triggered by touch event.
		 *
		 * @param {object} event EventListener event object.
		 */
		TouchClose: (event) => {
			this.Release();

			document.ontouchmove = null;
    		document.ontouchend = null;
		},

		/**
		 * Initializes mouse resize controls triggered by mouse event.
		 *
		 * @param {object} event EventListener event object.
		 */
		Open: (event, left, right, top, bottom) => {
			event = event || window.event;
			event.preventDefault();

			this.Resize.start.x = event.clientX;
			this.Resize.start.y = event.clientY;

			this.Block();

			document.onmousemove = (event) => { this.Resize.Update(event.clientX, event.clientY, left, right, top, bottom); };
			document.onmouseup = this.Resize.Close;
		},

		/**
		 * Ends mouse resize controls triggered by mouse event.
		 *
		 * @param {object} event EventListener event object.
		 */
		Close: (event) => {
			this.Release();

			document.onmouseup = null;
    		document.onmousemove = null;
		}
	};

	/**
	 * Drag object for performing drag actions on the window.
	 */
	this.Drag = {
		start: { x:0, y:0 }, // Start position of drag.

		/**
		 * Performs drag on window DOM elements given the drag operation.
		 *
		 * @param {number} clientX X position of cursor / touch performing the drag.
		 * @param {number} clientY Y position of cursor / touch performing the drag.
		 */
		DOMUpdate: (eventX, eventY) =>
		{
			if (this.transform.maximized)
			{
				this.transform.maximized = false;
				this.DOM.window.style.width = this.transform.width;
				this.DOM.window.style.height = this.transform.height;

				this.DOM.window.style.left = (eventX - this.DOM.window.offsetWidth / 2) + "px";
				if (this.DOM.window.offsetLeft < 0)
					this.DOM.window.style.left = "0px";
				else if (this.DOM.window.offsetLeft + this.DOM.window.offsetWidth > window.innerWidth)
					this.DOM.window.style.left = (window.innerWidth - this.DOM.window.offsetWidth) + "px";
			}

			if (eventX < 10 || eventX > window.innerWidth - 10) eventX = this.Drag.start.x;

			let posX = this.Drag.start.x - eventX;
		    let posY = this.Drag.start.y - eventY;

		    posX = this.DOM.window.offsetLeft - posX;
		    posY = this.DOM.window.offsetTop - posY;

		    this.Drag.start.x = eventX;
		    if (posY < titleBar.height) 
		    	posY = titleBar.height; 
		    else if (posY > window.innerHeight - 22) 
		    	posY = window.innerHeight - 22;
		    else 
		    	this.Drag.start.y = eventY;

			this.DOM.window.style.left = posX + "px";
			this.DOM.window.style.top = posY + "px";
		},

		/**
		 * Perform special actions at the end of drag if certain conditions are met.
		 */
		DOMClose: () =>
		{
			// If the window is dragged to the top, maximize it.
			if (this.DOM.window.offsetTop == titleBar.height)
				this.Maximize();
		},

		/**
		 * Initializes touch drag controls triggered by touch event.
		 *
		 * @param {object} event EventListener event object.
		 */
		TouchStart: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.start.x = event.changedTouches[0].clientX;
			this.Drag.start.y = event.changedTouches[0].clientY;

			this.Block();

			document.ontouchmove = this.Drag.TouchUpdate;
			document.ontouchend = this.Drag.TouchClose;
		},

		/**
		 * Update called by touch controls.
		 *
		 * @param {object} event EventListener event object.
		 */
		TouchUpdate: (event) => {
			event = event || window.event;

			this.Drag.DOMUpdate(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		},

		/**
		 * Ends touch drag controls triggered by touch event.
		 *
		 * @param {object} event EventListener event object.
		 */
		TouchClose: (event) => {
			this.Release();
			this.Drag.DOMClose();

			document.ontouchmove = null;
    		document.ontouchend = null;
		},

		/**
		 * Initializes mouse drag controls triggered by mouse event.
		 *
		 * @param {object} event EventListener event object.
		 */
		Open: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.start.x = event.clientX;
			this.Drag.start.y = event.clientY;

			this.Block();

			document.onmousemove = this.Drag.Update;
			document.onmouseup = this.Drag.Close;
		},

		/**
		 * Update called by mouse controls.
		 *
		 * @param {object} event EventListener event object.
		 */
		Update: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.DOMUpdate(event.clientX, event.clientY);
		},

		/**
		 * Ends mouse drag controls triggered by mouse event.
		 *
		 * @param {object} event EventListener event object.
		 */
		Close: (event) => {
			this.Release();
			this.Drag.DOMClose();

			document.onmouseup = null;
    		document.onmousemove = null;
		}
	};
}