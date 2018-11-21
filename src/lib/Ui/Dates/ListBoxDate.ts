import * as moment from 'moment';

/**
 * 
 * This a small "port" to Typescript
 * all credit to original author(s) 
 * @at: https://github.com/vitalets/combodate
 */
export class ListBoxDate {
    public $element: any;
    public options: any = {};
    public map: any;
    public $widget;
    public $month: any;
    public $year: any;
    public $ampm: any;
    public borderColor: any;
    constructor(element: any, options: any) {
        console.log('register ListBoxDate ');
        this.$element = $(element);
        if (!this.$element.is('input')) {
            $.error('Combodate should be applied to INPUT element');
            return;
        }
        this.options = $.extend({}, new ListBoxDateDefaultOptions(), options, this.$element.data());
        this.init();
    }

    public init() {
        this.map = {
            //key   regexp    moment.method
            day: ['D', 'date'],
            month: ['M', 'month'],
            year: ['Y', 'year'],
            hour: ['[Hh]', 'hours'],
            minute: ['m', 'minutes'],
            second: ['s', 'seconds'],
            ampm: ['[Aa]', '']
        };

        this.$widget = $('<span class="combodate"></span>').html(this.getTemplate());

        this.initCombos();

        //update original input on change 
        this.$widget.on('change', 'select', $.proxy(function (e: any) {
            let self: any = this;
            self.$element.val(self.getValue()).change();
            // update days count if month or year changes
            if (self.options.smartDays) {
                if ($(e.target).is('.month') || $(e.target).is('.year')) {
                    self.fillCombo('day');
                }
            }
        }, this));

        this.$widget.find('select').css('width', 'auto');

        // hide original input and insert widget                                       
        this.$element.hide().after(this.$widget);

        // set initial value
        this.setValue(this.$element.val() || this.options.value);

    }
    public getTemplate() {
        var tpl = this.options.template;
        var customClass = this.options.customClass;

        //first pass
        $.each(this.map, function (k: any, v: any) {
            v = v[0];
            var r = new RegExp(v + '+'),
                token = v.length > 1 ? v.substring(1, 2) : v;

            tpl = tpl.replace(r, '{' + token + '}');
        });

        //replace spaces with &nbsp;
        tpl = tpl.replace(/ /g, '&nbsp;');

        //second pass
        $.each(this.map, function (k: any, v: any) {
            v = v[0];
            var token = v.length > 1 ? v.substring(1, 2) : v;

            tpl = tpl.replace('{' + token + '}', '<select class="' + k + ' ' + customClass + '"></select>');
        });

        return tpl;
    }

    /* 
      Initialize combos that presents in template 
    */
    public initCombos() {
        for (var k in this.map) {
            var $c = this.$widget.find('.' + k);
            // set properties like this.$day, this.$month etc.
            this['$' + k] = $c.length ? $c : null;
            // fill with items
            this.fillCombo(k);
        }
    }
    /*
         Fill combo with items 
        */
    public fillCombo(k: any) {
        var $combo = this['$' + k];
        if (!$combo) {
            return;
        }

        // define method name to fill items, e.g `fillDays`
        var f = 'fill' + k.charAt(0).toUpperCase() + k.slice(1);
        var items = this[f]();
        var value = $combo.val();

        $combo.empty();
        for (var i = 0; i < items.length; i++) {
            $combo.append('<option value="' + items[i][0] + '">' + items[i][1] + '</option>');
        }

        $combo.val(value);
    }

    /*
         Initialize items of combos. Handles `firstItem` option 
        */
    public fillCommon(key: any) {
        var values: any = [],
            relTime;

        if (this.options.firstItem === 'name') {
            let M: any = moment;
            //need both to support moment ver < 2 and  >= 2
            relTime = M.relativeTime || M.langData()._relativeTime;
            var header: any = typeof relTime[key] === 'function' ? relTime[key](1, true, key, false) : relTime[key];
            //take last entry (see momentjs lang files structure) 
            header = header.split(' ').reverse()[0];
            values.push(['', header]);
        } else if (this.options.firstItem === 'empty') {
            values.push(['', '']);
        }
        return values;
    }

