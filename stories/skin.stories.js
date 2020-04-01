import mustache from 'mustache';
import { htmluserlangattributes } from './utils';
import skinTemplate from '!!raw-loader!../includes/templates/index.mustache';
import legacySkinTemplate from '!!raw-loader!../includes/templates/legacy.mustache';
import { placeholder } from './utils';

import '../resources/skins.vector.styles/index.less';
import { PERSONAL_MENU_TEMPLATE_DATA, personalMenuTemplate } from './PersonalMenu.stories.data';
import { pageActionsData, namespaceTabsData, vectorTabsTemplate } from './VectorTabs.stories.data';
import { vectorMenuTemplate, moreData, variantsData } from './VectorMenu.stories.data';
import { searchBoxData, searchBoxTemplate } from './SearchBox.stories.data';
import { SIDEBAR_DATA, SIDEBAR_TEMPLATE_PARTIALS, sidebarTemplate } from './Sidebar.stories.data';
import { FOOTER_TEMPLATE_DATA, footerTemplate } from './Footer.stories.data';

const NAVIGATION_TEMPLATE_DATA = {
	loggedInWithVariantsAndOptOut: {
		'data-personal-menu': PERSONAL_MENU_TEMPLATE_DATA.loggedInWithEcho,
		'data-namespace-tabs': namespaceTabsData,
		'data-page-actions': pageActionsData,
		'data-variants': variantsData,
		'data-search-box': searchBoxData,
		'data-sidebar': SIDEBAR_DATA.withPortalsAndOptOut,
		'html-navigation-heading': 'Navigation menu',
		'html-logo-attributes': `class="mw-wiki-logo" href="/wiki/Main_Page" title="Visit the main page"`
	},
	loggedOutWithVariants: {
		'data-personal-menu': PERSONAL_MENU_TEMPLATE_DATA.loggedOut,
		'data-namespace-tabs': namespaceTabsData,
		'data-page-actions': pageActionsData,
		'data-variants': variantsData,
		'data-search-box': searchBoxData,
		'data-sidebar': SIDEBAR_DATA.withPortals,
		'html-navigation-heading': 'Navigation menu',
		'html-logo-attributes': `class="mw-wiki-logo" href="/wiki/Main_Page" title="Visit the main page"`
	},
	loggedInWithMoreActions: {
		'data-personal-menu': PERSONAL_MENU_TEMPLATE_DATA.loggedInWithEcho,
		'data-namespace-tabs': namespaceTabsData,
		'data-page-actions': pageActionsData,
		'data-page-actions-more': moreData,
		'data-search-box': searchBoxData,
		'data-sidebar': SIDEBAR_DATA.withPortals,
		'html-navigation-heading': 'Navigation menu',
		'html-logo-attributes': `class="mw-wiki-logo" href="/wiki/Main_Page" title="Visit the main page"`
	}
};

const TEMPLATE_PARTIALS = Object.assign( {}, SIDEBAR_TEMPLATE_PARTIALS, {
	SearchBox: searchBoxTemplate,
	Sidebar: sidebarTemplate,
	VectorTabs: vectorTabsTemplate,
	VectorMenu: vectorMenuTemplate,
	PersonalMenu: personalMenuTemplate,
	Footer: footerTemplate
} );

export default {
	title: 'Skin'
};

const HTML_INDICATORS = `<div class="mw-indicators mw-body-content">
<div id="mw-indicator-good-star" class="mw-indicator">
	<a href="/wiki/Wikipedia:Good_articles"
		title="This is a good article. Follow the link for more information.">
			<img alt="This is a good article. Follow the link for more information."
				src="//upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/19px-Symbol_support_vote.svg.png" decoding="async" width="19" height="20"
				srcset="//upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/29px-Symbol_support_vote.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/39px-Symbol_support_vote.svg.png 2x" data-file-width="180" data-file-height="185" />
	</a>
</div>
<div id="mw-indicator-pp-autoreview" class="mw-indicator">
	<a href="/wiki/Wikipedia:Protection_policy#pending"
		title="All edits by unregistered and new users are subject to review prior to becoming visible to unregistered users">
		<img alt="Page protected with pending changes" src="//upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pending-protection-shackle.svg/20px-Pending-protection-shackle.svg.png"
			decoding="async" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pending-protection-shackle.svg/30px-Pending-protection-shackle.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pending-protection-shackle.svg/40px-Pending-protection-shackle.svg.png 2x" data-file-width="512" data-file-height="512" />
	</a>
</div>
</div>
`;

