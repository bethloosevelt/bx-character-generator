
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('util')) :
    typeof define === 'function' && define.amd ? define(['util'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.require$$0));
}(this, (function (require$$0) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

    function noop() { }
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
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
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

    var keys = createCommonjsModule(function (module) {
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
        transformationKeys = keys,
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

    var roller = new src();
    var roll = function (dice) { return function () { return roller.roll(dice).result; }; };
    var roll1D6 = roll("1d6");
    var roll3D6 = roll("3d6");

    /* src/icons/d6/One.svelte generated by Svelte v3.34.0 */

    const file$8 = "src/icons/d6/One.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "id", "center");
    			attr_dev(div0, "class", "dot absolute rounded-full bg-dark-gray svelte-vu70yl");
    			add_location(div0, file$8, 1, 2, 80);
    			attr_dev(div1, "id", "border");
    			attr_dev(div1, "class", "relative rounded border-dark-gray border-2 bg-white svelte-vu70yl");
    			add_location(div1, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("One", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<One> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class One extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "One",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/icons/d6/Two.svelte generated by Svelte v3.34.0 */

    const file$7 = "src/icons/d6/Two.svelte";

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "id", "top-left");
    			attr_dev(div0, "class", "dot absolute rounded-full bg-dark-gray svelte-1ceioko");
    			add_location(div0, file$7, 1, 2, 80);
    			attr_dev(div1, "id", "bottom-right");
    			attr_dev(div1, "class", "dot absolute rounded-full bg-dark-gray svelte-1ceioko");
    			add_location(div1, file$7, 2, 2, 151);
    			attr_dev(div2, "id", "border");
    			attr_dev(div2, "class", "relative rounded border-dark-gray border-2 bg-white svelte-1ceioko");
    			add_location(div2, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Two", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Two> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Two extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Two",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/icons/d6/Three.svelte generated by Svelte v3.34.0 */

    const file$6 = "src/icons/d6/Three.svelte";

    function create_fragment$6(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "id", "top-left");
    			attr_dev(div0, "class", "dot absolute rounded-full bg-dark-gray svelte-gb6us0");
    			add_location(div0, file$6, 1, 2, 80);
    			attr_dev(div1, "id", "center");
    			attr_dev(div1, "class", "dot absolute rounded-full bg-dark-gray svelte-gb6us0");
    			add_location(div1, file$6, 2, 2, 151);
    			attr_dev(div2, "id", "bottom-right");
    			attr_dev(div2, "class", "dot absolute rounded-full bg-dark-gray svelte-gb6us0");
    			add_location(div2, file$6, 3, 2, 220);
    			attr_dev(div3, "id", "border");
    			attr_dev(div3, "class", "relative rounded border-dark-gray border-2 bg-white svelte-gb6us0");
    			add_location(div3, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
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

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Three", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Three> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Three extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Three",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/icons/d6/Four.svelte generated by Svelte v3.34.0 */

    const file$5 = "src/icons/d6/Four.svelte";

    function create_fragment$5(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			attr_dev(div0, "id", "top-left");
    			attr_dev(div0, "class", "dot absolute rounded-full bg-dark-gray svelte-1ym3g8p");
    			add_location(div0, file$5, 1, 2, 80);
    			attr_dev(div1, "id", "top-right");
    			attr_dev(div1, "class", "dot absolute rounded-full bg-dark-gray svelte-1ym3g8p");
    			add_location(div1, file$5, 2, 2, 151);
    			attr_dev(div2, "id", "bottom-left");
    			attr_dev(div2, "class", "dot absolute rounded-full bg-dark-gray svelte-1ym3g8p");
    			add_location(div2, file$5, 3, 2, 223);
    			attr_dev(div3, "id", "bottom-right");
    			attr_dev(div3, "class", "dot absolute rounded-full bg-dark-gray svelte-1ym3g8p");
    			add_location(div3, file$5, 4, 2, 297);
    			attr_dev(div4, "id", "border");
    			attr_dev(div4, "class", "relative rounded border-dark-gray border-2 bg-white svelte-1ym3g8p");
    			add_location(div4, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
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

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Four", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Four> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Four extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Four",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/icons/d6/Five.svelte generated by Svelte v3.34.0 */

    const file$4 = "src/icons/d6/Five.svelte";

    function create_fragment$4(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			attr_dev(div0, "id", "top-left");
    			attr_dev(div0, "class", "dot absolute rounded-full bg-dark-gray svelte-161zkhd");
    			add_location(div0, file$4, 1, 2, 80);
    			attr_dev(div1, "id", "top-right");
    			attr_dev(div1, "class", "dot absolute rounded-full bg-dark-gray svelte-161zkhd");
    			add_location(div1, file$4, 2, 2, 151);
    			attr_dev(div2, "id", "center");
    			attr_dev(div2, "class", "dot absolute rounded-full bg-dark-gray svelte-161zkhd");
    			add_location(div2, file$4, 3, 2, 223);
    			attr_dev(div3, "id", "bottom-left");
    			attr_dev(div3, "class", "dot absolute rounded-full bg-dark-gray svelte-161zkhd");
    			add_location(div3, file$4, 4, 2, 292);
    			attr_dev(div4, "id", "bottom-right");
    			attr_dev(div4, "class", "dot absolute rounded-full bg-dark-gray svelte-161zkhd");
    			add_location(div4, file$4, 5, 2, 366);
    			attr_dev(div5, "id", "border");
    			attr_dev(div5, "class", "relative rounded border-dark-gray border-2 bg-white svelte-161zkhd");
    			add_location(div5, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div5, t0);
    			append_dev(div5, div1);
    			append_dev(div5, t1);
    			append_dev(div5, div2);
    			append_dev(div5, t2);
    			append_dev(div5, div3);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
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

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Five", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Five> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Five extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Five",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/icons/d6/Six.svelte generated by Svelte v3.34.0 */

    const file$3 = "src/icons/d6/Six.svelte";

    function create_fragment$3(ctx) {
    	let div6;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			attr_dev(div0, "id", "top-left");
    			attr_dev(div0, "class", "dot absolute rounded-full bg-dark-gray svelte-wlmtqr");
    			add_location(div0, file$3, 1, 2, 80);
    			attr_dev(div1, "id", "top-right");
    			attr_dev(div1, "class", "dot absolute rounded-full bg-dark-gray svelte-wlmtqr");
    			add_location(div1, file$3, 2, 2, 151);
    			attr_dev(div2, "id", "center-left");
    			attr_dev(div2, "class", "dot absolute rounded-full bg-dark-gray svelte-wlmtqr");
    			add_location(div2, file$3, 3, 2, 223);
    			attr_dev(div3, "id", "center-right");
    			attr_dev(div3, "class", "dot absolute rounded-full bg-dark-gray svelte-wlmtqr");
    			add_location(div3, file$3, 4, 2, 297);
    			attr_dev(div4, "id", "bottom-left");
    			attr_dev(div4, "class", "dot absolute rounded-full bg-dark-gray svelte-wlmtqr");
    			add_location(div4, file$3, 5, 2, 372);
    			attr_dev(div5, "id", "bottom-right");
    			attr_dev(div5, "class", "dot absolute rounded-full bg-dark-gray svelte-wlmtqr");
    			add_location(div5, file$3, 6, 2, 446);
    			attr_dev(div6, "id", "border");
    			attr_dev(div6, "class", "relative rounded border-dark-gray border-2 bg-white svelte-wlmtqr");
    			add_location(div6, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div6, t0);
    			append_dev(div6, div1);
    			append_dev(div6, t1);
    			append_dev(div6, div2);
    			append_dev(div6, t2);
    			append_dev(div6, div3);
    			append_dev(div6, t3);
    			append_dev(div6, div4);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Six", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Six> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Six extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Six",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/icons/d6/RollableTrio.svelte generated by Svelte v3.34.0 */
    const file$2 = "src/icons/d6/RollableTrio.svelte";

    // (34:6) {#if shownDice[0] === 1}
    function create_if_block_17(ctx) {
    	let one;
    	let current;
    	one = new One({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(one.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(one, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(one.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(one.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(one, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(34:6) {#if shownDice[0] === 1}",
    		ctx
    	});

    	return block;
    }

    // (37:6) {#if shownDice[0] === 2}
    function create_if_block_16(ctx) {
    	let two;
    	let current;
    	two = new Two({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(two.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(two, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(two.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(two.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(two, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(37:6) {#if shownDice[0] === 2}",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#if shownDice[0] === 3}
    function create_if_block_15(ctx) {
    	let three;
    	let current;
    	three = new Three({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(three.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(three, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(three.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(three.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(three, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(40:6) {#if shownDice[0] === 3}",
    		ctx
    	});

    	return block;
    }

    // (43:6) {#if shownDice[0] === 4}
    function create_if_block_14(ctx) {
    	let four;
    	let current;
    	four = new Four({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(four.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(four, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(four.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(four.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(four, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(43:6) {#if shownDice[0] === 4}",
    		ctx
    	});

    	return block;
    }

    // (46:6) {#if shownDice[0] === 5}
    function create_if_block_13(ctx) {
    	let five;
    	let current;
    	five = new Five({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(five.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(five, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(five.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(five.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(five, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(46:6) {#if shownDice[0] === 5}",
    		ctx
    	});

    	return block;
    }

    // (49:6) {#if shownDice[0] === 6}
    function create_if_block_12(ctx) {
    	let six;
    	let current;
    	six = new Six({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(six.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(six, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(six.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(six.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(six, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(49:6) {#if shownDice[0] === 6}",
    		ctx
    	});

    	return block;
    }

    // (56:6) {#if shownDice[1] === 1}
    function create_if_block_11(ctx) {
    	let one;
    	let current;
    	one = new One({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(one.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(one, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(one.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(one.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(one, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(56:6) {#if shownDice[1] === 1}",
    		ctx
    	});

    	return block;
    }

    // (59:6) {#if shownDice[1] === 2}
    function create_if_block_10(ctx) {
    	let two;
    	let current;
    	two = new Two({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(two.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(two, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(two.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(two.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(two, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(59:6) {#if shownDice[1] === 2}",
    		ctx
    	});

    	return block;
    }

    // (62:6) {#if shownDice[1] === 3}
    function create_if_block_9(ctx) {
    	let three;
    	let current;
    	three = new Three({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(three.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(three, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(three.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(three.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(three, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(62:6) {#if shownDice[1] === 3}",
    		ctx
    	});

    	return block;
    }

    // (65:6) {#if shownDice[1] === 4}
    function create_if_block_8(ctx) {
    	let four;
    	let current;
    	four = new Four({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(four.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(four, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(four.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(four.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(four, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(65:6) {#if shownDice[1] === 4}",
    		ctx
    	});

    	return block;
    }

    // (68:6) {#if shownDice[1] === 5}
    function create_if_block_7(ctx) {
    	let five;
    	let current;
    	five = new Five({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(five.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(five, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(five.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(five.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(five, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(68:6) {#if shownDice[1] === 5}",
    		ctx
    	});

    	return block;
    }

    // (71:6) {#if shownDice[1] === 6}
    function create_if_block_6(ctx) {
    	let six;
    	let current;
    	six = new Six({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(six.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(six, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(six.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(six.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(six, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(71:6) {#if shownDice[1] === 6}",
    		ctx
    	});

    	return block;
    }

    // (78:6) {#if shownDice[2] === 1}
    function create_if_block_5(ctx) {
    	let one;
    	let current;
    	one = new One({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(one.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(one, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(one.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(one.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(one, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(78:6) {#if shownDice[2] === 1}",
    		ctx
    	});

    	return block;
    }

    // (81:6) {#if shownDice[2] === 2}
    function create_if_block_4(ctx) {
    	let two;
    	let current;
    	two = new Two({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(two.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(two, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(two.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(two.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(two, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(81:6) {#if shownDice[2] === 2}",
    		ctx
    	});

    	return block;
    }

    // (84:6) {#if shownDice[2] === 3}
    function create_if_block_3(ctx) {
    	let three;
    	let current;
    	three = new Three({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(three.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(three, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(three.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(three.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(three, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(84:6) {#if shownDice[2] === 3}",
    		ctx
    	});

    	return block;
    }

    // (87:6) {#if shownDice[2] === 4}
    function create_if_block_2(ctx) {
    	let four;
    	let current;
    	four = new Four({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(four.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(four, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(four.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(four.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(four, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(87:6) {#if shownDice[2] === 4}",
    		ctx
    	});

    	return block;
    }

    // (90:6) {#if shownDice[2] === 5}
    function create_if_block_1(ctx) {
    	let five;
    	let current;
    	five = new Five({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(five.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(five, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(five.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(five.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(five, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(90:6) {#if shownDice[2] === 5}",
    		ctx
    	});

    	return block;
    }

    // (93:6) {#if shownDice[2] === 6}
    function create_if_block(ctx) {
    	let six;
    	let current;
    	six = new Six({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(six.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(six, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(six.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(six.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(six, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(93:6) {#if shownDice[2] === 6}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div7;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let div1_class_value;
    	let t5;
    	let div3;
    	let div2;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let div3_class_value;
    	let t11;
    	let div5;
    	let div4;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let div5_class_value;
    	let t17;
    	let div6;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*shownDice*/ ctx[0][0] === 1 && create_if_block_17(ctx);
    	let if_block1 = /*shownDice*/ ctx[0][0] === 2 && create_if_block_16(ctx);
    	let if_block2 = /*shownDice*/ ctx[0][0] === 3 && create_if_block_15(ctx);
    	let if_block3 = /*shownDice*/ ctx[0][0] === 4 && create_if_block_14(ctx);
    	let if_block4 = /*shownDice*/ ctx[0][0] === 5 && create_if_block_13(ctx);
    	let if_block5 = /*shownDice*/ ctx[0][0] === 6 && create_if_block_12(ctx);
    	let if_block6 = /*shownDice*/ ctx[0][1] === 1 && create_if_block_11(ctx);
    	let if_block7 = /*shownDice*/ ctx[0][1] === 2 && create_if_block_10(ctx);
    	let if_block8 = /*shownDice*/ ctx[0][1] === 3 && create_if_block_9(ctx);
    	let if_block9 = /*shownDice*/ ctx[0][1] === 4 && create_if_block_8(ctx);
    	let if_block10 = /*shownDice*/ ctx[0][1] === 5 && create_if_block_7(ctx);
    	let if_block11 = /*shownDice*/ ctx[0][1] === 6 && create_if_block_6(ctx);
    	let if_block12 = /*shownDice*/ ctx[0][2] === 1 && create_if_block_5(ctx);
    	let if_block13 = /*shownDice*/ ctx[0][2] === 2 && create_if_block_4(ctx);
    	let if_block14 = /*shownDice*/ ctx[0][2] === 3 && create_if_block_3(ctx);
    	let if_block15 = /*shownDice*/ ctx[0][2] === 4 && create_if_block_2(ctx);
    	let if_block16 = /*shownDice*/ ctx[0][2] === 5 && create_if_block_1(ctx);
    	let if_block17 = /*shownDice*/ ctx[0][2] === 6 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			t8 = space();
    			if (if_block9) if_block9.c();
    			t9 = space();
    			if (if_block10) if_block10.c();
    			t10 = space();
    			if (if_block11) if_block11.c();
    			t11 = space();
    			div5 = element("div");
    			div4 = element("div");
    			if (if_block12) if_block12.c();
    			t12 = space();
    			if (if_block13) if_block13.c();
    			t13 = space();
    			if (if_block14) if_block14.c();
    			t14 = space();
    			if (if_block15) if_block15.c();
    			t15 = space();
    			if (if_block16) if_block16.c();
    			t16 = space();
    			if (if_block17) if_block17.c();
    			t17 = space();
    			div6 = element("div");
    			add_location(div0, file$2, 32, 4, 933);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`${/*rolling*/ ctx[1] ? "rolling-1" : ""} p-1`) + " svelte-19zly8r"));
    			add_location(div1, file$2, 31, 2, 879);
    			add_location(div2, file$2, 54, 4, 1373);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(`${/*rolling*/ ctx[1] ? "rolling-2" : ""} p-1`) + " svelte-19zly8r"));
    			add_location(div3, file$2, 53, 2, 1319);
    			add_location(div4, file$2, 76, 4, 1813);
    			attr_dev(div5, "class", div5_class_value = "" + (null_to_empty(`${/*rolling*/ ctx[1] ? "rolling-3" : ""} p-1`) + " svelte-19zly8r"));
    			add_location(div5, file$2, 75, 2, 1759);
    			attr_dev(div6, "class", "absolute w-full h-full cursor-pointer");
    			add_location(div6, file$2, 97, 2, 2199);
    			attr_dev(div7, "id", "container");
    			attr_dev(div7, "class", "relative flex flex-col justify-between slide-up-1 svelte-19zly8r");
    			add_location(div7, file$2, 30, 0, 798);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t3);
    			if (if_block4) if_block4.m(div0, null);
    			append_dev(div0, t4);
    			if (if_block5) if_block5.m(div0, null);
    			append_dev(div7, t5);
    			append_dev(div7, div3);
    			append_dev(div3, div2);
    			if (if_block6) if_block6.m(div2, null);
    			append_dev(div2, t6);
    			if (if_block7) if_block7.m(div2, null);
    			append_dev(div2, t7);
    			if (if_block8) if_block8.m(div2, null);
    			append_dev(div2, t8);
    			if (if_block9) if_block9.m(div2, null);
    			append_dev(div2, t9);
    			if (if_block10) if_block10.m(div2, null);
    			append_dev(div2, t10);
    			if (if_block11) if_block11.m(div2, null);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			if (if_block12) if_block12.m(div4, null);
    			append_dev(div4, t12);
    			if (if_block13) if_block13.m(div4, null);
    			append_dev(div4, t13);
    			if (if_block14) if_block14.m(div4, null);
    			append_dev(div4, t14);
    			if (if_block15) if_block15.m(div4, null);
    			append_dev(div4, t15);
    			if (if_block16) if_block16.m(div4, null);
    			append_dev(div4, t16);
    			if (if_block17) if_block17.m(div4, null);
    			append_dev(div7, t17);
    			append_dev(div7, div6);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div6, "click", /*onClick*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*shownDice*/ ctx[0][0] === 1) {
    				if (if_block0) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_17(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][0] === 2) {
    				if (if_block1) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_16(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][0] === 3) {
    				if (if_block2) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_15(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][0] === 4) {
    				if (if_block3) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_14(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div0, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][0] === 5) {
    				if (if_block4) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_13(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div0, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][0] === 6) {
    				if (if_block5) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_12(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div0, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*rolling*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`${/*rolling*/ ctx[1] ? "rolling-1" : ""} p-1`) + " svelte-19zly8r"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (/*shownDice*/ ctx[0][1] === 1) {
    				if (if_block6) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block_11(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(div2, t6);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][1] === 2) {
    				if (if_block7) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block_10(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(div2, t7);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][1] === 3) {
    				if (if_block8) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block8, 1);
    					}
    				} else {
    					if_block8 = create_if_block_9(ctx);
    					if_block8.c();
    					transition_in(if_block8, 1);
    					if_block8.m(div2, t8);
    				}
    			} else if (if_block8) {
    				group_outros();

    				transition_out(if_block8, 1, 1, () => {
    					if_block8 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][1] === 4) {
    				if (if_block9) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block9, 1);
    					}
    				} else {
    					if_block9 = create_if_block_8(ctx);
    					if_block9.c();
    					transition_in(if_block9, 1);
    					if_block9.m(div2, t9);
    				}
    			} else if (if_block9) {
    				group_outros();

    				transition_out(if_block9, 1, 1, () => {
    					if_block9 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][1] === 5) {
    				if (if_block10) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block10, 1);
    					}
    				} else {
    					if_block10 = create_if_block_7(ctx);
    					if_block10.c();
    					transition_in(if_block10, 1);
    					if_block10.m(div2, t10);
    				}
    			} else if (if_block10) {
    				group_outros();

    				transition_out(if_block10, 1, 1, () => {
    					if_block10 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][1] === 6) {
    				if (if_block11) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block11, 1);
    					}
    				} else {
    					if_block11 = create_if_block_6(ctx);
    					if_block11.c();
    					transition_in(if_block11, 1);
    					if_block11.m(div2, null);
    				}
    			} else if (if_block11) {
    				group_outros();

    				transition_out(if_block11, 1, 1, () => {
    					if_block11 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*rolling*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(`${/*rolling*/ ctx[1] ? "rolling-2" : ""} p-1`) + " svelte-19zly8r"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (/*shownDice*/ ctx[0][2] === 1) {
    				if (if_block12) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block12, 1);
    					}
    				} else {
    					if_block12 = create_if_block_5(ctx);
    					if_block12.c();
    					transition_in(if_block12, 1);
    					if_block12.m(div4, t12);
    				}
    			} else if (if_block12) {
    				group_outros();

    				transition_out(if_block12, 1, 1, () => {
    					if_block12 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][2] === 2) {
    				if (if_block13) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block13, 1);
    					}
    				} else {
    					if_block13 = create_if_block_4(ctx);
    					if_block13.c();
    					transition_in(if_block13, 1);
    					if_block13.m(div4, t13);
    				}
    			} else if (if_block13) {
    				group_outros();

    				transition_out(if_block13, 1, 1, () => {
    					if_block13 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][2] === 3) {
    				if (if_block14) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block14, 1);
    					}
    				} else {
    					if_block14 = create_if_block_3(ctx);
    					if_block14.c();
    					transition_in(if_block14, 1);
    					if_block14.m(div4, t14);
    				}
    			} else if (if_block14) {
    				group_outros();

    				transition_out(if_block14, 1, 1, () => {
    					if_block14 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][2] === 4) {
    				if (if_block15) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block15, 1);
    					}
    				} else {
    					if_block15 = create_if_block_2(ctx);
    					if_block15.c();
    					transition_in(if_block15, 1);
    					if_block15.m(div4, t15);
    				}
    			} else if (if_block15) {
    				group_outros();

    				transition_out(if_block15, 1, 1, () => {
    					if_block15 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][2] === 5) {
    				if (if_block16) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block16, 1);
    					}
    				} else {
    					if_block16 = create_if_block_1(ctx);
    					if_block16.c();
    					transition_in(if_block16, 1);
    					if_block16.m(div4, t16);
    				}
    			} else if (if_block16) {
    				group_outros();

    				transition_out(if_block16, 1, 1, () => {
    					if_block16 = null;
    				});

    				check_outros();
    			}

    			if (/*shownDice*/ ctx[0][2] === 6) {
    				if (if_block17) {
    					if (dirty & /*shownDice*/ 1) {
    						transition_in(if_block17, 1);
    					}
    				} else {
    					if_block17 = create_if_block(ctx);
    					if_block17.c();
    					transition_in(if_block17, 1);
    					if_block17.m(div4, null);
    				}
    			} else if (if_block17) {
    				group_outros();

    				transition_out(if_block17, 1, 1, () => {
    					if_block17 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*rolling*/ 2 && div5_class_value !== (div5_class_value = "" + (null_to_empty(`${/*rolling*/ ctx[1] ? "rolling-3" : ""} p-1`) + " svelte-19zly8r"))) {
    				attr_dev(div5, "class", div5_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);
    			transition_in(if_block7);
    			transition_in(if_block8);
    			transition_in(if_block9);
    			transition_in(if_block10);
    			transition_in(if_block11);
    			transition_in(if_block12);
    			transition_in(if_block13);
    			transition_in(if_block14);
    			transition_in(if_block15);
    			transition_in(if_block16);
    			transition_in(if_block17);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			transition_out(if_block8);
    			transition_out(if_block9);
    			transition_out(if_block10);
    			transition_out(if_block11);
    			transition_out(if_block12);
    			transition_out(if_block13);
    			transition_out(if_block14);
    			transition_out(if_block15);
    			transition_out(if_block16);
    			transition_out(if_block17);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			if (if_block12) if_block12.d();
    			if (if_block13) if_block13.d();
    			if (if_block14) if_block14.d();
    			if (if_block15) if_block15.d();
    			if (if_block16) if_block16.d();
    			if (if_block17) if_block17.d();
    			mounted = false;
    			dispose();
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
    	validate_slots("RollableTrio", slots, []);
    	let { onChange } = $$props;
    	const rollDice = () => [roll1D6(), roll1D6(), roll1D6()];
    	let shownDice = rollDice();
    	let rolling = false;
    	let rollInterval;

    	const updateDice = () => {
    		$$invalidate(0, shownDice = rollDice());
    	};

    	const onClick = () => {
    		if (!rolling) {
    			$$invalidate(1, rolling = true);
    			updateDice();
    			rollInterval = setInterval(updateDice, 75);
    		} else {
    			updateDice();
    			clearInterval(rollInterval);
    			$$invalidate(1, rolling = false);
    			onChange(shownDice.reduce((soFar, curr) => soFar + curr, 0));
    		}
    	};

    	const writable_props = ["onChange"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RollableTrio> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("onChange" in $$props) $$invalidate(3, onChange = $$props.onChange);
    	};

    	$$self.$capture_state = () => ({
    		One,
    		Two,
    		Three,
    		Four,
    		Five,
    		Six,
    		roll1D6,
    		onChange,
    		rollDice,
    		shownDice,
    		rolling,
    		rollInterval,
    		updateDice,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("onChange" in $$props) $$invalidate(3, onChange = $$props.onChange);
    		if ("shownDice" in $$props) $$invalidate(0, shownDice = $$props.shownDice);
    		if ("rolling" in $$props) $$invalidate(1, rolling = $$props.rolling);
    		if ("rollInterval" in $$props) rollInterval = $$props.rollInterval;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shownDice, rolling, onClick, onChange];
    }

    class RollableTrio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { onChange: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RollableTrio",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onChange*/ ctx[3] === undefined && !("onChange" in props)) {
    			console.warn("<RollableTrio> was created without expected prop 'onChange'");
    		}
    	}

    	get onChange() {
    		throw new Error("<RollableTrio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onChange(value) {
    		throw new Error("<RollableTrio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/RollStats.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$1 } = globals;
    const file$1 = "src/pages/RollStats.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (30:6) {#each abilities as ability, idx}
    function create_each_block(ctx) {
    	let div3;
    	let div0;
    	let d6trio;
    	let t0;
    	let div1;
    	let t1_value = /*ability*/ ctx[5] + "";
    	let t1;
    	let t2;
    	let div2;

    	let t3_value = (/*abilityValues*/ ctx[1][/*idx*/ ctx[7]] === 0
    	? "_"
    	: /*abilityValues*/ ctx[1][/*idx*/ ctx[7]]) + "";

    	let t3;
    	let t4;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[4](/*ability*/ ctx[5], ...args);
    	}

    	d6trio = new RollableTrio({
    			props: { onChange: func },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(d6trio.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(div0, "class", "pb-4");
    			add_location(div0, file$1, 34, 10, 1017);
    			add_location(div1, file$1, 44, 10, 1277);
    			add_location(div2, file$1, 45, 10, 1308);
    			attr_dev(div3, "class", "slide-up flex flex-col items-center svelte-q4t9oy");
    			attr_dev(div3, "style", /*getAnimationDelayStyle*/ ctx[3](/*idx*/ ctx[7]));
    			add_location(div3, file$1, 30, 8, 892);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(d6trio, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, t3);
    			append_dev(div3, t4);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const d6trio_changes = {};
    			if (dirty & /*rolledAbilities*/ 1) d6trio_changes.onChange = func;
    			d6trio.$set(d6trio_changes);

    			if ((!current || dirty & /*abilityValues*/ 2) && t3_value !== (t3_value = (/*abilityValues*/ ctx[1][/*idx*/ ctx[7]] === 0
    			? "_"
    			: /*abilityValues*/ ctx[1][/*idx*/ ctx[7]]) + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(d6trio.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(d6trio.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(d6trio);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(30:6) {#each abilities as ability, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let div0;
    	let h2;
    	let t1;
    	let div2;
    	let div1;
    	let current;
    	let each_value = /*abilities*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Click to Roll Abilities";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(h2, "font-family", "ScalaSans-Regular");
    			attr_dev(h2, "class", "pb-2 text-3xl font-bold");
    			add_location(h2, file$1, 20, 4, 529);
    			add_location(div0, file$1, 19, 2, 519);
    			attr_dev(div1, "class", "w-1/2 flex flex-row justify-between text-2xl");
    			add_location(div1, file$1, 28, 4, 785);
    			attr_dev(div2, "class", "select-none pt-8 pb-16 w-full flex flex-row justify-center");
    			set_style(div2, "font-family", "ScalaSans-Regular");
    			add_location(div2, file$1, 24, 2, 657);
    			attr_dev(div3, "class", "position w-full flex flex-col justify-center items-center ");
    			add_location(div3, file$1, 18, 0, 444);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getAnimationDelayStyle, abilityValues, abilities, rolledAbilities*/ 15) {
    				each_value = /*abilities*/ ctx[2];
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
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
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
    	let abilityValues;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("RollStats", slots, []);
    	
    	
    	let { rolledAbilities } = $$props;

    	rolledAbilities = {
    		STR: 0,
    		INT: 0,
    		WIS: 0,
    		DEX: 0,
    		CON: 0,
    		CHA: 0
    	};

    	const abilities = ["STR", "INT", "WIS", "DEX", "CON", "CHA"];
    	const getAnimationDelayStyle = idx => `animation-delay: ${25 * idx}ms;`;
    	const writable_props = ["rolledAbilities"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RollStats> was created with unknown prop '${key}'`);
    	});

    	const func = (ability, sum) => {
    		$$invalidate(0, rolledAbilities = { ...rolledAbilities, [ability]: sum });
    	};

    	$$self.$$set = $$props => {
    		if ("rolledAbilities" in $$props) $$invalidate(0, rolledAbilities = $$props.rolledAbilities);
    	};

    	$$self.$capture_state = () => ({
    		roll3D6,
    		D6Trio: RollableTrio,
    		rolledAbilities,
    		abilities,
    		getAnimationDelayStyle,
    		abilityValues
    	});

    	$$self.$inject_state = $$props => {
    		if ("rolledAbilities" in $$props) $$invalidate(0, rolledAbilities = $$props.rolledAbilities);
    		if ("abilityValues" in $$props) $$invalidate(1, abilityValues = $$props.abilityValues);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*rolledAbilities*/ 1) {
    			$$invalidate(1, abilityValues = Object.values(rolledAbilities || {}));
    		}
    	};

    	return [rolledAbilities, abilityValues, abilities, getAnimationDelayStyle, func];
    }

    class RollStats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { rolledAbilities: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RollStats",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*rolledAbilities*/ ctx[0] === undefined && !("rolledAbilities" in props)) {
    			console.warn("<RollStats> was created without expected prop 'rolledAbilities'");
    		}
    	}

    	get rolledAbilities() {
    		throw new Error("<RollStats>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rolledAbilities(value) {
    		throw new Error("<RollStats>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let rollstats;
    	let updating_rolledAbilities;
    	let div0_class_value;
    	let t0;
    	let div1;
    	let button;
    	let t1;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	function rollstats_rolledAbilities_binding(value) {
    		/*rollstats_rolledAbilities_binding*/ ctx[3](value);
    	}

    	let rollstats_props = {};

    	if (/*rolledAbilities*/ ctx[0] !== void 0) {
    		rollstats_props.rolledAbilities = /*rolledAbilities*/ ctx[0];
    	}

    	rollstats = new RollStats({ props: rollstats_props, $$inline: true });
    	binding_callbacks.push(() => bind(rollstats, "rolledAbilities", rollstats_rolledAbilities_binding));

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(rollstats.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			button = element("button");
    			t1 = text("Continue");

    			attr_dev(div0, "class", div0_class_value = `position ${/*currentPage*/ ctx[2] === "roll-abilities"
			? "h-full"
			: "h-auto"} flex flex-col justify-center`);

    			add_location(div0, file, 12, 4, 398);

    			attr_dev(button, "class", button_class_value = `${/*abilitiesRolled*/ ctx[1] && /*currentPage*/ ctx[2] === "roll-abilities"
			? ""
			: "invisible"} bg-mint hover:bg-black hover:text-white text-black font-bold py-2 px-4 rounded`);

    			add_location(button, file, 20, 6, 645);
    			attr_dev(div1, "class", "w-1/2 flex flex-row justify-end");
    			add_location(div1, file, 19, 4, 593);
    			attr_dev(div2, "class", "w-full flex-1 flex flex-col align-center");
    			add_location(div2, file, 11, 2, 339);
    			attr_dev(div3, "class", "flex flex-col align-center text-dark-gray h-screen");
    			add_location(div3, file, 10, 0, 272);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(rollstats, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(button, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const rollstats_changes = {};

    			if (!updating_rolledAbilities && dirty & /*rolledAbilities*/ 1) {
    				updating_rolledAbilities = true;
    				rollstats_changes.rolledAbilities = /*rolledAbilities*/ ctx[0];
    				add_flush_callback(() => updating_rolledAbilities = false);
    			}

    			rollstats.$set(rollstats_changes);

    			if (!current || dirty & /*currentPage*/ 4 && div0_class_value !== (div0_class_value = `position ${/*currentPage*/ ctx[2] === "roll-abilities"
			? "h-full"
			: "h-auto"} flex flex-col justify-center`)) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*abilitiesRolled, currentPage*/ 6 && button_class_value !== (button_class_value = `${/*abilitiesRolled*/ ctx[1] && /*currentPage*/ ctx[2] === "roll-abilities"
			? ""
			: "invisible"} bg-mint hover:bg-black hover:text-white text-black font-bold py-2 px-4 rounded`)) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rollstats.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rollstats.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(rollstats);
    			mounted = false;
    			dispose();
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
    	let abilitiesRolled;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	
    	
    	let rolledAbilities = null;
    	let currentPage = "roll-abilities";
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function rollstats_rolledAbilities_binding(value) {
    		rolledAbilities = value;
    		$$invalidate(0, rolledAbilities);
    	}

    	const click_handler = () => {
    		$$invalidate(2, currentPage = "select-class");
    	};

    	$$self.$capture_state = () => ({
    		RollStats,
    		rolledAbilities,
    		currentPage,
    		abilitiesRolled
    	});

    	$$self.$inject_state = $$props => {
    		if ("rolledAbilities" in $$props) $$invalidate(0, rolledAbilities = $$props.rolledAbilities);
    		if ("currentPage" in $$props) $$invalidate(2, currentPage = $$props.currentPage);
    		if ("abilitiesRolled" in $$props) $$invalidate(1, abilitiesRolled = $$props.abilitiesRolled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*rolledAbilities*/ 1) {
    			$$invalidate(1, abilitiesRolled = !!rolledAbilities && Object.entries(rolledAbilities).length === 6);
    		}

    		if ($$self.$$.dirty & /*abilitiesRolled*/ 2) {
    			console.log(abilitiesRolled);
    		}
    	};

    	return [
    		rolledAbilities,
    		abilitiesRolled,
    		currentPage,
    		rollstats_rolledAbilities_binding,
    		click_handler
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
