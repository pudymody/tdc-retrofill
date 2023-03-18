/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%%
[ \r\t]+                   {}
"'"[ \._\-\*0-9a-zA-Z]+"'" return 'ATOMQS';
"\""[ '\._\-\*0-9a-zA-Z]+"\"" return 'ATOMQD';
[0-9a-zA-Z]+  return 'ATOMC';
"&"                   return '&';
"|"                   return '|';
"("                   return '(';
")"                   return ')';
">="                   return '>=';
"<="                   return '<=';
"<>"                   return '<>';
"="                   return '=';
">"                   return '>';
"<"                   return '<';

/lex

/* operator associations and precedence */

%start expressions

%% /* language grammar */

expressions
    : complex {return function(ctx){return $1(ctx)}}
    ;

complex
    : simple {$$=$1}
    | simple '&' simple complex_sub1 { if($4 == undefined){ $$=function(ctx){ return $1(ctx) && $3(ctx); } }else{$$ = function(ctx){return $1(ctx) && $3(ctx) && $4(ctx)}} }
    | simple '|' simple complex_sub2 { if($4 == undefined){ $$=function(ctx){ return $1(ctx) || $3(ctx); } }else{$$ = function(ctx){return $1(ctx) || $3(ctx) || $4(ctx)}} }
		;

complex_sub1
		: '&' simple complex_sub1 { if($3 == undefined){ $$=$2 }else{$$ = function(ctx){return $2(ctx) && $3(ctx)}} }
		|
		;

complex_sub2
		: '|' simple complex_sub1 { if($3 == undefined){ $$=$2 }else{$$ = function(ctx){return $2(ctx) || $3(ctx)}} }
		|
		;

simple
    : '(' complex ')' {$$=$2}
    | atom relop atom {$$=function(ctx){return $2($1,$3,ctx)}}
		;

relop 
    : '=' {$$=function(a,b,ctx){ var val_a = a(ctx); var val_b = b(ctx); if(typeof val_b == "string" && val_b.indexOf("*") > -1){ return val_a.match(val_b.replace(/\*/g, ".*")) != null }else{return val_a == val_b} }}
		| '<>' {$$=function(a,b,ctx){ var val_a = a(ctx); var val_b = b(ctx); if(typeof val_b == "string" && val_b.indexOf("*") > -1){ return val_a.match(val_b.replace(/\*/g, ".*")) == null }else{return val_a != val_b}}}
    | '>' {$$=function(a,b,ctx){ return parseInt(a(ctx)) > parseInt(b(ctx)) }}
    | '>=' {$$=function(a,b,ctx){ return parseInt(a(ctx)) >= parseInt(b(ctx)) }}
		| '<' {$$=function(a,b,ctx){ return parseInt(a(ctx)) < parseInt(b(ctx)) }}
    | '<=' {$$=function(a,b,ctx){ return parseInt(a(ctx)) <= parseInt(b(ctx)) }}
		;
 
atom 
    : ATOMC {$$=function(ctx){if(ctx.hasOwnProperty($1)){return ctx[$1]}else{if(isNaN($1)){return $1}else{return parseInt($1,10)}}}}
    | ATOMQS {$$=function(ctx){return $1.slice(1).slice(0,-1);}}
    | ATOMQD {$$=function(ctx){return $1.slice(1).slice(0,-1);}}
		;
