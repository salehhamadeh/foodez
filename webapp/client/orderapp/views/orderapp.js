var meals;
var subtotal = 0.0;
var total = 0.0;
var order = {};

Template.orderapp.helpers({
	meals: function() {
		var cursor = Meals.find();
		meals = cursor.fetch();
		return cursor;
	}
});

Template.orderapp.rendered = function() {
	$('.subtotal-value').text("$" + subtotal);
	$('.total-price').text("$" + total);
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
		total = subtotal*1.06;
		total = total.toFixed(2);

		$('.subtotal-value').text("$" + subtotal);
		$('.total-price').text("$" + total);
	},
	'click #order-button': function() {
		var name = $('#customer-name').val();
		var phone = $('#customer-phone').val();

		if (name != "" && phone != "") {
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

			if (total == 0) {
				Meteor.call("placeOrder", customerId, orderMeals, function(error, orderDetails) {
					order = orderDetails;
					$('#order-number').text(order.orderNumber);
					$('#thankYouModal').modal('show');
				});
			} else {
				$('#paypal-button').html(
					PAYPAL.apps.ButtonFactory.create("salehhamadeh@gmail.com",
					{
						button: "buynow",
						name: {
							value: "FoodEz Order"
						},
						amount: {
							value: total
						}
					}));
				$('#paymentModal').modal('show');
			}
		}
	},
	'click #order-free': function() {
		var temp = total;
		total = 0;
		$('#order-button').click();
		total = temp;
	}
});