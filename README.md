# Ember-simple-pagination
## This addon is no longer maintained. If you wish to take it over, please contact me and I will transfer it to you.

[![Build Status](https://travis-ci.org/twbrandt/ember-simple-pagination.svg?branch=master)](https://travis-ci.org/twbrandt/ember-simple-pagination)
[![Code Climate](https://codeclimate.com/github/twbrandt/ember-simple-pagination/badges/gpa.svg)](https://codeclimate.com/github/twbrandt/ember-simple-pagination)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/twbrandt/ember-simple-pagination/master/LICENSE.md)

This Ember addon is a simple pagination component which uses Twitter Bootstrap markup. It works with both server-side and client-side pagination.

![screenshot](screenshots/ember-simple-pagination-screenshot.png)

## Installation
* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

`ember install ember-simple-pagination`

## Usage

In your templates:

```
{{simple-pagination
  recordCount=recordCount
  pageSize=pageSize
  pageNumber=pageNumber
  maxPagesInList=maxPagesInList
  dataTestSelector='my-test-selector'
  onPageSelect=(action "getPage")}}
```
### Properties
- `recordCount`: The total number records in the collection being paginated.
- `pageSize`: The number of records in each page.
- `pageNumber`: The current page number. Note that page numbers begin at `1`, not `0`.
- `maxPagesInList`: The maximum of page numbers to display. Defaults to 10.
- `dataTestSelector`: adds a `data-test-selector` attribute to the outer div. Defaults to `null`.

### Events
`onPageSelect`: This fires when the user clicks a page number link, or the `next page` or `previous page` links. It will invoke the external action specified. The page number selected by the user will be passed to the action. The action is not invoked if the user selects the current page link, or the `previous page` link if the current page === 1, or the `next page` link if the current page === the total number of pages.

## Example

This example assumes the Ember `JSONAPIAdapter` and on the server `JSONAPI::Resources`.

`app/components/display-posts.js`:
```javascript
import Component from '@ember/component';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  posts: computed(function() {
    return this.get('store').peekAll('post');
  }),

  pageSize: 20,
  pageNumber: null,
  recordCount: null,

  sortProps: ['createdAt:desc'],
  sortedPosts: sort('posts', 'sortProps'),

  loadPosts(getPageNumber) {
    const pageSize = this.get('pageSize');

    this.get('store').unloadAll('post');
    this.get('store').
      query('post', {page: {number: getPageNumber, size: pageSize}}).
      then((result) => {
        this.setProperties({
        	'recordCount': result.get('meta.record-count'),
        	'pageNumber': getPageNumber
        });
      };
  },

  init() {
    this._super(...arguments);
    this.loadPosts(1);
  },

  actions: {
    getPage(getPageNumber) {
      this.loadPosts(getPageNumber);
    }
  }
});
```

`app/templates/components/display-posts.hbs`:
```html
<ul class="list-unstyled">
  {{#each sortedPosts as |post|}}
    <li>{{display-post post=post}}</li>
  {{/each}}
</ul>

{{simple-pagination
  recordCount=recordCount
  pageSize=pageSize
  pageNumber=pageNumber
  onPageSelect=(action "getPage")}}
```
