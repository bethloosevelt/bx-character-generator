
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('util')) :
    typeof define === 'function' && define.amd ? define(['util'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.require$$0));
}(this, (function (require$$0) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.34.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*jslint indent: 2*/

    var inputError = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      var util = require$$0__default['default'];

      function InvalidInputError(input) {
        this.name = 'InvalidInputError';
        if (input) {
          this.message = util.format('"%s" is not a valid input string for node-roll.', input);
        } else {
          this.message = 'No input string was supplied to node-roll.';
        }
        this.input = input;
      }

      InvalidInputError.prototype = new Error();
      InvalidInputError.prototype.constructor = InvalidInputError;

      module.exports = InvalidInputError;

    }());
    });

    /*jslint indent: 2*/

    var add = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      module.exports = function (number, value) {
        return number + value;
      };

    }());
    });

    /*jslint indent: 2*/

    var bestOf = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      module.exports = function (rolledDice, value) {
        var result = [],
          sorted = rolledDice.sort(function (a, b) {
            return b - a;
          }),
          i;
        for (i = 0; i < sorted.length && i < (value / 1); i = i + 1) {
          result.push(sorted[i]);
        }
        return result;
      };

    }());
    });

    /*jslint indent: 2*/

    var divide = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      module.exports = function (number, value) {
        return number / value;
      };

    }());
    });

    /*jslint indent: 2*/

    var multiply = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      module.exports = function (number, value) {
        return number * value;
      };

    }());
    });

    /*jslint indent: 2*/

    var subtract = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      module.exports = function (number, value) {
        return number - value;
      };

    }());
    });

    /*jslint indent: 2*/

    var sum = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      module.exports = function (rolledDice) {
        return rolledDice.reduce(function (sum, value) {
          return sum + value;
        }, 0);
      };

    }());
    });

    /*jslint indent: 2*/

    var worstOf = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      module.exports = function (rolledDice, value) {
        var result = [],
          sorted = rolledDice.sort(function (a, b) {
            return a - b;
          }),
          i;
        for (i = 0; i < sorted.length && i < (value / 1); i = i + 1) {
          result.push(sorted[i]);
        }
        return result;
      };

    }());
    });

    /*jslint indent: 2*/

    /*global require: true, module: true*/
    var transforms = {
      add: add,
      'best-of': bestOf,
      divide: divide,
      multiply: multiply,
      subtract: subtract,
      sum: sum,
      'worst-of': worstOf
    };

    /*jslint indent: 2*/

    var keys$1 = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      module.exports = {
        '+': function (value) {
          return [
            'sum',
            ['add', value]
          ];
        },
        '-': function (value) {
          return [
            'sum',
            ['subtract', value]
          ];
        },
        '*': function (value) {
          return [
            'sum',
            ['multiply', value]
          ];
        },
        '/': function (value) {
          return [
            'sum',
            ['divide', value]
          ];
        },
        'b': function (value) {
          return [
            ['best-of', value],
            'sum'
          ];
        },
        'w': function (value) {
          return [
            ['worst-of', value],
            'sum'
          ];
        }
      };

    }());
    });

    /*jslint indent: 2*/

    var src = createCommonjsModule(function (module) {
    /*global require: true, module: true*/
    (function () {

      var InvalidInputError = inputError,
        transformationFunctions = transforms,
        transformationKeys = keys$1,
        regex =  /^(\d*)d(\d+|\%)(([\+\-\/\*bw])(\d+))?(([\+\-\/\*])(\d+|(\d*)d(\d+|\%)(([\+\-\/\*bw])(\d+))?))*$/,
        roll,
        cleaner,
        sumResult = false,
        filler = [];

      roll = function (random) {
        this.random = random || Math.random.bind(Math);
      };

      roll.prototype.validate = function (s) {
        return regex.test(s);
      };

      roll.prototype.parse = function (s) {
        if (!this.validate(s)) {
          throw new InvalidInputError(s);
        }

        var match = regex.exec(s),
          quantity = match[1], // 2d20+3 => 2
          sides = match[2], // 2d20+3 => 20
          hasTransformation = !!match[3], // 2d20+3 => true
          operator,
          transformationParameter,
          transforms = [],
          opIndex = 0,
          segments = s.split(/[\+\-]/),
          outsideRoll,
          seg;

        if (segments[0].indexOf('b') > -1 || segments[0].indexOf('w') > -1) {
          transforms.push(transformationKeys[match[4]](parseInt(match[5], 10)));
        }

        for (seg = 1; seg < segments.length; seg += 1) {
          opIndex += segments[seg - 1].length;
          operator = s[opIndex]; // 2d20+3 => "+"
          opIndex += 1;
          transformationParameter = segments[seg]; // 2d20+3 => 3
          if (transformationParameter.indexOf('d') > -1) { // perform a roll
            outsideRoll = this.roll(transformationParameter, true);
            transforms.push(transformationKeys[operator](outsideRoll.result));
          } else {
            transforms.push(transformationKeys[operator](parseInt(transformationParameter, 10)));
          }
        }

        return {
          quantity: quantity ? parseInt(quantity, 10) : 1,
          sides: sides === '%' ? 100 : parseInt(sides, 10),
          transformations: hasTransformation || transforms.length > 0 ? transforms.length > 0 ? transforms : transformationKeys[match[4]](parseInt(match[5], 10)) : ['sum'],
          toString: function () {
            return s;
          }
        };
      };

      roll.prototype.roll = function (input, invokedByParse) {
        if (!input) {
          throw new InvalidInputError();
        } else if (typeof input === 'string') {
          input = this.parse(input);
        }

        var rolled = [],
         calculations = [],
         carryFiller = [];

        while (rolled.length < input.quantity) {
          rolled.push(Math.floor((this.random() * input.sides) + 1));
        }

        filler.push(rolled);

        calculations = input.transformations.reduce(function (previous, transformation) {
          var transformationFunction,
            transformationAdditionalParameter,
            sumParam = false;
          if (typeof transformation === 'function') { // lets you pass something custom in
            transformationFunction = transformation;
          } else if (typeof transformation === 'string') { // "sum"
            transformationFunction = transformationFunctions[transformation];
          } else if (transformation instanceof Array) { // ["add", 3]
            if (transformation[0] instanceof Array) {
              sumResult = true;
              cleaner = transformation[1];
              transformation = transformation[0];
            } else if (transformation[1] instanceof Array) {
              sumParam = true;
              cleaner = transformation[0];
              transformation = transformation[1];
            }
            transformationFunction = transformationFunctions[transformation[0]]; // fn for "add"
            transformationAdditionalParameter = transformation[1];
          }
          if (sumParam === true && previous[0]  instanceof Array) {
            previous[0] = transformationFunctions[cleaner](previous[0]);
          }
          previous.unshift(transformationFunction(previous[0], transformationAdditionalParameter));
          return previous;
        }, [rolled]);

        if (sumResult === true && calculations[0] instanceof Array) {
          calculations[1] = calculations[0];
          calculations[0] = transformationFunctions[cleaner](calculations[0]);
        }

        if (!invokedByParse) {
          if (filler.length > 1) {
            filler.unshift(filler.pop());
          }
          carryFiller = filler.length === 1 ? filler[0] : filler;
          filler = [];
        }

        return {
          input: input,
          calculations: calculations,
          rolled: carryFiller,
          result: calculations[0]
        };
      };

      module.exports = roll;
      module.exports.InvalidInputError = InvalidInputError;

    }());
    });

    function _isPlaceholder(a) {
      return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
    }

    /**
     * Optimized internal one-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */

    function _curry1(fn) {
      return function f1(a) {
        if (arguments.length === 0 || _isPlaceholder(a)) {
          return f1;
        } else {
          return fn.apply(this, arguments);
        }
      };
    }

    /**
     * Optimized internal two-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */

    function _curry2(fn) {
      return function f2(a, b) {
        switch (arguments.length) {
          case 0:
            return f2;

          case 1:
            return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
              return fn(a, _b);
            });

          default:
            return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
              return fn(_a, b);
            }) : _isPlaceholder(b) ? _curry1(function (_b) {
              return fn(a, _b);
            }) : fn(a, b);
        }
      };
    }

    /**
     * Tests whether or not an object is an array.
     *
     * @private
     * @param {*} val The object to test.
     * @return {Boolean} `true` if `val` is an array, `false` otherwise.
     * @example
     *
     *      _isArray([]); //=> true
     *      _isArray(null); //=> false
     *      _isArray({}); //=> false
     */
    var _isArray = Array.isArray || function _isArray(val) {
      return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
    };

    function _isTransformer(obj) {
      return obj != null && typeof obj['@@transducer/step'] === 'function';
    }

    /**
     * Returns a function that dispatches with different strategies based on the
     * object in list position (last argument). If it is an array, executes [fn].
     * Otherwise, if it has a function with one of the given method names, it will
     * execute that function (functor case). Otherwise, if it is a transformer,
     * uses transducer [xf] to return a new transformer (transducer case).
     * Otherwise, it will default to executing [fn].
     *
     * @private
     * @param {Array} methodNames properties to check for a custom implementation
     * @param {Function} xf transducer to initialize if object is transformer
     * @param {Function} fn default ramda implementation
     * @return {Function} A function that dispatches on object in list position
     */

    function _dispatchable(methodNames, xf, fn) {
      return function () {
        if (arguments.length === 0) {
          return fn();
        }

        var args = Array.prototype.slice.call(arguments, 0);
        var obj = args.pop();

        if (!_isArray(obj)) {
          var idx = 0;

          while (idx < methodNames.length) {
            if (typeof obj[methodNames[idx]] === 'function') {
              return obj[methodNames[idx]].apply(obj, args);
            }

            idx += 1;
          }

          if (_isTransformer(obj)) {
            var transducer = xf.apply(null, args);
            return transducer(obj);
          }
        }

        return fn.apply(this, arguments);
      };
    }

    function _reduced(x) {
      return x && x['@@transducer/reduced'] ? x : {
        '@@transducer/value': x,
        '@@transducer/reduced': true
      };
    }

    var _xfBase = {
      init: function () {
        return this.xf['@@transducer/init']();
      },
      result: function (result) {
        return this.xf['@@transducer/result'](result);
      }
    };

    function _has(prop, obj) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var toString = Object.prototype.toString;

    var _isArguments =
    /*#__PURE__*/
    function () {
      return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
        return toString.call(x) === '[object Arguments]';
      } : function _isArguments(x) {
        return _has('callee', x);
      };
    }();

    var hasEnumBug = !
    /*#__PURE__*/
    {
      toString: null
    }.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

    var hasArgsEnumBug =
    /*#__PURE__*/
    function () {

      return arguments.propertyIsEnumerable('length');
    }();

    var contains = function contains(list, item) {
      var idx = 0;

      while (idx < list.length) {
        if (list[idx] === item) {
          return true;
        }

        idx += 1;
      }

      return false;
    };
    /**
     * Returns a list containing the names of all the enumerable own properties of
     * the supplied object.
     * Note that the order of the output array is not guaranteed to be consistent
     * across different JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {k: v} -> [k]
     * @param {Object} obj The object to extract properties from
     * @return {Array} An array of the object's own properties.
     * @see R.keysIn, R.values
     * @example
     *
     *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
     */


    var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ?
    /*#__PURE__*/
    _curry1(function keys(obj) {
      return Object(obj) !== obj ? [] : Object.keys(obj);
    }) :
    /*#__PURE__*/
    _curry1(function keys(obj) {
      if (Object(obj) !== obj) {
        return [];
      }

      var prop, nIdx;
      var ks = [];

      var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

      for (prop in obj) {
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
          ks[ks.length] = prop;
        }
      }

      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;

        while (nIdx >= 0) {
          prop = nonEnumerableProps[nIdx];

          if (_has(prop, obj) && !contains(ks, prop)) {
            ks[ks.length] = prop;
          }

          nIdx -= 1;
        }
      }

      return ks;
    });

    /**
     * Gives a single-word string description of the (native) type of a value,
     * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
     * attempt to distinguish user Object types any further, reporting them all as
     * 'Object'.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Type
     * @sig (* -> {*}) -> String
     * @param {*} val The value to test
     * @return {String}
     * @example
     *
     *      R.type({}); //=> "Object"
     *      R.type(1); //=> "Number"
     *      R.type(false); //=> "Boolean"
     *      R.type('s'); //=> "String"
     *      R.type(null); //=> "Null"
     *      R.type([]); //=> "Array"
     *      R.type(/[A-z]/); //=> "RegExp"
     *      R.type(() => {}); //=> "Function"
     *      R.type(undefined); //=> "Undefined"
     */

    var type =
    /*#__PURE__*/
    _curry1(function type(val) {
      return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
    });

    function _arrayFromIterator(iter) {
      var list = [];
      var next;

      while (!(next = iter.next()).done) {
        list.push(next.value);
      }

      return list;
    }

    function _includesWith(pred, x, list) {
      var idx = 0;
      var len = list.length;

      while (idx < len) {
        if (pred(x, list[idx])) {
          return true;
        }

        idx += 1;
      }

      return false;
    }

    function _functionName(f) {
      // String(x => x) evaluates to "x => x", so the pattern may not match.
      var match = String(f).match(/^function (\w*)/);
      return match == null ? '' : match[1];
    }

    // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    function _objectIs(a, b) {
      // SameValue algorithm
      if (a === b) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return a !== 0 || 1 / a === 1 / b;
      } else {
        // Step 6.a: NaN == NaN
        return a !== a && b !== b;
      }
    }

    var _objectIs$1 = typeof Object.is === 'function' ? Object.is : _objectIs;

    /**
     * private _uniqContentEquals function.
     * That function is checking equality of 2 iterator contents with 2 assumptions
     * - iterators lengths are the same
     * - iterators values are unique
     *
     * false-positive result will be returned for comparision of, e.g.
     * - [1,2,3] and [1,2,3,4]
     * - [1,1,1] and [1,2,3]
     * */

    function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
      var a = _arrayFromIterator(aIterator);

      var b = _arrayFromIterator(bIterator);

      function eq(_a, _b) {
        return _equals(_a, _b, stackA.slice(), stackB.slice());
      } // if *a* array contains any element that is not included in *b*


      return !_includesWith(function (b, aItem) {
        return !_includesWith(eq, aItem, b);
      }, b, a);
    }

    function _equals(a, b, stackA, stackB) {
      if (_objectIs$1(a, b)) {
        return true;
      }

      var typeA = type(a);

      if (typeA !== type(b)) {
        return false;
      }

      if (a == null || b == null) {
        return false;
      }

      if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
        return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
      }

      if (typeof a.equals === 'function' || typeof b.equals === 'function') {
        return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
      }

      switch (typeA) {
        case 'Arguments':
        case 'Array':
        case 'Object':
          if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
            return a === b;
          }

          break;

        case 'Boolean':
        case 'Number':
        case 'String':
          if (!(typeof a === typeof b && _objectIs$1(a.valueOf(), b.valueOf()))) {
            return false;
          }

          break;

        case 'Date':
          if (!_objectIs$1(a.valueOf(), b.valueOf())) {
            return false;
          }

          break;

        case 'Error':
          return a.name === b.name && a.message === b.message;

        case 'RegExp':
          if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
            return false;
          }

          break;
      }

      var idx = stackA.length - 1;

      while (idx >= 0) {
        if (stackA[idx] === a) {
          return stackB[idx] === b;
        }

        idx -= 1;
      }

      switch (typeA) {
        case 'Map':
          if (a.size !== b.size) {
            return false;
          }

          return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));

        case 'Set':
          if (a.size !== b.size) {
            return false;
          }

          return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));

        case 'Arguments':
        case 'Array':
        case 'Object':
        case 'Boolean':
        case 'Number':
        case 'String':
        case 'Date':
        case 'Error':
        case 'RegExp':
        case 'Int8Array':
        case 'Uint8Array':
        case 'Uint8ClampedArray':
        case 'Int16Array':
        case 'Uint16Array':
        case 'Int32Array':
        case 'Uint32Array':
        case 'Float32Array':
        case 'Float64Array':
        case 'ArrayBuffer':
          break;

        default:
          // Values of other types are only equal if identical.
          return false;
      }

      var keysA = keys(a);

      if (keysA.length !== keys(b).length) {
        return false;
      }

      var extendedStackA = stackA.concat([a]);
      var extendedStackB = stackB.concat([b]);
      idx = keysA.length - 1;

      while (idx >= 0) {
        var key = keysA[idx];

        if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
          return false;
        }

        idx -= 1;
      }

      return true;
    }

    /**
     * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
     * cyclical data structures.
     *
     * Dispatches symmetrically to the `equals` methods of both arguments, if
     * present.
     *
     * @func
     * @memberOf R
     * @since v0.15.0
     * @category Relation
     * @sig a -> b -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @example
     *
     *      R.equals(1, 1); //=> true
     *      R.equals(1, '1'); //=> false
     *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
     *
     *      const a = {}; a.v = a;
     *      const b = {}; b.v = b;
     *      R.equals(a, b); //=> true
     */

    var equals =
    /*#__PURE__*/
    _curry2(function equals(a, b) {
      return _equals(a, b, [], []);
    });

    function _indexOf(list, a, idx) {
      var inf, item; // Array.prototype.indexOf doesn't exist below IE9

      if (typeof list.indexOf === 'function') {
        switch (typeof a) {
          case 'number':
            if (a === 0) {
              // manually crawl the list to distinguish between +0 and -0
              inf = 1 / a;

              while (idx < list.length) {
                item = list[idx];

                if (item === 0 && 1 / item === inf) {
                  return idx;
                }

                idx += 1;
              }

              return -1;
            } else if (a !== a) {
              // NaN
              while (idx < list.length) {
                item = list[idx];

                if (typeof item === 'number' && item !== item) {
                  return idx;
                }

                idx += 1;
              }

              return -1;
            } // non-zero numbers can utilise Set


            return list.indexOf(a, idx);
          // all these types can utilise Set

          case 'string':
          case 'boolean':
          case 'function':
          case 'undefined':
            return list.indexOf(a, idx);

          case 'object':
            if (a === null) {
              // null can utilise Set
              return list.indexOf(a, idx);
            }

        }
      } // anything else not covered above, defer to R.equals


      while (idx < list.length) {
        if (equals(list[idx], a)) {
          return idx;
        }

        idx += 1;
      }

      return -1;
    }

    function _includes(a, list) {
      return _indexOf(list, a, 0) >= 0;
    }

    var _Set =
    /*#__PURE__*/
    function () {
      function _Set() {
        /* globals Set */
        this._nativeSet = typeof Set === 'function' ? new Set() : null;
        this._items = {};
      }

      // until we figure out why jsdoc chokes on this
      // @param item The item to add to the Set
      // @returns {boolean} true if the item did not exist prior, otherwise false
      //
      _Set.prototype.add = function (item) {
        return !hasOrAdd(item, true, this);
      }; //
      // @param item The item to check for existence in the Set
      // @returns {boolean} true if the item exists in the Set, otherwise false
      //


      _Set.prototype.has = function (item) {
        return hasOrAdd(item, false, this);
      }; //
      // Combines the logic for checking whether an item is a member of the set and
      // for adding a new item to the set.
      //
      // @param item       The item to check or add to the Set instance.
      // @param shouldAdd  If true, the item will be added to the set if it doesn't
      //                   already exist.
      // @param set        The set instance to check or add to.
      // @return {boolean} true if the item already existed, otherwise false.
      //


      return _Set;
    }();

    function hasOrAdd(item, shouldAdd, set) {
      var type = typeof item;
      var prevSize, newSize;

      switch (type) {
        case 'string':
        case 'number':
          // distinguish between +0 and -0
          if (item === 0 && 1 / item === -Infinity) {
            if (set._items['-0']) {
              return true;
            } else {
              if (shouldAdd) {
                set._items['-0'] = true;
              }

              return false;
            }
          } // these types can all utilise the native Set


          if (set._nativeSet !== null) {
            if (shouldAdd) {
              prevSize = set._nativeSet.size;

              set._nativeSet.add(item);

              newSize = set._nativeSet.size;
              return newSize === prevSize;
            } else {
              return set._nativeSet.has(item);
            }
          } else {
            if (!(type in set._items)) {
              if (shouldAdd) {
                set._items[type] = {};
                set._items[type][item] = true;
              }

              return false;
            } else if (item in set._items[type]) {
              return true;
            } else {
              if (shouldAdd) {
                set._items[type][item] = true;
              }

              return false;
            }
          }

        case 'boolean':
          // set._items['boolean'] holds a two element array
          // representing [ falseExists, trueExists ]
          if (type in set._items) {
            var bIdx = item ? 1 : 0;

            if (set._items[type][bIdx]) {
              return true;
            } else {
              if (shouldAdd) {
                set._items[type][bIdx] = true;
              }

              return false;
            }
          } else {
            if (shouldAdd) {
              set._items[type] = item ? [false, true] : [true, false];
            }

            return false;
          }

        case 'function':
          // compare functions for reference equality
          if (set._nativeSet !== null) {
            if (shouldAdd) {
              prevSize = set._nativeSet.size;

              set._nativeSet.add(item);

              newSize = set._nativeSet.size;
              return newSize === prevSize;
            } else {
              return set._nativeSet.has(item);
            }
          } else {
            if (!(type in set._items)) {
              if (shouldAdd) {
                set._items[type] = [item];
              }

              return false;
            }

            if (!_includes(item, set._items[type])) {
              if (shouldAdd) {
                set._items[type].push(item);
              }

              return false;
            }

            return true;
          }

        case 'undefined':
          if (set._items[type]) {
            return true;
          } else {
            if (shouldAdd) {
              set._items[type] = true;
            }

            return false;
          }

        case 'object':
          if (item === null) {
            if (!set._items['null']) {
              if (shouldAdd) {
                set._items['null'] = true;
              }

              return false;
            }

            return true;
          }

        /* falls through */

        default:
          // reduce the search size of heterogeneous sets by creating buckets
          // for each type.
          type = Object.prototype.toString.call(item);

          if (!(type in set._items)) {
            if (shouldAdd) {
              set._items[type] = [item];
            }

            return false;
          } // scan through all previously applied items


          if (!_includes(item, set._items[type])) {
            if (shouldAdd) {
              set._items[type].push(item);
            }

            return false;
          }

          return true;
      }
    } // A simple Set type that honours R.equals semantics

    /**
     * Finds the set (i.e. no duplicates) of all elements in the first list not
     * contained in the second list. Objects and Arrays are compared in terms of
     * value equality, not reference equality.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig [*] -> [*] -> [*]
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The elements in `list1` that are not in `list2`.
     * @see R.differenceWith, R.symmetricDifference, R.symmetricDifferenceWith, R.without
     * @example
     *
     *      R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
     *      R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
     *      R.difference([{a: 1}, {b: 2}], [{a: 1}, {c: 3}]) //=> [{b: 2}]
     */

    var difference =
    /*#__PURE__*/
    _curry2(function difference(first, second) {
      var out = [];
      var idx = 0;
      var firstLen = first.length;
      var secondLen = second.length;
      var toFilterOut = new _Set();

      for (var i = 0; i < secondLen; i += 1) {
        toFilterOut.add(second[i]);
      }

      while (idx < firstLen) {
        if (toFilterOut.add(first[idx])) {
          out[out.length] = first[idx];
        }

        idx += 1;
      }

      return out;
    });

    var XFind =
    /*#__PURE__*/
    function () {
      function XFind(f, xf) {
        this.xf = xf;
        this.f = f;
        this.found = false;
      }

      XFind.prototype['@@transducer/init'] = _xfBase.init;

      XFind.prototype['@@transducer/result'] = function (result) {
        if (!this.found) {
          result = this.xf['@@transducer/step'](result, void 0);
        }

        return this.xf['@@transducer/result'](result);
      };

      XFind.prototype['@@transducer/step'] = function (result, input) {
        if (this.f(input)) {
          this.found = true;
          result = _reduced(this.xf['@@transducer/step'](result, input));
        }

        return result;
      };

      return XFind;
    }();

    var _xfind =
    /*#__PURE__*/
    _curry2(function _xfind(f, xf) {
      return new XFind(f, xf);
    });

    /**
     * Returns the first element of the list which matches the predicate, or
     * `undefined` if no element matches.
     *
     * Dispatches to the `find` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> a | undefined
     * @param {Function} fn The predicate function used to determine if the element is the
     *        desired one.
     * @param {Array} list The array to consider.
     * @return {Object} The element found, or `undefined`.
     * @see R.transduce
     * @example
     *
     *      const xs = [{a: 1}, {a: 2}, {a: 3}];
     *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
     *      R.find(R.propEq('a', 4))(xs); //=> undefined
     */

    var find =
    /*#__PURE__*/
    _curry2(
    /*#__PURE__*/
    _dispatchable(['find'], _xfind, function find(fn, list) {
      var idx = 0;
      var len = list.length;

      while (idx < len) {
        if (fn(list[idx])) {
          return list[idx];
        }

        idx += 1;
      }
    }));

    /* node_modules/carbon-icons-svelte/lib/ChevronUp24/ChevronUp24.svelte generated by Svelte v3.34.0 */

    const file$6 = "node_modules/carbon-icons-svelte/lib/ChevronUp24/ChevronUp24.svelte";

    // (39:4) {#if title}
    function create_if_block$2(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$6, 39, 6, 1044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "ChevronUp24" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "24" },
    		{ height: "24" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M16 10L26 20 24.6 21.4 16 12.8 7.4 21.4 6 20z");
    			add_location(path, file$6, 36, 2, 949);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$6, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "ChevronUp24" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "24" },
    				{ height: "24" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChevronUp24", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class ChevronUp24 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronUp24",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<ChevronUp24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronUp24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ChevronUp24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ChevronUp24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<ChevronUp24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<ChevronUp24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<ChevronUp24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<ChevronUp24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronUp24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronUp24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ChevronUp24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ChevronUp24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-icons-svelte/lib/ChevronDown24/ChevronDown24.svelte generated by Svelte v3.34.0 */

    const file$5 = "node_modules/carbon-icons-svelte/lib/ChevronDown24/ChevronDown24.svelte";

    // (39:4) {#if title}
    function create_if_block$1(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$5, 39, 6, 1046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "ChevronDown24" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "24" },
    		{ height: "24" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M16 22L6 12 7.4 10.6 16 19.2 24.6 10.6 26 12z");
    			add_location(path, file$5, 36, 2, 951);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$5, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "ChevronDown24" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "24" },
    				{ height: "24" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChevronDown24", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class ChevronDown24 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDown24",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get class() {
    		throw new Error("<ChevronDown24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronDown24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ChevronDown24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ChevronDown24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<ChevronDown24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<ChevronDown24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<ChevronDown24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<ChevronDown24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronDown24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronDown24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ChevronDown24>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ChevronDown24>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/SavingThrows.svelte generated by Svelte v3.34.0 */

    const file$4 = "src/SavingThrows.svelte";

    function create_fragment$4(ctx) {
    	let table;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t2_value = /*characterClass*/ ctx[1].savingThrows.d + "";
    	let t2;
    	let t3;
    	let tr1;
    	let td2;
    	let t5;
    	let td3;
    	let t6_value = /*characterClass*/ ctx[1].savingThrows.w + "";
    	let t6;
    	let t7;
    	let tr2;
    	let td4;
    	let t9;
    	let td5;
    	let t10_value = /*characterClass*/ ctx[1].savingThrows.p + "";
    	let t10;
    	let t11;
    	let tr3;
    	let td6;
    	let t13;
    	let td7;
    	let t14_value = /*characterClass*/ ctx[1].savingThrows.b + "";
    	let t14;
    	let t15;
    	let tr4;
    	let td8;
    	let t17;
    	let td9;
    	let t18_value = /*characterClass*/ ctx[1].savingThrows.s + "";
    	let t18;
    	let t19;
    	let tr5;
    	let td10;
    	let t21;
    	let td11;
    	let t22_value = /*characterClass*/ ctx[1].savingThrows.s + (/*abilityModifiers*/ ctx[0].WIS?.modifiers.magicSaves || 0) + "";
    	let t22;

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Death, poison (D)";
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Magic wands (W)";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Paralysis, petrification (P)";
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Breath attacks (B)";
    			t13 = space();
    			td7 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			tr4 = element("tr");
    			td8 = element("td");
    			td8.textContent = "Spells, magic rods, magic staves (S)";
    			t17 = space();
    			td9 = element("td");
    			t18 = text(t18_value);
    			t19 = space();
    			tr5 = element("tr");
    			td10 = element("td");
    			td10.textContent = "+/-";
    			t21 = space();
    			td11 = element("td");
    			t22 = text(t22_value);
    			attr_dev(td0, "class", "font-bold");
    			add_location(td0, file$4, 8, 4, 143);
    			add_location(td1, file$4, 9, 4, 192);
    			attr_dev(tr0, "class", "bg-mint");
    			add_location(tr0, file$4, 7, 2, 118);
    			attr_dev(td2, "class", "font-bold");
    			add_location(td2, file$4, 12, 4, 252);
    			add_location(td3, file$4, 13, 4, 299);
    			add_location(tr1, file$4, 11, 2, 243);
    			attr_dev(td4, "class", "font-bold");
    			add_location(td4, file$4, 16, 4, 375);
    			add_location(td5, file$4, 17, 4, 435);
    			attr_dev(tr2, "class", "bg-mint");
    			add_location(tr2, file$4, 15, 2, 350);
    			attr_dev(td6, "class", "font-bold");
    			add_location(td6, file$4, 20, 4, 495);
    			add_location(td7, file$4, 21, 4, 545);
    			add_location(tr3, file$4, 19, 2, 486);
    			attr_dev(td8, "class", "font-bold");
    			add_location(td8, file$4, 24, 4, 621);
    			add_location(td9, file$4, 25, 4, 689);
    			attr_dev(tr4, "class", "bg-mint");
    			add_location(tr4, file$4, 23, 2, 596);
    			attr_dev(td10, "class", "font-bold");
    			add_location(td10, file$4, 28, 4, 749);
    			add_location(td11, file$4, 29, 4, 784);
    			add_location(tr5, file$4, 27, 2, 740);
    			attr_dev(table, "class", "table-auto");
    			add_location(table, file$4, 6, 0, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(td1, t2);
    			append_dev(table, t3);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, t5);
    			append_dev(tr1, td3);
    			append_dev(td3, t6);
    			append_dev(table, t7);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, t9);
    			append_dev(tr2, td5);
    			append_dev(td5, t10);
    			append_dev(table, t11);
    			append_dev(table, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, t13);
    			append_dev(tr3, td7);
    			append_dev(td7, t14);
    			append_dev(table, t15);
    			append_dev(table, tr4);
    			append_dev(tr4, td8);
    			append_dev(tr4, t17);
    			append_dev(tr4, td9);
    			append_dev(td9, t18);
    			append_dev(table, t19);
    			append_dev(table, tr5);
    			append_dev(tr5, td10);
    			append_dev(tr5, t21);
    			append_dev(tr5, td11);
    			append_dev(td11, t22);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*characterClass*/ 2 && t2_value !== (t2_value = /*characterClass*/ ctx[1].savingThrows.d + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*characterClass*/ 2 && t6_value !== (t6_value = /*characterClass*/ ctx[1].savingThrows.w + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*characterClass*/ 2 && t10_value !== (t10_value = /*characterClass*/ ctx[1].savingThrows.p + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*characterClass*/ 2 && t14_value !== (t14_value = /*characterClass*/ ctx[1].savingThrows.b + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*characterClass*/ 2 && t18_value !== (t18_value = /*characterClass*/ ctx[1].savingThrows.s + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*characterClass, abilityModifiers*/ 3 && t22_value !== (t22_value = /*characterClass*/ ctx[1].savingThrows.s + (/*abilityModifiers*/ ctx[0].WIS?.modifiers.magicSaves || 0) + "")) set_data_dev(t22, t22_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SavingThrows", slots, []);
    	
    	
    	let { abilityModifiers } = $$props;
    	let { characterClass } = $$props;
    	const writable_props = ["abilityModifiers", "characterClass"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SavingThrows> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("abilityModifiers" in $$props) $$invalidate(0, abilityModifiers = $$props.abilityModifiers);
    		if ("characterClass" in $$props) $$invalidate(1, characterClass = $$props.characterClass);
    	};

    	$$self.$capture_state = () => ({ abilityModifiers, characterClass });

    	$$self.$inject_state = $$props => {
    		if ("abilityModifiers" in $$props) $$invalidate(0, abilityModifiers = $$props.abilityModifiers);
    		if ("characterClass" in $$props) $$invalidate(1, characterClass = $$props.characterClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [abilityModifiers, characterClass];
    }

    class SavingThrows extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { abilityModifiers: 0, characterClass: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SavingThrows",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*abilityModifiers*/ ctx[0] === undefined && !("abilityModifiers" in props)) {
    			console.warn("<SavingThrows> was created without expected prop 'abilityModifiers'");
    		}

    		if (/*characterClass*/ ctx[1] === undefined && !("characterClass" in props)) {
    			console.warn("<SavingThrows> was created without expected prop 'characterClass'");
    		}
    	}

    	get abilityModifiers() {
    		throw new Error("<SavingThrows>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set abilityModifiers(value) {
    		throw new Error("<SavingThrows>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get characterClass() {
    		throw new Error("<SavingThrows>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set characterClass(value) {
    		throw new Error("<SavingThrows>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Combat.svelte generated by Svelte v3.34.0 */

    const file$3 = "src/Combat.svelte";

    function create_fragment$3(ctx) {
    	let table;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t2_value = /*abilityModifiers*/ ctx[0].CON?.modifiers.hp + "";
    	let t2;
    	let t3;
    	let tr1;
    	let td2;
    	let t5;
    	let td3;
    	let t6_value = 10 + (/*abilityModifiers*/ ctx[0].DEX?.modifiers.armorClass || 0) + "";
    	let t6;
    	let t7;
    	let tr2;
    	let td4;
    	let t9;
    	let td5;
    	let t10_value = (/*abilityModifiers*/ ctx[0].DEX?.modifiers.armorClass || 0) + "";
    	let t10;
    	let t11;
    	let tr3;
    	let td6;
    	let t13;
    	let td7;
    	let t14_value = /*abilityModifiers*/ ctx[0].STR?.modifiers.melee + "";
    	let t14;
    	let t15;
    	let tr4;
    	let td8;
    	let t17;
    	let td9;
    	let t18_value = /*abilityModifiers*/ ctx[0].DEX?.modifiers.missile + "";
    	let t18;

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "HP CON modifier (+/-)";
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Unarmored AC (UN)";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "AC DEX modifier (+/-)";
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Melee STR modifier (Mel)";
    			t13 = space();
    			td7 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			tr4 = element("tr");
    			td8 = element("td");
    			td8.textContent = "Missile DEX modifier (Mis)";
    			t17 = space();
    			td9 = element("td");
    			t18 = text(t18_value);
    			attr_dev(td0, "class", "font-bold");
    			add_location(td0, file$3, 6, 4, 114);
    			add_location(td1, file$3, 7, 4, 167);
    			attr_dev(tr0, "class", "bg-mint");
    			add_location(tr0, file$3, 5, 2, 89);
    			attr_dev(td2, "class", "font-bold");
    			add_location(td2, file$3, 10, 4, 232);
    			add_location(td3, file$3, 11, 4, 281);
    			add_location(tr1, file$3, 9, 2, 223);
    			attr_dev(td4, "class", "font-bold");
    			add_location(td4, file$3, 14, 4, 382);
    			add_location(td5, file$3, 15, 4, 435);
    			attr_dev(tr2, "class", "bg-mint");
    			add_location(tr2, file$3, 13, 2, 357);
    			attr_dev(td6, "class", "font-bold");
    			add_location(td6, file$3, 18, 4, 513);
    			add_location(td7, file$3, 19, 4, 569);
    			add_location(tr3, file$3, 17, 2, 504);
    			attr_dev(td8, "class", "font-bold");
    			add_location(td8, file$3, 22, 4, 653);
    			add_location(td9, file$3, 23, 4, 711);
    			attr_dev(tr4, "class", "bg-mint");
    			add_location(tr4, file$3, 21, 2, 628);
    			attr_dev(table, "class", "table-auto");
    			add_location(table, file$3, 4, 0, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(td1, t2);
    			append_dev(table, t3);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, t5);
    			append_dev(tr1, td3);
    			append_dev(td3, t6);
    			append_dev(table, t7);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, t9);
    			append_dev(tr2, td5);
    			append_dev(td5, t10);
    			append_dev(table, t11);
    			append_dev(table, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, t13);
    			append_dev(tr3, td7);
    			append_dev(td7, t14);
    			append_dev(table, t15);
    			append_dev(table, tr4);
    			append_dev(tr4, td8);
    			append_dev(tr4, t17);
    			append_dev(tr4, td9);
    			append_dev(td9, t18);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*abilityModifiers*/ 1 && t2_value !== (t2_value = /*abilityModifiers*/ ctx[0].CON?.modifiers.hp + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*abilityModifiers*/ 1 && t6_value !== (t6_value = 10 + (/*abilityModifiers*/ ctx[0].DEX?.modifiers.armorClass || 0) + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*abilityModifiers*/ 1 && t10_value !== (t10_value = (/*abilityModifiers*/ ctx[0].DEX?.modifiers.armorClass || 0) + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*abilityModifiers*/ 1 && t14_value !== (t14_value = /*abilityModifiers*/ ctx[0].STR?.modifiers.melee + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*abilityModifiers*/ 1 && t18_value !== (t18_value = /*abilityModifiers*/ ctx[0].DEX?.modifiers.missile + "")) set_data_dev(t18, t18_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Combat", slots, []);
    	
    	let { abilityModifiers } = $$props;
    	const writable_props = ["abilityModifiers"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Combat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("abilityModifiers" in $$props) $$invalidate(0, abilityModifiers = $$props.abilityModifiers);
    	};

    	$$self.$capture_state = () => ({ abilityModifiers });

    	$$self.$inject_state = $$props => {
    		if ("abilityModifiers" in $$props) $$invalidate(0, abilityModifiers = $$props.abilityModifiers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [abilityModifiers];
    }

    class Combat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { abilityModifiers: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Combat",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*abilityModifiers*/ ctx[0] === undefined && !("abilityModifiers" in props)) {
    			console.warn("<Combat> was created without expected prop 'abilityModifiers'");
    		}
    	}

    	get abilityModifiers() {
    		throw new Error("<Combat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set abilityModifiers(value) {
    		throw new Error("<Combat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Encounters.svelte generated by Svelte v3.34.0 */

    const file$2 = "src/Encounters.svelte";

    function create_fragment$2(ctx) {
    	let table;
    	let tr0;
    	let td0;
    	let td1;
    	let td2;
    	let t1_value = /*abilityModifiers*/ ctx[0].DEX?.modifiers.initiative + "";
    	let t1;
    	let t2;
    	let tr1;
    	let td3;
    	let t4;
    	let td4;
    	let t5_value = /*abilityModifiers*/ ctx[0].CHA?.modifiers.npcReactions + "";
    	let t5;

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Initiative (Init)";
    			td1 = element("td");
    			td2 = element("td");
    			t1 = text(t1_value);
    			t2 = space();
    			tr1 = element("tr");
    			td3 = element("td");
    			td3.textContent = "CHA modifier to reaction rolls (+/-)";
    			t4 = space();
    			td4 = element("td");
    			t5 = text(t5_value);
    			attr_dev(td0, "class", "font-bold");
    			add_location(td0, file$2, 6, 4, 114);
    			add_location(td1, file$2, 6, 48, 158);
    			add_location(td2, file$2, 6, 54, 164);
    			attr_dev(tr0, "class", "bg-mint");
    			add_location(tr0, file$2, 5, 2, 89);
    			attr_dev(td3, "class", "font-bold");
    			add_location(td3, file$2, 11, 4, 249);
    			add_location(td4, file$2, 12, 4, 317);
    			add_location(tr1, file$2, 10, 2, 240);
    			attr_dev(table, "class", "table-auto");
    			add_location(table, file$2, 4, 0, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, td1);
    			append_dev(tr0, td2);
    			append_dev(td2, t1);
    			append_dev(table, t2);
    			append_dev(table, tr1);
    			append_dev(tr1, td3);
    			append_dev(tr1, t4);
    			append_dev(tr1, td4);
    			append_dev(td4, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*abilityModifiers*/ 1 && t1_value !== (t1_value = /*abilityModifiers*/ ctx[0].DEX?.modifiers.initiative + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*abilityModifiers*/ 1 && t5_value !== (t5_value = /*abilityModifiers*/ ctx[0].CHA?.modifiers.npcReactions + "")) set_data_dev(t5, t5_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Encounters", slots, []);
    	
    	let { abilityModifiers } = $$props;
    	const writable_props = ["abilityModifiers"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Encounters> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("abilityModifiers" in $$props) $$invalidate(0, abilityModifiers = $$props.abilityModifiers);
    	};

    	$$self.$capture_state = () => ({ abilityModifiers });

    	$$self.$inject_state = $$props => {
    		if ("abilityModifiers" in $$props) $$invalidate(0, abilityModifiers = $$props.abilityModifiers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [abilityModifiers];
    }

    class Encounters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { abilityModifiers: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Encounters",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*abilityModifiers*/ ctx[0] === undefined && !("abilityModifiers" in props)) {
    			console.warn("<Encounters> was created without expected prop 'abilityModifiers'");
    		}
    	}

    	get abilityModifiers() {
    		throw new Error("<Encounters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set abilityModifiers(value) {
    		throw new Error("<Encounters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Exploration.svelte generated by Svelte v3.34.0 */

    const file$1 = "src/Exploration.svelte";

    function create_fragment$1(ctx) {
    	let table;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t2_value = (/*characterClass*/ ctx[1].exploration?.ld || "1-in-6") + "";
    	let t2;
    	let t3;
    	let tr1;
    	let td2;
    	let t5;
    	let td3;
    	let t6_value = /*abilityModifiers*/ ctx[0].STR?.modifiers.openDoors + "";
    	let t6;
    	let t7;
    	let tr2;
    	let td4;
    	let t9;
    	let td5;
    	let t10_value = (/*characterClass*/ ctx[1].exploration?.sd || "1-in-6") + "";
    	let t10;
    	let t11;
    	let tr3;
    	let td6;
    	let t13;
    	let td7;
    	let t14_value = (/*characterClass*/ ctx[1].exploration?.ft || "1-in-6") + "";
    	let t14;

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Listen at door (LD)";
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Open stuck door (OD)";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Find secret door (SD)";
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Find room trap (FT)";
    			t13 = space();
    			td7 = element("td");
    			t14 = text(t14_value);
    			attr_dev(td0, "class", "font-bold");
    			add_location(td0, file$1, 8, 4, 143);
    			add_location(td1, file$1, 9, 4, 194);
    			attr_dev(tr0, "class", "bg-mint");
    			add_location(tr0, file$1, 7, 2, 118);
    			attr_dev(td2, "class", "font-bold");
    			add_location(td2, file$1, 12, 4, 267);
    			add_location(td3, file$1, 13, 4, 319);
    			add_location(tr1, file$1, 11, 2, 258);
    			attr_dev(td4, "class", "font-bold");
    			add_location(td4, file$1, 16, 4, 407);
    			add_location(td5, file$1, 17, 4, 460);
    			attr_dev(tr2, "class", "bg-mint");
    			add_location(tr2, file$1, 15, 2, 382);
    			attr_dev(td6, "class", "font-bold");
    			add_location(td6, file$1, 20, 4, 533);
    			add_location(td7, file$1, 21, 4, 584);
    			add_location(tr3, file$1, 19, 2, 524);
    			attr_dev(table, "class", "table-auto");
    			add_location(table, file$1, 6, 0, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(td1, t2);
    			append_dev(table, t3);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, t5);
    			append_dev(tr1, td3);
    			append_dev(td3, t6);
    			append_dev(table, t7);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, t9);
    			append_dev(tr2, td5);
    			append_dev(td5, t10);
    			append_dev(table, t11);
    			append_dev(table, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, t13);
    			append_dev(tr3, td7);
    			append_dev(td7, t14);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*characterClass*/ 2 && t2_value !== (t2_value = (/*characterClass*/ ctx[1].exploration?.ld || "1-in-6") + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*abilityModifiers*/ 1 && t6_value !== (t6_value = /*abilityModifiers*/ ctx[0].STR?.modifiers.openDoors + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*characterClass*/ 2 && t10_value !== (t10_value = (/*characterClass*/ ctx[1].exploration?.sd || "1-in-6") + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*characterClass*/ 2 && t14_value !== (t14_value = (/*characterClass*/ ctx[1].exploration?.ft || "1-in-6") + "")) set_data_dev(t14, t14_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Exploration", slots, []);
    	
    	
    	let { abilityModifiers } = $$props;
    	let { characterClass } = $$props;
    	const writable_props = ["abilityModifiers", "characterClass"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Exploration> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("abilityModifiers" in $$props) $$invalidate(0, abilityModifiers = $$props.abilityModifiers);
    		if ("characterClass" in $$props) $$invalidate(1, characterClass = $$props.characterClass);
    	};

    	$$self.$capture_state = () => ({ abilityModifiers, characterClass });

    	$$self.$inject_state = $$props => {
    		if ("abilityModifiers" in $$props) $$invalidate(0, abilityModifiers = $$props.abilityModifiers);
    		if ("characterClass" in $$props) $$invalidate(1, characterClass = $$props.characterClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [abilityModifiers, characterClass];
    }

    class Exploration extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { abilityModifiers: 0, characterClass: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Exploration",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*abilityModifiers*/ ctx[0] === undefined && !("abilityModifiers" in props)) {
    			console.warn("<Exploration> was created without expected prop 'abilityModifiers'");
    		}

    		if (/*characterClass*/ ctx[1] === undefined && !("characterClass" in props)) {
    			console.warn("<Exploration> was created without expected prop 'characterClass'");
    		}
    	}

    	get abilityModifiers() {
    		throw new Error("<Exploration>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set abilityModifiers(value) {
    		throw new Error("<Exploration>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get characterClass() {
    		throw new Error("<Exploration>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set characterClass(value) {
    		throw new Error("<Exploration>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CON_MODIFIER_TABLE = [
        {
            lowerBound: 3,
            upperBound: 3,
            modifiers: {
                hp: -3,
            },
        },
        {
            lowerBound: 4,
            upperBound: 5,
            modifiers: {
                hp: -2,
            },
        },
        {
            lowerBound: 6,
            upperBound: 8,
            modifiers: {
                hp: -1,
            },
        },
        {
            lowerBound: 9,
            upperBound: 12,
            modifiers: {
                hp: 0,
            },
        },
        {
            lowerBound: 13,
            upperBound: 15,
            modifiers: {
                hp: 1,
            },
        },
        {
            lowerBound: 16,
            upperBound: 17,
            modifiers: {
                hp: 2,
            },
        },
        {
            lowerBound: 18,
            upperBound: 18,
            modifiers: {
                hp: 3,
            },
        },
    ];
    var WIS_MODIFIER_TABLE = [
        {
            lowerBound: 3,
            upperBound: 3,
            modifiers: {
                magicSaves: -3,
            },
        },
        {
            lowerBound: 4,
            upperBound: 5,
            modifiers: {
                magicSaves: -2,
            },
        },
        {
            lowerBound: 6,
            upperBound: 8,
            modifiers: {
                magicSaves: -1,
            },
        },
        {
            lowerBound: 9,
            upperBound: 12,
            modifiers: {
                magicSaves: 0,
            },
        },
        {
            lowerBound: 13,
            upperBound: 15,
            modifiers: {
                magicSaves: 1,
            },
        },
        {
            lowerBound: 16,
            upperBound: 17,
            modifiers: {
                magicSaves: 2,
            },
        },
        {
            lowerBound: 18,
            upperBound: 18,
            modifiers: {
                magicSaves: 3,
            },
        },
    ];
    var CHA_MODIFIER_TABLE = [
        {
            lowerBound: 3,
            upperBound: 3,
            modifiers: {
                npcReactions: -2,
                maxRetainers: 1,
                loyalty: 4,
            },
        },
        {
            lowerBound: 4,
            upperBound: 5,
            modifiers: {
                npcReactions: -1,
                maxRetainers: 2,
                loyalty: 5,
            },
        },
        {
            lowerBound: 6,
            upperBound: 8,
            modifiers: {
                npcReactions: -1,
                maxRetainers: 3,
                loyalty: 6,
            },
        },
        {
            lowerBound: 9,
            upperBound: 12,
            modifiers: {
                npcReactions: 0,
                maxRetainers: 3,
                loyalty: 7,
            },
        },
        {
            lowerBound: 13,
            upperBound: 15,
            modifiers: {
                npcReactions: 1,
                maxRetainers: 5,
                loyalty: 8,
            },
        },
        {
            lowerBound: 16,
            upperBound: 17,
            modifiers: {
                npcReactions: 1,
                maxRetainers: 6,
                loyalty: 9,
            },
        },
        {
            lowerBound: 18,
            upperBound: 18,
            modifiers: {
                npcReactions: 2,
                maxRetainers: 7,
                loyalty: 10,
            },
        },
    ];
    var DEX_MODIFIER_TABLE = [
        {
            lowerBound: 3,
            upperBound: 3,
            modifiers: {
                armorClass: -3,
                missile: -3,
                initiative: -2,
            },
        },
        {
            lowerBound: 4,
            upperBound: 5,
            modifiers: {
                armorClass: -2,
                missile: -2,
                initiative: -1,
            },
        },
        {
            lowerBound: 6,
            upperBound: 8,
            modifiers: {
                armorClass: -1,
                missile: -1,
                initiative: -1,
            },
        },
        {
            lowerBound: 9,
            upperBound: 12,
            modifiers: {
                armorClass: 0,
                missile: 0,
                initiative: 0,
            },
        },
        {
            lowerBound: 13,
            upperBound: 15,
            modifiers: {
                armorClass: 1,
                missile: 1,
                initiative: 1,
            },
        },
        {
            lowerBound: 16,
            upperBound: 17,
            modifiers: {
                armorClass: 2,
                missile: 2,
                initiative: 1,
            },
        },
        {
            lowerBound: 18,
            upperBound: 18,
            modifiers: {
                armorClass: 3,
                missile: 3,
                initiative: 2,
            },
        },
    ];
    var INT_MODIFIER_TABLE = [
        {
            lowerBound: 3,
            upperBound: 3,
            modifiers: {
                spokenLanguages: "Native (broken speech)",
                literacy: "Illiterate",
            },
        },
        {
            lowerBound: 4,
            upperBound: 5,
            modifiers: {
                spokenLanguages: "Native",
                literacy: "Illiterate",
            },
        },
        {
            lowerBound: 6,
            upperBound: 8,
            modifiers: {
                spokenLanguages: "Native",
                literacy: "Basic",
            },
        },
        {
            lowerBound: 9,
            upperBound: 12,
            modifiers: {
                spokenLanguages: "Native",
                literacy: "Literate",
            },
        },
        {
            lowerBound: 13,
            upperBound: 15,
            modifiers: {
                spokenLanguages: "Native +1 additional",
                literacy: "Literate",
            },
        },
        {
            lowerBound: 16,
            upperBound: 17,
            modifiers: {
                spokenLanguages: "Native +2 additional",
                literacy: "Literate",
            },
        },
        {
            lowerBound: 18,
            upperBound: 18,
            modifiers: {
                spokenLanguages: "Native +3 additional",
                literacy: "Literate",
            },
        },
    ];
    var STR_MODIFIER_TABLE = [
        {
            lowerBound: 3,
            upperBound: 3,
            modifiers: {
                melee: -3,
                openDoors: "1-in-6",
            },
        },
        {
            lowerBound: 4,
            upperBound: 5,
            modifiers: {
                melee: -2,
                openDoors: "1-in-6",
            },
        },
        {
            lowerBound: 6,
            upperBound: 8,
            modifiers: {
                melee: -1,
                openDoors: "1-in-6",
            },
        },
        {
            lowerBound: 9,
            upperBound: 12,
            modifiers: {
                melee: 0,
                openDoors: "2-in-6",
            },
        },
        {
            lowerBound: 13,
            upperBound: 15,
            modifiers: {
                melee: 1,
                openDoors: "3-in-6",
            },
        },
        {
            lowerBound: 16,
            upperBound: 17,
            modifiers: {
                melee: 2,
                openDoors: "4-in-6",
            },
        },
        {
            lowerBound: 18,
            upperBound: 18,
            modifiers: {
                melee: 3,
                openDoors: "5-in-6",
            },
        },
    ];
    var getModifier = function (table) { return function (abilityScore) {
        return table.find(function (row) { return row.lowerBound <= abilityScore && row.upperBound >= abilityScore; });
    }; };
    var getSTRModifier = getModifier(STR_MODIFIER_TABLE);
    var getINTModifier = getModifier(INT_MODIFIER_TABLE);
    var getDEXModifier = getModifier(DEX_MODIFIER_TABLE);
    var getCHAModifier = getModifier(CHA_MODIFIER_TABLE);
    var getWISModifier = getModifier(WIS_MODIFIER_TABLE);
    var getCONModifier = getModifier(CON_MODIFIER_TABLE);

    var defaultPrimeRequisiteModifierTableForAbility = function (ability) { return [
        { condition: { type: "IN_RANGE", ability: ability, min: 3, max: 5 }, result: -0.2 },
        { condition: { type: "IN_RANGE", ability: ability, min: 6, max: 8 }, result: -0.1 },
        { condition: { type: "IN_RANGE", ability: ability, min: 13, max: 15 }, result: 0.05 },
        { condition: { type: "IN_RANGE", ability: ability, min: 16, max: 18 }, result: 0.1 },
    ]; };

    var cleric = {
        name: "Cleric",
        primeRequisites: ["WIS"],
        primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("WIS"),
        hitDice: "1d6",
        languages: ["Alignment", "Common"],
        weapons: "Any blunt weapons",
        armor: "Any, including shields",
        specialAbilities: [
            "Divine Magic",
            "Turning the Undead",
            "Spell Casting (level 2+)",
        ],
        savingThrows: {
            d: 11,
            w: 12,
            p: 14,
            b: 16,
            s: 15,
        },
        expToNextLevel: 1500,
    };

    var dwarf = {
        name: "Dwarf",
        primeRequisites: ["STR"],
        primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("STR"),
        hitDice: "1d8",
        languages: ["Alignment", "Common", "Dwarvish", "Gnomish", "Goblin", "Kobold"],
        abilityMinimums: [{ ability: "CON", minimum: 9 }],
        armor: "Any, including shields",
        weapons: "Small or normal sized",
        specialAbilities: [
            "Detect Construction Tricks",
            "Detect Room Traps",
            "Infravision",
            "Listening at Doors",
            "Establish Underground Stronghold (level 9+)",
        ],
        savingThrows: {
            d: 8,
            w: 9,
            p: 10,
            b: 13,
            s: 12,
        },
        expToNextLevel: 2200,
    };

    var elf = {
        name: "Elf",
        primeRequisites: ["INT", "STR"],
        primeRequisiteModifier: [
            {
                condition: {
                    type: "AND",
                    first: { type: "IN_RANGE", ability: "INT", min: 16, max: 18 },
                    second: { type: "IN_RANGE", ability: "STR", min: 13, max: 18 },
                },
                result: 0.1,
            },
            {
                condition: {
                    type: "AND",
                    first: { type: "IN_RANGE", ability: "INT", min: 15, max: 15 },
                    second: { type: "IN_RANGE", ability: "STR", min: 13, max: 18 },
                },
                result: 0.05,
            },
        ],
        hitDice: "1d6",
        languages: ["Alignment", "Common", "Elvish", "Gnoll", "Hobgoblin", "Orcish"],
        abilityMinimums: [{ ability: "INT", minimum: 9 }],
        armor: "Any, including shields",
        weapons: "Any",
        specialAbilities: [
            "Arcane Magic",
            "Detect Secret Doors",
            "Immunity to Ghoul Paralysis",
            "Infravision",
            "Listening at Doors",
        ],
        savingThrows: {
            d: 12,
            w: 13,
            p: 13,
            b: 15,
            s: 15,
        },
        exploration: {
            sd: "2-in-6",
        },
        expToNextLevel: 4000,
    };

    var fighter = {
        name: "Fighter",
        primeRequisites: ["STR"],
        primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("STR"),
        hitDice: "1d8",
        languages: ["Alignment", "Common"],
        armor: "Any, including shields",
        weapons: "Any",
        specialAbilities: ["Stronghold", "Become Baron/Baroness (level 9+)"],
        savingThrows: {
            d: 12,
            w: 13,
            p: 14,
            b: 15,
            s: 16,
        },
        expToNextLevel: 2000,
    };

    var halfling$1 = {
        name: "Halfling",
        primeRequisites: ["DEX", "STR"],
        primeRequisiteModifier: [
            {
                condition: {
                    type: "AND",
                    first: { type: "IN_RANGE", ability: "DEX", min: 16, max: 18 },
                    second: { type: "IN_RANGE", ability: "STR", min: 16, max: 18 },
                },
                result: 0.1,
            },
            {
                condition: {
                    type: "OR",
                    first: { type: "IN_RANGE", ability: "DEX", min: 13, max: 15 },
                    second: { type: "IN_RANGE", ability: "STR", min: 13, max: 15 },
                },
                result: 0.05,
            },
        ],
        hitDice: "1d6",
        languages: ["Alignment", "Common", "Halfling"],
        abilityMinimums: [
            { ability: "CON", minimum: 9 },
            { ability: "DEX", minimum: 9 },
        ],
        armor: "Any appropriate to size, including shields",
        weapons: "Any appropriate to size",
        specialAbilities: [
            "Defensive Bonus",
            "Hiding",
            "Initiative Bonus",
            "Listening at Doors",
            "Missle Attack Bonus",
            "Stronghold",
        ],
        savingThrows: {
            d: 8,
            w: 9,
            p: 10,
            b: 13,
            s: 12,
        },
        expToNextLevel: 2000,
    };

    var magicUser = {
        name: "Magic User",
        primeRequisites: ["INT"],
        primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("INT"),
        hitDice: "1d4",
        languages: ["Alignment", "Common"],
        armor: "None",
        weapons: "Dagger",
        specialAbilities: ["Arcane Magic", "Establish Stronghold (level 11+)"],
        savingThrows: {
            d: 13,
            w: 14,
            p: 13,
            b: 16,
            s: 15,
        },
        expToNextLevel: 2500,
    };

    var halfling = {
        name: "Thief",
        primeRequisites: ["DEX"],
        primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("DEX"),
        hitDice: "1d4",
        languages: ["Alignment", "Common"],
        armor: "Leather, no shields",
        weapons: "Any",
        specialAbilities: [
            "Backstab",
            "Climb Sheer Surfaces",
            "Find or Remove Treasure Traps",
            "Hear Noise",
            "Move Silently",
            "Open Locks",
            "Pick Pockets",
            "Read Languages (level 4+)",
            "Scroll Use (level 10+)",
            "Establish thief den (level 9+)",
        ],
        savingThrows: {
            d: 13,
            w: 14,
            p: 13,
            b: 16,
            s: 15,
        },
        expToNextLevel: 1200,
    };

    var all = [cleric, dwarf, elf, fighter, halfling$1, magicUser, halfling];

    var characterClasses = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cleric: cleric,
        dwarf: dwarf,
        elf: elf,
        fighter: fighter,
        halfling: halfling$1,
        magicUser: magicUser,
        thief: halfling,
        all: all
    });

    var calculatePrimeRequisiteModifierDisplay = function (calculation, abilityBlock) {
        return displayPrimeRequisite(calculatePrimeRequisiteModifier(calculation, abilityBlock));
    };
    var displayPrimeRequisite = function (modifier) {
        switch (modifier) {
            case -0.2:
                return "-20%";
            case -0.1:
                return "-10%";
            case 0:
                return "None";
            case 0.05:
                return "+5%";
            case 0.1:
                return "+10%";
        }
    };
    var calculatePrimeRequisiteModifier = function (calculation, abilityBlock) {
        var firstMatchingCondition = find(function (x) {
            return evaluateCondition(abilityBlock, x.condition);
        })(calculation);
        if (firstMatchingCondition) {
            return firstMatchingCondition.result;
        }
        return 0;
    };
    var evaluateCondition = function (abilityBlock, condition) {
        switch (condition.type) {
            case "IN_RANGE":
                var ability = abilityBlock[condition.ability];
                return ability >= condition.min && ability <= condition.max;
            case "AND":
                return (evaluateCondition(abilityBlock, condition.first) &&
                    evaluateCondition(abilityBlock, condition.second));
            case "OR":
                return (evaluateCondition(abilityBlock, condition.first) ||
                    evaluateCondition(abilityBlock, condition.second));
        }
    };

    /* src/App.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    // (136:6) {#each selectedCharacterClass === null ? availableCharacterClasses : [selectedCharacterClass] as cc, idx}
    function create_each_block_2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*cc*/ ctx[23].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*cc*/ ctx[23].armor + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*cc*/ ctx[23].weapons + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*cc*/ ctx[23].hitDice + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*cc*/ ctx[23].languages.join(", ") + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*cc*/ ctx[23].specialAbilities.join(", ") + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = calculatePrimeRequisiteModifierDisplay(/*cc*/ ctx[23].primeRequisiteModifier, /*rolledAbilities*/ ctx[5]) + "";
    	let t12;
    	let t13;
    	let tr_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			attr_dev(td0, "class", "p-4 font-bold");
    			set_style(td0, "font-family", "ScalaSans-Regular");
    			add_location(td0, file, 144, 10, 4753);
    			attr_dev(td1, "class", "p-4");
    			set_style(td1, "margin-top", "2px");
    			add_location(td1, file, 147, 10, 4868);
    			attr_dev(td2, "class", "p-4");
    			add_location(td2, file, 148, 10, 4935);
    			attr_dev(td3, "class", "p-4");
    			add_location(td3, file, 149, 10, 4979);
    			attr_dev(td4, "class", "p-4");
    			add_location(td4, file, 150, 10, 5023);
    			attr_dev(td5, "class", "p-4");
    			add_location(td5, file, 151, 10, 5080);
    			attr_dev(td6, "class", "p-4");
    			add_location(td6, file, 152, 10, 5144);

    			attr_dev(tr, "class", tr_class_value = `${/*idx*/ ctx[25] % 2 === 0 ? "bg-mint" : ""} ${/*selectedCharacterClass*/ ctx[1] === null
			? "cursor-pointer hover:bg-dark-gray text-dark-gray hover:text-white"
			: ""}`);

    			add_location(tr, file, 136, 8, 4460);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			append_dev(td6, t12);
    			append_dev(tr, t13);

    			if (!mounted) {
    				dispose = listen_dev(
    					tr,
    					"click",
    					function () {
    						if (is_function(/*onSelectCharacterClass*/ ctx[7](/*cc*/ ctx[23].name))) /*onSelectCharacterClass*/ ctx[7](/*cc*/ ctx[23].name).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*selectedCharacterClass*/ 2 && t0_value !== (t0_value = /*cc*/ ctx[23].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*selectedCharacterClass*/ 2 && t2_value !== (t2_value = /*cc*/ ctx[23].armor + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*selectedCharacterClass*/ 2 && t4_value !== (t4_value = /*cc*/ ctx[23].weapons + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*selectedCharacterClass*/ 2 && t6_value !== (t6_value = /*cc*/ ctx[23].hitDice + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*selectedCharacterClass*/ 2 && t8_value !== (t8_value = /*cc*/ ctx[23].languages.join(", ") + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*selectedCharacterClass*/ 2 && t10_value !== (t10_value = /*cc*/ ctx[23].specialAbilities.join(", ") + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*selectedCharacterClass*/ 2 && t12_value !== (t12_value = calculatePrimeRequisiteModifierDisplay(/*cc*/ ctx[23].primeRequisiteModifier, /*rolledAbilities*/ ctx[5]) + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*selectedCharacterClass*/ 2 && tr_class_value !== (tr_class_value = `${/*idx*/ ctx[25] % 2 === 0 ? "bg-mint" : ""} ${/*selectedCharacterClass*/ ctx[1] === null
			? "cursor-pointer hover:bg-dark-gray text-dark-gray hover:text-white"
			: ""}`)) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(136:6) {#each selectedCharacterClass === null ? availableCharacterClasses : [selectedCharacterClass] as cc, idx}",
    		ctx
    	});

    	return block;
    }

    // (164:2) {#if selectedCharacterClass !== null}
    function create_if_block_1(ctx) {
    	let h2;

    	let t0_value = (/*selectedCharacterClass*/ ctx[1] !== null && /*selectedAlignment*/ ctx[2] === null
    	? "Choose Alignment"
    	: "Alignment") + "";

    	let t0;
    	let t1;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*selectedAlignment*/ ctx[2] === null) return create_if_block_2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			set_style(h2, "font-family", "ScalaSans-Regular");
    			attr_dev(h2, "class", "pb-2 text-2xl font-bold");
    			add_location(h2, file, 164, 4, 5411);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedCharacterClass, selectedAlignment*/ 6 && t0_value !== (t0_value = (/*selectedCharacterClass*/ ctx[1] !== null && /*selectedAlignment*/ ctx[2] === null
    			? "Choose Alignment"
    			: "Alignment") + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(164:2) {#if selectedCharacterClass !== null}",
    		ctx
    	});

    	return block;
    }

    // (177:4) {:else}
    function create_else_block(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*selectedAlignment*/ ctx[2]);
    			attr_dev(div, "class", "pb-6");
    			add_location(div, file, 177, 6, 6038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedAlignment*/ 4) set_data_dev(t, /*selectedAlignment*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(177:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (170:4) {#if selectedAlignment === null}
    function create_if_block_2(ctx) {
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Select Alignment";
    			option1 = element("option");
    			option1.textContent = `${"Chaotic"}`;
    			option2 = element("option");
    			option2.textContent = `${"Neutral"}`;
    			option3 = element("option");
    			option3.textContent = `${"Lawful"}`;
    			attr_dev(option0, "class", "py-1");
    			option0.__value = null;
    			option0.value = option0.__value;
    			add_location(option0, file, 171, 8, 5742);
    			attr_dev(option1, "class", "py-1");
    			option1.__value = "Chaotic";
    			option1.value = option1.__value;
    			add_location(option1, file, 172, 8, 5810);
    			attr_dev(option2, "class", "py-1");
    			option2.__value = "Neutral";
    			option2.value = option2.__value;
    			add_location(option2, file, 173, 8, 5878);
    			attr_dev(option3, "class", "py-1");
    			option3.__value = "Lawful";
    			option3.value = option3.__value;
    			add_location(option3, file, 174, 8, 5946);
    			attr_dev(select, "name", "alignment");
    			attr_dev(select, "id", "alignment");
    			if (/*selectedAlignment*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[13].call(select));
    			add_location(select, file, 170, 6, 5662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			select_option(select, /*selectedAlignment*/ ctx[2]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedAlignment*/ 4) {
    				select_option(select, /*selectedAlignment*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(170:4) {#if selectedAlignment === null}",
    		ctx
    	});

    	return block;
    }

    // (183:2) {#if selectedCharacterClass !== null && selectedAlignment !== null}
    function create_if_block(ctx) {
    	let h2;
    	let t1;
    	let div6;
    	let div5;
    	let div0;
    	let t2;
    	let div3;
    	let div1;
    	let t4;
    	let div2;
    	let t5;
    	let t6;
    	let div4;
    	let t7;
    	let div7;
    	let t8;
    	let div12;
    	let div9;
    	let div8;
    	let t10;
    	let combat;
    	let t11;
    	let div11;
    	let div10;
    	let t13;
    	let savingthrows;
    	let t14;
    	let div17;
    	let div14;
    	let div13;
    	let t16;
    	let encounters;
    	let t17;
    	let div16;
    	let div15;
    	let t19;
    	let exploration;
    	let current;
    	let each_value_1 = difference(/*adjustableAbilities*/ ctx[8], /*selectedCharacterClass*/ ctx[1].primeRequisites);
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*selectedCharacterClass*/ ctx[1].primeRequisites;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	combat = new Combat({
    			props: {
    				abilityModifiers: /*abilityModifiers*/ ctx[4]
    			},
    			$$inline: true
    		});

    	savingthrows = new SavingThrows({
    			props: {
    				abilityModifiers: /*abilityModifiers*/ ctx[4],
    				characterClass: /*selectedCharacterClass*/ ctx[1]
    			},
    			$$inline: true
    		});

    	encounters = new Encounters({
    			props: {
    				abilityModifiers: /*abilityModifiers*/ ctx[4]
    			},
    			$$inline: true
    		});

    	exploration = new Exploration({
    			props: {
    				abilityModifiers: /*abilityModifiers*/ ctx[4],
    				characterClass: /*selectedCharacterClass*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Adjust Prime Requisite Abilities";
    			t1 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "Ability Points";
    			t4 = space();
    			div2 = element("div");
    			t5 = text(/*adjustmentPointPool*/ ctx[3]);
    			t6 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div7 = element("div");
    			t8 = space();
    			div12 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div8.textContent = "Combat";
    			t10 = space();
    			create_component(combat.$$.fragment);
    			t11 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div10.textContent = "Saving Throws";
    			t13 = space();
    			create_component(savingthrows.$$.fragment);
    			t14 = space();
    			div17 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div13.textContent = "Encounters";
    			t16 = space();
    			create_component(encounters.$$.fragment);
    			t17 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div15.textContent = "Exploration";
    			t19 = space();
    			create_component(exploration.$$.fragment);
    			set_style(h2, "font-family", "ScalaSans-Regular");
    			attr_dev(h2, "class", "pb-2 text-2xl font-bold");
    			add_location(h2, file, 183, 4, 6190);
    			attr_dev(div0, "class", "w-48 justify-end flex p-4");
    			add_location(div0, file, 188, 8, 6417);
    			add_location(div1, file, 210, 10, 7522);
    			attr_dev(div2, "class", "font-bold");
    			add_location(div2, file, 211, 10, 7558);
    			attr_dev(div3, "class", "p-2 text-xl flex flex-col align-middle justify-center");
    			add_location(div3, file, 209, 8, 7444);
    			attr_dev(div4, "class", "w-48 flex justify-start p-4");
    			add_location(div4, file, 213, 8, 7632);
    			attr_dev(div5, "class", "w-auto flex justify-between");
    			add_location(div5, file, 187, 6, 6367);
    			attr_dev(div6, "class", "w-full flex justify-center");
    			add_location(div6, file, 186, 4, 6320);
    			add_location(div7, file, 236, 4, 8650);
    			add_location(div8, file, 239, 8, 8744);
    			attr_dev(div9, "class", "p-8");
    			add_location(div9, file, 238, 6, 8718);
    			add_location(div10, file, 243, 8, 8845);
    			attr_dev(div11, "class", "p-8");
    			add_location(div11, file, 242, 6, 8819);
    			attr_dev(div12, "class", "w-full flex flex-row justify-center");
    			add_location(div12, file, 237, 4, 8662);
    			add_location(div13, file, 252, 8, 9092);
    			attr_dev(div14, "class", "p-8");
    			add_location(div14, file, 251, 6, 9066);
    			add_location(div15, file, 256, 8, 9201);
    			attr_dev(div16, "class", "p-8");
    			add_location(div16, file, 255, 6, 9175);
    			attr_dev(div17, "class", "w-full flex flex-row justify-center");
    			add_location(div17, file, 250, 4, 9010);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div5, t2);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, t5);
    			append_dev(div5, t6);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			insert_dev(target, t7, anchor);
    			insert_dev(target, div7, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div9);
    			append_dev(div9, div8);
    			append_dev(div9, t10);
    			mount_component(combat, div9, null);
    			append_dev(div12, t11);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div11, t13);
    			mount_component(savingthrows, div11, null);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div14);
    			append_dev(div14, div13);
    			append_dev(div14, t16);
    			mount_component(encounters, div14, null);
    			append_dev(div17, t17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div16, t19);
    			mount_component(exploration, div16, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*decrementBaseAbility, difference, adjustableAbilities, selectedCharacterClass, adjustedAbilities, incrementBaseAbility*/ 1795) {
    				each_value_1 = difference(/*adjustableAbilities*/ ctx[8], /*selectedCharacterClass*/ ctx[1].primeRequisites);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*adjustmentPointPool*/ 8) set_data_dev(t5, /*adjustmentPointPool*/ ctx[3]);

    			if (dirty & /*decrementPrimeAbility, selectedCharacterClass, adjustedAbilities, incrementPrimeAbility*/ 6147) {
    				each_value = /*selectedCharacterClass*/ ctx[1].primeRequisites;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			const combat_changes = {};
    			if (dirty & /*abilityModifiers*/ 16) combat_changes.abilityModifiers = /*abilityModifiers*/ ctx[4];
    			combat.$set(combat_changes);
    			const savingthrows_changes = {};
    			if (dirty & /*abilityModifiers*/ 16) savingthrows_changes.abilityModifiers = /*abilityModifiers*/ ctx[4];
    			if (dirty & /*selectedCharacterClass*/ 2) savingthrows_changes.characterClass = /*selectedCharacterClass*/ ctx[1];
    			savingthrows.$set(savingthrows_changes);
    			const encounters_changes = {};
    			if (dirty & /*abilityModifiers*/ 16) encounters_changes.abilityModifiers = /*abilityModifiers*/ ctx[4];
    			encounters.$set(encounters_changes);
    			const exploration_changes = {};
    			if (dirty & /*abilityModifiers*/ 16) exploration_changes.abilityModifiers = /*abilityModifiers*/ ctx[4];
    			if (dirty & /*selectedCharacterClass*/ 2) exploration_changes.characterClass = /*selectedCharacterClass*/ ctx[1];
    			exploration.$set(exploration_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(combat.$$.fragment, local);
    			transition_in(savingthrows.$$.fragment, local);
    			transition_in(encounters.$$.fragment, local);
    			transition_in(exploration.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(combat.$$.fragment, local);
    			transition_out(savingthrows.$$.fragment, local);
    			transition_out(encounters.$$.fragment, local);
    			transition_out(exploration.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div12);
    			destroy_component(combat);
    			destroy_component(savingthrows);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div17);
    			destroy_component(encounters);
    			destroy_component(exploration);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(183:2) {#if selectedCharacterClass !== null && selectedAlignment !== null}",
    		ctx
    	});

    	return block;
    }

    // (190:10) {#each difference(adjustableAbilities, selectedCharacterClass.primeRequisites) as ba}
    function create_each_block_1(ctx) {
    	let div4;
    	let div0;
    	let chevronup24;
    	let t0;
    	let div1;
    	let t1_value = /*ba*/ ctx[20] + "";
    	let t1;
    	let t2;
    	let div2;
    	let t3_value = /*adjustedAbilities*/ ctx[0][/*ba*/ ctx[20]] + "";
    	let t3;
    	let t4;
    	let div3;
    	let chevrondown24;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	chevronup24 = new ChevronUp24({ $$inline: true });
    	chevrondown24 = new ChevronDown24({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			create_component(chevronup24.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			create_component(chevrondown24.$$.fragment);
    			t5 = space();
    			attr_dev(div0, "class", "w-10 h-10 select-none flex justify-center align-middle bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold");
    			add_location(div0, file, 191, 14, 6624);
    			attr_dev(div1, "class", "text-xl");
    			add_location(div1, file, 197, 14, 6929);
    			attr_dev(div2, "class", "text-xl");
    			add_location(div2, file, 198, 14, 6975);
    			attr_dev(div3, "class", "w-10 h-10 select-none flex justify-center align-middle bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold");
    			set_style(div3, "transform", "rotate(180deg)");
    			add_location(div3, file, 199, 14, 7040);
    			attr_dev(div4, "class", "p-2 flex flex-col align-middle");
    			add_location(div4, file, 190, 12, 6565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			mount_component(chevronup24, div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			mount_component(chevrondown24, div3, null);
    			append_dev(div4, t5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div0,
    						"click",
    						function () {
    							if (is_function(/*incrementBaseAbility*/ ctx[10](/*ba*/ ctx[20]))) /*incrementBaseAbility*/ ctx[10](/*ba*/ ctx[20]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div3,
    						"click",
    						function () {
    							if (is_function(/*decrementBaseAbility*/ ctx[9](/*ba*/ ctx[20]))) /*decrementBaseAbility*/ ctx[9](/*ba*/ ctx[20]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*selectedCharacterClass*/ 2) && t1_value !== (t1_value = /*ba*/ ctx[20] + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*adjustedAbilities, selectedCharacterClass*/ 3) && t3_value !== (t3_value = /*adjustedAbilities*/ ctx[0][/*ba*/ ctx[20]] + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronup24.$$.fragment, local);
    			transition_in(chevrondown24.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronup24.$$.fragment, local);
    			transition_out(chevrondown24.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(chevronup24);
    			destroy_component(chevrondown24);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(190:10) {#each difference(adjustableAbilities, selectedCharacterClass.primeRequisites) as ba}",
    		ctx
    	});

    	return block;
    }

    // (215:10) {#each selectedCharacterClass.primeRequisites as pr}
    function create_each_block(ctx) {
    	let div4;
    	let div0;
    	let chevronup24;
    	let t0;
    	let div1;
    	let t1_value = /*pr*/ ctx[17] + "";
    	let t1;
    	let t2;
    	let div2;
    	let t3_value = /*adjustedAbilities*/ ctx[0][/*pr*/ ctx[17]] + "";
    	let t3;
    	let t4;
    	let div3;
    	let chevrondown24;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	chevronup24 = new ChevronUp24({ $$inline: true });
    	chevrondown24 = new ChevronDown24({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			create_component(chevronup24.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			create_component(chevrondown24.$$.fragment);
    			t5 = space();
    			attr_dev(div0, "class", "w-10 h-10 select-none flex justify-center align-middle bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold");
    			add_location(div0, file, 216, 14, 7808);
    			attr_dev(div1, "class", "text-xl");
    			add_location(div1, file, 222, 14, 8114);
    			attr_dev(div2, "class", "text-xl");
    			add_location(div2, file, 223, 14, 8160);
    			attr_dev(div3, "class", "w-10 h-10 select-none flex justify-center align-middle bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold");
    			set_style(div3, "transform", "rotate(180deg)");
    			add_location(div3, file, 224, 14, 8225);
    			attr_dev(div4, "class", "p-2 flex flex-col align-middle");
    			add_location(div4, file, 215, 12, 7749);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			mount_component(chevronup24, div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			mount_component(chevrondown24, div3, null);
    			append_dev(div4, t5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div0,
    						"click",
    						function () {
    							if (is_function(/*incrementPrimeAbility*/ ctx[11](/*pr*/ ctx[17]))) /*incrementPrimeAbility*/ ctx[11](/*pr*/ ctx[17]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div3,
    						"click",
    						function () {
    							if (is_function(/*decrementPrimeAbility*/ ctx[12](/*pr*/ ctx[17]))) /*decrementPrimeAbility*/ ctx[12](/*pr*/ ctx[17]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*selectedCharacterClass*/ 2) && t1_value !== (t1_value = /*pr*/ ctx[17] + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*adjustedAbilities, selectedCharacterClass*/ 3) && t3_value !== (t3_value = /*adjustedAbilities*/ ctx[0][/*pr*/ ctx[17]] + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronup24.$$.fragment, local);
    			transition_in(chevrondown24.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronup24.$$.fragment, local);
    			transition_out(chevrondown24.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(chevronup24);
    			destroy_component(chevrondown24);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(215:10) {#each selectedCharacterClass.primeRequisites as pr}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div22;
    	let h1;
    	let t1;
    	let div20;
    	let div19;
    	let div2;
    	let div0;
    	let t3;
    	let div1;
    	let t5;
    	let div5;
    	let div3;
    	let t7;
    	let div4;
    	let t9;
    	let div9;
    	let div8;
    	let div6;
    	let t11;
    	let div7;
    	let t13;
    	let div12;
    	let div10;
    	let t15;
    	let div11;
    	let t17;
    	let div15;
    	let div13;
    	let t19;
    	let div14;
    	let t21;
    	let div18;
    	let div16;
    	let t23;
    	let div17;
    	let t25;
    	let h2;

    	let t26_value = (/*selectedCharacterClass*/ ctx[1] !== null
    	? "Character Class"
    	: "Choose Available Class") + "";

    	let t26;
    	let t27;
    	let div21;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t29;
    	let th1;
    	let t31;
    	let th2;
    	let t33;
    	let th3;
    	let t35;
    	let th4;
    	let t37;
    	let th5;
    	let t39;
    	let th6;
    	let t41;
    	let t42;
    	let t43;
    	let current;

    	let each_value_2 = /*selectedCharacterClass*/ ctx[1] === null
    	? /*availableCharacterClasses*/ ctx[6]
    	: [/*selectedCharacterClass*/ ctx[1]];

    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let if_block0 = /*selectedCharacterClass*/ ctx[1] !== null && create_if_block_1(ctx);
    	let if_block1 = /*selectedCharacterClass*/ ctx[1] !== null && /*selectedAlignment*/ ctx[2] !== null && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div22 = element("div");
    			h1 = element("h1");
    			h1.textContent = "BX D&D Character Creator";
    			t1 = space();
    			div20 = element("div");
    			div19 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "STR";
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = `${/*rolledAbilities*/ ctx[5].STR}`;
    			t5 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "INT";
    			t7 = space();
    			div4 = element("div");
    			div4.textContent = `${/*rolledAbilities*/ ctx[5].INT}`;
    			t9 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div6 = element("div");
    			div6.textContent = "WIS";
    			t11 = space();
    			div7 = element("div");
    			div7.textContent = `${/*rolledAbilities*/ ctx[5].WIS}`;
    			t13 = space();
    			div12 = element("div");
    			div10 = element("div");
    			div10.textContent = "DEX";
    			t15 = space();
    			div11 = element("div");
    			div11.textContent = `${/*rolledAbilities*/ ctx[5].DEX}`;
    			t17 = space();
    			div15 = element("div");
    			div13 = element("div");
    			div13.textContent = "CON";
    			t19 = space();
    			div14 = element("div");
    			div14.textContent = `${/*rolledAbilities*/ ctx[5].CON}`;
    			t21 = space();
    			div18 = element("div");
    			div16 = element("div");
    			div16.textContent = "CHA";
    			t23 = space();
    			div17 = element("div");
    			div17.textContent = `${/*rolledAbilities*/ ctx[5].CHA}`;
    			t25 = space();
    			h2 = element("h2");
    			t26 = text(t26_value);
    			t27 = space();
    			div21 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Class";
    			t29 = space();
    			th1 = element("th");
    			th1.textContent = "Armor";
    			t31 = space();
    			th2 = element("th");
    			th2.textContent = "Weapons";
    			t33 = space();
    			th3 = element("th");
    			th3.textContent = "HD";
    			t35 = space();
    			th4 = element("th");
    			th4.textContent = "Languages";
    			t37 = space();
    			th5 = element("th");
    			th5.textContent = "Special Abilities";
    			t39 = space();
    			th6 = element("th");
    			th6.textContent = "EXP modifier";
    			t41 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t42 = space();
    			if (if_block0) if_block0.c();
    			t43 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h1, "class", "text-5xl pt-8 pb-7");
    			set_style(h1, "font-family", "BungeeShade");
    			add_location(h1, file, 71, 2, 2674);
    			add_location(div0, file, 80, 8, 3009);
    			add_location(div1, file, 81, 8, 3032);
    			attr_dev(div2, "class", "flex flex-col align-middle");
    			add_location(div2, file, 79, 6, 2960);
    			add_location(div3, file, 86, 8, 3118);
    			add_location(div4, file, 87, 8, 3141);
    			add_location(div5, file, 85, 6, 3104);
    			add_location(div6, file, 93, 10, 3243);
    			add_location(div7, file, 94, 10, 3268);
    			add_location(div8, file, 92, 8, 3227);
    			add_location(div9, file, 91, 6, 3213);
    			add_location(div10, file, 100, 8, 3373);
    			add_location(div11, file, 101, 8, 3396);
    			add_location(div12, file, 99, 6, 3359);
    			add_location(div13, file, 106, 8, 3482);
    			add_location(div14, file, 107, 8, 3505);
    			add_location(div15, file, 105, 6, 3468);
    			add_location(div16, file, 112, 8, 3591);
    			add_location(div17, file, 113, 8, 3614);
    			add_location(div18, file, 111, 6, 3577);
    			attr_dev(div19, "class", "w-1/3 flex flex-row justify-between text-2xl");
    			add_location(div19, file, 78, 4, 2895);
    			attr_dev(div20, "class", "pt-8 pb-16 w-full flex flex-row justify-center");
    			set_style(div20, "font-family", "ScalaSans-Regular");
    			add_location(div20, file, 74, 2, 2779);
    			set_style(h2, "font-family", "ScalaSans-Regular");
    			attr_dev(h2, "class", "pb-2 text-2xl font-bold");
    			add_location(h2, file, 117, 2, 3682);
    			attr_dev(th0, "class", "p-4");
    			add_location(th0, file, 126, 10, 4040);
    			attr_dev(th1, "class", "p-4");
    			add_location(th1, file, 127, 10, 4077);
    			attr_dev(th2, "class", "p-4");
    			add_location(th2, file, 128, 10, 4114);
    			attr_dev(th3, "class", "p-4");
    			add_location(th3, file, 129, 10, 4153);
    			attr_dev(th4, "class", "p-4");
    			add_location(th4, file, 130, 10, 4187);
    			attr_dev(th5, "class", "p-4");
    			add_location(th5, file, 131, 10, 4228);
    			attr_dev(th6, "class", "p-4");
    			add_location(th6, file, 132, 10, 4277);
    			add_location(tr, file, 125, 8, 4025);
    			add_location(thead, file, 124, 6, 4009);
    			attr_dev(table, "class", "w-full table-auto");
    			set_style(table, "font-family", "ScalaSans-Regular");
    			add_location(table, file, 123, 4, 3930);
    			attr_dev(div21, "class", "pr-16 pl-16 pb-8 flex flex-row justify-center");
    			add_location(div21, file, 122, 2, 3866);
    			attr_dev(div22, "class", "text-center text-dark-gray");
    			add_location(div22, file, 70, 0, 2631);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div22, anchor);
    			append_dev(div22, h1);
    			append_dev(div22, t1);
    			append_dev(div22, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div19, t5);
    			append_dev(div19, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div19, t9);
    			append_dev(div19, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t11);
    			append_dev(div8, div7);
    			append_dev(div19, t13);
    			append_dev(div19, div12);
    			append_dev(div12, div10);
    			append_dev(div12, t15);
    			append_dev(div12, div11);
    			append_dev(div19, t17);
    			append_dev(div19, div15);
    			append_dev(div15, div13);
    			append_dev(div15, t19);
    			append_dev(div15, div14);
    			append_dev(div19, t21);
    			append_dev(div19, div18);
    			append_dev(div18, div16);
    			append_dev(div18, t23);
    			append_dev(div18, div17);
    			append_dev(div22, t25);
    			append_dev(div22, h2);
    			append_dev(h2, t26);
    			append_dev(div22, t27);
    			append_dev(div22, div21);
    			append_dev(div21, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t29);
    			append_dev(tr, th1);
    			append_dev(tr, t31);
    			append_dev(tr, th2);
    			append_dev(tr, t33);
    			append_dev(tr, th3);
    			append_dev(tr, t35);
    			append_dev(tr, th4);
    			append_dev(tr, t37);
    			append_dev(tr, th5);
    			append_dev(tr, t39);
    			append_dev(tr, th6);
    			append_dev(table, t41);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(div22, t42);
    			if (if_block0) if_block0.m(div22, null);
    			append_dev(div22, t43);
    			if (if_block1) if_block1.m(div22, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*selectedCharacterClass*/ 2) && t26_value !== (t26_value = (/*selectedCharacterClass*/ ctx[1] !== null
    			? "Character Class"
    			: "Choose Available Class") + "")) set_data_dev(t26, t26_value);

    			if (dirty & /*selectedCharacterClass, onSelectCharacterClass, availableCharacterClasses, calculatePrimeRequisiteModifierDisplay, rolledAbilities*/ 226) {
    				each_value_2 = /*selectedCharacterClass*/ ctx[1] === null
    				? /*availableCharacterClasses*/ ctx[6]
    				: [/*selectedCharacterClass*/ ctx[1]];

    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (/*selectedCharacterClass*/ ctx[1] !== null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div22, t43);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*selectedCharacterClass*/ ctx[1] !== null && /*selectedAlignment*/ ctx[2] !== null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*selectedCharacterClass, selectedAlignment*/ 6) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div22, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div22);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let adjustedAbilities;
    	let abilityModifiers;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	
    	const roller = new src();
    	const roll = dice => () => roller.roll(dice).result;
    	const roll3D6 = roll("3d6");
    	let selectedCharacterClass = null;
    	let selectedAlignment = null;

    	const rolledAbilities = {
    		STR: roll3D6(),
    		INT: roll3D6(),
    		WIS: roll3D6(),
    		DEX: roll3D6(),
    		CON: roll3D6(),
    		CHA: roll3D6()
    	};

    	const availableCharacterClasses = all.filter(cc => cc.abilityMinimums
    	? cc.abilityMinimums.reduce((soFar, curr) => soFar && rolledAbilities[curr.ability] >= curr.minimum, true)
    	: true);

    	const onSelectCharacterClass = name => () => {
    		$$invalidate(1, selectedCharacterClass = availableCharacterClasses.find(cc => cc.name === name) || null);
    	};

    	const adjustableAbilities = ["STR", "INT", "WIS"];
    	let adjustmentPointPool = 0;

    	const decrementBaseAbility = ability => () => {
    		if (adjustedAbilities[ability] > 10) {
    			$$invalidate(0, adjustedAbilities[ability] -= 2, adjustedAbilities);
    			$$invalidate(3, adjustmentPointPool += 1);
    		}
    	};

    	const incrementBaseAbility = ability => () => {
    		if (adjustedAbilities[ability] < rolledAbilities[ability] - 1 && adjustmentPointPool >= 1) {
    			$$invalidate(0, adjustedAbilities[ability] += 2, adjustedAbilities);
    			$$invalidate(3, adjustmentPointPool -= 1);
    		}
    	};

    	const incrementPrimeAbility = ability => () => {
    		if (adjustmentPointPool >= 1) {
    			$$invalidate(0, adjustedAbilities[ability] += 1, adjustedAbilities);
    			$$invalidate(3, adjustmentPointPool -= 1);
    		}
    	};

    	const decrementPrimeAbility = ability => () => {
    		if (adjustedAbilities[ability] > rolledAbilities[ability]) {
    			$$invalidate(0, adjustedAbilities[ability] -= 1, adjustedAbilities);
    			$$invalidate(3, adjustmentPointPool += 1);
    		}
    	};

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selectedAlignment = select_value(this);
    		$$invalidate(2, selectedAlignment);
    	}

    	$$self.$capture_state = () => ({
    		Roll: src,
    		difference,
    		ChevronUp24,
    		ChevronDown24,
    		SavingThrows,
    		Combat,
    		Encounters,
    		Exploration,
    		getSTRModifier,
    		getINTModifier,
    		getWISModifier,
    		getDEXModifier,
    		getCONModifier,
    		getCHAModifier,
    		characterClasses,
    		calculatePrimeRequisiteModifierDisplay,
    		roller,
    		roll,
    		roll3D6,
    		selectedCharacterClass,
    		selectedAlignment,
    		rolledAbilities,
    		availableCharacterClasses,
    		onSelectCharacterClass,
    		adjustableAbilities,
    		adjustmentPointPool,
    		decrementBaseAbility,
    		incrementBaseAbility,
    		incrementPrimeAbility,
    		decrementPrimeAbility,
    		adjustedAbilities,
    		abilityModifiers
    	});

    	$$self.$inject_state = $$props => {
    		if ("selectedCharacterClass" in $$props) $$invalidate(1, selectedCharacterClass = $$props.selectedCharacterClass);
    		if ("selectedAlignment" in $$props) $$invalidate(2, selectedAlignment = $$props.selectedAlignment);
    		if ("adjustmentPointPool" in $$props) $$invalidate(3, adjustmentPointPool = $$props.adjustmentPointPool);
    		if ("adjustedAbilities" in $$props) $$invalidate(0, adjustedAbilities = $$props.adjustedAbilities);
    		if ("abilityModifiers" in $$props) $$invalidate(4, abilityModifiers = $$props.abilityModifiers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*adjustedAbilities*/ 1) {
    			$$invalidate(4, abilityModifiers = {
    				STR: getSTRModifier(adjustedAbilities["STR"]),
    				INT: getINTModifier(adjustedAbilities["INT"]),
    				WIS: getWISModifier(adjustedAbilities["WIS"]),
    				DEX: getDEXModifier(adjustedAbilities["DEX"]),
    				CON: getCONModifier(adjustedAbilities["CON"]),
    				CHA: getCHAModifier(adjustedAbilities["CHA"])
    			});
    		}
    	};

    	$$invalidate(0, adjustedAbilities = Object.assign({}, rolledAbilities));

    	return [
    		adjustedAbilities,
    		selectedCharacterClass,
    		selectedAlignment,
    		adjustmentPointPool,
    		abilityModifiers,
    		rolledAbilities,
    		availableCharacterClasses,
    		onSelectCharacterClass,
    		adjustableAbilities,
    		decrementBaseAbility,
    		incrementBaseAbility,
    		incrementPrimeAbility,
    		decrementPrimeAbility,
    		select_change_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    new App({
      target: document.getElementById("app"),
      props: {},
    });

})));
//# sourceMappingURL=bundle.js.map
