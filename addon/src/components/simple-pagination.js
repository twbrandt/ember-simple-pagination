import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SimplePagination extends Component {
    get maxPagesInList () {
        return this.args.maxPagesInList ?? 10;
    }

    get displayPaginator () {
        return this.totalPages > 1;
    }

    get isPrevDisabled () {
        return this.args.pageNumber === 1;
    }

    get isNextDisabled () {
      return this.args.pageNumber === this.totalPages;
    }

    get prevPageNumber() {
      return Math.max(1, this.args.pageNumber - 1);
    }

    get nextPageNumber () {
      return Math.min(this.totalPages, this.args.pageNumber + 1);
    }

    get totalPages () {
      const recordCount = this.args.recordCount;
      const pageSize = this.args.pageSize;
      const pageNumber = this.args.pageNumber;
      const maxPagesInList = this.maxPagesInList;

      if (recordCount < 0 || pageSize < 1 || pageNumber < 1 || maxPagesInList < 2) {
        return 0;
      }

      const totalPages = Math.floor(recordCount/pageSize),
          rem = recordCount % pageSize;

      if (rem > 0) {
        return totalPages + 1;
      }

      return totalPages;
    }

    get nbrPagesInList () {
      return Math.min(this.totalPages, this.maxPagesInList);
    }

    get pages () {
        const pageArray = [];
        const totalPages = this.totalPages;
        const pageNumber = this.args.pageNumber;
        const nbrPagesInList = this.nbrPagesInList;

        const endPgNbr = Math.min((pageNumber + 3), totalPages);
        let pgNbr = Math.max((endPgNbr - nbrPagesInList + 1), 1);

        for (var i = 0; i < nbrPagesInList; i++) {
          const active = pgNbr === pageNumber;
          pageArray[i] = { number: pgNbr, active: active };
          pgNbr++;
        }

        return pageArray;
    }

    @action
    getPage (newPageNumber) {
        if (newPageNumber !== this.args.pageNumber) {
            this.args.onPageSelect(newPageNumber);
        }
    }
}
