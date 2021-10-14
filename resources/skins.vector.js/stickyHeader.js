var
	STICKY_HEADER_ID = 'vector-sticky-header',
	initSearchToggle = require( './searchToggle.js' ),
	STICKY_HEADER_APPENDED_ID = '-sticky-header',
	STICKY_HEADER_VISIBLE_CLASS = 'vector-sticky-header-visible',
	STICKY_HEADER_USER_MENU_CONTAINER_CLASS = 'vector-sticky-header-icon-end',
	FIRST_HEADING_ID = 'firstHeading',
	USER_MENU_ID = 'p-personal',
	VECTOR_USER_LINKS_SELECTOR = '.vector-user-links',
	SEARCH_TOGGLE_SELECTOR = '.vector-sticky-header-search-toggle';

/**
 * Copies attribute from an element to another.
 *
 * @param {Element} from
 * @param {Element} to
 * @param {string} attribute
 */
function copyAttribute( from, to, attribute ) {
	var fromAttr = from.getAttribute( attribute );
	if ( fromAttr ) {
		to.setAttribute( attribute, fromAttr );
	}
}

/**
 * Copies attribute from an element to another.
 *
 * @param {Element} from
 * @param {Element} to
 */
function copyButtonAttributes( from, to ) {
	copyAttribute( from, to, 'href' );
	copyAttribute( from, to, 'title' );
}

/**
 * Suffixes an attribute with a value that indicates it
 * relates to the sticky header to support click tracking instrumentation.
 *
 * @param {Element} node
 * @param {string} attribute
 */
function suffixStickyAttribute( node, attribute ) {
	var value = node.getAttribute( attribute );
	if ( value ) {
		node.setAttribute( attribute, value + STICKY_HEADER_APPENDED_ID );
	}
}

/**
 * Makes a node trackable by our click tracking instrumentation.
 *
 * @param {Element} node
 */
function makeNodeTrackable( node ) {
	suffixStickyAttribute( node, 'id' );
	suffixStickyAttribute( node, 'data-event-name' );
}

/**
 *
 * @param {null|HTMLElement|Node} node
 * @return {HTMLElement}
 */
function toHTMLElement( node ) {
	// @ts-ignore
	return node;
}

/**
 * @param {HTMLElement} node
 */
function removeNode( node ) {
	toHTMLElement( node.parentNode ).removeChild( node );
}

/**
 * @param {NodeList} nodes
 * @param {string} className
 */
function removeClassFromNodes( nodes, className ) {
	Array.prototype.forEach.call( nodes, function ( node ) {
		// eslint-disable-next-line mediawiki/class-doc
		node.classList.remove( className );
	} );
}

/**
 * Makes sticky header icons functional for modern Vector.
 *
 * @param {HTMLElement} header
 * @param {HTMLElement|null} history
 * @param {HTMLElement|null} talk
 */
function prepareIcons( header, history, talk ) {
	var historySticky = header.querySelector( '#ca-history-sticky-header' ),
		talkSticky = header.querySelector( '#ca-talk-sticky-header' );

	if ( !historySticky || !talkSticky ) {
		throw new Error( 'Sticky header has unexpected HTML' );
	}

	if ( history ) {
		copyButtonAttributes( history, historySticky );
	} else {
		// @ts-ignore
		historySticky.parentNode.removeChild( historySticky );
	}
	if ( talk ) {
		copyButtonAttributes( talk, talkSticky );
	} else {
		// @ts-ignore
		talkSticky.parentNode.removeChild( talkSticky );
	}
}

/**
 * Render sticky header edit or protected page icons for modern Vector.
 *
 * @param {HTMLElement} header
 * @param {HTMLElement|null} primaryEdit
 * @param {boolean} isProtected
 * @param {HTMLElement|null} secondaryEdit
 */
