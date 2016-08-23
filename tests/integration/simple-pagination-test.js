import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-pagination', 'Integration | Component | simple paginatiton', {
  integration: true
});

test ('it is not displayed if record count is less <= page size', function(assert) {
  assert.expect(2);
  
  this.setProperties({
    'pageSize': 20,
    'recordCount': 10
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount}}`);
  assert.equal((this.$('[data-test-selector="page-navigation"]')).length, 0);

  this.setProperties({
    'pageSize': 20,
    'recordCount': 20
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount}}`);
  assert.equal((this.$('[data-test-selector="page-navigation"]')).length, 0);
});

test('it is displayed if record count is greater than page size', function(assert) {
  assert.expect(1);
  
  this.setProperties({
    'pageSize': 20,
    'recordCount': 30
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount}}`);
  assert.equal((this.$('[data-test-selector="page-navigation"]')).length, 1);
  
});

test('it displays the correct number of page links', function(assert) {
  assert.expect(1);
  
  this.setProperties({
    'pageSize': 20,
    'recordCount': 25
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount}}`);
  assert.equal((this.$('[data-test-selector="page-number"]')).length, 2, "");
});

test('it marks the current page as active', function(assert) {
  assert.expect(2);

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 2
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
  const classes0 = this.$(this.$('[data-test-selector="page-number"]')[0]).attr("class");
  const classes1 = this.$(this.$('[data-test-selector="page-number"]')[1]).attr("class");
  assert.notOk(/active/.test(classes0), "Noncurrent page not marked as active");
  assert.ok(/active/.test(classes1), "Current page marked as active");
});

test('it disables the previous page link if the current page is page 1', function(assert) {
  assert.expect(2);

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 1
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
  let classes = this.$('[data-test-selector="previous-page"]').attr("class");
  assert.ok(/disabled/.test(classes), "Previous page link disabled");  

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 2
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
  classes = this.$('[data-test-selector="previous-page"]').attr("class");
  assert.notOk(/disabled/.test(classes), "Previous page link not disabled");  
});

test('it disables the next page link if the current page is the last page', function(assert) {
  assert.expect(2);

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 2
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
  let classes = this.$('[data-test-selector="next-page"]').attr("class");
  assert.ok(/disabled/.test(classes), "Next page link disabled");  

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 1
  });

  this.render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
  classes = this.$('[data-test-selector="next-page"]').attr("class");
  assert.notOk(/disabled/.test(classes), "Next page link not disabled");  
});

test('it invokes the action for the "onPageSelect" event when the user clicks a page link', function(assert) {
  assert.expect(1);

  this.set('externalAction', function(actual) {
    // The page number clicked should be 2
    assert.equal(actual, 2, "page link clicked");
  });

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 1
  });

  this.render(hbs`{{simple-pagination 
    pageSize=pageSize 
    recordCount=recordCount 
    pageNumber=pageNumber
    onPageSelect=(action externalAction)}}`);

  // Click page number 2.
  this.$(this.$('[data-test-selector="page-number"]')[1]).click();

});

test('it invokes the action for the "onPageSelect" event when the user clicks previous page link', function(assert) {
  assert.expect(1);

  this.set('externalAction', function(actual) {
    // Current page number is 2, so previous page number should be 1
    assert.equal(actual, 1, "previous page link clicked");
  });

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 2
  });

  this.render(hbs`{{simple-pagination 
    pageSize=pageSize 
    recordCount=recordCount 
    pageNumber=pageNumber
    onPageSelect=(action externalAction)}}`);

  this.$('[data-test-selector="previous-page"]').click();

});

test('it invokes the action for the "onPageSelect" event when the user clicks next page link', function(assert) {
  assert.expect(1);

  this.set('externalAction', function(actual) {
    // Current page number is 1, so next page number should be 2
    assert.equal(actual, 2, "next page link clicked");
  });

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 1
  });

  this.render(hbs`{{simple-pagination 
    pageSize=pageSize 
    recordCount=recordCount 
    pageNumber=pageNumber
    onPageSelect=(action externalAction)}}`);

  this.$('[data-test-selector="next-page"]').click();

});

test('it does not invoke the "onPageSelect" action when the page number clicked === current page number', function(assert) {
  assert.expect(0);

  this.set('externalAction', function(actual) {
    // this should not happen
    assert.equal(actual, 1, "page link clicked");
  });

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 1
  });

  this.render(hbs`{{simple-pagination 
    pageSize=pageSize 
    recordCount=recordCount 
    pageNumber=pageNumber
    onPageSelect=(action externalAction)}}`);

  // Click page number 1.
  this.$(this.$('[data-test-selector="page-number"]')[0]).click();

});

test('it does not invoke the "onPageSelect" action when the previous page link is clicked and the page number is 1', function(assert) {
  assert.expect(0);

  this.set('externalAction', function(actual) {
    // this should not happen
    assert.equal(actual, 1, "previous page clicked");
  });

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 1
  });

  this.render(hbs`{{simple-pagination 
    pageSize=pageSize 
    recordCount=recordCount 
    pageNumber=pageNumber
    onPageSelect=(action externalAction)}}`);

  // Click previous page.
  this.$('[data-test-selector="previous-page"]').click();

});

test('it does not invoke the "onPageSelect" action when the next page link is clicked and the page number is the last page', function(assert) {
  assert.expect(0);

  this.set('externalAction', function(actual) {
    // this should not happen
    assert.equal(actual, 2, "next page clicked");
  });

  this.setProperties({
    'pageSize': 20,
    'recordCount': 25,
    'pageNumber': 2
  });

  this.render(hbs`{{simple-pagination 
    pageSize=pageSize 
    recordCount=recordCount 
    pageNumber=pageNumber
    onPageSelect=(action externalAction)}}`);

  // Click next page.
  this.$('[data-test-selector="next-page"]').click();

});

