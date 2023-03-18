import baretest from "baretest";
import assert from "assert";

import { filterParser as parser } from "./element.js";

const test = baretest("TDC Filter");
test("Explicit grouping of 'or' and 'and'", function(){
	const	filter = `(Column1 > 10 & Column3 = lime) | Column4 < 5`;
	const src = {Column1: 11, Column3: "lime"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Single quoted atoms allows dash", function(){
	const	filter = `caseNum="2x01"&term='High-Resolution Microwave Survey'`;
	const src = {caseNum: "2x01", term: "High-Resolution Microwave Survey"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Doble quoted atoms allows dash", function(){
	const	filter = `caseNum="2x01"&term="High-Resolution Microwave Survey"`;
	const src = {caseNum: "2x01", term: "High-Resolution Microwave Survey"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Single quoted atoms allows underscore", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount>0&surv='w_skinne'`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: 1, surv: "w_skinne"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Doble quoted atoms allows underscore", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount>0&surv="w_skinne"`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: 1, surv: "w_skinne"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Double quoted atoms allows single quote", function(){
	const	filter = `caseNum="2x01"&term="High' Resolution Microwave Survey"`;
	const src = {caseNum: "2x01", term: "High' Resolution Microwave Survey"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Distinct op allows wildcard in double quote", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount>0&surv<>"*fox*"`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: 5, surv: "x"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Equal op allows wildcard in double quote", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount>0&surv="*dana*"`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: 5, surv: "asdfdanaasdf"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Distinct op allows wildcard in single quote", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount>0&surv<>'*fox*'`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: 5, surv: "x"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Equal op allows wildcard in single quote", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount>0&surv='*dana*'`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: 5, surv: "asdfdanaasdf"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Greater op cast to number", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount>0`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: "5,4,3", surv: "asdfdanaasdf"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Greater or equal op cast to number", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount>=0`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: "5,4,3", surv: "asdfdanaasdf"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Lower op cast to number", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount<6`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: "5,4,3", surv: "asdfdanaasdf"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});
test("Lower or equal op cast to number", function(){
	const	filter = `category="evid"&mediaType="qtvr"&qtvrCount<=6`;
	const src = {category: "evid", mediaType: "qtvr", qtvrCount: "5,4,3", surv: "asdfdanaasdf"};

	const ast = parser.parse(filter);
	assert.equal(ast(src), true);
});

test.run();
