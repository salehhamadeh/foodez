Router.map(function() {
  this.route('dashboard', {
    path : '/dashboard',
    waitOn: function() {
    	/*Meteor.subscribe('orders');
    	Meteor.subscribe('meals');
    	Meteor.subscibe('customers');*/
    }
   });
});