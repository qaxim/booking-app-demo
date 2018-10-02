import {JetView, plugins} from "webix-jet";
import {getCities} from "models/cities";

export default class AllFlightsView extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		const theme = this.app.config.theme;
		const cities = getCities();

		return {
			gravity:3,
			rows:[
				{
					view:"toolbar",
					localId:"toolbar",
					visibleBatch:"default",
					css:theme,
					cols:[
						{ view:"label", template:_("Flights"), autowidth:true },
						{ width:30 },
						{ batch:"default" },
						{
							view:"combo",
							id:"depart:combo",
							batch:"search",
							placeholder:_("Select departure point"),
							options:cities,
							on:{
								onChange:newv => {
									if (newv)
										this.$$("to:combo").enable();
									else {
										this.$$("to:combo").disable();
										this.app.callEvent("search:flight");
									}
									this.$$("to:combo").setValue("");
								}
							}
						},
						{
							view:"combo",
							localId:"to:combo",
							batch:"search",
							disabled:true,
							placeholder:_("Select destination"),
							options:{
								data:cities,
								on:{
									onShow(){
										let from = webix.$$("depart:combo").getValue();
										if (from){
											this.getList().filter(obj => obj.id !== from);
										}
									}
								}
							}
						},
						{
							view:"button",
							type:"form",
							batch:"search",
							width:100,
							value:_("Search"),
							align:"left",
							click:() => {
								const id_from = webix.$$("depart:combo").getValue();
								const id_to = this.$$("to:combo").getValue();
								if (id_from && id_to){
									const from = cities[id_from-1].value;
									const to = cities[id_to-1].value;
									this.app.callEvent("search:flight",[from,to]);
								}
							}
						},
						{ width:30 },
						{
							view:"segmented", localId:"offers",
							width:300,
							options:[
								{ id:"specialoffers", value:_("Offers") },
								{ id:"regularoffers", value:_("Regular") },
								{ id:"flightinfo", value:_("Info") }
							]
						},
						{ width:6 }
					]
				},
				{ $subview:true }
			]
		};
	}
	init(){
		this.use(plugins.Menu,"offers");
	}
	urlChange(ui,url){
		const toolbar = this.$$("toolbar");
		toolbar.showBatch(url[1].page === "flightinfo" ? "search" : "default");
	}
}
