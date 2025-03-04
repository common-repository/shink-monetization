// Developed by Robert Nyman/DOMAssistant team, code/licensing: http://code.google.com/p/domassistant/, documentation: http://www.domassistant.com/documentation, version 2.7.4
var DOMAssistant = function () {
        var G = function () {};
        var C = /*@cc_on!@*/
        false;
        var F = C && parseFloat(navigator.appVersion) < 6;
        var B = {},
            K = {},
            A = true;
        var J = {
            accesskey: "accessKey",
            "class": "className",
            colspan: "colSpan",
            "for": "htmlFor",
            maxlength: "maxLength",
            readonly: "readOnly",
            rowspan: "rowSpan",
            tabindex: "tabIndex",
            valign: "vAlign",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding"
        };
        var I = {
            rules: /\s*(,)\s*/g,
            selector: /^(\w+)?(#[\w\u00C0-\uFFFF\-\_]+|(\*))?((\.[\w\u00C0-\uFFFF\-_]+)*)?((\[\w+\s*(\^|\$|\*|\||~)?(=\s*([\w\u00C0-\uFFFF\s\-\_\.]+|"[^"]*"|'[^']*'))?\]+)*)?(((:\w+[\w\-]*)(\((odd|even|\-?\d*n?((\+|\-)\d+)?|[\w\u00C0-\uFFFF\-_\.]+|"[^"]*"|'[^']*'|((\w*\.[\w\u00C0-\uFFFF\-_]+)*)?|(\[#?\w+(\^|\$|\*|\||~)?=?[\w\u00C0-\uFFFF\s\-\_\.\'\"]+\]+)|(:\w+[\w\-]*))\))?)*)?(>|\+|~)?/,
            id: /^#([\w\u00C0-\uFFFF\-\_]+)$/,
            tag: /^(\w+)/,
            relation: /^(>|\+|~)$/,
            pseudo: /^:(\w[\w\-]*)(\((.+)\))?$/,
            pseudos: /:(\w[\w\-]*)(\(([^\)]+)\))?/g,
            attribs: /\[(\w+)\s*(\^|\$|\*|\||~)?=?\s*([\w\u00C0-\uFFFF\s\-_\.]+|"[^"]*"|'[^']*')?\]/g,
            classes: /\.([\w\u00C0-\uFFFF\-_]+)/g,
            quoted: /^["'](.*)["']$/,
            nth: /^((odd|even)|([1-9]\d*)|((([1-9]\d*)?)n([\+\-]\d+)?)|(\-(([1-9]\d*)?)n\+(\d+)))$/
        };
        var E = function (M, L) {
                M.push.apply(M, [].slice.apply(L));
                return M
            };
        if (C) {
            E = function (N, M) {
                if (M.slice) {
                    return N.concat(M)
                }
                var L = 0,
                    O;
                while ((O = M[L++])) {
                    N[N.length] = O
                }
                return N
            }
        }
        var D = function (O, N) {
                if (O.indexOf) {
                    return O.indexOf(N) >= 0
                }
                for (var M = 0, L = O.length; M < L; M++) {
                    if (O[M] === N) {
                        return true
                    }
                }
                return false
            };
        var H = function (N, L) {
                var M = N.parentNode;
                return L === document || M === L || (M !== document && H(M, L))
            };
        return {
            isIE: C,
            camel: J,
            allMethods: [],
            publicMethods: ["cssSelect", "elmsByClass", "elmsByAttribute", "elmsByTag"],
            initCore: function () {
                this.applyMethod.call(window, "$", this.$);
                this.applyMethod.call(window, "$$", this.$$);
                window.DOMAssistant = this;
                if (C) {
                    G = Array
                }
                G.prototype = [];
                G.prototype.each = function (N) {
                    for (var M = 0, L = this.length; M < L; M++) {
                        N.call(this[M])
                    }
                    return this
                };
                G.prototype.first = function () {
                    return (typeof this[0] !== "undefined") ? DOMAssistant.addMethodsToElm(this[0]) : null
                };
                G.prototype.end = function () {
                    return this.previousSet
                };
                this.attach(this)
            },
            addMethods: function (L, M) {
                if (typeof this.allMethods[L] === "undefined") {
                    this.allMethods[L] = M;
                    this.addHTMLArrayPrototype(L, M)
                }
            },
            addMethodsToElm: function (M) {
                for (var L in this.allMethods) {
                    if (typeof this.allMethods[L] !== "undefined") {
                        this.applyMethod.call(M, L, this.allMethods[L])
                    }
                }
                return M
            },
            applyMethod: function (M, L) {
                if (typeof this[M] !== "function") {
                    this[M] = L
                }
            },
            attach: function (N) {
                var L = N.publicMethods;
                if (typeof L === "undefined") {
                    for (var P in N) {
                        if (P !== "init" && typeof N[P] !== "undefined") {
                            this.addMethods(P, N[P])
                        }
                    }
                } else {
                    if (L.constructor === Array) {
                        for (var M = 0, O;
                        (O = L[M]); M++) {
                            this.addMethods(O, N[O])
                        }
                    }
                }
                if (typeof N.init === "function") {
                    N.init()
                }
            },
            addHTMLArrayPrototype: function (L, M) {
                G.prototype[L] = function () {
                    var P = new G();
                    P.previousSet = this;
                    var Q;
                    for (var O = 0, N = this.length; O < N; O++) {
                        Q = M.apply(this[O], arguments);
                        if ( !! Q && Q.constructor === Array) {
                            P = E(P, Q)
                        } else {
                            P.push(Q)
                        }
                    }
                    return P
                }
            },
            clearHandlers: function () {
                var Q = this.all || this.getElementsByTagName("*");
                for (var P = 0, R, L;
                (R = Q[P++]);) {
                    if ((L = R.attributes)) {
                        for (var N = 0, O = L.length, M; N < O; N++) {
                            M = L[N].nodeName.toLowerCase();
                            if (typeof R[M] === "function") {
                                R[M] = null
                            }
                        }
                    }
                }
            },
            setCache: function (L) {
                A = L
            },
            $: function () {
                var O = arguments[0];
                if (arguments.length === 1 && (typeof O === "object" || (typeof O === "function" && !! O.nodeName))) {
                    return DOMAssistant.$$(O)
                }
                var Q = new G();
                for (var M = 0, L, P;
                (L = arguments[M]); M++) {
                    if (typeof L === "string") {
                        L = L.replace(/^[^#]*(#)/, "$1");
                        if (I.id.test(L)) {
                            if ((P = DOMAssistant.$$(L.substr(1), false))) {
                                Q.push(P)
                            }
                        } else {
                            var N = (document.all || document.getElementsByTagName("*")).length;
                            Q = (!document.querySelectorAll && A && K.rule && K.rule === L && K.doc === N) ? K.elms : E(Q, DOMAssistant.cssSelection.call(document, L));
                            K = {
                                rule: L,
                                elms: Q,
                                doc: N
                            }
                        }
                    }
                }
                return Q
            },
            $$: function (Q, N) {
                var P = (typeof Q === "object" || (typeof Q === "function" && !! Q.nodeName)) ? Q : document.getElementById(Q);
                var O = N || true;
                if (typeof Q === "string" && P && P.id !== Q) {
                    P = null;
                    for (var L = 0, M;
                    (M = document.all[L]); L++) {
                        if (M.id === Q) {
                            P = M;
                            break
                        }
                    }
                }
                if (P && O) {
                    DOMAssistant.addMethodsToElm(P)
                }
                return P
            },
            getSequence: function (P) {
                var Q, O = 2,
                    M = -1,
                    L = -1,
                    N = I.nth.exec(P.replace(/^0n\+/, "").replace(/^2n$/, "even").replace(/^2n+1$/, "odd"));
                if (!N) {
                    return null
                }
                if (N[2]) {
                    Q = (N[2] === "odd") ? 1 : 2;
                    L = (Q === 1) ? 1 : 0
                } else {
                    if (N[3]) {
                        Q = parseInt(N[3], 10);
                        O = 0;
                        M = Q
                    } else {
                        if (N[4]) {
                            O = N[6] ? parseInt(N[6], 10) : 1;
                            Q = N[7] ? parseInt(N[7], 10) : 0;
                            while (Q < 1) {
                                Q += O
                            }
                            L = (Q > O) ? (Q - O) % O : ((Q === O) ? 0 : Q)
                        } else {
                            if (N[8]) {
                                O = N[10] ? parseInt(N[10], 10) : 1;
                                Q = M = parseInt(N[11], 10);
                                while (Q > O) {
                                    Q -= O
                                }
                                L = (M > O) ? (M - O) % O : ((M === O) ? 0 : M)
                            }
                        }
                    }
                }
                return {
                    start: Q,
                    add: O,
                    max: M,
                    modVal: L
                }
            },
            cssByDOM: function (L) {
                var AL = L.replace(I.rules, "$1").split(",");
                var AD = new G(),
                    At = [],
                    AI = [];
                var y, AU, X, T, d, Ax, N, Ak, Q, Z, M, Au, AO, O, AK;
                try {
                    y = new RegExp("(?:\\[[^\\[]*\\]|\\(.*\\)|[^\\s\\+>~\\[\\(])+|[\\+>~]", "g")
                } catch (Am) {
                    y = /[^\s]+/g
                }
                function AR(i) {
                    i = i || At;
                    for (var e = 0, a = i.length; e < a; e++) {
                        i[e].added = null
                    }
                }
                function S() {
                    for (var e = 0, a = AU.length; e < a; e++) {
                        AU[e].childElms = null
                    }
                }
                function Aq(k, a) {
                    for (var l = 0, o;
                    (o = k[l]); l++) {
                        var n = false;
                        for (var e = 0, m;
                        (m = a[e]); e++) {
                            if (m === o) {
                                n = true;
                                a.splice(e, 1);
                                break
                            }
                        }
                        if (n) {
                            k.splice(l--, 1)
                        }
                    }
                    return k
                }
                function U(e, a) {
                    return C ? e[J[a.toLowerCase()] || a] : e.getAttribute(a, 2)
                }
                function g(a, e) {
                    a = a ? a.replace(I.quoted, "$1").replace(/\./g, "\\.") : null;
                    switch (e) {
                    case "^":
                        return "^" + a;
                    case "$":
                        return a + "$";
                    case "*":
                        return a;
                    case "|":
                        return "^" + a + "(\\-\\w+)*$";
                    case "~":
                        return "\\b" + a + "\\b";
                    default:
                        return a ? "^" + a + "$" : null
                    }
                }
                function v(a, e) {
                    return F ? ((a === "*") ? e.all : e.all.tags(a)) : e.getElementsByTagName(a)
                }
                function AM(a, e) {
                    a = a || "*";
                    e = e || document;
                    return (e === document || e.lastModified) ? B[a] || (B[a] = v(a, document)) : v(a, e)
                }
                function Av(m, A5, j) {
                    AU = [];
                    var k = A5.split("-"),
                        r = [],
                        AW = 0,
                        A4, AV;
                    var l = (A4 = /\-of\-type$/.test(A5)) ? "nodeName" : "nodeType";

                    function A6(A8) {
                        var A7 = A4 ? A8.nodeName : 1;
                        while ((A8 = A8.previousSibling) && A8[l] !== A7) {}
                        return A8
                    }
                    function q(A8) {
                        var A7 = A4 ? A8.nodeName : 1;
                        while ((A8 = A8.nextSibling) && A8[l] !== A7) {}
                        return A8
                    }
                    var o = {
                        first: function (A7) {
                            return !A6(A7)
                        },
                        last: function (A7) {
                            return !q(A7)
                        },
                        empty: function (A7) {
                            return !A7.childNodes.length
                        },
                        enabled: function (A7) {
                            return !Q.disabled && Q.type !== "hidden"
                        },
                        disabled: function (A7) {
                            return Q.disabled
                        },
                        checked: function (A7) {
                            return Q.checked
                        },
                        contains: function (A7) {
                            return (Q.innerText || Q.textContent || "").indexOf(j.replace(I.quoted, "$1")) > -1
                        },
                        other: function (A7) {
                            return U(Q, A5) === j
                        }
                    };

                    function i(A7) {
                        while ((Q = m[AW++])) {
                            if (o[A7](Q)) {
                                r[r.length] = Q
                            }
                        }
                        return r
                    }
                    var A1 = k[0] || null;
                    if (A1 && o[A1]) {
                        return i(A1)
                    }
                    switch (A1) {
                    case "only":
                        var s;
                        while ((Q = m[AW++])) {
                            Z = Q.parentNode;
                            if (Z !== s) {
                                if (!A6(Q) && !q(Q)) {
                                    r[r.length] = Q
                                }
                                s = Z
                            }
                        }
                        break;
                    case "nth":
                        if (/^n$/.test(j)) {
                            r = m
                        } else {
                            var A3 = (k[1] === "last") ? ["lastChild", "previousSibling"] : ["firstChild", "nextSibling"];
                            AK = DOMAssistant.getSequence.call(this, j);
                            if (AK) {
                                while ((Q = m[AW++])) {
                                    Z = Q.parentNode;
                                    if (!Z.childElms) {
                                        var A0 = 0,
                                            AX = Q.nodeName;
                                        AO = AK.start;
                                        O = Z[A3[0]];
                                        while (O && (AK.max < 0 || AO <= AK.max)) {
                                            var A2 = O.nodeName;
                                            if ((A4 && A2 === AX) || (!A4 && O.nodeType === 1)) {
                                                if (++A0 === AO) {
                                                    if (A2 === AX) {
                                                        r[r.length] = O
                                                    }
                                                    AO += AK.add
                                                }
                                            }
                                            O = O[A3[1]]
                                        }
                                        Z.childElms = true;
                                        AU[AU.length] = Z
                                    }
                                }
                                S()
                            }
                        }
                        break;
                    case "target":
                        var e = document.location.hash.slice(1);
                        if (e) {
                            while ((Q = m[AW++])) {
                                if (U(Q, "name") === e || U(Q, "id") === e) {
                                    r[r.length] = Q;
                                    break
                                }
                            }
                        }
                        break;
                    case "not":
                        if ((AV = I.pseudo.exec(j))) {
                            r = Aq(m, Av(m, AV[1] ? AV[1].toLowerCase() : null, AV[3] || null))
                        } else {
                            for (var AY in I) {
                                if (I[AY].lastIndex) {
                                    I[AY].lastIndex = 0
                                }
                            }
                            j = j.replace(I.id, "[id=$1]");
                            var u = I.tag.exec(j);
                            var n = I.classes.exec(j);
                            var t = I.attribs.exec(j);
                            var a = new RegExp(t ? g(t[3], t[2]) : "(^|\\s)" + (u ? u[1] : n ? n[1] : "") + "(\\s|$)", "i");
                            while ((M = m[AW++])) {
                                Au = null;
                                if (u && !a.test(M.nodeName)) {
                                    Au = M
                                } else {
                                    if (n && !a.test(M.className)) {
                                        Au = M
                                    } else {
                                        if (t) {
                                            var AZ = U(M, t[1]);
                                            if (!AZ || !a.test(AZ)) {
                                                Au = M
                                            }
                                        }
                                    }
                                }
                                if (Au && !Au.added) {
                                    Au.added = true;
                                    r[r.length] = Au
                                }
                            }
                        }
                        break;
                    default:
                        return i("other")
                    }
                    return r
                }
                for (var Ao = 0;
                (X = AL[Ao]); Ao++) {
                    if (Ao && D(AL.slice(0, Ao), X)) {
                        continue
                    }
                    At = [this];
                    T = X.match(y);
                    for (var Al = 0, V;
                    (V = T[Al]); Al++) {
                        AI = [];
                        if (Al > 0 && I.relation.test(V)) {
                            if ((d = I.relation.exec(V))) {
                                var Ar = null,
                                    AS = T[Al + 1];
                                if ((Ax = I.tag.exec(AS))) {
                                    Ax = Ax[1];
                                    N = new RegExp("(^|\\s)" + Ax + "(\\s|$)", "i")
                                } else {
                                    if (I.id.test(AS)) {
                                        Ar = DOMAssistant.$(AS) || null
                                    }
                                }
                                for (var Aj = 0, c;
                                (c = At[Aj]); Aj++) {
                                    switch (d[0]) {
                                    case ">":
                                        var AF = Ar || AM(Ax, c);
                                        for (var Ah = 0, AA;
                                        (AA = AF[Ah]); Ah++) {
                                            if (AA.parentNode === c) {
                                                AI[AI.length] = AA
                                            }
                                        }
                                        break;
                                    case "+":
                                        while ((c = c.nextSibling) && c.nodeType !== 1) {}
                                        if (c) {
                                            if ((Ar && Ar[0] === c) || (!Ar && (!Ax || N.test(c.nodeName)))) {
                                                AI[AI.length] = c
                                            }
                                        }
                                        break;
                                    case "~":
                                        while ((c = c.nextSibling) && !c.added) {
                                            if ((Ar && Ar[0] === c) || (!Ar && (!Ax || N.test(c.nodeName)))) {
                                                c.added = true;
                                                AI[AI.length] = c
                                            }
                                        }
                                        break
                                    }
                                }
                                At = AI;
                                AR();
                                V = T[++Al];
                                if (/^\w+$/.test(V) || I.id.test(V)) {
                                    continue
                                }
                                At.skipTag = true
                            }
                        }
                        var Aw = I.selector.exec(V);
                        var AH = {
                            tag: (!Aw[1] || Aw[3] === "*") ? "*" : Aw[1],
                            id: (Aw[3] !== "*") ? Aw[2] : null,
                            allClasses: Aw[4],
                            allAttr: Aw[6],
                            allPseudos: Aw[11]
                        };
                        if (AH.id) {
                            var f = 0,
                                Ap = document.getElementById(AH.id.replace(/#/, ""));
                            if (Ap) {
                                while (At[f] && !H(Ap, At[f])) {
                                    f++
                                }
                                AI = (f < At.length) ? [Ap] : []
                            }
                            At = AI
                        } else {
                            if (AH.tag && !At.skipTag) {
                                if (Al === 0 && !AI.length && At.length === 1) {
                                    At = AI = E([], AM(AH.tag, At[0]))
                                } else {
                                    for (var Ag = 0, AP = At.length, AB, Ay; Ag < AP; Ag++) {
                                        AB = AM(AH.tag, At[Ag]);
                                        for (var Ad = 0;
                                        (Ay = AB[Ad]); Ad++) {
                                            if (!Ay.added) {
                                                Ay.added = true;
                                                AI[AI.length] = Ay
                                            }
                                        }
                                    }
                                    At = AI;
                                    AR()
                                }
                            }
                        }
                        if (!AI.length) {
                            break
                        }
                        At.skipTag = false;
                        if (AH.allClasses) {
                            var Ac = 0,
                                Ae = [],
                                Y = AH.allClasses.split(".").slice(1);
                            while ((Ak = At[Ac++])) {
                                var Ai = true,
                                    Az = Ak.className;
                                if (Az && Az.length) {
                                    Az = Az.split(" ");
                                    for (var Aa = 0, Ab = Y.length; Aa < Ab; Aa++) {
                                        if (!D(Az, Y[Aa])) {
                                            Ai = false;
                                            break
                                        }
                                    }
                                    if (Ai) {
                                        Ae[Ae.length] = Ak
                                    }
                                }
                            }
                            At = AI = Ae
                        }
                        if (AH.allAttr) {
                            var w = 0,
                                AE = [],
                                Af = [],
                                AJ = AH.allAttr.match(/\[[^\]]+\]/g);
                            for (var z = 0, P = AJ.length, x, AQ; z < P; z++) {
                                I.attribs.lastIndex = 0;
                                x = I.attribs.exec(AJ[z]);
                                AQ = g(x[3], x[2] || null);
                                AE[z] = [(AQ ? new RegExp(AQ) : null), x[1]]
                            }
                            while ((Ak = AI[w++])) {
                                for (var p = 0, AG = AE.length; p < AG; p++) {
                                    var R = true,
                                        AC = AE[p][0],
                                        An = U(Ak, AE[p][1]);
                                    if (!AC && An === true) {
                                        continue
                                    }
                                    if ((!AC && (!An || typeof An !== "string" || !An.length)) || ( !! AC && !AC.test(An))) {
                                        R = false;
                                        break
                                    }
                                }
                                if (R) {
                                    Af[Af.length] = Ak
                                }
                            }
                            At = AI = Af
                        }
                        if (AH.allPseudos) {
                            var W = AH.allPseudos.match(I.pseudos);
                            for (var h = 0, As = W.length; h < As; h++) {
                                I.pseudos.lastIndex = 0;
                                var AT = I.pseudos.exec(W[h]);
                                var b = AT[1] ? AT[1].toLowerCase() : null;
                                var AN = AT[3] || null;
                                AI = Av(AI, b, AN);
                                AR(AI)
                            }
                            At = AI
                        }
                    }
                    AD = E(AD, At)
                }
                return AD
            },
            cssByXpath: function (M) {
                var N = {
                    xhtml: "http://www.w3.org/1999/xhtml"
                };
                var O = (document.documentElement.namespaceURI === N.xhtml) ? "xhtml:" : "";
                var L = function P(Q) {
                        return N[Q] || null
                    };
                DOMAssistant.cssByXpath = function (l) {
                    if (/:checked/.test(l)) {
                        return DOMAssistant.cssByDOM.call(this, l)
                    }
                    var X = l.replace(I.rules, "$1").split(",");
                    var W = new G();
                    var p, r, f, U, V, Z;
                    var q = new RegExp("(?:\\[[^\\[]*\\]|\\(.*\\)|[^\\s\\+>~\\[\\(])+|[\\+>~]", "g");

                    function h(i, t, k, j) {
                        j = j ? j.replace(I.quoted, "$1") : j;
                        switch (k) {
                        case "^":
                            return "starts-with(@" + t + ', "' + j + '")';
                        case "$":
                            return "substring(@" + t + ", (string-length(@" + t + ") - " + (j.length - 1) + "), " + j.length + ') = "' + j + '"';
                        case "*":
                            return 'contains(concat(" ", @' + t + ', " "), "' + j + '")';
                        case "|":
                            return "(@" + t + '="' + j + '" or starts-with(@' + t + ', "' + j + '-"))';
                        case "~":
                            return 'contains(concat(" ", @' + t + ', " "), " ' + j + ' ")';
                        default:
                            return "@" + t + (j ? '="' + j + '"' : "")
                        }
                    }
                    function T(i, t, k, j) {
                        return "[" + h(i, t, k, j) + "]"
                    }
                    function n(y, x, k) {
                        y = /\-child$/.test(x) ? "*" : y;
                        var t = "",
                            v = x.split("-"),
                            u;
                        switch (v[0]) {
                        case "nth":
                            if (!/^n$/.test(k)) {
                                var j = ((v[1] === "last") ? "(count(following-sibling::" : "(count(preceding-sibling::") + y + ") + 1)";
                                if ((Z = DOMAssistant.getSequence.call(this, k))) {
                                    t = (Z.start === Z.max) ? j + " = " + Z.start : j + " mod " + Z.add + " = " + Z.modVal + ((Z.start > 1) ? " and " + j + " >= " + Z.start : "") + ((Z.max > 0) ? " and " + j + " <= " + Z.max : "")
                                }
                            }
                            break;
                        case "not":
                            var w = (u = I.pseudo.exec(k)) ? n(y, u[1] ? u[1].toLowerCase() : null, u[3] || null) : k.replace(I.id, "[id=$1]").replace(I.tag, "self::$1").replace(I.classes, 'contains(concat(" ", @class, " "), " $1 ")').replace(I.attribs, h);
                            t = "not(" + w + ")";
                            break;
                        case "first":
                            return "not(preceding-sibling::" + y + ")";
                        case "last":
                            return "not(following-sibling::" + y + ")";
                        case "only":
                            return "not(preceding-sibling::" + y + " or following-sibling::" + y + ")";
                        case "empty":
                            return "count(child::*) = 0 and string-length(text()) = 0";
                        case "contains":
                            return 'contains(., "' + k.replace(I.quoted, "$1") + '")';
                        case "enabled":
                            return 'not(@disabled) and not(@type="hidden")';
                        case "disabled":
                            return "@disabled";
                        case "target":
                            var i = document.location.hash.slice(1);
                            return '@name="' + i + '" or @id="' + i + '"';
                        default:
                            return "@" + x + '="' + k + '"'
                        }
                        return t
                    }
                    for (var m = 0;
                    (p = X[m]); m++) {
                        if (m && D(X.slice(0, m), p)) {
                            continue
                        }
                        r = p.match(q);
                        f = ".";
                        for (var g = 0, o = r.length; g < o; g++) {
                            U = I.selector.exec(r[g]);
                            V = {
                                tag: O + ((!U[1] || U[3] === "*") ? "*" : U[1]),
                                id: (U[3] !== "*") ? U[2] : null,
                                allClasses: U[4],
                                allAttr: U[6],
                                allPseudos: U[11],
                                tagRelation: U[23]
                            };
                            if (V.tagRelation) {
                                var a = {
                                    ">": "/child::",
                                    "+": "/following-sibling::*[1]/self::",
                                    "~": "/following-sibling::"
                                };
                                f += a[V.tagRelation] || ""
                            } else {
                                f += (g > 0 && I.relation.test(r[g - 1])) ? V.tag : ("/descendant::" + V.tag)
                            }
                            if (V.id) {
                                f += '[@id = "' + V.id.replace(/^#/, "") + '"]'
                            }
                            if (V.allClasses) {
                                f += V.allClasses.replace(I.classes, '[contains(concat(" ", @class, " "), " $1 ")]')
                            }
                            if (V.allAttr) {
                                f += V.allAttr.replace(I.attribs, T)
                            }
                            if (V.allPseudos) {
                                var Y = V.allPseudos.match(I.pseudos);
                                for (var e = 0, R = Y.length; e < R; e++) {
                                    I.pseudos.lastIndex = 0;
                                    var S = I.pseudos.exec(Y[e]);
                                    var s = S[1] ? S[1].toLowerCase() : null;
                                    var Q = S[3] || null;
                                    var b = n(V.tag, s, Q);
                                    if (b.length) {
                                        f += "[" + b + "]"
                                    }
                                }
                            }
                        }
                        var d = document.evaluate(f, this, L, 0, null),
                            c;
                        while ((c = d.iterateNext())) {
                            W.push(c)
                        }
                    }
                    return W
                };
                return DOMAssistant.cssByXpath.call(this, M)
            },
            cssSelection: function (M) {
                DOMAssistant.cssSelection = document.evaluate ? DOMAssistant.cssByXpath : DOMAssistant.cssByDOM;
                if (document.querySelectorAll) {
                    var L = DOMAssistant.cssSelection;
                    DOMAssistant.cssSelection = function (N) {
                        try {
                            var P = new G();
                            return E(P, this.querySelectorAll(N))
                        } catch (O) {
                            return L.call(this, N)
                        }
                    }
                }
                return DOMAssistant.cssSelection.call(this, M)
            },
            cssSelect: function (L) {
                return DOMAssistant.cssSelection.call(this, L)
            },
            elmsByClass: function (N, L) {
                var M = (L || "") + "." + N;
                return DOMAssistant.cssSelection.call(this, M)
            },
            elmsByAttribute: function (M, N, L, P) {
                var O = (L || "") + "[" + M + ((N && N !== "*") ? ((P || "") + "=" + N + "]") : "]");
                return DOMAssistant.cssSelection.call(this, O)
            },
            elmsByTag: function (L) {
                return DOMAssistant.cssSelection.call(this, L)
            }
        }
    }();
DOMAssistant.initCore();
DOMAssistant.AJAX = function () {
    var globalXMLHttp = null;
    var readyState = 0;
    var status = -1;
    var statusText = "";
    var requestPool = [];
    var createAjaxObj = function (url, method, callback, addToContent) {
            var params = null;
            if (/POST/i.test(method)) {
                url = url.split("?");
                params = url[1];
                url = url[0]
            }
            return {
                url: url,
                method: method,
                callback: callback,
                params: params,
                headers: {},
                responseType: "text",
                addToContent: addToContent || false
            }
        };
    var inProgress = function (xhr) {
            return ( !! xhr && xhr.readyState >= 1 && xhr.readyState <= 3)
        };
    return {
        publicMethods: ["ajax", "get", "post", "load"],
        initRequest: function () {
            var XMLHttp = null;
            if ( !! window.XMLHttpRequest) {
                XMLHttp = new XMLHttpRequest();
                DOMAssistant.AJAX.initRequest = function () {
                    return requestPool.length ? requestPool.pop() : new XMLHttpRequest()
                }
            } else {
                if ( !! window.ActiveXObject) {
                    var XMLHttpMS = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
                    for (var i = 0; i < XMLHttpMS.length; i++) {
                        try {
                            XMLHttp = new window.ActiveXObject(XMLHttpMS[i]);
                            DOMAssistant.AJAX.initRequest = function () {
                                return requestPool.length ? requestPool.pop() : new window.ActiveXObject(XMLHttpMS[i])
                            };
                            break
                        } catch (e) {
                            XMLHttp = null
                        }
                    }
                }
            }
            return XMLHttp
        },
        ajax: function (ajaxObj) {
            if (!ajaxObj.noParse && ajaxObj.url && /\?/.test(ajaxObj.url) && ajaxObj.method && /POST/i.test(ajaxObj.method)) {
                var url = ajaxObj.url.split("?");
                ajaxObj.url = url[0];
                ajaxObj.params = url[1] + ((url[1].length > 0 && ajaxObj.params) ? ("&" + ajaxObj.params) : "")
            }
            return DOMAssistant.AJAX.makeCall.call(this, ajaxObj)
        },
        get: function (url, callback, addToContent) {
            var ajaxObj = createAjaxObj(url, "GET", callback, addToContent);
            return DOMAssistant.AJAX.makeCall.call(this, ajaxObj)
        },
        post: function (url, callback) {
            var ajaxObj = createAjaxObj(url, "POST", callback);
            return DOMAssistant.AJAX.makeCall.call(this, ajaxObj)
        },
        load: function (url, addToContent) {
            DOMAssistant.AJAX.get.call(this, url, DOMAssistant.AJAX.replaceWithAJAXContent, addToContent)
        },
        makeCall: function (ajaxObj) {
            var XMLHttp = DOMAssistant.AJAX.initRequest();
            if (XMLHttp) {
                globalXMLHttp = XMLHttp;
                (function (elm) {
                    var url = ajaxObj.url,
                        method = ajaxObj.method || "GET",
                        callback = ajaxObj.callback,
                        params = ajaxObj.params,
                        headers = ajaxObj.headers,
                        responseType = ajaxObj.responseType || "text",
                        addToContent = ajaxObj.addToContent,
                        timeout = ajaxObj.timeout || null,
                        ex = ajaxObj.exception,
                        timeoutId = null;
                    XMLHttp.open(method, url, true);
                    XMLHttp.setRequestHeader("AJAX", "true");
                    XMLHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    if (method === "POST") {
                        var contentLength = params ? params.length : 0;
                        XMLHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        XMLHttp.setRequestHeader("Content-length", contentLength);
                        if (XMLHttp.overrideMimeType) {
                            XMLHttp.setRequestHeader("Connection", "close")
                        }
                    }
                    if (responseType === "json") {
                        XMLHttp.setRequestHeader("Accept", "application/json, text/javascript, */*")
                    }
                    for (var i in headers) {
                        if (typeof i === "string") {
                            XMLHttp.setRequestHeader(i, headers[i])
                        }
                    }
                    if (typeof callback === "function") {
                        XMLHttp.onreadystatechange = function () {
                            try {
                                if (XMLHttp.readyState === 4) {
                                    window.clearTimeout(timeoutId);
                                    status = XMLHttp.status;
                                    statusText = XMLHttp.statusText;
                                    readyState = 4;
                                    if (!status || status !== 200) {
                                        throw new Error(statusText)
                                    }
                                    var response = /xml/i.test(responseType) ? XMLHttp.responseXML : XMLHttp.responseText;
                                    if (/json/i.test(responseType)) {
                                        response = (typeof JSON === "object" && typeof JSON.parse === "function") ? JSON.parse(response) : eval("(" + response + ")")
                                    }
                                    globalXMLHttp = null;
                                    XMLHttp.onreadystatechange = function () {};
                                    requestPool.push(XMLHttp);
                                    callback.call(elm, response, addToContent)
                                }
                            } catch (e) {
                                globalXMLHttp = XMLHttp = null;
                                if (typeof ex === "function") {
                                    ex.call(elm, e);
                                    ex = null
                                }
                            }
                        }
                    }
                    XMLHttp.send(params);
                    if (timeout) {
                        timeoutId = window.setTimeout(function () {
                            if (inProgress(XMLHttp)) {
                                XMLHttp.abort();
                                if (typeof ex === "function") {
                                    readyState = 0;
                                    status = 408;
                                    statusText = "Request timeout";
                                    globalXMLHttp = XMLHttp = null;
                                    ex.call(elm, new Error(statusText));
                                    ex = null
                                }
                            }
                        }, timeout)
                    }
                })(this)
            }
            return this
        },
        replaceWithAJAXContent: function (content, add) {
            if (add) {
                this.innerHTML += content
            } else {
                DOMAssistant.clearHandlers.apply(this);
                this.innerHTML = content
            }
        },
        getReadyState: function () {
            return (globalXMLHttp && typeof globalXMLHttp.readyState !== "undefined") ? globalXMLHttp.readyState : readyState
        },
        getStatus: function () {
            return status
        },
        getStatusText: function () {
            return statusText
        }
    }
}();
DOMAssistant.attach(DOMAssistant.AJAX);
DOMAssistant.CSS = function () {
    return {
        addClass: function (B) {
            if (!DOMAssistant.CSS.hasClass.call(this, B)) {
                var A = this.className;
                this.className = A + (A.length ? " " : "") + B
            }
            return this
        },
        removeClass: function (A) {
            return DOMAssistant.CSS.replaceClass.call(this, A)
        },
        replaceClass: function (B, C) {
            var A = new RegExp(("(^|\\s)" + B + "(\\s|$)"), "i");
            this.className = this.className.replace(A, function (D, G, F) {
                var E = C ? (G + C + F) : "";
                if (/^\s+.*\s+$/.test(D)) {
                    E = D.replace(/(\s+).+/, "$1")
                }
                return E
            }).replace(/^\s+|\s+$/g, "");
            return this
        },
        hasClass: function (A) {
            return new RegExp(("(^|\\s)" + A + "(\\s|$)"), "i").test(this.className)
        },
        setStyle: function (C, D) {
            if (this.filters && (typeof C === "string" ? /opacity/i.test(C) : C.opacity)) {
                this.style.filter = "alpha(opacity=" + (D || C.opacity || 1) * 100 + ")"
            }
            if (typeof this.style.cssText !== "undefined") {
                var A = this.style.cssText;
                if (typeof C === "object") {
                    for (var B in C) {
                        if (typeof B === "string") {
                            A += ";" + B + ":" + C[B]
                        }
                    }
                } else {
                    A += ";" + C + ":" + D
                }
                this.style.cssText = A
            }
            return this
        },
        getStyle: function (A) {
            var C = "";
            A = A.toLowerCase();
            if (document.defaultView && document.defaultView.getComputedStyle) {
                C = document.defaultView.getComputedStyle(this, "").getPropertyValue(A)
            } else {
                if (this.currentStyle) {
                    if (this.filters && /^opacity$/.test(A)) {
                        var B = this.filters["DXImageTransform.Microsoft.Alpha"] || this.filters.alpha || {};
                        C = (B.opacity || 100) / 100
                    } else {
                        A = A.replace(/^float$/, "styleFloat").replace(/\-(\w)/g, function (D, E) {
                            return E.toUpperCase()
                        });
                        C = this.currentStyle[A]
                    }
                    if (C === "auto" && /^(width|height)$/.test(A) && this.currentStyle.display !== "none") {
                        C = this["offset" + A.charAt(0).toUpperCase() + A.substr(1)] + "px"
                    }
                }
            }
            return C
        }
    }
}();
DOMAssistant.attach(DOMAssistant.CSS);
DOMAssistant.Content = function () {
    var A = DOMAssistant.$;
    return {
        init: function () {
            DOMAssistant.setCache(false)
        },
        prev: function () {
            var B = this;
            while ((B = B.previousSibling) && B.nodeType !== 1) {}
            return A(B)
        },
        next: function () {
            var B = this;
            while ((B = B.nextSibling) && B.nodeType !== 1) {}
            return A(B)
        },
        create: function (D, C, B, E) {
            var F = A(document.createElement(D));
            if (C) {
                F = F.setAttributes(C)
            }
            if (typeof E !== "undefined") {
                F.addContent(E)
            }
            if (B) {
                DOMAssistant.Content.addContent.call(this, F)
            }
            return F
        },
        setAttributes: function (B) {
            if (DOMAssistant.isIE) {
                var C = function (G, E, F) {
                        var D = E.toLowerCase();
                        switch (D) {
                        case "name":
                        case "type":
                            return document.createElement(G.outerHTML.replace(new RegExp(D + "=[a-zA-Z]+"), " ").replace(">", " " + D + "=" + F + ">"));
                        case "style":
                            G.style.cssText = F;
                            return G;
                        default:
                            G[DOMAssistant.camel[D] || E] = F;
                            return G
                        }
                    };
                DOMAssistant.Content.setAttributes = function (D) {
                    var H = this;
                    var G = this.parentNode;
                    for (var F in D) {
                        if (typeof D[F] === "string" || typeof D[F] === "number") {
                            var E = C(H, F, D[F]);
                            if (G && /(name|type)/i.test(F)) {
                                if (H.innerHTML) {
                                    E.innerHTML = H.innerHTML
                                }
                                G.replaceChild(E, H)
                            }
                            H = E
                        }
                    }
                    return A(H)
                }
            } else {
                DOMAssistant.Content.setAttributes = function (D) {
                    for (var E in D) {
                        if (/class/i.test(E)) {
                            this.className = D[E]
                        } else {
                            this.setAttribute(E, D[E])
                        }
                    }
                    return this
                }
            }
            return DOMAssistant.Content.setAttributes.call(this, B)
        },
        addContent: function (C) {
            var B = typeof C;
            if (B === "string" || B === "number") {
                this.innerHTML += C
            } else {
                if (B === "object" || (B === "function" && !! C.nodeName)) {
                    this.appendChild(C)
                }
            }
            return this
        },
        replaceContent: function (B) {
            DOMAssistant.clearHandlers.apply(this);
            this.innerHTML = "";
            return DOMAssistant.Content.addContent.call(this, B)
        },
        replace: function (G, B) {
            var F = typeof G;
            if (F === "string" || F === "number") {
                var E = this.parentNode;
                var D = A(E).create("div", null, false, G);
                for (var C = D.childNodes.length - 1; C >= 0; C--) {
                    E.insertBefore(D.childNodes[C], this.nextSibling)
                }
                G = this.nextSibling;
                E.removeChild(this)
            } else {
                if (F === "object" || (F === "function" && !! G.nodeName)) {
                    this.parentNode.replaceChild(G, this)
                }
            }
            return B ? G : this
        },
        remove: function () {
            this.parentNode.removeChild(this);
            return null
        }
    }
}();
DOMAssistant.attach(DOMAssistant.Content);
DOMAssistant.Events = function () {
    var A = 1;
    return {
        publicMethods: ["triggerEvent", "addEvent", "removeEvent", "preventDefault", "cancelBubble"],
        init: function () {
            window.addEvent = this.addEvent;
            window.removeEvent = this.removeEvent;
            DOMAssistant.preventDefault = this.preventDefault;
            DOMAssistant.cancelBubble = this.cancelBubble
        },
        triggerEvent: function (C, F) {
            if (this.events && this.events[C]) {
                var E = {
                    type: C,
                    target: F || this,
                    currentTarget: this,
                    bubbles: false,
                    cancelable: false,
                    preventDefault: function () {},
                    stopPropagation: function () {},
                    timeStamp: +new Date()
                };
                for (var D = 0, B = this.events[C].length; D < B; D++) {
                    this.events[C][D].call(this, E)
                }
            } else {
                if (typeof this["on" + C] === "function") {
                    this["on" + C].call(this, E)
                }
            }
            return this
        },
        addEvent: function (B, D) {
            if (/^DOM/.test(B)) {
                if (this.addEventListener) {
                    this.addEventListener(B, D, false)
                }
            } else {
                if (!this.uniqueHandlerId) {
                    this.uniqueHandlerId = A++
                }
                if (!(D.attachedElements && D.attachedElements[B + this.uniqueHandlerId])) {
                    if (!this.events) {
                        this.events = {}
                    }
                    if (!this.events[B]) {
                        this.events[B] = [];
                        var C = this["on" + B];
                        if (C) {
                            this.events[B].push(C)
                        }
                    }
                    this.events[B].push(D);
                    this["on" + B] = DOMAssistant.Events.handleEvent;
                    if (typeof this.window === "object") {
                        this.window["on" + B] = DOMAssistant.Events.handleEvent
                    }
                    if (!D.attachedElements) {
                        D.attachedElements = {}
                    }
                    D.attachedElements[B + this.uniqueHandlerId] = true
                }
            }
            return this
        },
        handleEvent: function (B) {
            var G = B || event;
            var H = G.target || G.srcElement || document;
            while (H.nodeType !== 1 && H.parentNode) {
                H = H.parentNode
            }
            G.eventTarget = H;
            var C = this.events[G.type].slice(0),
                F, E;
            if ((F = C.length)) {
                for (var D = 0; D < F; D++) {
                    if (typeof C[D] === "function") {
                        E = C[D].call(this, G)
                    }
                }
                return E
            }
        },
        removeEvent: function (B, F) {
            if (this.events && this.events[B]) {
                var C = this.events[B];
                for (var E, D = C.length - 1; D >= 0; D--) {
                    E = F || C[D];
                    if (C[D] === E) {
                        delete C[D];
                        C.splice(D, 1);
                        if (E.attachedElements) {
                            E.attachedElements[B + this.uniqueHandlerId] = null
                        }
                    }
                }
            } else {
                if (this["on" + B] && !F) {
                    this["on" + B] = null
                }
            }
            return this
        },
        preventDefault: function (B) {
            if (B && B.preventDefault) {
                DOMAssistant.Events.preventDefault = function (C) {
                    C.preventDefault()
                }
            } else {
                DOMAssistant.Events.preventDefault = function (C) {
                    event.returnValue = false
                }
            }
            return DOMAssistant.Events.preventDefault(B)
        },
        cancelBubble: function (B) {
            if (B && B.stopPropagation) {
                DOMAssistant.Events.cancelBubble = function (C) {
                    C.stopPropagation()
                }
            } else {
                DOMAssistant.Events.cancelBubble = function (C) {
                    event.cancelBubble = true
                }
            }
            return DOMAssistant.Events.cancelBubble(B)
        }
    }
}();
DOMAssistant.attach(DOMAssistant.Events);
DOMAssistant.DOMLoad = function () {
    var DOMLoaded = false;
    var DOMLoadTimer = null;
    var functionsToCall = [];
    var addedStrings = {};
    var errorHandling = null;
    var execFunctions = function () {
            for (var i = 0, il = functionsToCall.length; i < il; i++) {
                try {
                    functionsToCall[i]()
                } catch (e) {
                    if (errorHandling && typeof errorHandling === "function") {
                        errorHandling(e)
                    }
                }
            }
            functionsToCall = []
        };
    var DOMHasLoaded = function () {
            if (DOMLoaded) {
                return
            }
            DOMLoaded = true;
            execFunctions()
        }; /*@cc_on @if(@_win32||@_win64)if(document.getElementById){document.write("<script id=\"ieScriptLoad\" defer src=\"//:\"><\/script>");document.getElementById("ieScriptLoad").onreadystatechange=function(){if(this.readyState==="complete"){DOMHasLoaded()}}}@end@*/
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", DOMHasLoaded, false)
    }
    if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
        DOMLoadTimer = setInterval(function () {
            if (/loaded|complete/i.test(document.readyState)) {
                DOMHasLoaded();
                clearInterval(DOMLoadTimer)
            }
        }, 10)
    }
    window.onload = DOMHasLoaded;
    return {
        DOMReady: function () {
            for (var i = 0, il = arguments.length, funcRef; i < il; i++) {
                funcRef = arguments[i];
                if (!funcRef.DOMReady && !addedStrings[funcRef]) {
                    if (typeof funcRef === "string") {
                        addedStrings[funcRef] = true;
                        funcRef = new Function(funcRef)
                    }
                    funcRef.DOMReady = true;
                    functionsToCall.push(funcRef)
                }
            }
            if (DOMLoaded) {
                execFunctions()
            }
        },
        setErrorHandling: function (funcRef) {
            errorHandling = funcRef
        }
    }
}();
DOMAssistant.DOMReady = DOMAssistant.DOMLoad.DOMReady;

var url;
if(!domain_url ){
var domain_url = 'shon.xyz';
}
if(!typesite){
    var typesite=0;
}


function checkLinks() {

    if (typeof(domains_include) == "object") {
        DOMAssistant.$("body a").each(function () {        
            if (in_object(domains_include, DOMAssistant.$(this).href)) {
                if (DOMAssistant.$(this).href.toLowerCase().indexOf(domain_url) != 7) {
                    url = "https://"+ domain_url +"/s/"+id_user+"?s="+DOMAssistant.$(this).href.replace("#", "%23");
                    DOMAssistant.$(this).setAttributes({href : url});
                }                
            }
        });

    } else if (typeof(domains_exclude) == "object") {

        DOMAssistant.$("body a").each(function () {      
            if (!in_object(domains_exclude, DOMAssistant.$(this).href) && DOMAssistant.$(this).href.substr(0,10) != "javascript") {                        
                if (DOMAssistant.$(this).href.toLowerCase().indexOf(domain_url) != 7) {
                    url = "https://"+ domain_url +"/s/"+id_user+"?s="+DOMAssistant.$(this).href.replace("#", "%23");
                    DOMAssistant.$(this).setAttributes({href : url});                    
                }
            }
        });
    }

}

function in_object(obj, val) {
    for(var i = 0, l = obj.length; i < l; i++) {       
        var re = new RegExp(obj[i],"i");           
        if(val.search(re) >0) {
            return true;
        }
    }
    return false;
}

DOMAssistant.DOMReady(checkLinks);
