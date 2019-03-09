import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | simple pagination', function(hooks) {
  setupTest(hooks);

  test('.totalPages should return 0 if bad property values', function(assert) {
    assert.expect(4);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();

    simplePagination.setProperties({
      'recordCount': -1,
      'pageSize': 20
    });
    assert.equal(simplePagination.get('totalPages'), 0, "record count <  0");

    simplePagination.setProperties({
      'recordCount': 10,
      'pageSize': 0
    });
    assert.equal(simplePagination.get('totalPages'), 0, "page size <  1");

    simplePagination.setProperties({
      'recordCount': 10,
      'pageSize': 20,
      'pageNumber': 0
    });
    assert.equal(simplePagination.get('totalPages'), 0, "pageNumber < 1");

    simplePagination.setProperties({
      'recordCount': 10,
      'pageSize': 20,
      'maxPagesInList': 1
    });
    assert.equal(simplePagination.get('totalPages'), 0, "maxPagesInList < 2");
  });

  test('.totalPages should correclty return number of pages', function(assert) {
    assert.expect(5);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();
    
    simplePagination.setProperties({
      'recordCount': 0,
      'pageSize': 20
    });
    assert.equal(simplePagination.get('totalPages'), 0, "record count == 0");

    simplePagination.setProperties({
      'recordCount': 10,
      'pageSize': 20
    });
    assert.equal(simplePagination.get('totalPages'), 1, "record count < page size");

    simplePagination.setProperties({
      'recordCount': 20,
      'pageSize': 20
    });
    assert.equal(simplePagination.get('totalPages'), 1, "record count = page size");

    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20
    });
    assert.equal(simplePagination.get('totalPages'), 2, "record count > page size, not a multiple");

    simplePagination.setProperties({
      'recordCount': 60,
      'pageSize': 20
    });
    assert.equal(simplePagination.get('totalPages'), 3, "record count is a multiple of page size");

  });

  test('.nextPageNumber is lesser of pageNumber + 1 or totalPages', function(assert) {
    assert.expect(3);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();
    
    simplePagination.setProperties({
      'recordCount': 50,
      'pageSize': 20,
      'pageNumber': 1
    });
    assert.equal(simplePagination.get('nextPageNumber'),2, "pageNumber+1 < totalPages");

    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'pageNumber': 1
    });
    assert.equal(simplePagination.get('nextPageNumber'),2, "pageNumber+1 === totalPages");

    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'pageNumber': 2
    });
    assert.equal(simplePagination.get('nextPageNumber'),2, "pageNumber+1 > totalPages");

  });

  test('.prevPageNumber is greater of 1 or pageNumber-1', function(assert) {
    assert.expect(3);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();
    
    simplePagination.setProperties({
      'recordCount': 50,
      'pageSize': 20,
      'pageNumber': 3
    });
    assert.equal(simplePagination.get('prevPageNumber'),2, "pageNumber-1 > 1");

    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'pageNumber': 2
    });
    assert.equal(simplePagination.get('prevPageNumber'),1, "pageNumber-1 === 1");

    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'pageNumber': 1
    });
    assert.equal(simplePagination.get('prevPageNumber'),1, "pageNumber-1 < 1");

  });

  test('.isPrevDisabled should return true if pageNumber === 1', function(assert) {
    assert.expect(2);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();
    
    simplePagination.setProperties({
      'recordCount': 30,
      'pageSize': 20,
      'pageNumber': 1
    });
    assert.ok(simplePagination.get('isPrevDisabled'),"pageNumber === 1");

    simplePagination.setProperties({
      'recordCount': 30,
      'pageSize': 20,
      'pageNumber': 2
    });
    assert.notOk(simplePagination.get('isPrevDisabled'),"pageNumber !== 1");
  });

  test('.isNextDisabled should return true if pageNumber === totalPages', function(assert) {
    assert.expect(2);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();
    
    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'pageNumber': 2
    });
    assert.ok(simplePagination.get('isNextDisabled'),"pageNumber === totalPages");

    simplePagination.setProperties({
      'recordCount': 30,
      'pageSize': 20,
      'pageNumber': 1
    });
    assert.notOk(simplePagination.get('isNextDisabled'),"pageNumber !== totalPages");
  });

  test('.nbrPagesInList is the lesser of totalPages and maxPagesInList', function(assert) {
    assert.expect(2);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();

    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'maxPagesInList': 10
    });
    assert.equal(simplePagination.get('nbrPagesInList'), 2);

    simplePagination.setProperties({
      'recordCount': 500,
      'pageSize': 20,
      'maxPagesInList': 10
    });
    assert.equal(simplePagination.get('nbrPagesInList'), 10);
  });

  test('.pages should return an array whose length === nbrPagesInList', function(assert) {
    assert.expect(2);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();
    
    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'maxPagesInList': 10
    });
    assert.equal(simplePagination.get('pages').length, simplePagination.get('nbrPagesInList'));

    simplePagination.setProperties({
      'recordCount': 500,
      'pageSize': 20,
      'maxPagesInList': 10
    });
    assert.equal(simplePagination.get('pages').length, simplePagination.get('nbrPagesInList'));
  });

  test('last page number in list should be lesser of current page + 3 and totalPages', function(assert) {
    assert.expect(3);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();

    simplePagination.setProperties({
      'recordCount': 310,
      'pageSize': 20,
      'maxPagesInList': 10,
      'pageNumber': 13
    });
    let pages = simplePagination.get('pages');
    assert.equal(pages[9]["number"], 16, "last page in list is current page + 3");

    simplePagination.setProperties({
      'recordCount': 310,
      'pageSize': 20,
      'maxPagesInList': 10,
      'pageNumber': 15
    });
    let totalPages = simplePagination.get('totalPages');
    pages = simplePagination.get('pages');
    assert.equal(pages[9]["number"], totalPages, "last page in list === totalPages");

    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'maxPagesInList': 10,
      'pageNumber': 1
    });
    pages = simplePagination.get('pages');
    totalPages = simplePagination.get('totalPages');
    assert.equal(pages[1]["number"], totalPages, "last page in list === totalPages");
  });

  test('first page number in list should be greater of (last number in list - nbrPagesInList + 1) and 1', function(assert) {
    assert.expect(3);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();

    simplePagination.setProperties({
      'recordCount': 310,
      'pageSize': 20,
      'maxPagesInList': 10,
      'pageNumber': 13
    });
    let pages = simplePagination.get('pages'),
        nbrPagesInList = simplePagination.get('nbrPagesInList'),
        expectedNumber = pages[9]["number"] - nbrPagesInList + 1;
    assert.equal(pages[0]["number"], expectedNumber, "first number in list calculated correctly");

    simplePagination.setProperties({
      'recordCount': 310,
      'pageSize': 20,
      'maxPagesInList': 10,
      'pageNumber': 1
    });
    pages = simplePagination.get('pages');
    assert.equal(pages[0]["number"], 1, "first number in list is 1");

    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'maxPagesInList': 10,
      'pageNumber': 1
    });
    pages = simplePagination.get('pages');
    assert.equal(pages[0]["number"], 1, "first number in list is 1");
  });

  test('element of .pages where "active" is true should be current page number ', function(assert) {
    assert.expect(3);
    const simplePagination = this.owner.factoryFor('component:simple-pagination').create();
    
    simplePagination.setProperties({
      'recordCount': 25,
      'pageSize': 20,
      'pageNumber': 2
    });
    assert.equal(simplePagination.get('pages')[0]["active"], false);
    assert.equal(simplePagination.get('pages')[1]["active"], true);

    simplePagination.setProperties({
      'recordCount': 310,
      'pageSize': 20,
      'pageNumber': 13
    });
    assert.equal(simplePagination.get('pages')[6]["active"], true);
  });
});
