desktopApps = [];

function CreateApp(action, position, text, tooltip, imgsrc)
{
	let desktopApp = new App();
	desktopApp.Init(action, position, text, tooltip, imgsrc);
	desktopApps.push(desktopApp);

	UpdateAppFocus();
	UpdateAppSelection();
}

function UpdateAppSize()
{
	for (let i = 0; i < desktopApps.length; i++)
		desktopApps[i].OnResize();
}

function UpdateAppFocus()
{
	for (let i = 0; i < desktopApps.length; i++)
		desktopApps[i].SetSelected(i, (i == desktopApps.length - 1));
}

function UpdateAppSelection()
{
	for (let i = 0; i < desktopApps.length; i++)
		desktopApps[i].Deselect();
}

var App = function()
{
	this.focus;

	this.DOM = {
		window: null,
		container: null,
		icon: null,
		text: null,
		tooltip: null
		//appCover: null
	};

	this.transform = {
		selected: false
	};

	this.Action = () => {};

	this.CreateDOM = function()
	{
		let fragment = document.createDocumentFragment();

		this.DOM.window = document.createElement("div");
		this.DOM.window.setAttribute("class", "win-desktopAppMount win-tooltip");

		this.DOM.tooltip = document.createElement("span");
		this.DOM.tooltip.setAttribute("class", "win-desktopApp-tooltip-top");

		this.DOM.container = document.createElement("div");
		this.DOM.container.setAttribute("class", "muffins-flex muffins-directionColumn muffins-justifySpaceBetween win-desktopApp win-container");

		this.DOM.icon = document.createElement("div");
		this.DOM.icon.setAttribute("class", "win-desktopApp-icon");

		let textContainer = document.createElement("div");
		textContainer.setAttribute("class", "muffins-flex muffins-alignCenter win-desktopApp-text");

		let textRow = document.createElement("div");
		textRow.setAttribute("class", "muffins-flex muffins-justifySpaceBetween win-container");

		let textSpacer1 = document.createElement("div");
		let textSpacer2 = document.createElement("div");
		this.DOM.text = document.createElement("div");

		//this.DOM.appCover = document.createElement("div");
		//this.DOM.appCover.setAttribute("class", "win-desktopApp-cover");

		textRow.appendChild(textSpacer1);
		textRow.appendChild(this.DOM.text);
		textRow.appendChild(textSpacer2);
		textContainer.appendChild(textRow);

		this.DOM.container.appendChild(this.DOM.icon);
		this.DOM.container.appendChild(textContainer);

		this.DOM.window.appendChild(this.DOM.tooltip);
		this.DOM.window.appendChild(this.DOM.container);
		//this.DOM.window.appendChild(this.DOM.appCover);
		fragment.appendChild(this.DOM.window);

		document.getElementById("mainContainer").appendChild(fragment);
	};

	this.Init = function(action, position, text, tooltip, imgsrc)
	{
		this.Action = action;

		this.CreateDOM();
		this.InitEventListeners();

		this.DOM.window.style.top = position.top + "px";
		this.DOM.window.style.left = position.left + "px";

		this.DOM.icon.style.backgroundImage = `url('${imgsrc}')`;
		this.DOM.text.innerHTML = text;
		this.DOM.tooltip.innerHTML = tooltip;
	};

	this.InitEventListeners = function()
	{
		if (!platformMobile)
		{
			this.DOM.window.addEventListener("mousedown", (event) => { this.Drag.Open(event); }, false);
		}
		else
		{
			this.DOM.window.addEventListener("touchstart", (event) => { this.Drag.TouchStart(event); }, false);
		}
	};

	this.Select = function()
	{
		desktopApps.splice(this.focus, 1);
		desktopApps.push(this);
		UpdateAppFocus();
	}

	this.SetSelected = function(focus, isFocus)
	{
		this.focus = focus;
		if (isFocus) 
		{
			this.DOM.window.style.backgroundColor = "var(--win-desktopApp-hoverColor)";
		}
		else
		{
			this.Deselect();
		}

		this.DOM.container.style.zIndex = focus.toString();
		this.DOM.tooltip.style.zIndex = 1000;
	}

	this.Deselect = function()
	{
		this.transform.selected = false;
		this.DOM.window.style.backgroundColor = "transparent";
	}

	this.Drag = {
		initial: { x:0, y:0 },
		start: { x:0, y:0 },

		OpenEvent: () =>
		{
			this.Select();
		},

		DOMUpdate: (eventX, eventY) =>
		{
			this.DOM.window.setAttribute("class", "win-desktopAppMount");
			this.DOM.tooltip.style.display = "none";

			for (let i = 0; i < openedWindows.length; i++)
				openedWindows[i].DOM.appCover.style.display = "block";

			let posX = this.Drag.start.x - eventX;
		    let posY = this.Drag.start.y - eventY;

		    posX = this.DOM.window.offsetLeft - posX;
		    posY = this.DOM.window.offsetTop - posY;

		    if (posX < 0) 
		    	posX = 0; 
		    else if (posX > window.innerWidth - 60) 
		    	posX = window.innerWidth - 60;
		    else 
		    	this.Drag.start.x = eventX;

		    if (posY < titleBar.height) 
		    	posY = titleBar.height; 
		    else if (posY > window.innerHeight - 70) 
		    	posY = window.innerHeight - 70;
		    else 
		    	this.Drag.start.y = eventY;

			this.DOM.window.style.left = posX + "px";
			this.DOM.window.style.top = posY + "px";

			if (posY < titleBar.height + 50)
			{
				this.DOM.tooltip.setAttribute("class", "win-desktopApp-tooltip-bottom");
			}
			else
			{
				this.DOM.tooltip.setAttribute("class", "win-desktopApp-tooltip-top");
			}
		},

		CloseEvent: (eventX, eventY) =>
		{
			this.DOM.window.setAttribute("class", "win-desktopAppMount win-tooltip");
			this.DOM.tooltip.style.display = "block";

			for (let i = 0; i < openedWindows.length; i++)
				openedWindows[i].DOM.appCover.style.display = "none";

			if (eventX == this.Drag.initial.x && eventY == this.Drag.initial.y)
			{
				if (this.transform.selected)
				{
					this.transform.selected = false;
					this.Action();
				}
				else
				{
					this.transform.selected = true;
				}
			}	
			else
			{
				this.transform.selected = false;
			}
		},

		TouchStart: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.start.x = event.changedTouches[0].clientX;
			this.Drag.start.y = event.changedTouches[0].clientY;
			this.Drag.initial.x = event.changedTouches[0].clientX;
			this.Drag.initial.y = event.changedTouches[0].clientY;

			this.Drag.OpenEvent();

			document.ontouchmove = this.Drag.TouchUpdate;
			document.ontouchend = this.Drag.TouchClose;
		},
		TouchUpdate: (event) => {
			event = event || window.event;

			this.Drag.DOMUpdate(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		},
		TouchClose: (event) => {
			this.Drag.CloseEvent(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

			document.ontouchmove = null;
    		document.ontouchend = null;
		},

		Open: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.start.x = event.clientX;
			this.Drag.start.y = event.clientY;
			this.Drag.initial.x = event.clientX;
			this.Drag.initial.y = event.clientY;

			this.Drag.OpenEvent();

			document.onmousemove = this.Drag.Update;
			document.onmouseup = this.Drag.Close;
		},
		Update: (event) => {
			event = event || window.event;
			event.preventDefault();

			this.Drag.DOMUpdate(event.clientX, event.clientY);
		},
		Close: (event) => {
			this.Drag.CloseEvent(event.clientX, event.clientY);

			document.onmouseup = null;
    		document.onmousemove = null;
		}
	};

	this.OnResize = function()
	{
		if (this.DOM.window.offsetTop + 70 > window.innerHeight)
		{
			this.DOM.window.style.top = (window.innerHeight - 70) + "px";
		}

		if (this.DOM.window.offsetLeft + 60 > window.innerWidth)
		{
			this.DOM.window.style.left = (window.innerWidth - 60) + "px";
		}
	};
}