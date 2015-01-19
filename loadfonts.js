/*!
 * LoadFonts 1.0
 * https://github.com/GaborLenard/LoadFonts/
 *
 * Copyright 2015 Gabor Lenard
 *
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <http://unlicense.org>
 *
 */

/*jshint devel:true, asi:true */
(function (root, definition) {

	root.LoadFonts = definition()

}(window, function () {
	"use strict"
	
	var doc = document
	var html = doc.documentElement
	
	// private recursive routine to regularly check the array of spans for width change
	var watchWidthChange = function watchWidthChange(spans, delay, doneCallback) {
		var i = spans.length
		while (i--) {
			var span = spans[i]
			if (span.offsetWidth !== span.origWidth) {
				span.parentNode.removeChild(span)
				spans.splice(i, 1)
			}
		}
		if (spans.length === 0) {
			doneCallback()
		} else {
			setTimeout(function () { watchWidthChange(spans, delay * 1.25, doneCallback) }, delay)
		}
	}
	
	/**
	 * Loads the specified fonts in a hidden span, forcing the browser to load them.
	 * If the @param {fonts} is an Array, it either contains one or more strings or Objects 
	 * or both, mixed. The Objects must have attribute `family` containing the font-family.
	 * Optional attribute is `style`.
	 *
	 * Examples: 
	 *		loadFonts("Sauna")
	 *		loadFonts("Dolly", "hide-dolly")
	 *		loadFonts({family: "Dolly", style: "font-weight: 300"}, "hide-dolly")
	 *		loadFonts(["Sauna", {family: "Dolly", style: "font-weight: 300"}], "hide-dolly")
	 *		loadFonts(["Bello", "Liza"], "hide-webfonts", 1000)
	 *		loadFonts("Fakir", "hide-webfonts", 3000, function(){ setLongCookie("fakir", "loaded") })
	 *
	 * @param {fonts} Either an Array or a string, each containing a single font-family. 
	 * @param {fallbackClass} The CSS className that will be applied if the font wasn't loaded within the {fallbackTimeout}
	 * @param {fallbackTimeout} The time in ms before the fallbackClass is applied. Optional. If missing or falsy (including 0), the default 777 is used.
	 * @param {successCallback} function that will be called backed after all fonts were loaded. Optional.
	 */
	var loadFonts = function loadFonts(fonts, fallbackClass, fallbackTimeout, successCallback) {
		var body = doc.body
		if (!body) {
			return 
		}
		if (!(fonts instanceof Array)) {
			fonts = [fonts]
		}
		var spans = []
		for (var i=0, l=fonts.length; i<l; i++) {
			var font = fonts[i]
			if(typeof font === "string") {
				font = {family: font}
			}
			var span = doc.createElement("span")
			span.style.cssText = "display:block;position:absolute;top:-9999px;left:-9999px;" +
				"visibility:hidden;width:auto;height:auto;white-space:nowrap;line-height:normal;" +
				"margin:0;padding:0;font-variant:normal;font-size:300px;font-family:Georgia,sans-serif;" + 
				(fonts[i].style ? fonts[i].style : "")
			span.appendChild(doc.createTextNode("A1WQy-/#"))
			body.appendChild(span)
			span.origWidth = span.offsetWidth
			span.style.fontFamily = "'" + font.family + "'," + span.style.fontFamily
			if (span.origWidth !== span.offsetWidth) {
				body.removeChild(span)
			} else {
				spans.push(span)
			}
		}
		var cleanup = function cleanup () {
			if (fallbackClass) {
				html.className = html.className.replace(
					new RegExp("(^|\\s)*" + fallbackClass + "(\\s|$)*", "g"), " "
				)
			}
			if (typeof successCallback === "function") {
				successCallback()
			}
		}
		var timerId
		if (spans.length === 0) {
			cleanup()
		} else {
			if (fallbackClass) {
				timerId = setTimeout(function fallback() {
					html.className += " " + fallbackClass
				}, fallbackTimeout || 2222)
			}
			watchWidthChange(spans, 23, function () {
				clearTimeout(timerId)
				cleanup()
			})
		}
	}

	return loadFonts
}))
