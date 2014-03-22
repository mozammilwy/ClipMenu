/*
    MD5 and SHA routines, along with their supplemental sub-routines are
    Copyright (C) Paul Johnston 1999 - 2002.
    Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet, Ondrej Zara
    Distributed under the BSD License	
*/

var Util = {
    md5:function(str) {
		var input = Util.utf8decode(str);
		var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
		var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
		var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

		/*
		* Calculate the MD5 of an array of little-endian words, and a bit length
		*/
		function core_md5(x, len) {
			/* append padding */
			x[len >> 5] |= 0x80 << ((len) % 32);
			x[(((len + 64) >>> 9) << 4) + 14] = len;

			var a =  1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d =  271733878;

			for(var i = 0; i < x.length; i += 16) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;

				a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
				d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
				c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
				b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
				a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
				d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
				c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
				b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
				a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
				d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
				c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
				b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
				a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
				d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
				c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
				b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

				a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
				d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
				c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
				b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
				a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
				d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
				c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
				b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
				a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
				d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
				c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
				b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
				a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
				d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
				c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
				b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

				a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
				d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
				c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
				b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
				a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
				d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
				c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
				b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
				a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
				d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
				c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
				b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
				a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
				d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
				c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
				b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

				a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
				d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
				c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
				b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
				a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
				d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
				c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
				b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
				a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
				d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
				c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
				b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
				a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
				d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
				c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
				b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

				a = safe_add(a, olda);
				b = safe_add(b, oldb);
				c = safe_add(c, oldc);
				d = safe_add(d, oldd);
			}
			return [a, b, c, d];
		}

		/*
		* These functions implement the four basic operations the algorithm uses.
		*/
		function md5_cmn(q, a, b, x, s, t) {
			return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
		}
		function md5_ff(a, b, c, d, x, s, t) {
			return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}
		function md5_gg(a, b, c, d, x, s, t) {
			return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}
		function md5_hh(a, b, c, d, x, s, t) {
			return md5_cmn(b ^ c ^ d, a, b, x, s, t);
		}
		function md5_ii(a, b, c, d, x, s, t) {
			return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
		}

		/*
		* Add integers, wrapping at 2^32. This uses 16-bit operations internally
		* to work around bugs in some JS interpreters.
		*/
		function safe_add(x, y)	{
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}

		/*
		* Bitwise rotate a 32-bit number to the left.
		*/
		function bit_rol(num, cnt) {
			return (num << cnt) | (num >>> (32 - cnt));
		}

		/*
		* Convert a string to an array of little-endian words
		* If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
		*/
		function str2binl(str) {
			var bin = [];
			var mask = (1 << chrsz) - 1;
			for(var i = 0; i < str.length * chrsz; i += chrsz)
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
			return bin;
		}

		/*
		* Convert an array of little-endian words to a hex string.
		*/
		function binl2hex(binarray)	{
			var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var str = "";
			for(var i = 0; i < binarray.length * 4; i++) {
				str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
				hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
			}
			return str;
		}
		return binl2hex(core_md5(str2binl(input), input.length * chrsz));
    },
    sha1:function(str) {
		var input = Util.utf8decode(str);
		var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
		var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
		var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

		/*
		 * Calculate the SHA-1 of an array of big-endian words, and a bit length
		 */
		function core_sha1(x, len) {
			/* append padding */
			x[len >> 5] |= 0x80 << (24 - len % 32);
			x[((len + 64 >> 9) << 4) + 15] = len;

			var w = Array(80);
			var a =  1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d =  271733878;
			var e = -1009589776;

			for(var i = 0; i < x.length; i += 16) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;
				var olde = e;

				for(var j = 0; j < 80; j++) {
					if(j < 16) w[j] = x[i + j];
					else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
					var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
					safe_add(safe_add(e, w[j]), sha1_kt(j)));
					e = d;
					d = c;
					c = rol(b, 30);
					b = a;
					a = t;
				}

				a = safe_add(a, olda);
				b = safe_add(b, oldb);
				c = safe_add(c, oldc);
				d = safe_add(d, oldd);
				e = safe_add(e, olde);
			}
			return Array(a, b, c, d, e);
		}

		/*
		* Perform the appropriate triplet combination function for the current
		* iteration
		*/
		function sha1_ft(t, b, c, d) {
			if(t < 20) return (b & c) | ((~b) & d);
			if(t < 40) return b ^ c ^ d;
			if(t < 60) return (b & c) | (b & d) | (c & d);
			return b ^ c ^ d;
		}

		/*
		* Determine the appropriate additive constant for the current iteration
		*/
		function sha1_kt(t) {
			return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
			(t < 60) ? -1894007588 : -899497514;
		}

		/*
		* Add integers, wrapping at 2^32. This uses 16-bit operations internally
		* to work around bugs in some JS interpreters.
		*/
		function safe_add(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}

		/*
		* Bitwise rotate a 32-bit number to the left.
		*/
		function rol(num, cnt) {
			return (num << cnt) | (num >>> (32 - cnt));
		}

		/*
		* Convert an 8-bit or 16-bit string to an array of big-endian words
		* In 8-bit function, characters >255 have their hi-byte silently ignored.
		*/
		function str2binb(str) {
			var bin = Array();
			var mask = (1 << chrsz) - 1;
			for (var i = 0; i < str.length * chrsz; i += chrsz)
				bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
			return bin;
		}

		/*
		* Convert an array of big-endian words to a hex string.
		*/
		function binb2hex(binarray)	{
			var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var str = "";
			for(var i = 0; i < binarray.length * 4; i++) {
				str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
				hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
			}
			return str;
		}
		
		return binb2hex(core_sha1(str2binb(input),input.length * chrsz));
	},
    base64encode:function(str) {
		var input = Util.utf8decode(str);
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) { 
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
		} while (i < input.length);
		return output;
	},
    base64decode:function(input) {
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) { output = output + String.fromCharCode(chr2); }
			if (enc4 != 64) { output = output + String.fromCharCode(chr3); }
		} while (i < input.length);

		return Util.utf8encode(output);
	},
    serialize:function(obj, pretty, depth, cache) {
		var d = depth || 0;
		var c = cache || [];
		var separator = pretty ? "\n" : "";
		var indent = pretty ? "  " : "";
		var prefix = "";
		if (pretty) { for (var i=0;i<d;i++) { prefix += indent; } }
		
		if (c.indexOf(obj) != -1) { throw new Error("Cannot serialize cyclic structures"); }
		
		var table = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};

		function sanitize(str) {
			var result = '"';
			for (var i=0;i<str.length;i++) {
				var ch = str.charAt(i);
				if (ch in table) {
					result += table[ch];
				} else { 
					result += ch; 
				}
			}
			result += '"';
			return result;
		}

		switch (typeof(obj)) {
		    case "string": return sanitize(obj);
		    case "number":
		    case "boolean": return obj.toString();
			case "function": throw new Error("Cannot serialize functions");
			case "object":
 				if (obj === null) {
				    return "null";
				} else if (obj instanceof Number || obj instanceof Boolean || obj instanceof RegExp)  { 
				    return obj.toString(); 
				} else if (obj instanceof String) { 
				    return sanitize(obj); 
				} else if (obj instanceof Date) { 
				    return "new Date("+obj.getTime()+")"; 
				} else if (obj instanceof Array) {
					c.push(obj);
				    var arr = [];
				    for (var i=0;i<obj.length;i++) {
						arr.push(prefix+indent+arguments.callee(obj[i], pretty, d+1, c));
				    }
				    return "["+separator+arr.join(","+separator)+separator+prefix+"]";
				} else if (obj instanceof Object) {
					c.push(obj);
				    var arr = [];
				    for (var p in obj) {
						var str = prefix+indent+sanitize(p) + ":" + arguments.callee(obj[p], pretty, d+1, c);
						arr.push(str);
				    }
				    return "{"+separator+arr.join(","+separator)+separator+prefix+"}";
				}
			break;
		}
		return null;
    },
    deserialize:function(str) {
		return eval("("+str+")");
    },
	utf8encode:function(str) {
		var result = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < str.length ) {
			c = str.charCodeAt(i);
			if (c < 128) {
				result += String.fromCharCode(c);
				i += 1;
			} else if ((c > 191) && (c < 224)) {
				c1 = str.charCodeAt(i+1);
				result += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
				i += 2;
			} else {
				c1 = str.charCodeAt(i+1);
				c2 = str.charCodeAt(i+2);
				result += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
				i += 3;
			}
		}
		return result;	
	},
	utf8decode:function(str) {
		var result = "";

		for (var i=0;i<str.length;i++) {

			var c = str.charCodeAt(i);
			if (c < 128) {
				result += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				result += String.fromCharCode((c >> 6) | 192);
				result += String.fromCharCode((c & 63) | 128);
			}
			else {
				result += String.fromCharCode((c >> 12) | 224);
				result += String.fromCharCode(((c >> 6) & 63) | 128);
				result += String.fromCharCode((c & 63) | 128);
			}
		}
		return result;
	},
	mail:function(to, subject, body, headers, auth) {
		var from = Config["smtpFrom"];
		var rcpt = [];
		var h = {
			"To":[],
			"Cc":[]
		};
		if (to) { 
			rcpt.push(to); 
			h["To"].push(to); 
		}
		if (subject) { h["Subject"] = subject; }
		
		for (var p in headers) {
			var val = headers[p];
			if (p.match(/^to$/i)) {
				rcpt.push(val);
				h["To"].push(val);
			} else if (p.match(/^cc$/i)) {
				rcpt.push(val);
				h["Cc"].push(val);
			} else if (p.match(/^bcc$/i)) {
				rcpt.push(val);
			} else if (p.match(/^subject$/i)) {
				h["Subject"] = val;
			} else {
				h[p] = val; 
			}
		}
		
		function send(text, nowait) {
			// System.stdout("S: "+text+"\n");
			sock.send(text+"\r\n");
			if (!nowait) {
				var data = sock.receive(1024);
				// System.stdout("R: "+data);
			}
		}

		var host = Socket.getHostName();
		var sock = new Socket(Socket.PF_INET, Socket.SOCK_STREAM, Socket.SOL_TCP);
		sock.connect(Config["smtpHost"], Config["smtpPort"]);
		
		if (auth && auth.type.match(/^login$/i)) {
			send("HELO "+host);
		} else {
			send("EHLO "+host); 
			send("AUTH LOGIN"); 
			send(Util.base64encode(auth.user));
			send(Util.base64encode(auth.password)); 
		}
		
		send("MAIL FROM:<"+from+">");
		for (var i=0;i<rcpt.length;i++) {
			send("RCPT TO:<"+rcpt[i]+">");
		}
		send("DATA");
		
		for (var name in h) {
			var value = h[name];
			if (!(value instanceof Array)) { value = [value]; }
			for (var i=0;i<value.length;i++) {
				send(name+": "+value[i], true);
			}
		}
		send("", true);
		var b = body.replace(/\n\./g,"\n..");
		send(b+"\r\n.");
		send("QUIT");
		sock.close();
	}
}

exports.Util = Util;