<template>
	<details class="reading-survey" :open="showSurvey" @toggle="showSurvey = $event.target.open">
		<summary class="reading-survey__title">
			<strong>{{ $i18n( 'vector-readability-survey-title' ).text() }}</strong>
		</summary>
		<p v-i18n-html:vector-readability-survey-description></p>
		<div class="reading-survey__options">
			<div class="cdx-radio" v-for="(option, i) in options">
				<input name="vector-dark-mode-content-policy"
					@input="saveChange" :checked="option.checked"
					:id="'vector-dark-mode-content-policy-clientpref-' + option.value"
					type="radio"
					:value="option.value" class="cdx-radio__input">
				<span class="cdx-radio__icon"></span>
				<label class="cdx-radio__label" :for="'vector-dark-mode-content-policy-clientpref-' + option.value">
				{{ option.label }}
				</label>
			</div>
		</div>

	</details>
</template>

<script>
/* eslint-disable */
// @ts-nocheck
const rootEl = document.querySelector(':root');
const OPT_OUT_HREF = "#close-vector-survey";
const CSS_VAR_MAP = {
	storageKey: 'wm-reading-survey',
	bodyClass: 'wm-reading-survey-enabled',
	bodyTransitionClass: 'wm-reading-survey-transitions'
}

module.exports = exports = {
	name: "VectorReadingSurvey",
	compatConfig: { MODE: 3 },
	compilerOptions: { whitespace: 'condense' },
	data: () => {
		return {
			currentClass: [
				'vector-dark-mode-content-policy-clientpref-gi',
				'vector-dark-mode-content-policy-clientpref-custom',
				'vector-dark-mode-content-policy-clientpref-invert',
				'vector-dark-mode-content-policy-clientpref-strip',
				'vector-dark-mode-content-policy-clientpref-none'
			].filter( ( className ) => document.documentElement.classList.contains( className ) )[ 0 ]
		};
	},
	computed: {
		options: function () {
			return [
				{
					value: "none",
					label: mw.msg( 'vector-readability-survey-option-1' )
				},
				{
					value: "gi",
					label: mw.msg( 'vector-readability-survey-option-2' )
				},
				{
					value: "strip",
					label: mw.msg( 'vector-readability-survey-option-3' )
				},
				{
					value: "invert",
					label: mw.msg( 'vector-readability-survey-option-4' )
				},
				{
					value: "custom",
					label: mw.msg( 'vector-readability-survey-option-5' )
				}
			].map(
				function ( option ) {
					return Object.assign( option, {
						checked: this.currentClass === `vector-dark-mode-content-policy-clientpref-${option.value}`
					} );
				}.bind( this )
			);
		},
		feedbackUrl: function () {
			const contentLang = mw.config.get( 'wgContentLanguage' );
			const preloadLangSuffix = (contentLang === 'en' ) ? '' : '/' + contentLang;

			const feedbackUrlParams = new URLSearchParams( [
				[ 'action', 'submit' ],
				[ 'section', 'new' ],
				[ 'preload', 'Reading/Web/Accessibility_for_reading/Community_prototype_testing/preload' + preloadLangSuffix ],
				[ 'preloadparams[]', this.fontSize ],
				[ 'preloadparams[]', this.lineHeight ],
				[ 'preloadparams[]', this.verticalMargins ],
				[ 'preloadparams[]', window.location.href ],
				[ 'preloadparams[]', `${window.innerWidth} x ${window.innerHeight}` ],
				[ 'preloadtitle', ( mw.user.getName() ) ? 'User: ' + mw.user.getName() : '' ]
			] );
			return "https://www.mediawiki.org/wiki/Reading/Web/Accessibility_for_reading/Community_prototype_testing/Feedback?" + feedbackUrlParams.toString();
		}
	},
	methods: {
		saveChange: function ( ev ) {
			const api = new mw.Api();
			const value = ev.target.value;
			if ( mw.user.isAnon() ) {
				mw.user.clientPrefs.set( 'vector-dark-mode-content-policy', value );
			} else {
				document.documentElement.classList.remove(
					'vector-dark-mode-content-policy-clientpref-gi',
					'vector-dark-mode-content-policy-clientpref-custom',
					'vector-dark-mode-content-policy-clientpref-invert',
					'vector-dark-mode-content-policy-clientpref-strip',
					'vector-dark-mode-content-policy-clientpref-none'
				);
				api.saveOption( 'vector-dark-mode-content-policy', value );
			}
			const newClass = `vector-dark-mode-content-policy-clientpref-${value}`;
			document.documentElement.classList.add( newClass );
			this.currentClass = newClass;
		},
		getDefaultCSSVal: function (selector, cssProp) {
			const domEl = document.querySelector(selector);
			const domElStyles = window.getComputedStyle(domEl);
			const domElCSSProp = domElStyles.getPropertyValue(cssProp);
			console.log(selector, domElCSSProp);
			return parseInt(domElCSSProp);
		},
		getSavedCSSVal: function (name) {
			const savedVal = mw.storage.getObject(CSS_VAR_MAP.storageKey);
			if (savedVal && savedVal[name]) {
				return parseInt(savedVal[name]);
			}
		},
		getSavedShowVal: function() {
			const savedVal = mw.storage.getObject(CSS_VAR_MAP.storageKey);
			if ( savedVal && ( savedVal['showSurvey'] !== undefined ) ) {
				return savedVal['showSurvey'];
			}
		},
		saveShowVal: function() {
			const storageObject = mw.storage.getObject(CSS_VAR_MAP.storageKey);
			storageObject[ 'showSurvey' ] = this.showSurvey;
			mw.storage.setObject(CSS_VAR_MAP.storageKey, storageObject, 604800);
		},
		setCSSVal: function (name, val) {
			rootEl.style.setProperty(name, val + 'px');
			this.saveCSSVals();
		},
		saveCSSVals: function () {
			const storageObject = {};
			storageObject[ CSS_VAR_MAP.fontSize.storageKey ] = this.fontSize;
			storageObject[ CSS_VAR_MAP.lineHeight.storageKey ] = this.lineHeight;
			storageObject[ CSS_VAR_MAP.verticalMargins.storageKey ] = this.verticalMargins;
			storageObject[ 'showSurvey' ] = this.showSurvey;
			mw.storage.setObject(CSS_VAR_MAP.storageKey, storageObject, 604800);
		},
		resetSavedCSSVals: function () {
			mw.storage.remove( CSS_VAR_MAP.storageKey );
			document.documentElement.classList.remove( CSS_VAR_MAP.bodyClass );
			document.documentElement.classList.remove( CSS_VAR_MAP.bodyTransitionClass );

			this.fontSize = this.getDefaultCSSVal( CSS_VAR_MAP.fontSize.cssTarget, CSS_VAR_MAP.fontSize.cssProp );
			this.lineHeight = this.getDefaultCSSVal( CSS_VAR_MAP.lineHeight.cssTarget, CSS_VAR_MAP.lineHeight.cssProp );
			this.verticalMargins = this.getDefaultCSSVal( CSS_VAR_MAP.verticalMargins.cssTarget, CSS_VAR_MAP.verticalMargins.cssProp );
		},
		randomize: function () {
			this.fontSize = Math.floor( Math.random() * (24 - 12 + 1) + 12 );
			this.lineHeight = Math.floor( Math.random() * (42 - 16 + 1) + 16 );
			this.verticalMargins = Math.floor( Math.random() * (36 - 6 + 1) + 6 );
		},
		optOut: function ( e ) {
			const href = e.target.getAttribute( 'href' );
			if ( href === OPT_OUT_HREF ) {
				e.preventDefault();
				const api = new mw.Api();
				api.saveOption( 'vector-typography-survey', 0 )
				.then( function() {
					mw.storage.remove( CSS_VAR_MAP.storageKey );
					location.reload();
				});
			}
		}
	},
	watch: {
		showSurvey: function() { this.saveShowVal() }
	}
};
</script>

