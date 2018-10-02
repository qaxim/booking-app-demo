import {JetView} from "webix-jet";
import {getOffers} from "models/offers";

export default class SpecialOffersView extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		return {
			rows:[
				{
					view:"datatable",
					localId:"datatable",
					select:true,
					columns:[
						{ id:"id", header:"#", width:60, sort:"int" },
						{ id:"direction", header:_("Direction"), fillspace:5, sort:"string" },
						{
							id:"date", header:_("Date"), fillspace:3, sort:"date",
							format:webix.i18n.longDateFormatStr
						},
						{
							id:"", header:"Time", fillspace:2, minWidth:126,
							template:obj => obj.deptime + " <span class='webix_icon mdi mdi-arrow-right'></span> " + obj.arrtime
						},
						{
							id:"price", header:_("Price"), sort:"int", fillspace:2,
							format:webix.i18n.priceFormat
						},
						{
							id:"save", header:_("You save"), sort:"int", fillspace:2,
							format:webix.i18n.priceFormat
						},
						{ id:"places", header:_("Tickets"), sort:"int", fillspace:1 },
						{
							id:"status", header:_("Status"), sort:"text", adjust:"data",
							template:obj => {
								let st = "";
								if (obj.status === "Open")
									st = "open";
								else
									st = (obj.status === "Last deals") ? "last" : "soon";
								return `<span class="status ${st}">&#9679;&nbsp;&nbsp;${_(obj.status)}</span>`;
							}
						}
					],
					onClick:{
						"book_flight":() => false
					}
				}
			]
		};
	}
	init(){
		const grid = this.$$("datatable");
		grid.sync(getOffers());

		this.on(this.app,"search:flight", (from,to,date) => {
			grid.hideOverlay();
			if (from && to)
				grid.filter(obj => {
					const data_from = obj.direction.indexOf(from);
					const data_to = obj.direction.indexOf(to);
					return data_from !== -1 && data_to !== -1 && data_from < data_to && obj.date.toString().slice(0,14) === date.toString().slice(0,14);
				});
			else
				grid.filter();
			if (grid.count() === 0)
				grid.showOverlay("Sorry, there are no flights for this route");
		});
	}
}
