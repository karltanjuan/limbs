window.onload = function() {
	console.log( "Page loaded!" );
	detector = new HighContrastDetector();
}

window.limbs = new function() {
	this.toggle = function( id ) {
		var
			el = document.getElementById(id),
			classes, classIndex;

		if ( el ) {
			if ( el.className.indexOf( "expanded" ) === -1 ) {
				el.className += " expanded";
			} else {
				classes = el.className.split( " " ),
				classIndex = classes.indexOf( "expanded" );

				if ( classIndex !== -1 ) {
					classes.splice( classIndex, 1 );
					el.className = classes.reduce( ( a, b ) => {
						return a + " " + b;
					}, "" );
				} else console.error(
					"Class does not contain 'expanded'. This shouldn't happen."
				);
			}
		} else console.error(
			"Error expanding. Element with id '" + id + "' does not exist."
		);
	}
}

window.HighContrastDetector = function() {
	var htmlNode = document.getElementsByTagName( "html" )[ 0 ];

	// Detect high contrast on Firefox
	// This checks if a div background image exists after being created
	// http://qaware.blogspot.com/2015/05/accessibility-detecting-high-contrast.html
	var detectFirefox = function() {
		var
			hcDiv    = document.createElement( "div" ),
			classes  = "",
			style;

		hcDiv.id = "hc-test";
		hcDiv.setAttribute(
			"style",
			"width: 0px; height: 0px; background-image: url('#')"
		);

		document.documentElement.appendChild( hcDiv );

		style = window.getComputedStyle( document.getElementById( "hc-test" ) );
		if ( style[ "background-image" ] === "none" )
			htmlNode.className = "hc-default";
	}

	// Detect Chrome high contrast extension
	// This probably doesn't support third party extensions
	// https://stackoverflow.com/questions/38492220/detect-high-contrast-mode-in-chrome-browser
	var detectChrome = function() {
		if ( htmlNode.hasAttribute( "hcx" ) ) {
			htmlNode.className = "hc-chrome hc-" + htmlNode.getAttribute( "hcx" );
		}
	}

	// Edge and IE use the -ms-high-contrast rules in css, so no code needed

	// Use observer to detect Chrome contrast changes
	var observer = new MutationObserver( function( mutations ) {
		var m;

		for ( m = 0; m < mutations.length; m ++ ) {
			if ( mutations[ m ].attributeName === "hcx" ) {
				detectChrome();
				break;
			}
		}
	});

	observer.observe( htmlNode, { attributes: true } );

	detectFirefox();
	detectChrome(); // Just in case :)
}