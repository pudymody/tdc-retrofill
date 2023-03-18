import { parse as csvParse } from "csv-parse/browser/esm/sync";
import filterParser from "./grammar.jison"

class TDC extends HTMLElement {
	constructor(){
		super();

		this._params = new Map();
		this._data = null;
		this._index = 0;

		this.moveFirst = this.moveFirst.bind(this);
		this.moveNext = this.moveNext.bind(this);
		this.moveLast = this.moveLast.bind(this);
		this.move = this.move.bind(this);
		this.recordset = this.recordset.bind(this);
		this.recordCount = this.recordCount.bind(this);

		let recordsetProto = {
			moveFirst: this.moveFirst,
			moveNext: this.moveNext,
			moveLast: this.moveLast,
			move: this.move,
			_recordCount: this.recordCount
		};

		Object.defineProperty(recordsetProto, "recordCount", {
			enumerable: true,
			configurable: true,
			get(){ return this._recordCount() }
		});
		Object.setPrototypeOf( this.recordset, recordsetProto);
	}

	Reset(){
		// get params attr have prescendese over params children
		const $params = Object.fromEntries(
			Array.from(this.querySelectorAll("param"))
			.map( p => [p.getAttribute("name"), p.getAttribute("value")] )
		);
		const attr_params = Object.fromEntries([...this._params.entries()]);
		let real_params = { ...$params, ...attr_params };
		real_params.UseHeader = real_params.UseHeader.toLowerCase() == "true";

		// reset data using new filters and orders
		const xhr = new XMLHttpRequest();
		xhr.open('GET', real_params.DataURL, false);
		xhr.send(null);

		let records = csvParse(xhr.responseText, {
			skip_empty_lines: true,
			columns: real_params.UseHeader,
			escape: real_params.EscapeChar,
			delimiter: real_params.FieldDelim,
			quote: real_params.TextQualifier
		});

		if( real_params.filter.trim() ){
			const filterer = filterParser.parse(real_params.filter);
			records = records.filter(filterer);
		}

		// TODO: Check if multiple sort params are possible
		if( real_params.Sort.trim() ){
			records.sort(function(a,b){
				if( real_params.sortAscending ){
					return a[real_params.Sort] <= b[real_params.Sort]
				}else{
					return a[real_params.Sort] >= b[real_params.Sort]
				}
			});
		}

		this._data = records;
		this._index = 0;
	}

	moveFirst(){
		this._index = 0;
	}

	moveNext(){
		this._index++;
	}

	moveLast(){
		this._index = this._data.length - 1;
	}

	move(index){
		this._index = index;
	}

	recordCount(){
		if( this._data != null ){
			return this._data.length;
		}else{
			return 0;
		}
	}

	recordset(field){
		return this._data[ this._index ][ field ];
	}

	set DataURL(value){
		this._params.set("DataURL", value);
	}

	set UseHeader(value){
		this._params.set("UseHeader", value);
	}

	set FieldDelim(value){
		this._params.set("FieldDelim", value);
	}

	set TextQualifier(value){
		this._params.set("TextQualifier", value);
	}

	set EscapeChar(value){
		this._params.set("EscapeChar", value);
	}

	set sortAscending(value){
		this._params.set("sortAscending", value);
	}

	set Sort(value){
		this._params.set("Sort", value);
	}

	get Sort(){
		return this._params.get("Sort");
	}

	set caseSensitive(value){
		this._params.set("caseSensitive", value);
	}

	set filter(value){
		this._params.set("filter", value);
	}

	get filter(){
		return this._params.get("filter");
	}
}

export default TDC;
export { filterParser };
