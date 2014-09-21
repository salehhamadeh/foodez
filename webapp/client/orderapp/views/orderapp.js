var meals;
var subtotal = 0.0;

Template.orderapp.helpers({
	meals: function() {
		var cursor = Meals.find();
		meals = cursor.fetch();
		return cursor;
	}
});

Template.orderapp.rendered = function() {
	$('.subtotal-value').text("$" + subtotal);
}

Template.orderapp.events({
	'change .mealQuantity': function(e) {
		subtotal = 0.0;

		$('tr.mealItem').each(function(index, element) {
			var mealId = $(element).attr("data-id");
			var quantity = $(element).find('input.quantity').first().val();
			subtotal += _.filter(meals, function(meal) { return meal._id == mealId})[0].cost*quantity;
		});

		//Only use 2 digits after decimal point
		subtotal = subtotal.toFixed(2);

		$('.subtotal-value').text("$" + subtotal);
	},
	'click #order-button': function() {
		var customer = {
			name: $('#customer-name').val(),
			phone: $('#customer-phone').val()
		};

		var customerId = Customers.insert(customer);
		var orderMeals = [];
		$('tr.mealItem').each(function(index, element) {
			var mealId = $(element).attr("data-id");
			var quantity = $(element).find('input.quantity').first().val();

			for (var i = 0; i < quantity; i++) {
				orderMeals.push(mealId);
			}
		});
		
		Meteor.call("placeOrder", customerId, orderMeals);
	}
});