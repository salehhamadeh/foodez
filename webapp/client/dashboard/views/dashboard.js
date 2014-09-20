Template.dashboard.helpers({
	incompleteOrders: function() {
		return Orders.find({status: "incomplete"}, {sort: {timeCreated: 1}});
	},
	selectedOrder: function() {
		return Session.get("selectedOrderId");
	}
});

Template.dashboard.events({
	'click table tr': function(e) {
		Session.set("selectedOrderId", $(e.currentTarget).attr("data-id"));
	}
});

Template.orderTableItem.created = function() {
	var customer = Customers.findOne(this.data.customerId);
	this.data.customerName = customer.name;

	this.data.meals = Meals.find({_id: {$in: this.data.meals}, isMainMeal: true}).fetch();
}

Template.orderTableItem.selected = function() {
	return Session.equals("selectedOrderId", this._id) ? "selected" : '';
}

Template.orderInfo.helpers({
	mainMeals: function() {
		var selectedOrder = Orders.findOne(Session.get("selectedOrderId"));
		var meals = selectedOrder.meals;
		return Meals.find({_id: {$in: meals}, isMainMeal: true});
	},
	sides: function() {
		var selectedOrder = Orders.findOne(Session.get("selectedOrderId"));
		var meals = selectedOrder.meals;
		return Meals.find({_id: {$in: meals}, isMainMeal: false});
	}
})

Template.orderInfo.events({
	'click #cancel-button': function(e) {
		Meteor.call("orderCancelled", Session.get("selectedOrderId"));
	},
	'click #done-button': function(e) {
		Meteor.call("orderDone", Session.get("selectedOrderId"));
	}
})