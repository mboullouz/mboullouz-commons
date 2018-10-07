import * as collections from '../lib';

import * as assert from 'power-assert';
import { expect } from 'chai';
import { Utils } from './../lib/utils/Utils';
import { Logger } from '../lib/logging/Logger';


describe('Utils',
    function () {
        it('Browser should be false running from CMD',
            function () {
                expect(Utils.isBrowser()).equals(false);
            });

        it('Logger should be enabled',
            function () {
                expect(Logger.canLog()).equals(true);
            });

    });
