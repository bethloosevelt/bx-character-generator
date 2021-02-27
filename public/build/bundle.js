
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('util')) :
    typeof define === 'function' && define.amd ? define(['util'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.require$$0));
}(this, (function (require$$0) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

    function noop() { }
    const identity = x => x;
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
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
    var roll3D6 = roll("3d6");

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        const len = node.getTotalLength();
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }

    /* src/icons/D20.svelte generated by Svelte v3.34.0 */
    const file$2 = "src/icons/D20.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let path;
    	let path_intro;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M91.9,74.7C91.9,74.7,91.9,74.7,91.9,74.7c0.1-0.1,0.1-0.2,0.1-0.2c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1  c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.2c0,0,0-0.1,0-0.1c0-0.1,0-0.2,0-0.2V27.2c0,0,0,0,0-0.1c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1  c0,0,0,0,0-0.1c0,0,0,0,0-0.1c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1c0,0,0,0,0,0c0-0.1-0.1-0.1-0.1-0.2c0,0,0,0,0,0c0,0,0,0,0,0  c0,0,0,0,0-0.1c0-0.1-0.1-0.1-0.1-0.1c0,0,0,0,0,0c0,0,0,0,0-0.1c0,0-0.1-0.1-0.1-0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0-0.1-0.1-0.2-0.1  c0,0,0,0-0.1,0c0,0,0,0,0,0L50.9,2.3c-0.6-0.3-1.3-0.3-1.8,0L8.8,25.6c0,0,0,0,0,0c-0.1,0-0.1,0.1-0.2,0.1c0,0,0,0-0.1,0  c0,0-0.1,0.1-0.1,0.1c0,0,0,0-0.1,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0.1-0.1,0.1c0,0,0,0-0.1,0.1c0,0,0,0,0,0c0,0,0,0.1,0,0.1  c0,0,0,0.1-0.1,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1  c0,0,0,0,0,0.1v46.5c0,0,0,0,0,0v0c0,0.1,0,0.2,0,0.3c0,0,0,0.1,0,0.1c0,0.1,0.1,0.2,0.1,0.3c0,0,0,0,0,0c0,0,0,0,0,0  c0,0.1,0.1,0.2,0.2,0.3c0,0,0,0,0,0.1C8.2,74.9,8.3,75,8.4,75c0,0,0,0,0,0c0.1,0.1,0.1,0.1,0.2,0.2c0,0,0,0,0.1,0c0,0,0,0,0.1,0  l40.3,23.3c0,0,0,0,0,0c0,0,0.1,0,0.1,0.1c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0,0,0,0,0.1,0  c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0c0,0,0,0,0.1,0c0.1,0,0.1,0,0.2,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0  c0,0,0.1,0,0.1-0.1c0,0,0,0,0,0l40.3-23.3c0,0,0,0,0,0c0,0,0,0,0.1,0c0,0,0,0,0.1,0c0,0,0.1,0,0.1-0.1c0,0,0.1-0.1,0.1-0.1  c0,0,0.1,0,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0,0,0-0.1,0.1-0.1C91.8,74.8,91.8,74.7,91.9,74.7z M11.9,37.6l11.2,27.8  c0.1,0.3,0,0.7-0.4,0.9l-10.3,4.3c-0.4,0.2-0.9-0.1-0.9-0.6V37.7C11.5,37.5,11.8,37.4,11.9,37.6z M69.9,65.2H30.1  c-0.5,0-0.8-0.6-0.6-1l19.9-34.5c0.3-0.4,0.9-0.4,1.1,0l19.9,34.5C70.7,64.7,70.4,65.2,69.9,65.2z M25.6,61.6L12.7,29.7  c-0.2-0.4,0.1-0.9,0.6-0.9l32.2-1.6c0.5,0,0.9,0.5,0.6,1L26.7,61.7C26.5,62.2,25.8,62.2,25.6,61.6z M69.5,70l-19,23.4  c-0.3,0.3-0.8,0.3-1,0L30.5,70c-0.3-0.4,0-1.1,0.5-1.1h38C69.5,68.9,69.8,69.6,69.5,70z M73.3,61.7L53.9,28.2c-0.3-0.5,0.1-1,0.6-1  l32.2,1.6c0.5,0,0.7,0.5,0.6,0.9L74.4,61.6C74.2,62.2,73.5,62.2,73.3,61.7z M51.8,22.8V8.2c0-0.5,0.6-0.8,1-0.6L82,24.5  c0.2,0.1,0.1,0.4-0.1,0.4l-29.5-1.5C52.1,23.4,51.8,23.1,51.8,22.8z M47.5,23.4l-29.5,1.5c-0.2,0-0.3-0.3-0.1-0.4L47.2,7.7  c0.4-0.3,1,0.1,1,0.6v14.5C48.2,23.1,47.9,23.4,47.5,23.4z M25.5,69.7l16.1,19.9c0.1,0.2-0.1,0.4-0.3,0.3L15,74.7  c-0.5-0.3-0.4-1,0.1-1.2l9.7-4C25,69.4,25.3,69.5,25.5,69.7z M75.2,69.5l9.7,4c0.5,0.2,0.6,0.9,0.1,1.2L58.6,89.9  c-0.2,0.1-0.4-0.1-0.3-0.3l16.1-19.9C74.7,69.5,75,69.4,75.2,69.5z M87.6,70.6l-10.3-4.3c-0.3-0.1-0.5-0.5-0.4-0.9l11.2-27.8  c0.1-0.2,0.4-0.1,0.4,0.1V70C88.5,70.5,88,70.8,87.6,70.6z");
    			add_location(path, file$2, 14, 2, 303);
    			attr_dev(svg, "style", /*style*/ ctx[0]);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 100 125");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "width", "48");
    			attr_dev(svg, "height", "48");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file$2, 5, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*style*/ 1) {
    				attr_dev(svg, "style", /*style*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (!path_intro) {
    				add_render_callback(() => {
    					path_intro = create_in_transition(path, draw, {
    						speed: 0.01,
    						duration: 300,
    						delay: 0,
    						easing: quintOut
    					});

    					path_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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
    	validate_slots("D20", slots, []);
    	let { style = "" } = $$props;
    	const writable_props = ["style"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<D20> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    	};

    	$$self.$capture_state = () => ({ draw, quintOut, style });

    	$$self.$inject_state = $$props => {
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [style];
    }

    class D20 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { style: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "D20",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get style() {
    		throw new Error("<D20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<D20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/RollStats.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$1 } = globals;
    const file$1 = "src/pages/RollStats.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (24:6) {#each abilities as ability, idx}
    function create_each_block(ctx) {
    	let div3;
    	let div0;
    	let d20;
    	let t0;
    	let div1;
    	let t1_value = /*ability*/ ctx[4] + "";
    	let t1;
    	let t2;
    	let div2;
    	let t3_value = (/*rolledAbilities*/ ctx[0]?.[/*ability*/ ctx[4]] || "_") + "";
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	d20 = new D20({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(d20.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(div0, "class", "flex justify-center items-center h-14 w-16 cursor-pointer");
    			add_location(div0, file$1, 28, 10, 971);
    			add_location(div1, file$1, 34, 10, 1156);
    			add_location(div2, file$1, 35, 10, 1187);
    			attr_dev(div3, "class", "slide-up flex flex-col items-center svelte-q4t9oy");
    			attr_dev(div3, "style", /*getAnimationDelayStyle*/ ctx[3](/*idx*/ ctx[6]));
    			add_location(div3, file$1, 24, 8, 846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(d20, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, t3);
    			append_dev(div3, t4);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*setAbility*/ ctx[1](/*ability*/ ctx[4]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*rolledAbilities*/ 1) && t3_value !== (t3_value = (/*rolledAbilities*/ ctx[0]?.[/*ability*/ ctx[4]] || "_") + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(d20.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(d20.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(d20);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(24:6) {#each abilities as ability, idx}",
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
    			add_location(h2, file$1, 14, 4, 495);
    			add_location(div0, file$1, 13, 2, 485);
    			attr_dev(div1, "class", "w-1/2 flex flex-row justify-between text-2xl");
    			add_location(div1, file$1, 22, 4, 739);
    			attr_dev(div2, "class", "pt-8 pb-16 w-full flex flex-row justify-center");
    			set_style(div2, "font-family", "ScalaSans-Regular");
    			add_location(div2, file$1, 18, 2, 623);
    			attr_dev(div3, "class", "w-full flex flex-col justify-center items-center ");
    			add_location(div3, file$1, 12, 0, 419);
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
    			if (dirty & /*getAnimationDelayStyle, rolledAbilities, abilities, setAbility*/ 15) {
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("RollStats", slots, []);
    	
    	
    	let { rolledAbilities } = $$props;

    	const setAbility = ability => () => {
    		$$invalidate(0, rolledAbilities = Object.assign(Object.assign({}, rolledAbilities), { [ability]: roll3D6() }));
    	};

    	const abilities = ["STR", "INT", "WIS", "DEX", "CON", "CHA"];
    	const getAnimationDelayStyle = idx => `animation-delay: ${25 * idx}ms;`;
    	const writable_props = ["rolledAbilities"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RollStats> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("rolledAbilities" in $$props) $$invalidate(0, rolledAbilities = $$props.rolledAbilities);
    	};

    	$$self.$capture_state = () => ({
    		roll3D6,
    		D20,
    		rolledAbilities,
    		setAbility,
    		abilities,
    		getAnimationDelayStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ("rolledAbilities" in $$props) $$invalidate(0, rolledAbilities = $$props.rolledAbilities);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [rolledAbilities, setAbility, abilities, getAnimationDelayStyle];
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

    // (13:2) {#if abilitiesRolled}
    function create_if_block(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Continue";
    			add_location(button, file, 13, 4, 463);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(13:2) {#if abilitiesRolled}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let rollstats;
    	let updating_rolledAbilities;
    	let t;
    	let current;

    	function rollstats_rolledAbilities_binding(value) {
    		/*rollstats_rolledAbilities_binding*/ ctx[2](value);
    	}

    	let rollstats_props = {};

    	if (/*rolledAbilities*/ ctx[0] !== void 0) {
    		rollstats_props.rolledAbilities = /*rolledAbilities*/ ctx[0];
    	}

    	rollstats = new RollStats({ props: rollstats_props, $$inline: true });
    	binding_callbacks.push(() => bind(rollstats, "rolledAbilities", rollstats_rolledAbilities_binding));
    	let if_block = /*abilitiesRolled*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(rollstats.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "w-full flex-1 flex flex-col justify-center items-center ");
    			add_location(div0, file, 9, 2, 316);
    			attr_dev(div1, "class", "flex flex-col justify-center items-center text-dark-gray h-screen");
    			add_location(div1, file, 8, 0, 234);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(rollstats, div0, null);
    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const rollstats_changes = {};

    			if (!updating_rolledAbilities && dirty & /*rolledAbilities*/ 1) {
    				updating_rolledAbilities = true;
    				rollstats_changes.rolledAbilities = /*rolledAbilities*/ ctx[0];
    				add_flush_callback(() => updating_rolledAbilities = false);
    			}

    			rollstats.$set(rollstats_changes);

    			if (/*abilitiesRolled*/ ctx[1]) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			if (detaching) detach_dev(div1);
    			destroy_component(rollstats);
    			if (if_block) if_block.d();
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
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function rollstats_rolledAbilities_binding(value) {
    		rolledAbilities = value;
    		$$invalidate(0, rolledAbilities);
    	}

    	$$self.$capture_state = () => ({
    		RollStats,
    		rolledAbilities,
    		abilitiesRolled
    	});

    	$$self.$inject_state = $$props => {
    		if ("rolledAbilities" in $$props) $$invalidate(0, rolledAbilities = $$props.rolledAbilities);
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

    	return [rolledAbilities, abilitiesRolled, rollstats_rolledAbilities_binding];
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
