
/* --- GF wide coverage translation interface ------------------------------- */

var gftranslate = {}

gftranslate.jsonurl="/robust/Translate8.pgf"
gftranslate.grammar="Translate" // the name of the grammar

gftranslate.call=function(querystring,cont) {
    http_get_json(gftranslate.jsonurl+querystring,cont)
}

// Translate a sentence
gftranslate.translate=function(source,from,to,start,limit,cont) {
    var encsrc=encodeURIComponent(source)
    var g=gftranslate.grammar
    function extract(result) { cont(result[0].translations) }
    if(encsrc.length<200) // match limit in runtime/c/utils/pgf-server.c
	gftranslate.call("?command=c-translate&input="+encsrc
		      +"&from="+g+from+"&to="+g+to
		      +"&start="+start+"&limit="+limit,extract)
    else cont([{error:"sentence too long"}])
}

// Get functions to test which source and target langauges are supported
gftranslate.get_support=function(cont) {
    function support(code) { return gftranslate.targets[code] }
    function init2(grammar_info) {
	var ls=grammar_info.languages
	gftranslate.grammar=grammar_info.name
	var langs=[], pre=gftranslate.grammar, n=pre.length
	for(var i=0;i<ls.length;i++)
	    if(ls[i].name.substr(0,n)==pre) langs.push(ls[i].name.substr(n))
	gftranslate.targetlist=langs
	gftranslate.targets=toSet(langs)
	cont(support,support)
    }
    if(gftranslate.targets) cont(support,support)
    else gftranslate.call("?command=c-grammar",init2)
}