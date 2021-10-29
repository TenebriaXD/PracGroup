function CreateWindow()
{
	let win = new Window();

	let winHTML = 
	`<div id="window_${win.Id}" class="win-window">
		<div class="win-appMount">
			<div class="muffins-flex muffins-justifyStart muffins-directionReversed muffins-alignStretch win-titleBar">
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
				<div id="windowTitleBar_${win.Id}" class="muffins-flex muffins-alignCenter muffins-justifyCenter muffins-grow"></div>
			</div>

			<div class="win-container">
				<div class="win-appCover win-container" id="windowAppCover_${win.Id}">
				</div>
				<iframe class="win-container" id="windowIframe_${win.Id}" src=""></iframe>
			</div>
		</div>
	</div>`;

	document.getElementById("mainContainer").innerHTML += winHTML;

	win.Init();
}