function prepareEditIcons(
	header,
	primaryEdit,
	isProtected,
	secondaryEdit
) {
	var
		primaryEditSticky = toHTMLElement(
			header.querySelector(
				'#ca-ve-edit-sticky-header'
			)
		),
		protectedSticky = toHTMLElement(
			header.querySelector(
				'#ca-viewsource-sticky-header'
			)
		),
		wikitextSticky = toHTMLElement(
			header.querySelector(
				'#ca-edit-sticky-header'
			)
		);

	if ( !primaryEdit ) {
		removeNode( protectedSticky );
		removeNode( wikitextSticky );
		removeNode( primaryEditSticky );
		return;
	} else if ( isProtected ) {
		removeNode( wikitextSticky );
		removeNode( primaryEditSticky );
		copyButtonAttributes( primaryEdit, protectedSticky );
	} else {
		removeNode( protectedSticky );
		copyButtonAttributes( primaryEdit, primaryEditSticky );
		if ( secondaryEdit ) {
			copyButtonAttributes( secondaryEdit, wikitextSticky );
		} else {
			removeNode( wikitextSticky );
		}
	}
}

/**
 * Check if element is in viewport.
 *
 * @param {HTMLElement} element
 * @return {boolean}
 */
function isInViewport( element ) {
	var rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= ( window.innerHeight || document.documentElement.clientHeight ) &&
		rect.right <= ( window.innerWidth || document.documentElement.clientWidth )
	);
}

/**
 * Makes sticky header functional for modern Vector.
 *
 * @param {HTMLElement} header
 * @param {HTMLElement} stickyIntersection
 * @param {HTMLElement} userMenu
 * @param {Element} userMenuStickyContainer
 */
function makeStickyHeaderFunctional(
	header,
	stickyIntersection,
	userMenu,
	userMenuStickyContainer
) {
	var
		/* eslint-disable-next-line compat/compat */
		stickyObserver = new IntersectionObserver( function ( entries ) {
			if ( !entries[ 0 ].isIntersecting && entries[ 0 ].boundingClientRect.top < 0 ) {
				// Viewport has crossed the bottom edge of firstHeading so show sticky header.
				// eslint-disable-next-line mediawiki/class-doc
				header.classList.add( STICKY_HEADER_VISIBLE_CLASS );
			} else {
				// Viewport is above the bottom edge of firstHeading so hide sticky header.
				// eslint-disable-next-line mediawiki/class-doc
				header.classList.remove( STICKY_HEADER_VISIBLE_CLASS );
			}
		} ),
		// Type declaration needed because of https://github.com/Microsoft/TypeScript/issues/3734#issuecomment-118934518
		userMenuClone = /** @type {HTMLElement} */( userMenu.cloneNode( true ) ),
		userMenuStickyElementsWithIds = userMenuClone.querySelectorAll( '[ id ], [ data-event-name ]' ),
		userMenuStickyContainerInner = userMenuStickyContainer
			.querySelector( VECTOR_USER_LINKS_SELECTOR );

	// Update all ids of the cloned user menu to make them unique.
	makeNodeTrackable( userMenuClone );
	userMenuStickyElementsWithIds.forEach( makeNodeTrackable );

	// Remove portlet links added by gadgets using mw.util.addPortletLink, T291426
	var gadgetLinks = userMenuClone.querySelector( 'mw-list-item-js' );
	if ( gadgetLinks ) {
		gadgetLinks.remove();
	}
	removeClassFromNodes(
		userMenuClone.querySelectorAll( '.user-links-collapsible-item' ),
		'user-links-collapsible-item'
	);

	// Prevents user menu from being focusable, T290201
	var userMenuCheckbox = userMenuClone.querySelector( 'input' );
	if ( userMenuCheckbox ) {
		userMenuCheckbox.setAttribute( 'tabindex', '-1' );
	}

	// Clone the updated user menu to the sticky header.
	if ( userMenuStickyContainerInner ) {
		userMenuStickyContainerInner.appendChild( userMenuClone );
	}

	prepareIcons( header,
		document.querySelector( '#ca-history a' ),
		document.querySelector( '#ca-talk a' )
	);

	var veEdit = document.querySelector( '#ca-ve-edit a' );
	var ceEdit = document.querySelector( '#ca-edit a' );
	var protectedEdit = document.querySelector( '#ca-viewsource a' );
	var isProtected = !!protectedEdit;
	var primaryEdit = protectedEdit || ( veEdit || ceEdit );
	var secondaryEdit = veEdit ? ceEdit : null;

	prepareEditIcons(
		header,
		toHTMLElement( primaryEdit ),
		isProtected,
		toHTMLElement( secondaryEdit )
	);

	stickyObserver.observe( stickyIntersection );

	// When Visual Editor is activated, hide sticky header.
	mw.hook( 've.activationComplete' ).add( function () {
		// eslint-disable-next-line mediawiki/class-doc
		header.classList.remove( STICKY_HEADER_VISIBLE_CLASS );
		stickyObserver.unobserve( stickyIntersection );
	} );

	// When Visual Editor is deactivated, by cliking "read" tab at top of page, show sticky header.
	mw.hook( 've.deactivationComplete' ).add( function () {
		stickyObserver.observe( stickyIntersection );
	} );

	// After saving edits, re-apply the sticky header if the target is not in the viewport.
	mw.hook( 'postEdit.afterRemoval' ).add( function () {
		if ( !isInViewport( stickyIntersection ) ) {
			// eslint-disable-next-line mediawiki/class-doc
			header.classList.add( STICKY_HEADER_VISIBLE_CLASS );
			stickyObserver.observe( stickyIntersection );
		}
	} );
}

