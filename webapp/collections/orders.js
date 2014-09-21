Orders = new Meteor.Collection("orders");

var nextOrderNumber = 100;

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

if (Meteor.isServer) {
	Meteor.methods({
		orderDone: function(orderId) {
			Orders.update(orderId, {$set: {status: "complete"}});

			var order = Orders.findOne(orderId);
			notifyCustomer(order.customerId);

			function notifyCustomer(customerId) {
				var customer = Customers.findOne(customerId);
				Twilio.sendSms({
				    to: customer.phone,
				    from: Meteor.settings["TWILIO_PHONE_NUMBER"],
				    body: 'Your order #' + order.orderNumber + ' is ready!'
				},
				function(err, responseData) {
				  	if (err) {
				  		console.log(err);
				  	}
			    });
			}
		},
		orderCancelled: function(orderId) {
			Orders.update(orderId, {$set: {status: "cancelled"}});

			var order = Orders.findOne(orderId);
			notifyCustomer(order.customerId);

			function notifyCustomer(customerId) {
				var customer = Customers.findOne(customerId);
				Twilio.sendSms({
				    to: customer.phone,
				    from: Meteor.settings["TWILIO_PHONE_NUMBER"],
				    body: 'Your order #' + order.orderNumber + ' is cancelled!'
				},
				function(err, responseData) {
				  	if (err) {
				  		console.log(err);
				  	}
			    });
			}
		},
		placeOrder: function(customerId, meals) {
			var order = {
				orderNumber: nextOrderNumber++,
				status: "incomplete",
				timeCreated: Date.now(),
				customerId: customerId,
				meals: meals
			};

			Orders.insert(order);

			return order;
		}
	});
}