export const vectorLegacyLoggedOut = () => mustache.render( legacySkinTemplate, Object.assign( {
	'html-title': 'Vector 2019',
	'page-isarticle': true,
	'msg-tagline': 'From Wikipedia, the free encyclopedia',
	'html-userlangattributes': htmluserlangattributes,
	'msg-jumptonavigation': 'Jump to navigation',
	'msg-jumptosearch': 'Jump to search',

	// site specific
	'data-footer': FOOTER_TEMPLATE_DATA,
	'html-sitenotice': placeholder( 'a site notice or central notice banner may go here', 70 ),

	// article dependent
	'html-bodycontent': placeholder( 'Article content goes here' ),
	'html-printfooter': `Retrieved from ‘<a dir="ltr" href="#">https://en.wikipedia.org/w/index.php?title=this&oldid=blah</a>’`,
	'html-catlinks': placeholder( 'Category links component from mediawiki core', 50 ),

	// extension dependent..
	'html-hook-vector-before-footer': placeholder( 'VectorBeforeFooter hook output', 100 ),
	'html-dataAfterContent': placeholder( 'Extensions can add here e.g. Related Articles.', 100 ),
	'html-indicators': HTML_INDICATORS,
	'html-subtitle': placeholder( 'Extensions can configure subtitle', 20 )
}, NAVIGATION_TEMPLATE_DATA.loggedOutWithVariants ), TEMPLATE_PARTIALS );

export const vectorLegacyLoggedIn = () => mustache.render( legacySkinTemplate, Object.assign( {
	'html-title': 'Vector 2019',
	'page-isarticle': true,
	'msg-tagline': 'From Wikipedia, the free encyclopedia',
	'html-userlangattributes': htmluserlangattributes,
	'msg-jumptonavigation': 'Jump to navigation',
	'msg-jumptosearch': 'Jump to search',

	// site specific
	'data-footer': FOOTER_TEMPLATE_DATA,
	'html-sitenotice': placeholder( 'a site notice or central notice banner may go here', 70 ),

	// article dependent
	'html-bodycontent': placeholder( 'Article content goes here' ),
	'html-printfooter': `Retrieved from ‘<a dir="ltr" href="#">https://en.wikipedia.org/w/index.php?title=this&oldid=blah</a>’`,
	'html-catlinks': placeholder( 'Category links component from mediawiki core', 50 )
}, NAVIGATION_TEMPLATE_DATA.loggedInWithMoreActions ), TEMPLATE_PARTIALS );

export const vectorLoggedIn = () => mustache.render( skinTemplate, Object.assign( {
	'html-title': 'Vector 2020',
	'page-isarticle': true,
	'msg-tagline': 'From Wikipedia, the free encyclopedia',
	'html-userlangattributes': htmluserlangattributes,
	'msg-jumptonavigation': 'Jump to navigation',
	'msg-jumptosearch': 'Jump to search',

	// site specific
	'data-footer': FOOTER_TEMPLATE_DATA,
	'html-sitenotice': placeholder( 'a site notice or central notice banner may go here', 70 ),

	// article dependent
	'html-bodycontent': placeholder( 'Article content goes here' ),
	'html-printfooter': `Retrieved from ‘<a dir="ltr" href="#">https://en.wikipedia.org/w/index.php?title=this&oldid=blah</a>’`,
	'html-catlinks': placeholder( 'Category links component from mediawiki core', 50 )
}, NAVIGATION_TEMPLATE_DATA.loggedInWithVariantsAndOptOut ), TEMPLATE_PARTIALS );