    /*
        fill day
        */
    fillDay() {
        var items = this.fillCommon('d'), name, i,
            twoDigit = this.options.template.indexOf('DD') !== -1,
            daysCount = 31;

        // detect days count (depends on month and year)
        // originally https://github.com/vitalets/combodate/pull/7
        if (this.options.smartDays && this.$month && this.$year) {
            var month = parseInt(this.$month.val(), 10);
            var year = parseInt(this.$year.val(), 10);

            if (!isNaN(month) && !isNaN(year)) {
                daysCount = moment([year, month]).daysInMonth();
            }
        }

        for (i = 1; i <= daysCount; i++) {
            name = twoDigit ? this.leadZero(i) : i;
            items.push([i, name]);
        }
        return items;
    }

    /*
       fill month
       */
    fillMonth() {
        var items = this.fillCommon('M'), name, i,
            longNames = this.options.template.indexOf('MMMM') !== -1,
            shortNames = this.options.template.indexOf('MMM') !== -1,
            twoDigit = this.options.template.indexOf('MM') !== -1;

        for (i = 0; i <= 11; i++) {
            if (longNames) {
                //see https://github.com/timrwood/momentjs.com/pull/36
                name = moment().date(1).month(i).format('MMMM');
            } else if (shortNames) {
                name = moment().date(1).month(i).format('MMM');
            } else if (twoDigit) {
                name = this.leadZero(i + 1);
            } else {
                name = i + 1;
            }
            items.push([i, name]);
        }
        return items;
    }

    /*
      fill year
    */
    fillYear() {
        var items: any = [], name, i,
            longNames = this.options.template.indexOf('YYYY') !== -1;

        for (i = this.options.maxYear; i >= this.options.minYear; i--) {
            name = longNames ? i : (i + '').substring(2);
            items[this.options.yearDescending ? 'push' : 'unshift']([i, name]);
        }

        items = this.fillCommon('y').concat(items);

        return items;
    }

    /*
     fill hour
    */
    fillHour() {
        var items = this.fillCommon('h'), name, i,
            h12 = this.options.template.indexOf('h') !== -1,
            h24 = this.options.template.indexOf('H') !== -1,
            twoDigit = this.options.template.toLowerCase().indexOf('hh') !== -1,
            min = h12 ? 1 : 0,
            max = h12 ? 12 : 23;

        for (i = min; i <= max; i++) {
            name = twoDigit ? this.leadZero(i) : i;
            items.push([i, name]);
        }
        return items;
    }

    /*
        fill minute
        */
    fillMinute() {
        var items = this.fillCommon('m'), name, i,
            twoDigit = this.options.template.indexOf('mm') !== -1;

        for (i = 0; i <= 59; i += this.options.minuteStep) {
            name = twoDigit ? this.leadZero(i) : i;
            items.push([i, name]);
        }
        return items;
    }

    /*
        fill second
        */
    fillSecond() {
        var items = this.fillCommon('s'), name, i,
            twoDigit = this.options.template.indexOf('ss') !== -1;

        for (i = 0; i <= 59; i += this.options.secondStep) {
            name = twoDigit ? this.leadZero(i) : i;
            items.push([i, name]);
        }
        return items;
    }

    /*
        fill ampm
        */
    fillAmpm() {
        var ampmL = this.options.template.indexOf('a') !== -1,
            ampmU = this.options.template.indexOf('A') !== -1,
            items = [
                ['am', ampmL ? 'am' : 'AM'],
                ['pm', ampmL ? 'pm' : 'PM']
            ];
        return items;
    }
    /*
         Returns current date value from combos. 
         If format not specified - `options.format` used.
         If format = `null` - Moment object returned.
        */
    public getValue(format: any) {
        var dt, values: any = {},
            that = this,
            notSelected = false;

        //getting selected values    
        $.each(this.map, function (k: any, v: any) {
            if (k === 'ampm') {
                return;
            }
            var def = k === 'day' ? 1 : 0;

            values[k] = that['$' + k] ? parseInt(that['$' + k].val(), 10) : def;

            if (isNaN(values[k])) {
                notSelected = true;
                return false;
            }
        });

        //if at least one visible combo not selected - return empty string
        if (notSelected) {
            return '';
        }

        //convert hours 12h --> 24h 
        if (this.$ampm) {
            //12:00 pm --> 12:00 (24-h format, midday), 12:00 am --> 00:00 (24-h format, midnight, start of day)
            if (values.hour === 12) {
                values.hour = this.$ampm.val() === 'am' ? 0 : 12;
            } else {
                values.hour = this.$ampm.val() === 'am' ? values.hour : values.hour + 12;
            }
        }

        dt = moment([values.year, values.month, values.day, values.hour, values.minute, values.second]);

        //highlight invalid date
        this.highlight(dt);

        format = format === undefined ? this.options.format : format;
        if (format === null) {
            return dt.isValid() ? dt : null;
        } else {
            return dt.isValid() ? dt.format(format) : '';
        }
    }

