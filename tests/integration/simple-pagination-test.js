import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | simple paginatiton', function(hooks) {
  setupRenderingTest(hooks);

  test ('it is not displayed if record count is less <= page size', async function(assert) {
    assert.expect(2);

    this.setProperties({
      'pageSize': 20,
      'recordCount': 10
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount}}`);
    assert.dom('[data-test-selector="page-navigation"]').doesNotExist();

    this.setProperties({
      'pageSize': 20,
      'recordCount': 20
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount}}`);
    assert.dom('[data-test-selector="page-navigation"]').doesNotExist();
  });

  test('it is displayed if record count is greater than page size', async function(assert) {
    assert.expect(1);

    this.setProperties({
      'pageSize': 20,
      'recordCount': 30
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount}}`);
    assert.dom('[data-test-selector="page-navigation"]').exists({ count: 1 });

  });

  test('it displays the correct number of page links', async function(assert) {
    assert.expect(1);

    this.setProperties({
      'pageSize': 20,
      'recordCount': 25
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount}}`);
    assert.dom('[data-test-selector="page-number"]').exists({ count: 2 }, "");
  });

  test('it marks the current page as active', async function(assert) {
    assert.expect(2);

    this.setProperties({
      'pageSize': 20,
      'recordCount': 25,
      'pageNumber': 2
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
    const classes0 = this.element.querySelectorAll('[data-test-selector="page-number"]')[0].getAttribute("class");
    const classes1 = this.element.querySelectorAll('[data-test-selector="page-number"]')[1].getAttribute("class");
    assert.notOk(/active/.test(classes0), "Noncurrent page not marked as active");
    assert.ok(/active/.test(classes1), "Current page marked as active");
  });

  test('it disables the previous page link if the current page is page 1', async function(assert) {
    assert.expect(2);

    this.setProperties({
      'pageSize': 20,
      'recordCount': 25,
      'pageNumber': 1
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
    let classes = find('[data-test-selector="previous-page"]').getAttribute("class");
    assert.ok(/disabled/.test(classes), "Previous page link disabled");

    this.setProperties({
      'pageSize': 20,
      'recordCount': 25,
      'pageNumber': 2
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
    classes = find('[data-test-selector="previous-page"]').getAttribute("class");
    assert.notOk(/disabled/.test(classes), "Previous page link not disabled");
  });

  test('it disables the next page link if the current page is the last page', async function(assert) {
    assert.expect(2);

    this.setProperties({
      'pageSize': 20,
      'recordCount': 25,
      'pageNumber': 2
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
    let classes = find('[data-test-selector="next-page"]').getAttribute("class");
    assert.ok(/disabled/.test(classes), "Next page link disabled");

    this.setProperties({
      'pageSize': 20,
      'recordCount': 25,
      'pageNumber': 1
    });

    await render(hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount pageNumber=pageNumber}}`);
    classes = find('[data-test-selector="next-page"]').getAttribute("class");
    assert.notOk(/disabled/.test(classes), "Next page link not disabled");
  });

  test('it invokes the action for the "onPageSelect" event when the user clicks a page link', async function(assert) {
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

    await render(hbs`{{simple-pagination
      pageSize=pageSize
      recordCount=recordCount
      pageNumber=pageNumber
      onPageSelect=(action externalAction)}}`);

    // Click page number 2.
    this.element.querySelectorAll('[data-test-selector="page-number"]')[1].click();

  });

  test('it invokes the action for the "onPageSelect" event when the user clicks previous page link', async function(assert) {
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

    await render(hbs`{{simple-pagination
      pageSize=pageSize
      recordCount=recordCount
      pageNumber=pageNumber
      onPageSelect=(action externalAction)}}`);

    await click('[data-test-selector="previous-page"]');

  });

  test('it invokes the action for the "onPageSelect" event when the user clicks next page link', async function(assert) {
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

    await render(hbs`{{simple-pagination
      pageSize=pageSize
      recordCount=recordCount
      pageNumber=pageNumber
      onPageSelect=(action externalAction)}}`);

    await click('[data-test-selector="next-page"]');

  });

  test('it does not invoke the "onPageSelect" action when the page number clicked === current page number', async function(assert) {
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

    await render(hbs`{{simple-pagination
      pageSize=pageSize
      recordCount=recordCount
      pageNumber=pageNumber
      onPageSelect=(action externalAction)}}`);

    // Click page number 1.
    this.element.querySelector('[data-test-selector="page-number"]').click();

  });

  test('it does not invoke the "onPageSelect" action when the previous page link is clicked and the page number is 1', async function(assert) {
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

    await render(hbs`{{simple-pagination
      pageSize=pageSize
      recordCount=recordCount
      pageNumber=pageNumber
      onPageSelect=(action externalAction)}}`);

    // Click previous page.
    await click('[data-test-selector="previous-page"]');

  });

  test('it does not invoke the "onPageSelect" action when the next page link is clicked and the page number is the last page', async function(assert) {
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

    await render(hbs`{{simple-pagination
      pageSize=pageSize
      recordCount=recordCount
      pageNumber=pageNumber
      onPageSelect=(action externalAction)}}`);

    // Click next page.
    await click('[data-test-selector="next-page"]');

  });

  test('it adds "data-test-selector" attribute to the opening <div> if specified', async function(assert) {
    assert.expect(1);

    this.setProperties({
      'pageSize': 20,
      'recordCount': 25,
      'dataTestSelector': "test-selector"
    });

    await render(
      hbs`{{simple-pagination pageSize=pageSize recordCount=recordCount dataTestSelector=dataTestSelector}}`
    );
    let attr = this.element.querySelector('div').getAttribute('data-test-selector');
    assert.equal(attr, "test-selector", "data test selector attribute exists");
  });
});

