Orders = new Meteor.Collection("orders");

//Allow anything in the database to be modified without a Meteor.call
Orders.allow({
  insert: function () {
      return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});

Meteor.methods({
	orderDone: function(orderId) {
		function notifyCustomer(customerId) {
			var customer = Customers.findOne(customerId);
			//TODO: Send SMS
		}

		var order = Orders.update(orderId, {$set: {status: "complete"}});
		notifyCustomer(order.customerId);
	},
	orderCancelled: function(orderId) {
		function notifyCustomer(customerId) {
			var customer = Customers.findOne(customerId);
			//TODO: Send SMS
		}

		var order = Orders.update(Session.get("selectedOrderId"), {$set: {status: "cancelled"}});
		notifyCustomer(order.customerId);
	}
});