/**
 * @param {HTMLElement} header
 */
function setupSearchIfNeeded( header ) {
	var
		searchToggle = header.querySelector( SEARCH_TOGGLE_SELECTOR );

	if ( !(
		searchToggle &&
		window.fetch &&
		document.body.classList.contains( 'skin-vector-search-vue' )
	) ) {
		return;
	}

	initSearchToggle( searchToggle );
}

/**
 * Determines if sticky header should be visible for a given namespace.
 *
 * @param {number} namespaceNumber
 * @return {boolean}
 */
function isAllowedNamespace( namespaceNumber ) {
	// Corresponds to Main, User, Wikipedia, Template, Help, Category, Portal, Module.
	var allowedNamespaceNumbers = [ 0, 2, 4, 10, 12, 14, 100, 828 ];
	return allowedNamespaceNumbers.indexOf( namespaceNumber ) > -1;
}

/**
 * Determines if sticky header should be visible for a given action.
 *
 * @param {string} action
 * @return {boolean}
 */
function isAllowedAction( action ) {
	var disallowedActions = [ 'history', 'edit' ],
		hasDiffId = mw.config.get( 'wgDiffOldId' );
	return disallowedActions.indexOf( action ) < 0 && !hasDiffId;
}

module.exports = function initStickyHeader() {
	var header = document.getElementById( STICKY_HEADER_ID ),
		stickyIntersection = document.getElementById(
			FIRST_HEADING_ID
		),
		userMenu = document.getElementById( USER_MENU_ID ),
		userMenuStickyContainer = document.getElementsByClassName(
			STICKY_HEADER_USER_MENU_CONTAINER_CLASS
		)[ 0 ],
		allowedNamespace = isAllowedNamespace( mw.config.get( 'wgNamespaceNumber' ) ),
		allowedAction = isAllowedAction( mw.config.get( 'wgAction' ) );

	if ( !(
		header &&
		header.closest &&
		stickyIntersection &&
		userMenu &&
		userMenuStickyContainer &&
		allowedNamespace &&
		allowedAction &&
		'IntersectionObserver' in window ) ) {
		return;
	}

	makeStickyHeaderFunctional( header, stickyIntersection, userMenu, userMenuStickyContainer );
	setupSearchIfNeeded( header );
};
