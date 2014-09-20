Customers = new Meteor.Collection("customers");

//Allow anything in the database to be modified without a Meteor.call
Customers.allow({
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