<style lang="less">
@import 'mediawiki.skin.variables.less';
html.wm-reading-survey-enabled {
	--reading-survey-font-size: 14px;
	--reading-survey-line-height: 22px;
	--reading-survey-vertical-margins: 7px;
}

html.wm-reading-survey-enabled .vector-body {
	font-size: var( --reading-survey-font-size );
	line-height: var( --reading-survey-line-height );
}

html.wm-reading-survey-transitions .vector-body {
	transition: font-size 300ms, line-height 300ms;
}

html.wm-reading-survey-enabled .vector-body p {
	margin-bottom: var( --reading-survey-vertical-margins );
	margin-top: var( --reading-survey-vertical-margins );
}

html.wm-reading-survey-transitions .vector-body p {
	transition: margin 300ms;
}

.reading-survey {
	position: fixed;
	bottom: 0;
	right: 80px;
	width: 350px;

	background-color: var( --background-color-base, @background-color-base );
	border: 1px solid var( --border-color-base, @border-color-base );
	border-radius: 2px;
	padding: 24px 12px;

	font-size: 14px;
}

.reading-survey p {
	margin: 1em 0;
}

.reading-survey__title {
	font-weight: bold;
	font-size: 16px;
}

.reading-survey__options {
	display: flex;
	column-gap: 16px;
	margin: 24px;
	flex-flow: column;
}

.reading-survey__buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	justify-content: space-around;
}

.reading-survey__buttons .cdx-button {
	flex-grow: 1;
}
</style>
