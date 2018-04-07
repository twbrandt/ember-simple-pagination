import Component from '@ember/component';
import { equal, gt } from "@ember/object/computed";
import { computed } from "@ember/object";

export default Component.extend({
  maxPagesInList: 10,
  displayPaginator: gt('totalPages',1),
  isPrevDisabled: equal('pageNumber', 1),
  attributeBindings: ['dataTestSelector:data-test-selector'],
  dataTestSelector: null,

  isNextDisabled: computed('pageNumber', 'totalPages', function() {
    return this.get('pageNumber') === this.get('totalPages') ? true : false;
  }),

  prevPageNumber: computed('pageNumber', function() {
    return Math.max(1, this.get('pageNumber') - 1);
  }),

  nextPageNumber: computed('pageNumber', function() {
    return Math.min(this.get('totalPages'), this.get('pageNumber') + 1);
  }),

  totalPages: computed('recordCount', 'pageSize', function() {
    let recordCount = this.get('recordCount'),
        pageSize = this.get('pageSize'),
        pageNumber = this.get('pageNumber'),
        maxPagesInList = this.get('maxPagesInList');

    if (recordCount < 0 || pageSize < 1 || pageNumber < 1 || maxPagesInList < 2) {
      return 0;
    }

    let totalPages = Math.floor(recordCount/pageSize),
        rem = recordCount % pageSize;

    if (rem > 0) {
      totalPages++;
    }

    return totalPages;
  }),

  nbrPagesInList: computed('recordCount', 'pageSize', 'maxPagesInList', function() {
    return Math.min(this.get('totalPages'), this.get('maxPagesInList'));
  }),

  pages: computed('pageNumber', 'recordCount', 'pageSize', 'maxPagesInList', function() {
    let pageArray = [],
        totalPages = this.get('totalPages'),
        pageNumber = this.get('pageNumber'),
        nbrPagesInList = this.get('nbrPagesInList'),
        active, pgNbr, endPgNbr;

    endPgNbr = Math.min((pageNumber + 3), totalPages);
    pgNbr = Math.max((endPgNbr - nbrPagesInList + 1), 1);

    for (var i = 0; i < nbrPagesInList; i++) {
      active = pgNbr === pageNumber ? true : false;
      pageArray[i] = {number: pgNbr, active: active};
      pgNbr++;
    }
    return pageArray;
  }),

  actions: {
    getPage: function(newPageNumber) {
      if (newPageNumber !== this.get('pageNumber')) {
        this.get('onPageSelect')(newPageNumber);
      }
    }
  }
});
