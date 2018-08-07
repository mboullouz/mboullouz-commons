import * as collections from '../lib/index';

import * as assert from 'power-assert';
import {expect} from 'chai';

describe('Linked List',
    function() {

        var list: collections.LinkedList<any>;
        var elems = 100;

        var equals = function(a: any, b: any) {
            return a.el === b.el;
        };

        beforeEach(function() {
            list = new collections.LinkedList();
        });

        it('Inserts elements',
            function() {
                expect(list.first()).equals(undefined);
                expect(list.last()).equals(undefined);
                expect(list.size()).equals(0);
                for (var i = 0; i < elems; i++) {
                    list.add(i);
                    expect(list.first()).equals(0);
                    expect(list.last()).equals(i);

                    if (i === 0) {
                        expect(list.first()).equals(list.last());
                    }
                    expect(list.size()).equals(i + 1);
                }
            });

        it('Same as toString',
            function() {
                list.add(1);
                list.add(2);
                expect(list.toString()).equals("12");
              
            });

    });