    setValue(value: any) {
        if (!value) {
            return;
        }

        // parse in strict mode (third param `true`)
        var dt: any = typeof value === 'string' ? moment(value, this.options.format, true) : moment(value),
            that = this,
            values: any = {};

        //function to find nearest value in select options
        function getNearest($select: any, value: any) {
            var delta: any = {};
            $select.children('option').each(function (i: any, opt: any) {
                var optValue: any = $(opt).attr('value'),
                    distance;

                if (optValue === '') return;
                distance = Math.abs(optValue - value);
                if (typeof delta.distance === 'undefined' || distance < delta.distance) {
                    delta = { value: optValue, distance: distance };
                }
            });
            return delta.value;
        }

        if (dt.isValid()) {
            //read values from date object
            $.each(this.map, function (k: any, v: any) {
                if (k === 'ampm') {
                    return;
                }
                values[k] = dt[v[1]]();
            });

            if (this.$ampm) {
                //12:00 pm --> 12:00 (24-h format, midday), 12:00 am --> 00:00 (24-h format, midnight, start of day)
                if (values.hour >= 12) {
                    values.ampm = 'pm';
                    if (values.hour > 12) {
                        values.hour -= 12;
                    }
                } else {
                    values.ampm = 'am';
                    if (values.hour === 0) {
                        values.hour = 12;
                    }
                }
            }

            $.each(values, function (k: any, v: any) {
                //call val() for each existing combo, e.g. this.$hour.val()
                if (that['$' + k]) {

                    if (k === 'minute' && that.options.minuteStep > 1 && that.options.roundTime) {
                        v = getNearest(that['$' + k], v);
                    }

                    if (k === 'second' && that.options.secondStep > 1 && that.options.roundTime) {
                        v = getNearest(that['$' + k], v);
                    }

                    that['$' + k].val(v);
                }
            });

            // update days count
            if (this.options.smartDays) {
                this.fillCombo('day');
            }

            this.$element.val(dt.format(this.options.format)).change();
        }
    }

    /*
             highlight combos if date is invalid
            */
    highlight(dt: any) {
        if (!dt.isValid()) {
            if (this.options.errorClass) {
                this.$widget.addClass(this.options.errorClass);
            } else {
                //store original border color
                if (!this.borderColor) {
                    this.borderColor = this.$widget.find('select').css('border-color');
                }
                this.$widget.find('select').css('border-color', 'red');
            }
        } else {
            if (this.options.errorClass) {
                this.$widget.removeClass(this.options.errorClass);
            } else {
                this.$widget.find('select').css('border-color', this.borderColor);
            }
        }
    }
    leadZero(v: any) {
        return v <= 9 ? '0' + v : v;
    }

    destroy() {
        this.$widget.remove();
        this.$element.removeData('combodate').show();
    }

}

export class ListBoxDateDefaultOptions {
    format = 'DD-MM-YYYY HH:mm';
    //in this format items in dropdowns are displayed
    template = 'D / MMM / YYYY   H : mm';
    //initial value, can be `new Date()`    
    value = null;
    minYear = 2017;
    maxYear = 2020;
    yearDescending = true;
    minuteStep = 10;
    secondStep = 30;
    firstItem = 'empty';//'name', 'empty', 'none'
    errorClass = null;
    customClass = '';
    roundTime = true;// whether to round minutes and seconds if step > 1
    smartDays = false; // whether days in combo depend on selected month: 31, 30, 28
}