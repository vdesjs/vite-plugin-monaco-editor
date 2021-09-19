(() => {
  // node_modules/monaco-editor/esm/vs/base/common/errors.js
  var ErrorHandler = class {
    constructor() {
      this.listeners = [];
      this.unexpectedErrorHandler = function(e) {
        setTimeout(() => {
          if (e.stack) {
            throw new Error(e.message + "\n\n" + e.stack);
          }
          throw e;
        }, 0);
      };
    }
    emit(e) {
      this.listeners.forEach((listener) => {
        listener(e);
      });
    }
    onUnexpectedError(e) {
      this.unexpectedErrorHandler(e);
      this.emit(e);
    }
    onUnexpectedExternalError(e) {
      this.unexpectedErrorHandler(e);
    }
  };
  var errorHandler = new ErrorHandler();
  function onUnexpectedError(e) {
    if (!isPromiseCanceledError(e)) {
      errorHandler.onUnexpectedError(e);
    }
    return void 0;
  }
  function transformErrorForSerialization(error) {
    if (error instanceof Error) {
      let { name, message } = error;
      const stack = error.stacktrace || error.stack;
      return {
        $isError: true,
        name,
        message,
        stack
      };
    }
    return error;
  }
  var canceledName = "Canceled";
  function isPromiseCanceledError(error) {
    return error instanceof Error && error.name === canceledName && error.message === canceledName;
  }

  // node_modules/monaco-editor/esm/vs/base/common/functional.js
  function once(fn) {
    const _this = this;
    let didCall = false;
    let result;
    return function() {
      if (didCall) {
        return result;
      }
      didCall = true;
      result = fn.apply(_this, arguments);
      return result;
    };
  }

  // node_modules/monaco-editor/esm/vs/base/common/iterator.js
  var Iterable;
  (function(Iterable2) {
    function is(thing) {
      return thing && typeof thing === "object" && typeof thing[Symbol.iterator] === "function";
    }
    Iterable2.is = is;
    const _empty2 = Object.freeze([]);
    function empty() {
      return _empty2;
    }
    Iterable2.empty = empty;
    function* single(element) {
      yield element;
    }
    Iterable2.single = single;
    function from(iterable) {
      return iterable || _empty2;
    }
    Iterable2.from = from;
    function isEmpty(iterable) {
      return !iterable || iterable[Symbol.iterator]().next().done === true;
    }
    Iterable2.isEmpty = isEmpty;
    function first(iterable) {
      return iterable[Symbol.iterator]().next().value;
    }
    Iterable2.first = first;
    function some(iterable, predicate) {
      for (const element of iterable) {
        if (predicate(element)) {
          return true;
        }
      }
      return false;
    }
    Iterable2.some = some;
    function find(iterable, predicate) {
      for (const element of iterable) {
        if (predicate(element)) {
          return element;
        }
      }
      return void 0;
    }
    Iterable2.find = find;
    function* filter(iterable, predicate) {
      for (const element of iterable) {
        if (predicate(element)) {
          yield element;
        }
      }
    }
    Iterable2.filter = filter;
    function* map(iterable, fn) {
      let index = 0;
      for (const element of iterable) {
        yield fn(element, index++);
      }
    }
    Iterable2.map = map;
    function* concat(...iterables) {
      for (const iterable of iterables) {
        for (const element of iterable) {
          yield element;
        }
      }
    }
    Iterable2.concat = concat;
    function* concatNested(iterables) {
      for (const iterable of iterables) {
        for (const element of iterable) {
          yield element;
        }
      }
    }
    Iterable2.concatNested = concatNested;
    function reduce(iterable, reducer, initialValue) {
      let value = initialValue;
      for (const element of iterable) {
        value = reducer(value, element);
      }
      return value;
    }
    Iterable2.reduce = reduce;
    function* slice(arr, from2, to = arr.length) {
      if (from2 < 0) {
        from2 += arr.length;
      }
      if (to < 0) {
        to += arr.length;
      } else if (to > arr.length) {
        to = arr.length;
      }
      for (; from2 < to; from2++) {
        yield arr[from2];
      }
    }
    Iterable2.slice = slice;
    function consume(iterable, atMost = Number.POSITIVE_INFINITY) {
      const consumed = [];
      if (atMost === 0) {
        return [consumed, iterable];
      }
      const iterator = iterable[Symbol.iterator]();
      for (let i = 0; i < atMost; i++) {
        const next = iterator.next();
        if (next.done) {
          return [consumed, Iterable2.empty()];
        }
        consumed.push(next.value);
      }
      return [consumed, { [Symbol.iterator]() {
        return iterator;
      } }];
    }
    Iterable2.consume = consume;
    function equals(a, b, comparator = (at, bt) => at === bt) {
      const ai = a[Symbol.iterator]();
      const bi = b[Symbol.iterator]();
      while (true) {
        const an = ai.next();
        const bn = bi.next();
        if (an.done !== bn.done) {
          return false;
        } else if (an.done) {
          return true;
        } else if (!comparator(an.value, bn.value)) {
          return false;
        }
      }
    }
    Iterable2.equals = equals;
  })(Iterable || (Iterable = {}));

  // node_modules/monaco-editor/esm/vs/base/common/lifecycle.js
  var TRACK_DISPOSABLES = false;
  var disposableTracker = null;
  function setDisposableTracker(tracker) {
    disposableTracker = tracker;
  }
  if (TRACK_DISPOSABLES) {
    const __is_disposable_tracked__ = "__is_disposable_tracked__";
    setDisposableTracker(new class {
      trackDisposable(x) {
        const stack = new Error("Potentially leaked disposable").stack;
        setTimeout(() => {
          if (!x[__is_disposable_tracked__]) {
            console.log(stack);
          }
        }, 3e3);
      }
      setParent(child, parent) {
        if (child && child !== Disposable.None) {
          try {
            child[__is_disposable_tracked__] = true;
          } catch (_a2) {
          }
        }
      }
      markAsDisposed(disposable) {
        if (disposable && disposable !== Disposable.None) {
          try {
            disposable[__is_disposable_tracked__] = true;
          } catch (_a2) {
          }
        }
      }
      markAsSingleton(disposable) {
      }
    }());
  }
  function trackDisposable(x) {
    disposableTracker === null || disposableTracker === void 0 ? void 0 : disposableTracker.trackDisposable(x);
    return x;
  }
  function markAsDisposed(disposable) {
    disposableTracker === null || disposableTracker === void 0 ? void 0 : disposableTracker.markAsDisposed(disposable);
  }
  function setParentOfDisposable(child, parent) {
    disposableTracker === null || disposableTracker === void 0 ? void 0 : disposableTracker.setParent(child, parent);
  }
  function setParentOfDisposables(children, parent) {
    if (!disposableTracker) {
      return;
    }
    for (const child of children) {
      disposableTracker.setParent(child, parent);
    }
  }
  var MultiDisposeError = class extends Error {
    constructor(errors) {
      super(`Encountered errors while disposing of store. Errors: [${errors.join(", ")}]`);
      this.errors = errors;
    }
  };
  function dispose(arg) {
    if (Iterable.is(arg)) {
      let errors = [];
      for (const d of arg) {
        if (d) {
          try {
            d.dispose();
          } catch (e) {
            errors.push(e);
          }
        }
      }
      if (errors.length === 1) {
        throw errors[0];
      } else if (errors.length > 1) {
        throw new MultiDisposeError(errors);
      }
      return Array.isArray(arg) ? [] : arg;
    } else if (arg) {
      arg.dispose();
      return arg;
    }
  }
  function combinedDisposable(...disposables) {
    const parent = toDisposable(() => dispose(disposables));
    setParentOfDisposables(disposables, parent);
    return parent;
  }
  function toDisposable(fn) {
    const self2 = trackDisposable({
      dispose: once(() => {
        markAsDisposed(self2);
        fn();
      })
    });
    return self2;
  }
  var DisposableStore = class {
    constructor() {
      this._toDispose = new Set();
      this._isDisposed = false;
      trackDisposable(this);
    }
    dispose() {
      if (this._isDisposed) {
        return;
      }
      markAsDisposed(this);
      this._isDisposed = true;
      this.clear();
    }
    clear() {
      try {
        dispose(this._toDispose.values());
      } finally {
        this._toDispose.clear();
      }
    }
    add(o) {
      if (!o) {
        return o;
      }
      if (o === this) {
        throw new Error("Cannot register a disposable on itself!");
      }
      setParentOfDisposable(o, this);
      if (this._isDisposed) {
        if (!DisposableStore.DISABLE_DISPOSED_WARNING) {
          console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack);
        }
      } else {
        this._toDispose.add(o);
      }
      return o;
    }
  };
  DisposableStore.DISABLE_DISPOSED_WARNING = false;
  var Disposable = class {
    constructor() {
      this._store = new DisposableStore();
      trackDisposable(this);
      setParentOfDisposable(this._store, this);
    }
    dispose() {
      markAsDisposed(this);
      this._store.dispose();
    }
    _register(o) {
      if (o === this) {
        throw new Error("Cannot register a disposable on itself!");
      }
      return this._store.add(o);
    }
  };
  Disposable.None = Object.freeze({ dispose() {
  } });

  // node_modules/monaco-editor/esm/vs/base/common/platform.js
  var _a;
  var LANGUAGE_DEFAULT = "en";
  var _isWindows = false;
  var _isMacintosh = false;
  var _isLinux = false;
  var _isLinuxSnap = false;
  var _isNative = false;
  var _isWeb = false;
  var _isIOS = false;
  var _locale = void 0;
  var _language = LANGUAGE_DEFAULT;
  var _translationsConfigFile = void 0;
  var _userAgent = void 0;
  var globals = typeof self === "object" ? self : typeof global === "object" ? global : {};
  var nodeProcess = void 0;
  if (typeof globals.vscode !== "undefined" && typeof globals.vscode.process !== "undefined") {
    nodeProcess = globals.vscode.process;
  } else if (typeof process !== "undefined") {
    nodeProcess = process;
  }
  var isElectronRenderer = typeof ((_a = nodeProcess === null || nodeProcess === void 0 ? void 0 : nodeProcess.versions) === null || _a === void 0 ? void 0 : _a.electron) === "string" && nodeProcess.type === "renderer";
  var isElectronSandboxed = isElectronRenderer && (nodeProcess === null || nodeProcess === void 0 ? void 0 : nodeProcess.sandboxed);
  var browserCodeLoadingCacheStrategy = (() => {
    if (isElectronSandboxed) {
      return "bypassHeatCheck";
    }
    const env2 = nodeProcess === null || nodeProcess === void 0 ? void 0 : nodeProcess.env["VSCODE_BROWSER_CODE_LOADING"];
    if (typeof env2 === "string") {
      if (env2 === "none" || env2 === "code" || env2 === "bypassHeatCheck" || env2 === "bypassHeatCheckAndEagerCompile") {
        return env2;
      }
      return "bypassHeatCheck";
    }
    return void 0;
  })();
  if (typeof navigator === "object" && !isElectronRenderer) {
    _userAgent = navigator.userAgent;
    _isWindows = _userAgent.indexOf("Windows") >= 0;
    _isMacintosh = _userAgent.indexOf("Macintosh") >= 0;
    _isIOS = (_userAgent.indexOf("Macintosh") >= 0 || _userAgent.indexOf("iPad") >= 0 || _userAgent.indexOf("iPhone") >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
    _isLinux = _userAgent.indexOf("Linux") >= 0;
    _isWeb = true;
    _locale = navigator.language;
    _language = _locale;
  } else if (typeof nodeProcess === "object") {
    _isWindows = nodeProcess.platform === "win32";
    _isMacintosh = nodeProcess.platform === "darwin";
    _isLinux = nodeProcess.platform === "linux";
    _isLinuxSnap = _isLinux && !!nodeProcess.env["SNAP"] && !!nodeProcess.env["SNAP_REVISION"];
    _locale = LANGUAGE_DEFAULT;
    _language = LANGUAGE_DEFAULT;
    const rawNlsConfig = nodeProcess.env["VSCODE_NLS_CONFIG"];
    if (rawNlsConfig) {
      try {
        const nlsConfig = JSON.parse(rawNlsConfig);
        const resolved = nlsConfig.availableLanguages["*"];
        _locale = nlsConfig.locale;
        _language = resolved ? resolved : LANGUAGE_DEFAULT;
        _translationsConfigFile = nlsConfig._translationsConfigFile;
      } catch (e) {
      }
    }
    _isNative = true;
  } else {
    console.error("Unable to resolve platform.");
  }
  var _platform = 0;
  if (_isMacintosh) {
    _platform = 1;
  } else if (_isWindows) {
    _platform = 3;
  } else if (_isLinux) {
    _platform = 2;
  }
  var isWindows = _isWindows;
  var isMacintosh = _isMacintosh;
  var setImmediate = function defineSetImmediate() {
    if (globals.setImmediate) {
      return globals.setImmediate.bind(globals);
    }
    if (typeof globals.postMessage === "function" && !globals.importScripts) {
      let pending = [];
      globals.addEventListener("message", (e) => {
        if (e.data && e.data.vscodeSetImmediateId) {
          for (let i = 0, len = pending.length; i < len; i++) {
            const candidate = pending[i];
            if (candidate.id === e.data.vscodeSetImmediateId) {
              pending.splice(i, 1);
              candidate.callback();
              return;
            }
          }
        }
      });
      let lastId = 0;
      return (callback) => {
        const myId = ++lastId;
        pending.push({
          id: myId,
          callback
        });
        globals.postMessage({ vscodeSetImmediateId: myId }, "*");
      };
    }
    if (typeof (nodeProcess === null || nodeProcess === void 0 ? void 0 : nodeProcess.nextTick) === "function") {
      return nodeProcess.nextTick.bind(nodeProcess);
    }
    const _promise = Promise.resolve();
    return (callback) => _promise.then(callback);
  }();

  // node_modules/monaco-editor/esm/vs/base/common/types.js
  function getAllPropertyNames(obj) {
    let res = [];
    let proto = Object.getPrototypeOf(obj);
    while (Object.prototype !== proto) {
      res = res.concat(Object.getOwnPropertyNames(proto));
      proto = Object.getPrototypeOf(proto);
    }
    return res;
  }
  function getAllMethodNames(obj) {
    const methods = [];
    for (const prop of getAllPropertyNames(obj)) {
      if (typeof obj[prop] === "function") {
        methods.push(prop);
      }
    }
    return methods;
  }
  function createProxyObject(methodNames, invoke) {
    const createProxyMethod = (method) => {
      return function() {
        const args = Array.prototype.slice.call(arguments, 0);
        return invoke(method, args);
      };
    };
    let result = {};
    for (const methodName of methodNames) {
      result[methodName] = createProxyMethod(methodName);
    }
    return result;
  }

  // node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker.js
  var INITIALIZE = "$initialize";
  var SimpleWorkerProtocol = class {
    constructor(handler) {
      this._workerId = -1;
      this._handler = handler;
      this._lastSentReq = 0;
      this._pendingReplies = Object.create(null);
    }
    setWorkerId(workerId) {
      this._workerId = workerId;
    }
    sendMessage(method, args) {
      let req = String(++this._lastSentReq);
      return new Promise((resolve2, reject) => {
        this._pendingReplies[req] = {
          resolve: resolve2,
          reject
        };
        this._send({
          vsWorker: this._workerId,
          req,
          method,
          args
        });
      });
    }
    handleMessage(message) {
      if (!message || !message.vsWorker) {
        return;
      }
      if (this._workerId !== -1 && message.vsWorker !== this._workerId) {
        return;
      }
      this._handleMessage(message);
    }
    _handleMessage(msg) {
      if (msg.seq) {
        let replyMessage = msg;
        if (!this._pendingReplies[replyMessage.seq]) {
          console.warn("Got reply to unknown seq");
          return;
        }
        let reply = this._pendingReplies[replyMessage.seq];
        delete this._pendingReplies[replyMessage.seq];
        if (replyMessage.err) {
          let err = replyMessage.err;
          if (replyMessage.err.$isError) {
            err = new Error();
            err.name = replyMessage.err.name;
            err.message = replyMessage.err.message;
            err.stack = replyMessage.err.stack;
          }
          reply.reject(err);
          return;
        }
        reply.resolve(replyMessage.res);
        return;
      }
      let requestMessage = msg;
      let req = requestMessage.req;
      let result = this._handler.handleMessage(requestMessage.method, requestMessage.args);
      result.then((r) => {
        this._send({
          vsWorker: this._workerId,
          seq: req,
          res: r,
          err: void 0
        });
      }, (e) => {
        if (e.detail instanceof Error) {
          e.detail = transformErrorForSerialization(e.detail);
        }
        this._send({
          vsWorker: this._workerId,
          seq: req,
          res: void 0,
          err: transformErrorForSerialization(e)
        });
      });
    }
    _send(msg) {
      let transfer = [];
      if (msg.req) {
        const m = msg;
        for (let i = 0; i < m.args.length; i++) {
          if (m.args[i] instanceof ArrayBuffer) {
            transfer.push(m.args[i]);
          }
        }
      } else {
        const m = msg;
        if (m.res instanceof ArrayBuffer) {
          transfer.push(m.res);
        }
      }
      this._handler.sendMessage(msg, transfer);
    }
  };
  var SimpleWorkerServer = class {
    constructor(postMessage, requestHandlerFactory) {
      this._requestHandlerFactory = requestHandlerFactory;
      this._requestHandler = null;
      this._protocol = new SimpleWorkerProtocol({
        sendMessage: (msg, transfer) => {
          postMessage(msg, transfer);
        },
        handleMessage: (method, args) => this._handleMessage(method, args)
      });
    }
    onmessage(msg) {
      this._protocol.handleMessage(msg);
    }
    _handleMessage(method, args) {
      if (method === INITIALIZE) {
        return this.initialize(args[0], args[1], args[2], args[3]);
      }
      if (!this._requestHandler || typeof this._requestHandler[method] !== "function") {
        return Promise.reject(new Error("Missing requestHandler or method: " + method));
      }
      try {
        return Promise.resolve(this._requestHandler[method].apply(this._requestHandler, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    initialize(workerId, loaderConfig, moduleId, hostMethods) {
      this._protocol.setWorkerId(workerId);
      const proxyMethodRequest = (method, args) => {
        return this._protocol.sendMessage(method, args);
      };
      const hostProxy = createProxyObject(hostMethods, proxyMethodRequest);
      if (this._requestHandlerFactory) {
        this._requestHandler = this._requestHandlerFactory(hostProxy);
        return Promise.resolve(getAllMethodNames(this._requestHandler));
      }
      if (loaderConfig) {
        if (typeof loaderConfig.baseUrl !== "undefined") {
          delete loaderConfig["baseUrl"];
        }
        if (typeof loaderConfig.paths !== "undefined") {
          if (typeof loaderConfig.paths.vs !== "undefined") {
            delete loaderConfig.paths["vs"];
          }
        }
        if (typeof loaderConfig.trustedTypesPolicy !== void 0) {
          delete loaderConfig["trustedTypesPolicy"];
        }
        loaderConfig.catchError = true;
        self.require.config(loaderConfig);
      }
      return new Promise((resolve2, reject) => {
        self.require([moduleId], (module) => {
          this._requestHandler = module.create(hostProxy);
          if (!this._requestHandler) {
            reject(new Error(`No RequestHandler!`));
            return;
          }
          resolve2(getAllMethodNames(this._requestHandler));
        }, reject);
      });
    }
  };

  // node_modules/monaco-editor/esm/vs/base/common/diff/diffChange.js
  var DiffChange = class {
    constructor(originalStart, originalLength, modifiedStart, modifiedLength) {
      this.originalStart = originalStart;
      this.originalLength = originalLength;
      this.modifiedStart = modifiedStart;
      this.modifiedLength = modifiedLength;
    }
    getOriginalEnd() {
      return this.originalStart + this.originalLength;
    }
    getModifiedEnd() {
      return this.modifiedStart + this.modifiedLength;
    }
  };

  // node_modules/monaco-editor/esm/vs/base/common/strings.js
  function splitLines(str) {
    return str.split(/\r\n|\r|\n/);
  }
  function firstNonWhitespaceIndex(str) {
    for (let i = 0, len = str.length; i < len; i++) {
      const chCode = str.charCodeAt(i);
      if (chCode !== 32 && chCode !== 9) {
        return i;
      }
    }
    return -1;
  }
  function lastNonWhitespaceIndex(str, startIndex = str.length - 1) {
    for (let i = startIndex; i >= 0; i--) {
      const chCode = str.charCodeAt(i);
      if (chCode !== 32 && chCode !== 9) {
        return i;
      }
    }
    return -1;
  }
  function isHighSurrogate(charCode) {
    return 55296 <= charCode && charCode <= 56319;
  }
  function isLowSurrogate(charCode) {
    return 56320 <= charCode && charCode <= 57343;
  }
  function computeCodePoint(highSurrogate, lowSurrogate) {
    return (highSurrogate - 55296 << 10) + (lowSurrogate - 56320) + 65536;
  }
  var UTF8_BOM_CHARACTER = String.fromCharCode(65279);
  var GraphemeBreakTree = class {
    constructor() {
      this._data = getGraphemeBreakRawData();
    }
    static getInstance() {
      if (!GraphemeBreakTree._INSTANCE) {
        GraphemeBreakTree._INSTANCE = new GraphemeBreakTree();
      }
      return GraphemeBreakTree._INSTANCE;
    }
    getGraphemeBreakType(codePoint) {
      if (codePoint < 32) {
        if (codePoint === 10) {
          return 3;
        }
        if (codePoint === 13) {
          return 2;
        }
        return 4;
      }
      if (codePoint < 127) {
        return 0;
      }
      const data = this._data;
      const nodeCount = data.length / 3;
      let nodeIndex = 1;
      while (nodeIndex <= nodeCount) {
        if (codePoint < data[3 * nodeIndex]) {
          nodeIndex = 2 * nodeIndex;
        } else if (codePoint > data[3 * nodeIndex + 1]) {
          nodeIndex = 2 * nodeIndex + 1;
        } else {
          return data[3 * nodeIndex + 2];
        }
      }
      return 0;
    }
  };
  GraphemeBreakTree._INSTANCE = null;
  function getGraphemeBreakRawData() {
    return JSON.parse("[0,0,0,51592,51592,11,44424,44424,11,72251,72254,5,7150,7150,7,48008,48008,11,55176,55176,11,128420,128420,14,3276,3277,5,9979,9980,14,46216,46216,11,49800,49800,11,53384,53384,11,70726,70726,5,122915,122916,5,129320,129327,14,2558,2558,5,5906,5908,5,9762,9763,14,43360,43388,8,45320,45320,11,47112,47112,11,48904,48904,11,50696,50696,11,52488,52488,11,54280,54280,11,70082,70083,1,71350,71350,7,73111,73111,5,127892,127893,14,128726,128727,14,129473,129474,14,2027,2035,5,2901,2902,5,3784,3789,5,6754,6754,5,8418,8420,5,9877,9877,14,11088,11088,14,44008,44008,5,44872,44872,11,45768,45768,11,46664,46664,11,47560,47560,11,48456,48456,11,49352,49352,11,50248,50248,11,51144,51144,11,52040,52040,11,52936,52936,11,53832,53832,11,54728,54728,11,69811,69814,5,70459,70460,5,71096,71099,7,71998,71998,5,72874,72880,5,119149,119149,7,127374,127374,14,128335,128335,14,128482,128482,14,128765,128767,14,129399,129400,14,129680,129685,14,1476,1477,5,2377,2380,7,2759,2760,5,3137,3140,7,3458,3459,7,4153,4154,5,6432,6434,5,6978,6978,5,7675,7679,5,9723,9726,14,9823,9823,14,9919,9923,14,10035,10036,14,42736,42737,5,43596,43596,5,44200,44200,11,44648,44648,11,45096,45096,11,45544,45544,11,45992,45992,11,46440,46440,11,46888,46888,11,47336,47336,11,47784,47784,11,48232,48232,11,48680,48680,11,49128,49128,11,49576,49576,11,50024,50024,11,50472,50472,11,50920,50920,11,51368,51368,11,51816,51816,11,52264,52264,11,52712,52712,11,53160,53160,11,53608,53608,11,54056,54056,11,54504,54504,11,54952,54952,11,68108,68111,5,69933,69940,5,70197,70197,7,70498,70499,7,70845,70845,5,71229,71229,5,71727,71735,5,72154,72155,5,72344,72345,5,73023,73029,5,94095,94098,5,121403,121452,5,126981,127182,14,127538,127546,14,127990,127990,14,128391,128391,14,128445,128449,14,128500,128505,14,128752,128752,14,129160,129167,14,129356,129356,14,129432,129442,14,129648,129651,14,129751,131069,14,173,173,4,1757,1757,1,2274,2274,1,2494,2494,5,2641,2641,5,2876,2876,5,3014,3016,7,3262,3262,7,3393,3396,5,3570,3571,7,3968,3972,5,4228,4228,7,6086,6086,5,6679,6680,5,6912,6915,5,7080,7081,5,7380,7392,5,8252,8252,14,9096,9096,14,9748,9749,14,9784,9786,14,9833,9850,14,9890,9894,14,9938,9938,14,9999,9999,14,10085,10087,14,12349,12349,14,43136,43137,7,43454,43456,7,43755,43755,7,44088,44088,11,44312,44312,11,44536,44536,11,44760,44760,11,44984,44984,11,45208,45208,11,45432,45432,11,45656,45656,11,45880,45880,11,46104,46104,11,46328,46328,11,46552,46552,11,46776,46776,11,47000,47000,11,47224,47224,11,47448,47448,11,47672,47672,11,47896,47896,11,48120,48120,11,48344,48344,11,48568,48568,11,48792,48792,11,49016,49016,11,49240,49240,11,49464,49464,11,49688,49688,11,49912,49912,11,50136,50136,11,50360,50360,11,50584,50584,11,50808,50808,11,51032,51032,11,51256,51256,11,51480,51480,11,51704,51704,11,51928,51928,11,52152,52152,11,52376,52376,11,52600,52600,11,52824,52824,11,53048,53048,11,53272,53272,11,53496,53496,11,53720,53720,11,53944,53944,11,54168,54168,11,54392,54392,11,54616,54616,11,54840,54840,11,55064,55064,11,65438,65439,5,69633,69633,5,69837,69837,1,70018,70018,7,70188,70190,7,70368,70370,7,70465,70468,7,70712,70719,5,70835,70840,5,70850,70851,5,71132,71133,5,71340,71340,7,71458,71461,5,71985,71989,7,72002,72002,7,72193,72202,5,72281,72283,5,72766,72766,7,72885,72886,5,73104,73105,5,92912,92916,5,113824,113827,4,119173,119179,5,121505,121519,5,125136,125142,5,127279,127279,14,127489,127490,14,127570,127743,14,127900,127901,14,128254,128254,14,128369,128370,14,128400,128400,14,128425,128432,14,128468,128475,14,128489,128494,14,128715,128720,14,128745,128745,14,128759,128760,14,129004,129023,14,129296,129304,14,129340,129342,14,129388,129392,14,129404,129407,14,129454,129455,14,129485,129487,14,129659,129663,14,129719,129727,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2363,2363,7,2402,2403,5,2507,2508,7,2622,2624,7,2691,2691,7,2786,2787,5,2881,2884,5,3006,3006,5,3072,3072,5,3170,3171,5,3267,3268,7,3330,3331,7,3406,3406,1,3538,3540,5,3655,3662,5,3897,3897,5,4038,4038,5,4184,4185,5,4352,4447,8,6068,6069,5,6155,6157,5,6448,6449,7,6742,6742,5,6783,6783,5,6966,6970,5,7042,7042,7,7143,7143,7,7212,7219,5,7412,7412,5,8206,8207,4,8294,8303,4,8596,8601,14,9410,9410,14,9742,9742,14,9757,9757,14,9770,9770,14,9794,9794,14,9828,9828,14,9855,9855,14,9882,9882,14,9900,9903,14,9929,9933,14,9963,9967,14,9987,9988,14,10006,10006,14,10062,10062,14,10175,10175,14,11744,11775,5,42607,42607,5,43043,43044,7,43263,43263,5,43444,43445,7,43569,43570,5,43698,43700,5,43766,43766,5,44032,44032,11,44144,44144,11,44256,44256,11,44368,44368,11,44480,44480,11,44592,44592,11,44704,44704,11,44816,44816,11,44928,44928,11,45040,45040,11,45152,45152,11,45264,45264,11,45376,45376,11,45488,45488,11,45600,45600,11,45712,45712,11,45824,45824,11,45936,45936,11,46048,46048,11,46160,46160,11,46272,46272,11,46384,46384,11,46496,46496,11,46608,46608,11,46720,46720,11,46832,46832,11,46944,46944,11,47056,47056,11,47168,47168,11,47280,47280,11,47392,47392,11,47504,47504,11,47616,47616,11,47728,47728,11,47840,47840,11,47952,47952,11,48064,48064,11,48176,48176,11,48288,48288,11,48400,48400,11,48512,48512,11,48624,48624,11,48736,48736,11,48848,48848,11,48960,48960,11,49072,49072,11,49184,49184,11,49296,49296,11,49408,49408,11,49520,49520,11,49632,49632,11,49744,49744,11,49856,49856,11,49968,49968,11,50080,50080,11,50192,50192,11,50304,50304,11,50416,50416,11,50528,50528,11,50640,50640,11,50752,50752,11,50864,50864,11,50976,50976,11,51088,51088,11,51200,51200,11,51312,51312,11,51424,51424,11,51536,51536,11,51648,51648,11,51760,51760,11,51872,51872,11,51984,51984,11,52096,52096,11,52208,52208,11,52320,52320,11,52432,52432,11,52544,52544,11,52656,52656,11,52768,52768,11,52880,52880,11,52992,52992,11,53104,53104,11,53216,53216,11,53328,53328,11,53440,53440,11,53552,53552,11,53664,53664,11,53776,53776,11,53888,53888,11,54000,54000,11,54112,54112,11,54224,54224,11,54336,54336,11,54448,54448,11,54560,54560,11,54672,54672,11,54784,54784,11,54896,54896,11,55008,55008,11,55120,55120,11,64286,64286,5,66272,66272,5,68900,68903,5,69762,69762,7,69817,69818,5,69927,69931,5,70003,70003,5,70070,70078,5,70094,70094,7,70194,70195,7,70206,70206,5,70400,70401,5,70463,70463,7,70475,70477,7,70512,70516,5,70722,70724,5,70832,70832,5,70842,70842,5,70847,70848,5,71088,71089,7,71102,71102,7,71219,71226,5,71231,71232,5,71342,71343,7,71453,71455,5,71463,71467,5,71737,71738,5,71995,71996,5,72000,72000,7,72145,72147,7,72160,72160,5,72249,72249,7,72273,72278,5,72330,72342,5,72752,72758,5,72850,72871,5,72882,72883,5,73018,73018,5,73031,73031,5,73109,73109,5,73461,73462,7,94031,94031,5,94192,94193,7,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,126976,126979,14,127184,127231,14,127344,127345,14,127405,127461,14,127514,127514,14,127561,127567,14,127778,127779,14,127896,127896,14,127985,127986,14,127995,127999,5,128326,128328,14,128360,128366,14,128378,128378,14,128394,128397,14,128405,128406,14,128422,128423,14,128435,128443,14,128453,128464,14,128479,128480,14,128484,128487,14,128496,128498,14,128640,128709,14,128723,128724,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129096,129103,14,129292,129292,14,129311,129311,14,129329,129330,14,129344,129349,14,129360,129374,14,129394,129394,14,129402,129402,14,129413,129425,14,129445,129450,14,129466,129471,14,129483,129483,14,129511,129535,14,129653,129655,14,129667,129670,14,129705,129711,14,129731,129743,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2307,2307,7,2366,2368,7,2382,2383,7,2434,2435,7,2497,2500,5,2519,2519,5,2563,2563,7,2631,2632,5,2677,2677,5,2750,2752,7,2763,2764,7,2817,2817,5,2879,2879,5,2891,2892,7,2914,2915,5,3008,3008,5,3021,3021,5,3076,3076,5,3146,3149,5,3202,3203,7,3264,3265,7,3271,3272,7,3298,3299,5,3390,3390,5,3402,3404,7,3426,3427,5,3535,3535,5,3544,3550,7,3635,3635,7,3763,3763,7,3893,3893,5,3953,3966,5,3981,3991,5,4145,4145,7,4157,4158,5,4209,4212,5,4237,4237,5,4520,4607,10,5970,5971,5,6071,6077,5,6089,6099,5,6277,6278,5,6439,6440,5,6451,6456,7,6683,6683,5,6744,6750,5,6765,6770,7,6846,6846,5,6964,6964,5,6972,6972,5,7019,7027,5,7074,7077,5,7083,7085,5,7146,7148,7,7154,7155,7,7222,7223,5,7394,7400,5,7416,7417,5,8204,8204,5,8233,8233,4,8288,8292,4,8413,8416,5,8482,8482,14,8986,8987,14,9193,9203,14,9654,9654,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9775,14,9792,9792,14,9800,9811,14,9825,9826,14,9831,9831,14,9852,9853,14,9872,9873,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9936,9936,14,9941,9960,14,9974,9974,14,9982,9985,14,9992,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10145,10145,14,11013,11015,14,11503,11505,5,12334,12335,5,12951,12951,14,42612,42621,5,43014,43014,5,43047,43047,7,43204,43205,5,43335,43345,5,43395,43395,7,43450,43451,7,43561,43566,5,43573,43574,5,43644,43644,5,43710,43711,5,43758,43759,7,44005,44005,5,44012,44012,7,44060,44060,11,44116,44116,11,44172,44172,11,44228,44228,11,44284,44284,11,44340,44340,11,44396,44396,11,44452,44452,11,44508,44508,11,44564,44564,11,44620,44620,11,44676,44676,11,44732,44732,11,44788,44788,11,44844,44844,11,44900,44900,11,44956,44956,11,45012,45012,11,45068,45068,11,45124,45124,11,45180,45180,11,45236,45236,11,45292,45292,11,45348,45348,11,45404,45404,11,45460,45460,11,45516,45516,11,45572,45572,11,45628,45628,11,45684,45684,11,45740,45740,11,45796,45796,11,45852,45852,11,45908,45908,11,45964,45964,11,46020,46020,11,46076,46076,11,46132,46132,11,46188,46188,11,46244,46244,11,46300,46300,11,46356,46356,11,46412,46412,11,46468,46468,11,46524,46524,11,46580,46580,11,46636,46636,11,46692,46692,11,46748,46748,11,46804,46804,11,46860,46860,11,46916,46916,11,46972,46972,11,47028,47028,11,47084,47084,11,47140,47140,11,47196,47196,11,47252,47252,11,47308,47308,11,47364,47364,11,47420,47420,11,47476,47476,11,47532,47532,11,47588,47588,11,47644,47644,11,47700,47700,11,47756,47756,11,47812,47812,11,47868,47868,11,47924,47924,11,47980,47980,11,48036,48036,11,48092,48092,11,48148,48148,11,48204,48204,11,48260,48260,11,48316,48316,11,48372,48372,11,48428,48428,11,48484,48484,11,48540,48540,11,48596,48596,11,48652,48652,11,48708,48708,11,48764,48764,11,48820,48820,11,48876,48876,11,48932,48932,11,48988,48988,11,49044,49044,11,49100,49100,11,49156,49156,11,49212,49212,11,49268,49268,11,49324,49324,11,49380,49380,11,49436,49436,11,49492,49492,11,49548,49548,11,49604,49604,11,49660,49660,11,49716,49716,11,49772,49772,11,49828,49828,11,49884,49884,11,49940,49940,11,49996,49996,11,50052,50052,11,50108,50108,11,50164,50164,11,50220,50220,11,50276,50276,11,50332,50332,11,50388,50388,11,50444,50444,11,50500,50500,11,50556,50556,11,50612,50612,11,50668,50668,11,50724,50724,11,50780,50780,11,50836,50836,11,50892,50892,11,50948,50948,11,51004,51004,11,51060,51060,11,51116,51116,11,51172,51172,11,51228,51228,11,51284,51284,11,51340,51340,11,51396,51396,11,51452,51452,11,51508,51508,11,51564,51564,11,51620,51620,11,51676,51676,11,51732,51732,11,51788,51788,11,51844,51844,11,51900,51900,11,51956,51956,11,52012,52012,11,52068,52068,11,52124,52124,11,52180,52180,11,52236,52236,11,52292,52292,11,52348,52348,11,52404,52404,11,52460,52460,11,52516,52516,11,52572,52572,11,52628,52628,11,52684,52684,11,52740,52740,11,52796,52796,11,52852,52852,11,52908,52908,11,52964,52964,11,53020,53020,11,53076,53076,11,53132,53132,11,53188,53188,11,53244,53244,11,53300,53300,11,53356,53356,11,53412,53412,11,53468,53468,11,53524,53524,11,53580,53580,11,53636,53636,11,53692,53692,11,53748,53748,11,53804,53804,11,53860,53860,11,53916,53916,11,53972,53972,11,54028,54028,11,54084,54084,11,54140,54140,11,54196,54196,11,54252,54252,11,54308,54308,11,54364,54364,11,54420,54420,11,54476,54476,11,54532,54532,11,54588,54588,11,54644,54644,11,54700,54700,11,54756,54756,11,54812,54812,11,54868,54868,11,54924,54924,11,54980,54980,11,55036,55036,11,55092,55092,11,55148,55148,11,55216,55238,9,65056,65071,5,65529,65531,4,68097,68099,5,68159,68159,5,69446,69456,5,69688,69702,5,69808,69810,7,69815,69816,7,69821,69821,1,69888,69890,5,69932,69932,7,69957,69958,7,70016,70017,5,70067,70069,7,70079,70080,7,70089,70092,5,70095,70095,5,70191,70193,5,70196,70196,5,70198,70199,5,70367,70367,5,70371,70378,5,70402,70403,7,70462,70462,5,70464,70464,5,70471,70472,7,70487,70487,5,70502,70508,5,70709,70711,7,70720,70721,7,70725,70725,7,70750,70750,5,70833,70834,7,70841,70841,7,70843,70844,7,70846,70846,7,70849,70849,7,71087,71087,5,71090,71093,5,71100,71101,5,71103,71104,5,71216,71218,7,71227,71228,7,71230,71230,7,71339,71339,5,71341,71341,5,71344,71349,5,71351,71351,5,71456,71457,7,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123628,123631,5,125252,125258,5,126980,126980,14,127183,127183,14,127245,127247,14,127340,127343,14,127358,127359,14,127377,127386,14,127462,127487,6,127491,127503,14,127535,127535,14,127548,127551,14,127568,127569,14,127744,127777,14,127780,127891,14,127894,127895,14,127897,127899,14,127902,127984,14,127987,127989,14,127991,127994,14,128000,128253,14,128255,128317,14,128329,128334,14,128336,128359,14,128367,128368,14,128371,128377,14,128379,128390,14,128392,128393,14,128398,128399,14,128401,128404,14,128407,128419,14,128421,128421,14,128424,128424,14,128433,128434,14,128444,128444,14,128450,128452,14,128465,128467,14,128476,128478,14,128481,128481,14,128483,128483,14,128488,128488,14,128495,128495,14,128499,128499,14,128506,128591,14,128710,128714,14,128721,128722,14,128725,128725,14,128728,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129664,129666,14,129671,129679,14,129686,129704,14,129712,129718,14,129728,129730,14,129744,129750,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2259,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3134,3136,5,3142,3144,5,3157,3158,5,3201,3201,5,3260,3260,5,3263,3263,5,3266,3266,5,3270,3270,5,3274,3275,7,3285,3286,5,3328,3329,5,3387,3388,5,3391,3392,7,3398,3400,7,3405,3405,5,3415,3415,5,3457,3457,5,3530,3530,5,3536,3537,7,3542,3542,5,3551,3551,5,3633,3633,5,3636,3642,5,3761,3761,5,3764,3772,5,3864,3865,5,3895,3895,5,3902,3903,7,3967,3967,7,3974,3975,5,3993,4028,5,4141,4144,5,4146,4151,5,4155,4156,7,4182,4183,7,4190,4192,5,4226,4226,5,4229,4230,5,4253,4253,5,4448,4519,9,4957,4959,5,5938,5940,5,6002,6003,5,6070,6070,7,6078,6085,7,6087,6088,7,6109,6109,5,6158,6158,4,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6848,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7673,5,8203,8203,4,8205,8205,13,8232,8232,4,8234,8238,4,8265,8265,14,8293,8293,4,8400,8412,5,8417,8417,5,8421,8432,5,8505,8505,14,8617,8618,14,9000,9000,14,9167,9167,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9776,9783,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9935,14,9937,9937,14,9939,9940,14,9961,9962,14,9968,9973,14,9975,9978,14,9981,9981,14,9986,9986,14,9989,9989,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10084,14,10133,10135,14,10160,10160,14,10548,10549,14,11035,11036,14,11093,11093,14,11647,11647,5,12330,12333,5,12336,12336,14,12441,12442,5,12953,12953,14,42608,42610,5,42654,42655,5,43010,43010,5,43019,43019,5,43045,43046,5,43052,43052,5,43188,43203,7,43232,43249,5,43302,43309,5,43346,43347,7,43392,43394,5,43443,43443,5,43446,43449,5,43452,43453,5,43493,43493,5,43567,43568,7,43571,43572,7,43587,43587,5,43597,43597,7,43696,43696,5,43703,43704,5,43713,43713,5,43756,43757,5,43765,43765,7,44003,44004,7,44006,44007,7,44009,44010,7,44013,44013,5,44033,44059,12,44061,44087,12,44089,44115,12,44117,44143,12,44145,44171,12,44173,44199,12,44201,44227,12,44229,44255,12,44257,44283,12,44285,44311,12,44313,44339,12,44341,44367,12,44369,44395,12,44397,44423,12,44425,44451,12,44453,44479,12,44481,44507,12,44509,44535,12,44537,44563,12,44565,44591,12,44593,44619,12,44621,44647,12,44649,44675,12,44677,44703,12,44705,44731,12,44733,44759,12,44761,44787,12,44789,44815,12,44817,44843,12,44845,44871,12,44873,44899,12,44901,44927,12,44929,44955,12,44957,44983,12,44985,45011,12,45013,45039,12,45041,45067,12,45069,45095,12,45097,45123,12,45125,45151,12,45153,45179,12,45181,45207,12,45209,45235,12,45237,45263,12,45265,45291,12,45293,45319,12,45321,45347,12,45349,45375,12,45377,45403,12,45405,45431,12,45433,45459,12,45461,45487,12,45489,45515,12,45517,45543,12,45545,45571,12,45573,45599,12,45601,45627,12,45629,45655,12,45657,45683,12,45685,45711,12,45713,45739,12,45741,45767,12,45769,45795,12,45797,45823,12,45825,45851,12,45853,45879,12,45881,45907,12,45909,45935,12,45937,45963,12,45965,45991,12,45993,46019,12,46021,46047,12,46049,46075,12,46077,46103,12,46105,46131,12,46133,46159,12,46161,46187,12,46189,46215,12,46217,46243,12,46245,46271,12,46273,46299,12,46301,46327,12,46329,46355,12,46357,46383,12,46385,46411,12,46413,46439,12,46441,46467,12,46469,46495,12,46497,46523,12,46525,46551,12,46553,46579,12,46581,46607,12,46609,46635,12,46637,46663,12,46665,46691,12,46693,46719,12,46721,46747,12,46749,46775,12,46777,46803,12,46805,46831,12,46833,46859,12,46861,46887,12,46889,46915,12,46917,46943,12,46945,46971,12,46973,46999,12,47001,47027,12,47029,47055,12,47057,47083,12,47085,47111,12,47113,47139,12,47141,47167,12,47169,47195,12,47197,47223,12,47225,47251,12,47253,47279,12,47281,47307,12,47309,47335,12,47337,47363,12,47365,47391,12,47393,47419,12,47421,47447,12,47449,47475,12,47477,47503,12,47505,47531,12,47533,47559,12,47561,47587,12,47589,47615,12,47617,47643,12,47645,47671,12,47673,47699,12,47701,47727,12,47729,47755,12,47757,47783,12,47785,47811,12,47813,47839,12,47841,47867,12,47869,47895,12,47897,47923,12,47925,47951,12,47953,47979,12,47981,48007,12,48009,48035,12,48037,48063,12,48065,48091,12,48093,48119,12,48121,48147,12,48149,48175,12,48177,48203,12,48205,48231,12,48233,48259,12,48261,48287,12,48289,48315,12,48317,48343,12,48345,48371,12,48373,48399,12,48401,48427,12,48429,48455,12,48457,48483,12,48485,48511,12,48513,48539,12,48541,48567,12,48569,48595,12,48597,48623,12,48625,48651,12,48653,48679,12,48681,48707,12,48709,48735,12,48737,48763,12,48765,48791,12,48793,48819,12,48821,48847,12,48849,48875,12,48877,48903,12,48905,48931,12,48933,48959,12,48961,48987,12,48989,49015,12,49017,49043,12,49045,49071,12,49073,49099,12,49101,49127,12,49129,49155,12,49157,49183,12,49185,49211,12,49213,49239,12,49241,49267,12,49269,49295,12,49297,49323,12,49325,49351,12,49353,49379,12,49381,49407,12,49409,49435,12,49437,49463,12,49465,49491,12,49493,49519,12,49521,49547,12,49549,49575,12,49577,49603,12,49605,49631,12,49633,49659,12,49661,49687,12,49689,49715,12,49717,49743,12,49745,49771,12,49773,49799,12,49801,49827,12,49829,49855,12,49857,49883,12,49885,49911,12,49913,49939,12,49941,49967,12,49969,49995,12,49997,50023,12,50025,50051,12,50053,50079,12,50081,50107,12,50109,50135,12,50137,50163,12,50165,50191,12,50193,50219,12,50221,50247,12,50249,50275,12,50277,50303,12,50305,50331,12,50333,50359,12,50361,50387,12,50389,50415,12,50417,50443,12,50445,50471,12,50473,50499,12,50501,50527,12,50529,50555,12,50557,50583,12,50585,50611,12,50613,50639,12,50641,50667,12,50669,50695,12,50697,50723,12,50725,50751,12,50753,50779,12,50781,50807,12,50809,50835,12,50837,50863,12,50865,50891,12,50893,50919,12,50921,50947,12,50949,50975,12,50977,51003,12,51005,51031,12,51033,51059,12,51061,51087,12,51089,51115,12,51117,51143,12,51145,51171,12,51173,51199,12,51201,51227,12,51229,51255,12,51257,51283,12,51285,51311,12,51313,51339,12,51341,51367,12,51369,51395,12,51397,51423,12,51425,51451,12,51453,51479,12,51481,51507,12,51509,51535,12,51537,51563,12,51565,51591,12,51593,51619,12,51621,51647,12,51649,51675,12,51677,51703,12,51705,51731,12,51733,51759,12,51761,51787,12,51789,51815,12,51817,51843,12,51845,51871,12,51873,51899,12,51901,51927,12,51929,51955,12,51957,51983,12,51985,52011,12,52013,52039,12,52041,52067,12,52069,52095,12,52097,52123,12,52125,52151,12,52153,52179,12,52181,52207,12,52209,52235,12,52237,52263,12,52265,52291,12,52293,52319,12,52321,52347,12,52349,52375,12,52377,52403,12,52405,52431,12,52433,52459,12,52461,52487,12,52489,52515,12,52517,52543,12,52545,52571,12,52573,52599,12,52601,52627,12,52629,52655,12,52657,52683,12,52685,52711,12,52713,52739,12,52741,52767,12,52769,52795,12,52797,52823,12,52825,52851,12,52853,52879,12,52881,52907,12,52909,52935,12,52937,52963,12,52965,52991,12,52993,53019,12,53021,53047,12,53049,53075,12,53077,53103,12,53105,53131,12,53133,53159,12,53161,53187,12,53189,53215,12,53217,53243,12,53245,53271,12,53273,53299,12,53301,53327,12,53329,53355,12,53357,53383,12,53385,53411,12,53413,53439,12,53441,53467,12,53469,53495,12,53497,53523,12,53525,53551,12,53553,53579,12,53581,53607,12,53609,53635,12,53637,53663,12,53665,53691,12,53693,53719,12,53721,53747,12,53749,53775,12,53777,53803,12,53805,53831,12,53833,53859,12,53861,53887,12,53889,53915,12,53917,53943,12,53945,53971,12,53973,53999,12,54001,54027,12,54029,54055,12,54057,54083,12,54085,54111,12,54113,54139,12,54141,54167,12,54169,54195,12,54197,54223,12,54225,54251,12,54253,54279,12,54281,54307,12,54309,54335,12,54337,54363,12,54365,54391,12,54393,54419,12,54421,54447,12,54449,54475,12,54477,54503,12,54505,54531,12,54533,54559,12,54561,54587,12,54589,54615,12,54617,54643,12,54645,54671,12,54673,54699,12,54701,54727,12,54729,54755,12,54757,54783,12,54785,54811,12,54813,54839,12,54841,54867,12,54869,54895,12,54897,54923,12,54925,54951,12,54953,54979,12,54981,55007,12,55009,55035,12,55037,55063,12,55065,55091,12,55093,55119,12,55121,55147,12,55149,55175,12,55177,55203,12,55243,55291,10,65024,65039,5,65279,65279,4,65520,65528,4,66045,66045,5,66422,66426,5,68101,68102,5,68152,68154,5,68325,68326,5,69291,69292,5,69632,69632,7,69634,69634,7,69759,69761,5]");
  }

  // node_modules/monaco-editor/esm/vs/base/common/hash.js
  function numberHash(val, initialHashVal) {
    return (initialHashVal << 5) - initialHashVal + val | 0;
  }
  function stringHash(s, hashVal) {
    hashVal = numberHash(149417, hashVal);
    for (let i = 0, length = s.length; i < length; i++) {
      hashVal = numberHash(s.charCodeAt(i), hashVal);
    }
    return hashVal;
  }
  function leftRotate(value, bits, totalBits = 32) {
    const delta = totalBits - bits;
    const mask = ~((1 << delta) - 1);
    return (value << bits | (mask & value) >>> delta) >>> 0;
  }
  function fill(dest, index = 0, count = dest.byteLength, value = 0) {
    for (let i = 0; i < count; i++) {
      dest[index + i] = value;
    }
  }
  function leftPad(value, length, char = "0") {
    while (value.length < length) {
      value = char + value;
    }
    return value;
  }
  function toHexString(bufferOrValue, bitsize = 32) {
    if (bufferOrValue instanceof ArrayBuffer) {
      return Array.from(new Uint8Array(bufferOrValue)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    return leftPad((bufferOrValue >>> 0).toString(16), bitsize / 4);
  }
  var StringSHA1 = class {
    constructor() {
      this._h0 = 1732584193;
      this._h1 = 4023233417;
      this._h2 = 2562383102;
      this._h3 = 271733878;
      this._h4 = 3285377520;
      this._buff = new Uint8Array(64 + 3);
      this._buffDV = new DataView(this._buff.buffer);
      this._buffLen = 0;
      this._totalLen = 0;
      this._leftoverHighSurrogate = 0;
      this._finished = false;
    }
    update(str) {
      const strLen = str.length;
      if (strLen === 0) {
        return;
      }
      const buff = this._buff;
      let buffLen = this._buffLen;
      let leftoverHighSurrogate = this._leftoverHighSurrogate;
      let charCode;
      let offset;
      if (leftoverHighSurrogate !== 0) {
        charCode = leftoverHighSurrogate;
        offset = -1;
        leftoverHighSurrogate = 0;
      } else {
        charCode = str.charCodeAt(0);
        offset = 0;
      }
      while (true) {
        let codePoint = charCode;
        if (isHighSurrogate(charCode)) {
          if (offset + 1 < strLen) {
            const nextCharCode = str.charCodeAt(offset + 1);
            if (isLowSurrogate(nextCharCode)) {
              offset++;
              codePoint = computeCodePoint(charCode, nextCharCode);
            } else {
              codePoint = 65533;
            }
          } else {
            leftoverHighSurrogate = charCode;
            break;
          }
        } else if (isLowSurrogate(charCode)) {
          codePoint = 65533;
        }
        buffLen = this._push(buff, buffLen, codePoint);
        offset++;
        if (offset < strLen) {
          charCode = str.charCodeAt(offset);
        } else {
          break;
        }
      }
      this._buffLen = buffLen;
      this._leftoverHighSurrogate = leftoverHighSurrogate;
    }
    _push(buff, buffLen, codePoint) {
      if (codePoint < 128) {
        buff[buffLen++] = codePoint;
      } else if (codePoint < 2048) {
        buff[buffLen++] = 192 | (codePoint & 1984) >>> 6;
        buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
      } else if (codePoint < 65536) {
        buff[buffLen++] = 224 | (codePoint & 61440) >>> 12;
        buff[buffLen++] = 128 | (codePoint & 4032) >>> 6;
        buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
      } else {
        buff[buffLen++] = 240 | (codePoint & 1835008) >>> 18;
        buff[buffLen++] = 128 | (codePoint & 258048) >>> 12;
        buff[buffLen++] = 128 | (codePoint & 4032) >>> 6;
        buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
      }
      if (buffLen >= 64) {
        this._step();
        buffLen -= 64;
        this._totalLen += 64;
        buff[0] = buff[64 + 0];
        buff[1] = buff[64 + 1];
        buff[2] = buff[64 + 2];
      }
      return buffLen;
    }
    digest() {
      if (!this._finished) {
        this._finished = true;
        if (this._leftoverHighSurrogate) {
          this._leftoverHighSurrogate = 0;
          this._buffLen = this._push(this._buff, this._buffLen, 65533);
        }
        this._totalLen += this._buffLen;
        this._wrapUp();
      }
      return toHexString(this._h0) + toHexString(this._h1) + toHexString(this._h2) + toHexString(this._h3) + toHexString(this._h4);
    }
    _wrapUp() {
      this._buff[this._buffLen++] = 128;
      fill(this._buff, this._buffLen);
      if (this._buffLen > 56) {
        this._step();
        fill(this._buff);
      }
      const ml = 8 * this._totalLen;
      this._buffDV.setUint32(56, Math.floor(ml / 4294967296), false);
      this._buffDV.setUint32(60, ml % 4294967296, false);
      this._step();
    }
    _step() {
      const bigBlock32 = StringSHA1._bigBlock32;
      const data = this._buffDV;
      for (let j = 0; j < 64; j += 4) {
        bigBlock32.setUint32(j, data.getUint32(j, false), false);
      }
      for (let j = 64; j < 320; j += 4) {
        bigBlock32.setUint32(j, leftRotate(bigBlock32.getUint32(j - 12, false) ^ bigBlock32.getUint32(j - 32, false) ^ bigBlock32.getUint32(j - 56, false) ^ bigBlock32.getUint32(j - 64, false), 1), false);
      }
      let a = this._h0;
      let b = this._h1;
      let c = this._h2;
      let d = this._h3;
      let e = this._h4;
      let f, k;
      let temp;
      for (let j = 0; j < 80; j++) {
        if (j < 20) {
          f = b & c | ~b & d;
          k = 1518500249;
        } else if (j < 40) {
          f = b ^ c ^ d;
          k = 1859775393;
        } else if (j < 60) {
          f = b & c | b & d | c & d;
          k = 2400959708;
        } else {
          f = b ^ c ^ d;
          k = 3395469782;
        }
        temp = leftRotate(a, 5) + f + e + k + bigBlock32.getUint32(j * 4, false) & 4294967295;
        e = d;
        d = c;
        c = leftRotate(b, 30);
        b = a;
        a = temp;
      }
      this._h0 = this._h0 + a & 4294967295;
      this._h1 = this._h1 + b & 4294967295;
      this._h2 = this._h2 + c & 4294967295;
      this._h3 = this._h3 + d & 4294967295;
      this._h4 = this._h4 + e & 4294967295;
    }
  };
  StringSHA1._bigBlock32 = new DataView(new ArrayBuffer(320));

  // node_modules/monaco-editor/esm/vs/base/common/diff/diff.js
  var StringDiffSequence = class {
    constructor(source) {
      this.source = source;
    }
    getElements() {
      const source = this.source;
      const characters = new Int32Array(source.length);
      for (let i = 0, len = source.length; i < len; i++) {
        characters[i] = source.charCodeAt(i);
      }
      return characters;
    }
  };
  function stringDiff(original, modified, pretty) {
    return new LcsDiff(new StringDiffSequence(original), new StringDiffSequence(modified)).ComputeDiff(pretty).changes;
  }
  var Debug = class {
    static Assert(condition, message) {
      if (!condition) {
        throw new Error(message);
      }
    }
  };
  var MyArray = class {
    static Copy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
      for (let i = 0; i < length; i++) {
        destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
      }
    }
    static Copy2(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
      for (let i = 0; i < length; i++) {
        destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
      }
    }
  };
  var DiffChangeHelper = class {
    constructor() {
      this.m_changes = [];
      this.m_originalStart = 1073741824;
      this.m_modifiedStart = 1073741824;
      this.m_originalCount = 0;
      this.m_modifiedCount = 0;
    }
    MarkNextChange() {
      if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
        this.m_changes.push(new DiffChange(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount));
      }
      this.m_originalCount = 0;
      this.m_modifiedCount = 0;
      this.m_originalStart = 1073741824;
      this.m_modifiedStart = 1073741824;
    }
    AddOriginalElement(originalIndex, modifiedIndex) {
      this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
      this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
      this.m_originalCount++;
    }
    AddModifiedElement(originalIndex, modifiedIndex) {
      this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
      this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
      this.m_modifiedCount++;
    }
    getChanges() {
      if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
        this.MarkNextChange();
      }
      return this.m_changes;
    }
    getReverseChanges() {
      if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
        this.MarkNextChange();
      }
      this.m_changes.reverse();
      return this.m_changes;
    }
  };
  var LcsDiff = class {
    constructor(originalSequence, modifiedSequence, continueProcessingPredicate = null) {
      this.ContinueProcessingPredicate = continueProcessingPredicate;
      this._originalSequence = originalSequence;
      this._modifiedSequence = modifiedSequence;
      const [originalStringElements, originalElementsOrHash, originalHasStrings] = LcsDiff._getElements(originalSequence);
      const [modifiedStringElements, modifiedElementsOrHash, modifiedHasStrings] = LcsDiff._getElements(modifiedSequence);
      this._hasStrings = originalHasStrings && modifiedHasStrings;
      this._originalStringElements = originalStringElements;
      this._originalElementsOrHash = originalElementsOrHash;
      this._modifiedStringElements = modifiedStringElements;
      this._modifiedElementsOrHash = modifiedElementsOrHash;
      this.m_forwardHistory = [];
      this.m_reverseHistory = [];
    }
    static _isStringArray(arr) {
      return arr.length > 0 && typeof arr[0] === "string";
    }
    static _getElements(sequence) {
      const elements = sequence.getElements();
      if (LcsDiff._isStringArray(elements)) {
        const hashes = new Int32Array(elements.length);
        for (let i = 0, len = elements.length; i < len; i++) {
          hashes[i] = stringHash(elements[i], 0);
        }
        return [elements, hashes, true];
      }
      if (elements instanceof Int32Array) {
        return [[], elements, false];
      }
      return [[], new Int32Array(elements), false];
    }
    ElementsAreEqual(originalIndex, newIndex) {
      if (this._originalElementsOrHash[originalIndex] !== this._modifiedElementsOrHash[newIndex]) {
        return false;
      }
      return this._hasStrings ? this._originalStringElements[originalIndex] === this._modifiedStringElements[newIndex] : true;
    }
    ElementsAreStrictEqual(originalIndex, newIndex) {
      if (!this.ElementsAreEqual(originalIndex, newIndex)) {
        return false;
      }
      const originalElement = LcsDiff._getStrictElement(this._originalSequence, originalIndex);
      const modifiedElement = LcsDiff._getStrictElement(this._modifiedSequence, newIndex);
      return originalElement === modifiedElement;
    }
    static _getStrictElement(sequence, index) {
      if (typeof sequence.getStrictElement === "function") {
        return sequence.getStrictElement(index);
      }
      return null;
    }
    OriginalElementsAreEqual(index1, index2) {
      if (this._originalElementsOrHash[index1] !== this._originalElementsOrHash[index2]) {
        return false;
      }
      return this._hasStrings ? this._originalStringElements[index1] === this._originalStringElements[index2] : true;
    }
    ModifiedElementsAreEqual(index1, index2) {
      if (this._modifiedElementsOrHash[index1] !== this._modifiedElementsOrHash[index2]) {
        return false;
      }
      return this._hasStrings ? this._modifiedStringElements[index1] === this._modifiedStringElements[index2] : true;
    }
    ComputeDiff(pretty) {
      return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, pretty);
    }
    _ComputeDiff(originalStart, originalEnd, modifiedStart, modifiedEnd, pretty) {
      const quitEarlyArr = [false];
      let changes = this.ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr);
      if (pretty) {
        changes = this.PrettifyChanges(changes);
      }
      return {
        quitEarly: quitEarlyArr[0],
        changes
      };
    }
    ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr) {
      quitEarlyArr[0] = false;
      while (originalStart <= originalEnd && modifiedStart <= modifiedEnd && this.ElementsAreEqual(originalStart, modifiedStart)) {
        originalStart++;
        modifiedStart++;
      }
      while (originalEnd >= originalStart && modifiedEnd >= modifiedStart && this.ElementsAreEqual(originalEnd, modifiedEnd)) {
        originalEnd--;
        modifiedEnd--;
      }
      if (originalStart > originalEnd || modifiedStart > modifiedEnd) {
        let changes;
        if (modifiedStart <= modifiedEnd) {
          Debug.Assert(originalStart === originalEnd + 1, "originalStart should only be one more than originalEnd");
          changes = [
            new DiffChange(originalStart, 0, modifiedStart, modifiedEnd - modifiedStart + 1)
          ];
        } else if (originalStart <= originalEnd) {
          Debug.Assert(modifiedStart === modifiedEnd + 1, "modifiedStart should only be one more than modifiedEnd");
          changes = [
            new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, 0)
          ];
        } else {
          Debug.Assert(originalStart === originalEnd + 1, "originalStart should only be one more than originalEnd");
          Debug.Assert(modifiedStart === modifiedEnd + 1, "modifiedStart should only be one more than modifiedEnd");
          changes = [];
        }
        return changes;
      }
      const midOriginalArr = [0];
      const midModifiedArr = [0];
      const result = this.ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr);
      const midOriginal = midOriginalArr[0];
      const midModified = midModifiedArr[0];
      if (result !== null) {
        return result;
      } else if (!quitEarlyArr[0]) {
        const leftChanges = this.ComputeDiffRecursive(originalStart, midOriginal, modifiedStart, midModified, quitEarlyArr);
        let rightChanges = [];
        if (!quitEarlyArr[0]) {
          rightChanges = this.ComputeDiffRecursive(midOriginal + 1, originalEnd, midModified + 1, modifiedEnd, quitEarlyArr);
        } else {
          rightChanges = [
            new DiffChange(midOriginal + 1, originalEnd - (midOriginal + 1) + 1, midModified + 1, modifiedEnd - (midModified + 1) + 1)
          ];
        }
        return this.ConcatenateChanges(leftChanges, rightChanges);
      }
      return [
        new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
      ];
    }
    WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr) {
      let forwardChanges = null;
      let reverseChanges = null;
      let changeHelper = new DiffChangeHelper();
      let diagonalMin = diagonalForwardStart;
      let diagonalMax = diagonalForwardEnd;
      let diagonalRelative = midOriginalArr[0] - midModifiedArr[0] - diagonalForwardOffset;
      let lastOriginalIndex = -1073741824;
      let historyIndex = this.m_forwardHistory.length - 1;
      do {
        const diagonal = diagonalRelative + diagonalForwardBase;
        if (diagonal === diagonalMin || diagonal < diagonalMax && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1]) {
          originalIndex = forwardPoints[diagonal + 1];
          modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
          if (originalIndex < lastOriginalIndex) {
            changeHelper.MarkNextChange();
          }
          lastOriginalIndex = originalIndex;
          changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex);
          diagonalRelative = diagonal + 1 - diagonalForwardBase;
        } else {
          originalIndex = forwardPoints[diagonal - 1] + 1;
          modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
          if (originalIndex < lastOriginalIndex) {
            changeHelper.MarkNextChange();
          }
          lastOriginalIndex = originalIndex - 1;
          changeHelper.AddOriginalElement(originalIndex, modifiedIndex + 1);
          diagonalRelative = diagonal - 1 - diagonalForwardBase;
        }
        if (historyIndex >= 0) {
          forwardPoints = this.m_forwardHistory[historyIndex];
          diagonalForwardBase = forwardPoints[0];
          diagonalMin = 1;
          diagonalMax = forwardPoints.length - 1;
        }
      } while (--historyIndex >= -1);
      forwardChanges = changeHelper.getReverseChanges();
      if (quitEarlyArr[0]) {
        let originalStartPoint = midOriginalArr[0] + 1;
        let modifiedStartPoint = midModifiedArr[0] + 1;
        if (forwardChanges !== null && forwardChanges.length > 0) {
          const lastForwardChange = forwardChanges[forwardChanges.length - 1];
          originalStartPoint = Math.max(originalStartPoint, lastForwardChange.getOriginalEnd());
          modifiedStartPoint = Math.max(modifiedStartPoint, lastForwardChange.getModifiedEnd());
        }
        reverseChanges = [
          new DiffChange(originalStartPoint, originalEnd - originalStartPoint + 1, modifiedStartPoint, modifiedEnd - modifiedStartPoint + 1)
        ];
      } else {
        changeHelper = new DiffChangeHelper();
        diagonalMin = diagonalReverseStart;
        diagonalMax = diagonalReverseEnd;
        diagonalRelative = midOriginalArr[0] - midModifiedArr[0] - diagonalReverseOffset;
        lastOriginalIndex = 1073741824;
        historyIndex = deltaIsEven ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
        do {
          const diagonal = diagonalRelative + diagonalReverseBase;
          if (diagonal === diagonalMin || diagonal < diagonalMax && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1]) {
            originalIndex = reversePoints[diagonal + 1] - 1;
            modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
            if (originalIndex > lastOriginalIndex) {
              changeHelper.MarkNextChange();
            }
            lastOriginalIndex = originalIndex + 1;
            changeHelper.AddOriginalElement(originalIndex + 1, modifiedIndex + 1);
            diagonalRelative = diagonal + 1 - diagonalReverseBase;
          } else {
            originalIndex = reversePoints[diagonal - 1];
            modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
            if (originalIndex > lastOriginalIndex) {
              changeHelper.MarkNextChange();
            }
            lastOriginalIndex = originalIndex;
            changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex + 1);
            diagonalRelative = diagonal - 1 - diagonalReverseBase;
          }
          if (historyIndex >= 0) {
            reversePoints = this.m_reverseHistory[historyIndex];
            diagonalReverseBase = reversePoints[0];
            diagonalMin = 1;
            diagonalMax = reversePoints.length - 1;
          }
        } while (--historyIndex >= -1);
        reverseChanges = changeHelper.getChanges();
      }
      return this.ConcatenateChanges(forwardChanges, reverseChanges);
    }
    ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr) {
      let originalIndex = 0, modifiedIndex = 0;
      let diagonalForwardStart = 0, diagonalForwardEnd = 0;
      let diagonalReverseStart = 0, diagonalReverseEnd = 0;
      originalStart--;
      modifiedStart--;
      midOriginalArr[0] = 0;
      midModifiedArr[0] = 0;
      this.m_forwardHistory = [];
      this.m_reverseHistory = [];
      const maxDifferences = originalEnd - originalStart + (modifiedEnd - modifiedStart);
      const numDiagonals = maxDifferences + 1;
      const forwardPoints = new Int32Array(numDiagonals);
      const reversePoints = new Int32Array(numDiagonals);
      const diagonalForwardBase = modifiedEnd - modifiedStart;
      const diagonalReverseBase = originalEnd - originalStart;
      const diagonalForwardOffset = originalStart - modifiedStart;
      const diagonalReverseOffset = originalEnd - modifiedEnd;
      const delta = diagonalReverseBase - diagonalForwardBase;
      const deltaIsEven = delta % 2 === 0;
      forwardPoints[diagonalForwardBase] = originalStart;
      reversePoints[diagonalReverseBase] = originalEnd;
      quitEarlyArr[0] = false;
      for (let numDifferences = 1; numDifferences <= maxDifferences / 2 + 1; numDifferences++) {
        let furthestOriginalIndex = 0;
        let furthestModifiedIndex = 0;
        diagonalForwardStart = this.ClipDiagonalBound(diagonalForwardBase - numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
        diagonalForwardEnd = this.ClipDiagonalBound(diagonalForwardBase + numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
        for (let diagonal = diagonalForwardStart; diagonal <= diagonalForwardEnd; diagonal += 2) {
          if (diagonal === diagonalForwardStart || diagonal < diagonalForwardEnd && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1]) {
            originalIndex = forwardPoints[diagonal + 1];
          } else {
            originalIndex = forwardPoints[diagonal - 1] + 1;
          }
          modifiedIndex = originalIndex - (diagonal - diagonalForwardBase) - diagonalForwardOffset;
          const tempOriginalIndex = originalIndex;
          while (originalIndex < originalEnd && modifiedIndex < modifiedEnd && this.ElementsAreEqual(originalIndex + 1, modifiedIndex + 1)) {
            originalIndex++;
            modifiedIndex++;
          }
          forwardPoints[diagonal] = originalIndex;
          if (originalIndex + modifiedIndex > furthestOriginalIndex + furthestModifiedIndex) {
            furthestOriginalIndex = originalIndex;
            furthestModifiedIndex = modifiedIndex;
          }
          if (!deltaIsEven && Math.abs(diagonal - diagonalReverseBase) <= numDifferences - 1) {
            if (originalIndex >= reversePoints[diagonal]) {
              midOriginalArr[0] = originalIndex;
              midModifiedArr[0] = modifiedIndex;
              if (tempOriginalIndex <= reversePoints[diagonal] && 1447 > 0 && numDifferences <= 1447 + 1) {
                return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
              } else {
                return null;
              }
            }
          }
        }
        const matchLengthOfLongest = (furthestOriginalIndex - originalStart + (furthestModifiedIndex - modifiedStart) - numDifferences) / 2;
        if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(furthestOriginalIndex, matchLengthOfLongest)) {
          quitEarlyArr[0] = true;
          midOriginalArr[0] = furthestOriginalIndex;
          midModifiedArr[0] = furthestModifiedIndex;
          if (matchLengthOfLongest > 0 && 1447 > 0 && numDifferences <= 1447 + 1) {
            return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
          } else {
            originalStart++;
            modifiedStart++;
            return [
              new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
            ];
          }
        }
        diagonalReverseStart = this.ClipDiagonalBound(diagonalReverseBase - numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
        diagonalReverseEnd = this.ClipDiagonalBound(diagonalReverseBase + numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
        for (let diagonal = diagonalReverseStart; diagonal <= diagonalReverseEnd; diagonal += 2) {
          if (diagonal === diagonalReverseStart || diagonal < diagonalReverseEnd && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1]) {
            originalIndex = reversePoints[diagonal + 1] - 1;
          } else {
            originalIndex = reversePoints[diagonal - 1];
          }
          modifiedIndex = originalIndex - (diagonal - diagonalReverseBase) - diagonalReverseOffset;
          const tempOriginalIndex = originalIndex;
          while (originalIndex > originalStart && modifiedIndex > modifiedStart && this.ElementsAreEqual(originalIndex, modifiedIndex)) {
            originalIndex--;
            modifiedIndex--;
          }
          reversePoints[diagonal] = originalIndex;
          if (deltaIsEven && Math.abs(diagonal - diagonalForwardBase) <= numDifferences) {
            if (originalIndex <= forwardPoints[diagonal]) {
              midOriginalArr[0] = originalIndex;
              midModifiedArr[0] = modifiedIndex;
              if (tempOriginalIndex >= forwardPoints[diagonal] && 1447 > 0 && numDifferences <= 1447 + 1) {
                return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
              } else {
                return null;
              }
            }
          }
        }
        if (numDifferences <= 1447) {
          let temp = new Int32Array(diagonalForwardEnd - diagonalForwardStart + 2);
          temp[0] = diagonalForwardBase - diagonalForwardStart + 1;
          MyArray.Copy2(forwardPoints, diagonalForwardStart, temp, 1, diagonalForwardEnd - diagonalForwardStart + 1);
          this.m_forwardHistory.push(temp);
          temp = new Int32Array(diagonalReverseEnd - diagonalReverseStart + 2);
          temp[0] = diagonalReverseBase - diagonalReverseStart + 1;
          MyArray.Copy2(reversePoints, diagonalReverseStart, temp, 1, diagonalReverseEnd - diagonalReverseStart + 1);
          this.m_reverseHistory.push(temp);
        }
      }
      return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
    }
    PrettifyChanges(changes) {
      for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        const originalStop = i < changes.length - 1 ? changes[i + 1].originalStart : this._originalElementsOrHash.length;
        const modifiedStop = i < changes.length - 1 ? changes[i + 1].modifiedStart : this._modifiedElementsOrHash.length;
        const checkOriginal = change.originalLength > 0;
        const checkModified = change.modifiedLength > 0;
        while (change.originalStart + change.originalLength < originalStop && change.modifiedStart + change.modifiedLength < modifiedStop && (!checkOriginal || this.OriginalElementsAreEqual(change.originalStart, change.originalStart + change.originalLength)) && (!checkModified || this.ModifiedElementsAreEqual(change.modifiedStart, change.modifiedStart + change.modifiedLength))) {
          const startStrictEqual = this.ElementsAreStrictEqual(change.originalStart, change.modifiedStart);
          const endStrictEqual = this.ElementsAreStrictEqual(change.originalStart + change.originalLength, change.modifiedStart + change.modifiedLength);
          if (endStrictEqual && !startStrictEqual) {
            break;
          }
          change.originalStart++;
          change.modifiedStart++;
        }
        let mergedChangeArr = [null];
        if (i < changes.length - 1 && this.ChangesOverlap(changes[i], changes[i + 1], mergedChangeArr)) {
          changes[i] = mergedChangeArr[0];
          changes.splice(i + 1, 1);
          i--;
          continue;
        }
      }
      for (let i = changes.length - 1; i >= 0; i--) {
        const change = changes[i];
        let originalStop = 0;
        let modifiedStop = 0;
        if (i > 0) {
          const prevChange = changes[i - 1];
          originalStop = prevChange.originalStart + prevChange.originalLength;
          modifiedStop = prevChange.modifiedStart + prevChange.modifiedLength;
        }
        const checkOriginal = change.originalLength > 0;
        const checkModified = change.modifiedLength > 0;
        let bestDelta = 0;
        let bestScore = this._boundaryScore(change.originalStart, change.originalLength, change.modifiedStart, change.modifiedLength);
        for (let delta = 1; ; delta++) {
          const originalStart = change.originalStart - delta;
          const modifiedStart = change.modifiedStart - delta;
          if (originalStart < originalStop || modifiedStart < modifiedStop) {
            break;
          }
          if (checkOriginal && !this.OriginalElementsAreEqual(originalStart, originalStart + change.originalLength)) {
            break;
          }
          if (checkModified && !this.ModifiedElementsAreEqual(modifiedStart, modifiedStart + change.modifiedLength)) {
            break;
          }
          const touchingPreviousChange = originalStart === originalStop && modifiedStart === modifiedStop;
          const score = (touchingPreviousChange ? 5 : 0) + this._boundaryScore(originalStart, change.originalLength, modifiedStart, change.modifiedLength);
          if (score > bestScore) {
            bestScore = score;
            bestDelta = delta;
          }
        }
        change.originalStart -= bestDelta;
        change.modifiedStart -= bestDelta;
        const mergedChangeArr = [null];
        if (i > 0 && this.ChangesOverlap(changes[i - 1], changes[i], mergedChangeArr)) {
          changes[i - 1] = mergedChangeArr[0];
          changes.splice(i, 1);
          i++;
          continue;
        }
      }
      if (this._hasStrings) {
        for (let i = 1, len = changes.length; i < len; i++) {
          const aChange = changes[i - 1];
          const bChange = changes[i];
          const matchedLength = bChange.originalStart - aChange.originalStart - aChange.originalLength;
          const aOriginalStart = aChange.originalStart;
          const bOriginalEnd = bChange.originalStart + bChange.originalLength;
          const abOriginalLength = bOriginalEnd - aOriginalStart;
          const aModifiedStart = aChange.modifiedStart;
          const bModifiedEnd = bChange.modifiedStart + bChange.modifiedLength;
          const abModifiedLength = bModifiedEnd - aModifiedStart;
          if (matchedLength < 5 && abOriginalLength < 20 && abModifiedLength < 20) {
            const t = this._findBetterContiguousSequence(aOriginalStart, abOriginalLength, aModifiedStart, abModifiedLength, matchedLength);
            if (t) {
              const [originalMatchStart, modifiedMatchStart] = t;
              if (originalMatchStart !== aChange.originalStart + aChange.originalLength || modifiedMatchStart !== aChange.modifiedStart + aChange.modifiedLength) {
                aChange.originalLength = originalMatchStart - aChange.originalStart;
                aChange.modifiedLength = modifiedMatchStart - aChange.modifiedStart;
                bChange.originalStart = originalMatchStart + matchedLength;
                bChange.modifiedStart = modifiedMatchStart + matchedLength;
                bChange.originalLength = bOriginalEnd - bChange.originalStart;
                bChange.modifiedLength = bModifiedEnd - bChange.modifiedStart;
              }
            }
          }
        }
      }
      return changes;
    }
    _findBetterContiguousSequence(originalStart, originalLength, modifiedStart, modifiedLength, desiredLength) {
      if (originalLength < desiredLength || modifiedLength < desiredLength) {
        return null;
      }
      const originalMax = originalStart + originalLength - desiredLength + 1;
      const modifiedMax = modifiedStart + modifiedLength - desiredLength + 1;
      let bestScore = 0;
      let bestOriginalStart = 0;
      let bestModifiedStart = 0;
      for (let i = originalStart; i < originalMax; i++) {
        for (let j = modifiedStart; j < modifiedMax; j++) {
          const score = this._contiguousSequenceScore(i, j, desiredLength);
          if (score > 0 && score > bestScore) {
            bestScore = score;
            bestOriginalStart = i;
            bestModifiedStart = j;
          }
        }
      }
      if (bestScore > 0) {
        return [bestOriginalStart, bestModifiedStart];
      }
      return null;
    }
    _contiguousSequenceScore(originalStart, modifiedStart, length) {
      let score = 0;
      for (let l = 0; l < length; l++) {
        if (!this.ElementsAreEqual(originalStart + l, modifiedStart + l)) {
          return 0;
        }
        score += this._originalStringElements[originalStart + l].length;
      }
      return score;
    }
    _OriginalIsBoundary(index) {
      if (index <= 0 || index >= this._originalElementsOrHash.length - 1) {
        return true;
      }
      return this._hasStrings && /^\s*$/.test(this._originalStringElements[index]);
    }
    _OriginalRegionIsBoundary(originalStart, originalLength) {
      if (this._OriginalIsBoundary(originalStart) || this._OriginalIsBoundary(originalStart - 1)) {
        return true;
      }
      if (originalLength > 0) {
        const originalEnd = originalStart + originalLength;
        if (this._OriginalIsBoundary(originalEnd - 1) || this._OriginalIsBoundary(originalEnd)) {
          return true;
        }
      }
      return false;
    }
    _ModifiedIsBoundary(index) {
      if (index <= 0 || index >= this._modifiedElementsOrHash.length - 1) {
        return true;
      }
      return this._hasStrings && /^\s*$/.test(this._modifiedStringElements[index]);
    }
    _ModifiedRegionIsBoundary(modifiedStart, modifiedLength) {
      if (this._ModifiedIsBoundary(modifiedStart) || this._ModifiedIsBoundary(modifiedStart - 1)) {
        return true;
      }
      if (modifiedLength > 0) {
        const modifiedEnd = modifiedStart + modifiedLength;
        if (this._ModifiedIsBoundary(modifiedEnd - 1) || this._ModifiedIsBoundary(modifiedEnd)) {
          return true;
        }
      }
      return false;
    }
    _boundaryScore(originalStart, originalLength, modifiedStart, modifiedLength) {
      const originalScore = this._OriginalRegionIsBoundary(originalStart, originalLength) ? 1 : 0;
      const modifiedScore = this._ModifiedRegionIsBoundary(modifiedStart, modifiedLength) ? 1 : 0;
      return originalScore + modifiedScore;
    }
    ConcatenateChanges(left, right) {
      let mergedChangeArr = [];
      if (left.length === 0 || right.length === 0) {
        return right.length > 0 ? right : left;
      } else if (this.ChangesOverlap(left[left.length - 1], right[0], mergedChangeArr)) {
        const result = new Array(left.length + right.length - 1);
        MyArray.Copy(left, 0, result, 0, left.length - 1);
        result[left.length - 1] = mergedChangeArr[0];
        MyArray.Copy(right, 1, result, left.length, right.length - 1);
        return result;
      } else {
        const result = new Array(left.length + right.length);
        MyArray.Copy(left, 0, result, 0, left.length);
        MyArray.Copy(right, 0, result, left.length, right.length);
        return result;
      }
    }
    ChangesOverlap(left, right, mergedChangeArr) {
      Debug.Assert(left.originalStart <= right.originalStart, "Left change is not less than or equal to right change");
      Debug.Assert(left.modifiedStart <= right.modifiedStart, "Left change is not less than or equal to right change");
      if (left.originalStart + left.originalLength >= right.originalStart || left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
        const originalStart = left.originalStart;
        let originalLength = left.originalLength;
        const modifiedStart = left.modifiedStart;
        let modifiedLength = left.modifiedLength;
        if (left.originalStart + left.originalLength >= right.originalStart) {
          originalLength = right.originalStart + right.originalLength - left.originalStart;
        }
        if (left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
          modifiedLength = right.modifiedStart + right.modifiedLength - left.modifiedStart;
        }
        mergedChangeArr[0] = new DiffChange(originalStart, originalLength, modifiedStart, modifiedLength);
        return true;
      } else {
        mergedChangeArr[0] = null;
        return false;
      }
    }
    ClipDiagonalBound(diagonal, numDifferences, diagonalBaseIndex, numDiagonals) {
      if (diagonal >= 0 && diagonal < numDiagonals) {
        return diagonal;
      }
      const diagonalsBelow = diagonalBaseIndex;
      const diagonalsAbove = numDiagonals - diagonalBaseIndex - 1;
      const diffEven = numDifferences % 2 === 0;
      if (diagonal < 0) {
        const lowerBoundEven = diagonalsBelow % 2 === 0;
        return diffEven === lowerBoundEven ? 0 : 1;
      } else {
        const upperBoundEven = diagonalsAbove % 2 === 0;
        return diffEven === upperBoundEven ? numDiagonals - 1 : numDiagonals - 2;
      }
    }
  };

  // node_modules/monaco-editor/esm/vs/base/common/process.js
  var safeProcess;
  if (typeof globals.vscode !== "undefined" && typeof globals.vscode.process !== "undefined") {
    const sandboxProcess = globals.vscode.process;
    safeProcess = {
      get platform() {
        return sandboxProcess.platform;
      },
      get env() {
        return sandboxProcess.env;
      },
      cwd() {
        return sandboxProcess.cwd();
      },
      nextTick(callback) {
        return setImmediate(callback);
      }
    };
  } else if (typeof process !== "undefined") {
    safeProcess = {
      get platform() {
        return process.platform;
      },
      get env() {
        return process.env;
      },
      cwd() {
        return process.env["VSCODE_CWD"] || process.cwd();
      },
      nextTick(callback) {
        return process.nextTick(callback);
      }
    };
  } else {
    safeProcess = {
      get platform() {
        return isWindows ? "win32" : isMacintosh ? "darwin" : "linux";
      },
      nextTick(callback) {
        return setImmediate(callback);
      },
      get env() {
        return {};
      },
      cwd() {
        return "/";
      }
    };
  }
  var cwd = safeProcess.cwd;
  var env = safeProcess.env;
  var platform = safeProcess.platform;

  // node_modules/monaco-editor/esm/vs/base/common/path.js
  var CHAR_UPPERCASE_A = 65;
  var CHAR_LOWERCASE_A = 97;
  var CHAR_UPPERCASE_Z = 90;
  var CHAR_LOWERCASE_Z = 122;
  var CHAR_DOT = 46;
  var CHAR_FORWARD_SLASH = 47;
  var CHAR_BACKWARD_SLASH = 92;
  var CHAR_COLON = 58;
  var CHAR_QUESTION_MARK = 63;
  var ErrorInvalidArgType = class extends Error {
    constructor(name, expected, actual) {
      let determiner;
      if (typeof expected === "string" && expected.indexOf("not ") === 0) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      const type = name.indexOf(".") !== -1 ? "property" : "argument";
      let msg = `The "${name}" ${type} ${determiner} of type ${expected}`;
      msg += `. Received type ${typeof actual}`;
      super(msg);
      this.code = "ERR_INVALID_ARG_TYPE";
    }
  };
  function validateString(value, name) {
    if (typeof value !== "string") {
      throw new ErrorInvalidArgType(name, "string", value);
    }
  }
  function isPathSeparator(code) {
    return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
  }
  function isPosixPathSeparator(code) {
    return code === CHAR_FORWARD_SLASH;
  }
  function isWindowsDeviceRoot(code) {
    return code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z || code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z;
  }
  function normalizeString(path, allowAboveRoot, separator, isPathSeparator2) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code = 0;
    for (let i = 0; i <= path.length; ++i) {
      if (i < path.length) {
        code = path.charCodeAt(i);
      } else if (isPathSeparator2(code)) {
        break;
      } else {
        code = CHAR_FORWARD_SLASH;
      }
      if (isPathSeparator2(code)) {
        if (lastSlash === i - 1 || dots === 1) {
        } else if (dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
            if (res.length > 2) {
              const lastSlashIndex = res.lastIndexOf(separator);
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
              }
              lastSlash = i;
              dots = 0;
              continue;
            } else if (res.length !== 0) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            res += res.length > 0 ? `${separator}..` : "..";
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0) {
            res += `${separator}${path.slice(lastSlash + 1, i)}`;
          } else {
            res = path.slice(lastSlash + 1, i);
          }
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (code === CHAR_DOT && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  function _format(sep2, pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
      throw new ErrorInvalidArgType("pathObject", "Object", pathObject);
    }
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || `${pathObject.name || ""}${pathObject.ext || ""}`;
    if (!dir) {
      return base;
    }
    return dir === pathObject.root ? `${dir}${base}` : `${dir}${sep2}${base}`;
  }
  var win32 = {
    resolve(...pathSegments) {
      let resolvedDevice = "";
      let resolvedTail = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
          validateString(path, "path");
          if (path.length === 0) {
            continue;
          }
        } else if (resolvedDevice.length === 0) {
          path = cwd();
        } else {
          path = env[`=${resolvedDevice}`] || cwd();
          if (path === void 0 || path.slice(0, 2).toLowerCase() !== resolvedDevice.toLowerCase() && path.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
            path = `${resolvedDevice}\\`;
          }
        }
        const len = path.length;
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        if (len === 1) {
          if (isPathSeparator(code)) {
            rootEnd = 1;
            isAbsolute = true;
          }
        } else if (isPathSeparator(code)) {
          isAbsolute = true;
          if (isPathSeparator(path.charCodeAt(1))) {
            let j = 2;
            let last = j;
            while (j < len && !isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              const firstPart = path.slice(last, j);
              last = j;
              while (j < len && isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j < len && j !== last) {
                last = j;
                while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                  j++;
                }
                if (j === len || j !== last) {
                  device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                  rootEnd = j;
                }
              }
            }
          } else {
            rootEnd = 1;
          }
        } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
          device = path.slice(0, 2);
          rootEnd = 2;
          if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
            isAbsolute = true;
            rootEnd = 3;
          }
        }
        if (device.length > 0) {
          if (resolvedDevice.length > 0) {
            if (device.toLowerCase() !== resolvedDevice.toLowerCase()) {
              continue;
            }
          } else {
            resolvedDevice = device;
          }
        }
        if (resolvedAbsolute) {
          if (resolvedDevice.length > 0) {
            break;
          }
        } else {
          resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
          resolvedAbsolute = isAbsolute;
          if (isAbsolute && resolvedDevice.length > 0) {
            break;
          }
        }
      }
      resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
      return resolvedAbsolute ? `${resolvedDevice}\\${resolvedTail}` : `${resolvedDevice}${resolvedTail}` || ".";
    },
    normalize(path) {
      validateString(path, "path");
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = 0;
      let device;
      let isAbsolute = false;
      const code = path.charCodeAt(0);
      if (len === 1) {
        return isPosixPathSeparator(code) ? "\\" : path;
      }
      if (isPathSeparator(code)) {
        isAbsolute = true;
        if (isPathSeparator(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          while (j < len && !isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            const firstPart = path.slice(last, j);
            last = j;
            while (j < len && isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              last = j;
              while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j === len) {
                return `\\\\${firstPart}\\${path.slice(last)}\\`;
              }
              if (j !== last) {
                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2);
        rootEnd = 2;
        if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
          isAbsolute = true;
          rootEnd = 3;
        }
      }
      let tail = rootEnd < len ? normalizeString(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator) : "";
      if (tail.length === 0 && !isAbsolute) {
        tail = ".";
      }
      if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) {
        tail += "\\";
      }
      if (device === void 0) {
        return isAbsolute ? `\\${tail}` : tail;
      }
      return isAbsolute ? `${device}\\${tail}` : `${device}${tail}`;
    },
    isAbsolute(path) {
      validateString(path, "path");
      const len = path.length;
      if (len === 0) {
        return false;
      }
      const code = path.charCodeAt(0);
      return isPathSeparator(code) || len > 2 && isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON && isPathSeparator(path.charCodeAt(2));
    },
    join(...paths2) {
      if (paths2.length === 0) {
        return ".";
      }
      let joined;
      let firstPart;
      for (let i = 0; i < paths2.length; ++i) {
        const arg = paths2[i];
        validateString(arg, "path");
        if (arg.length > 0) {
          if (joined === void 0) {
            joined = firstPart = arg;
          } else {
            joined += `\\${arg}`;
          }
        }
      }
      if (joined === void 0) {
        return ".";
      }
      let needsReplace = true;
      let slashCount = 0;
      if (typeof firstPart === "string" && isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1 && isPathSeparator(firstPart.charCodeAt(1))) {
          ++slashCount;
          if (firstLen > 2) {
            if (isPathSeparator(firstPart.charCodeAt(2))) {
              ++slashCount;
            } else {
              needsReplace = false;
            }
          }
        }
      }
      if (needsReplace) {
        while (slashCount < joined.length && isPathSeparator(joined.charCodeAt(slashCount))) {
          slashCount++;
        }
        if (slashCount >= 2) {
          joined = `\\${joined.slice(slashCount)}`;
        }
      }
      return win32.normalize(joined);
    },
    relative(from, to) {
      validateString(from, "from");
      validateString(to, "to");
      if (from === to) {
        return "";
      }
      const fromOrig = win32.resolve(from);
      const toOrig = win32.resolve(to);
      if (fromOrig === toOrig) {
        return "";
      }
      from = fromOrig.toLowerCase();
      to = toOrig.toLowerCase();
      if (from === to) {
        return "";
      }
      let fromStart = 0;
      while (fromStart < from.length && from.charCodeAt(fromStart) === CHAR_BACKWARD_SLASH) {
        fromStart++;
      }
      let fromEnd = from.length;
      while (fromEnd - 1 > fromStart && from.charCodeAt(fromEnd - 1) === CHAR_BACKWARD_SLASH) {
        fromEnd--;
      }
      const fromLen = fromEnd - fromStart;
      let toStart = 0;
      while (toStart < to.length && to.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
        toStart++;
      }
      let toEnd = to.length;
      while (toEnd - 1 > toStart && to.charCodeAt(toEnd - 1) === CHAR_BACKWARD_SLASH) {
        toEnd--;
      }
      const toLen = toEnd - toStart;
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i < length; i++) {
        const fromCode = from.charCodeAt(fromStart + i);
        if (fromCode !== to.charCodeAt(toStart + i)) {
          break;
        } else if (fromCode === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      if (i !== length) {
        if (lastCommonSep === -1) {
          return toOrig;
        }
      } else {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
            return toOrig.slice(toStart + i + 1);
          }
          if (i === 2) {
            return toOrig.slice(toStart + i);
          }
        }
        if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
            lastCommonSep = i;
          } else if (i === 2) {
            lastCommonSep = 3;
          }
        }
        if (lastCommonSep === -1) {
          lastCommonSep = 0;
        }
      }
      let out = "";
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
          out += out.length === 0 ? ".." : "\\..";
        }
      }
      toStart += lastCommonSep;
      if (out.length > 0) {
        return `${out}${toOrig.slice(toStart, toEnd)}`;
      }
      if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
        ++toStart;
      }
      return toOrig.slice(toStart, toEnd);
    },
    toNamespacedPath(path) {
      if (typeof path !== "string") {
        return path;
      }
      if (path.length === 0) {
        return "";
      }
      const resolvedPath = win32.resolve(path);
      if (resolvedPath.length <= 2) {
        return path;
      }
      if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
        if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
          const code = resolvedPath.charCodeAt(2);
          if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
            return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
          }
        }
      } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0)) && resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        return `\\\\?\\${resolvedPath}`;
      }
      return path;
    },
    dirname(path) {
      validateString(path, "path");
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = -1;
      let offset = 0;
      const code = path.charCodeAt(0);
      if (len === 1) {
        return isPathSeparator(code) ? path : ".";
      }
      if (isPathSeparator(code)) {
        rootEnd = offset = 1;
        if (isPathSeparator(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          while (j < len && !isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              last = j;
              while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j === len) {
                return path;
              }
              if (j !== last) {
                rootEnd = offset = j + 1;
              }
            }
          }
        }
      } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
        rootEnd = len > 2 && isPathSeparator(path.charCodeAt(2)) ? 3 : 2;
        offset = rootEnd;
      }
      let end = -1;
      let matchedSlash = true;
      for (let i = len - 1; i >= offset; --i) {
        if (isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          matchedSlash = false;
        }
      }
      if (end === -1) {
        if (rootEnd === -1) {
          return ".";
        }
        end = rootEnd;
      }
      return path.slice(0, end);
    },
    basename(path, ext) {
      if (ext !== void 0) {
        validateString(ext, "ext");
      }
      validateString(path, "path");
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (path.length >= 2 && isWindowsDeviceRoot(path.charCodeAt(0)) && path.charCodeAt(1) === CHAR_COLON) {
        start = 2;
      }
      if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
        if (ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (isPathSeparator(code)) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  end = i;
                }
              } else {
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      }
      for (i = path.length - 1; i >= start; --i) {
        if (isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) {
        return "";
      }
      return path.slice(start, end);
    },
    extname(path) {
      validateString(path, "path");
      let start = 0;
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let preDotState = 0;
      if (path.length >= 2 && path.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path.charCodeAt(0))) {
        start = startPart = 2;
      }
      for (let i = path.length - 1; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path.slice(startDot, end);
    },
    format: _format.bind(null, "\\"),
    parse(path) {
      validateString(path, "path");
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const len = path.length;
      let rootEnd = 0;
      let code = path.charCodeAt(0);
      if (len === 1) {
        if (isPathSeparator(code)) {
          ret.root = ret.dir = path;
          return ret;
        }
        ret.base = ret.name = path;
        return ret;
      }
      if (isPathSeparator(code)) {
        rootEnd = 1;
        if (isPathSeparator(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          while (j < len && !isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              last = j;
              while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j === len) {
                rootEnd = j;
              } else if (j !== last) {
                rootEnd = j + 1;
              }
            }
          }
        }
      } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
        if (len <= 2) {
          ret.root = ret.dir = path;
          return ret;
        }
        rootEnd = 2;
        if (isPathSeparator(path.charCodeAt(2))) {
          if (len === 3) {
            ret.root = ret.dir = path;
            return ret;
          }
          rootEnd = 3;
        }
      }
      if (rootEnd > 0) {
        ret.root = path.slice(0, rootEnd);
      }
      let startDot = -1;
      let startPart = rootEnd;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      let preDotState = 0;
      for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (end !== -1) {
        if (startDot === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          ret.base = ret.name = path.slice(startPart, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
          ret.ext = path.slice(startDot, end);
        }
      }
      if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
      } else {
        ret.dir = ret.root;
      }
      return ret;
    },
    sep: "\\",
    delimiter: ";",
    win32: null,
    posix: null
  };
  var posix = {
    resolve(...pathSegments) {
      let resolvedPath = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        const path = i >= 0 ? pathSegments[i] : cwd();
        validateString(path, "path");
        if (path.length === 0) {
          continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      }
      resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
      if (resolvedAbsolute) {
        return `/${resolvedPath}`;
      }
      return resolvedPath.length > 0 ? resolvedPath : ".";
    },
    normalize(path) {
      validateString(path, "path");
      if (path.length === 0) {
        return ".";
      }
      const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      const trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
      path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
      if (path.length === 0) {
        if (isAbsolute) {
          return "/";
        }
        return trailingSeparator ? "./" : ".";
      }
      if (trailingSeparator) {
        path += "/";
      }
      return isAbsolute ? `/${path}` : path;
    },
    isAbsolute(path) {
      validateString(path, "path");
      return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    },
    join(...paths2) {
      if (paths2.length === 0) {
        return ".";
      }
      let joined;
      for (let i = 0; i < paths2.length; ++i) {
        const arg = paths2[i];
        validateString(arg, "path");
        if (arg.length > 0) {
          if (joined === void 0) {
            joined = arg;
          } else {
            joined += `/${arg}`;
          }
        }
      }
      if (joined === void 0) {
        return ".";
      }
      return posix.normalize(joined);
    },
    relative(from, to) {
      validateString(from, "from");
      validateString(to, "to");
      if (from === to) {
        return "";
      }
      from = posix.resolve(from);
      to = posix.resolve(to);
      if (from === to) {
        return "";
      }
      const fromStart = 1;
      const fromEnd = from.length;
      const fromLen = fromEnd - fromStart;
      const toStart = 1;
      const toLen = to.length - toStart;
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i < length; i++) {
        const fromCode = from.charCodeAt(fromStart + i);
        if (fromCode !== to.charCodeAt(toStart + i)) {
          break;
        } else if (fromCode === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
            return to.slice(toStart + i + 1);
          }
          if (i === 0) {
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
            lastCommonSep = i;
          } else if (i === 0) {
            lastCommonSep = 0;
          }
        }
      }
      let out = "";
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          out += out.length === 0 ? ".." : "/..";
        }
      }
      return `${out}${to.slice(toStart + lastCommonSep)}`;
    },
    toNamespacedPath(path) {
      return path;
    },
    dirname(path) {
      validateString(path, "path");
      if (path.length === 0) {
        return ".";
      }
      const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      let end = -1;
      let matchedSlash = true;
      for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          matchedSlash = false;
        }
      }
      if (end === -1) {
        return hasRoot ? "/" : ".";
      }
      if (hasRoot && end === 1) {
        return "//";
      }
      return path.slice(0, end);
    },
    basename(path, ext) {
      if (ext !== void 0) {
        validateString(ext, "ext");
      }
      validateString(path, "path");
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
        if (ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === CHAR_FORWARD_SLASH) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  end = i;
                }
              } else {
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      }
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) {
        return "";
      }
      return path.slice(start, end);
    },
    extname(path) {
      validateString(path, "path");
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let preDotState = 0;
      for (let i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path.slice(startDot, end);
    },
    format: _format.bind(null, "/"),
    parse(path) {
      validateString(path, "path");
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      let start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      let preDotState = 0;
      for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (end !== -1) {
        const start2 = startPart === 0 && isAbsolute ? 1 : startPart;
        if (startDot === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          ret.base = ret.name = path.slice(start2, end);
        } else {
          ret.name = path.slice(start2, startDot);
          ret.base = path.slice(start2, end);
          ret.ext = path.slice(startDot, end);
        }
      }
      if (startPart > 0) {
        ret.dir = path.slice(0, startPart - 1);
      } else if (isAbsolute) {
        ret.dir = "/";
      }
      return ret;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  posix.win32 = win32.win32 = win32;
  posix.posix = win32.posix = posix;
  var normalize = platform === "win32" ? win32.normalize : posix.normalize;
  var resolve = platform === "win32" ? win32.resolve : posix.resolve;
  var relative = platform === "win32" ? win32.relative : posix.relative;
  var dirname = platform === "win32" ? win32.dirname : posix.dirname;
  var basename = platform === "win32" ? win32.basename : posix.basename;
  var extname = platform === "win32" ? win32.extname : posix.extname;
  var sep = platform === "win32" ? win32.sep : posix.sep;

  // node_modules/monaco-editor/esm/vs/base/common/uri.js
  var _schemePattern = /^\w[\w\d+.-]*$/;
  var _singleSlashStart = /^\//;
  var _doubleSlashStart = /^\/\//;
  function _validateUri(ret, _strict) {
    if (!ret.scheme && _strict) {
      throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${ret.authority}", path: "${ret.path}", query: "${ret.query}", fragment: "${ret.fragment}"}`);
    }
    if (ret.scheme && !_schemePattern.test(ret.scheme)) {
      throw new Error("[UriError]: Scheme contains illegal characters.");
    }
    if (ret.path) {
      if (ret.authority) {
        if (!_singleSlashStart.test(ret.path)) {
          throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
        }
      } else {
        if (_doubleSlashStart.test(ret.path)) {
          throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
        }
      }
    }
  }
  function _schemeFix(scheme, _strict) {
    if (!scheme && !_strict) {
      return "file";
    }
    return scheme;
  }
  function _referenceResolution(scheme, path) {
    switch (scheme) {
      case "https":
      case "http":
      case "file":
        if (!path) {
          path = _slash;
        } else if (path[0] !== _slash) {
          path = _slash + path;
        }
        break;
    }
    return path;
  }
  var _empty = "";
  var _slash = "/";
  var _regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
  var URI = class {
    constructor(schemeOrData, authority, path, query, fragment, _strict = false) {
      if (typeof schemeOrData === "object") {
        this.scheme = schemeOrData.scheme || _empty;
        this.authority = schemeOrData.authority || _empty;
        this.path = schemeOrData.path || _empty;
        this.query = schemeOrData.query || _empty;
        this.fragment = schemeOrData.fragment || _empty;
      } else {
        this.scheme = _schemeFix(schemeOrData, _strict);
        this.authority = authority || _empty;
        this.path = _referenceResolution(this.scheme, path || _empty);
        this.query = query || _empty;
        this.fragment = fragment || _empty;
        _validateUri(this, _strict);
      }
    }
    static isUri(thing) {
      if (thing instanceof URI) {
        return true;
      }
      if (!thing) {
        return false;
      }
      return typeof thing.authority === "string" && typeof thing.fragment === "string" && typeof thing.path === "string" && typeof thing.query === "string" && typeof thing.scheme === "string" && typeof thing.fsPath === "string" && typeof thing.with === "function" && typeof thing.toString === "function";
    }
    get fsPath() {
      return uriToFsPath(this, false);
    }
    with(change) {
      if (!change) {
        return this;
      }
      let { scheme, authority, path, query, fragment } = change;
      if (scheme === void 0) {
        scheme = this.scheme;
      } else if (scheme === null) {
        scheme = _empty;
      }
      if (authority === void 0) {
        authority = this.authority;
      } else if (authority === null) {
        authority = _empty;
      }
      if (path === void 0) {
        path = this.path;
      } else if (path === null) {
        path = _empty;
      }
      if (query === void 0) {
        query = this.query;
      } else if (query === null) {
        query = _empty;
      }
      if (fragment === void 0) {
        fragment = this.fragment;
      } else if (fragment === null) {
        fragment = _empty;
      }
      if (scheme === this.scheme && authority === this.authority && path === this.path && query === this.query && fragment === this.fragment) {
        return this;
      }
      return new Uri(scheme, authority, path, query, fragment);
    }
    static parse(value, _strict = false) {
      const match = _regexp.exec(value);
      if (!match) {
        return new Uri(_empty, _empty, _empty, _empty, _empty);
      }
      return new Uri(match[2] || _empty, percentDecode(match[4] || _empty), percentDecode(match[5] || _empty), percentDecode(match[7] || _empty), percentDecode(match[9] || _empty), _strict);
    }
    static file(path) {
      let authority = _empty;
      if (isWindows) {
        path = path.replace(/\\/g, _slash);
      }
      if (path[0] === _slash && path[1] === _slash) {
        const idx = path.indexOf(_slash, 2);
        if (idx === -1) {
          authority = path.substring(2);
          path = _slash;
        } else {
          authority = path.substring(2, idx);
          path = path.substring(idx) || _slash;
        }
      }
      return new Uri("file", authority, path, _empty, _empty);
    }
    static from(components) {
      const result = new Uri(components.scheme, components.authority, components.path, components.query, components.fragment);
      _validateUri(result, true);
      return result;
    }
    static joinPath(uri, ...pathFragment) {
      if (!uri.path) {
        throw new Error(`[UriError]: cannot call joinPath on URI without path`);
      }
      let newPath;
      if (isWindows && uri.scheme === "file") {
        newPath = URI.file(win32.join(uriToFsPath(uri, true), ...pathFragment)).path;
      } else {
        newPath = posix.join(uri.path, ...pathFragment);
      }
      return uri.with({ path: newPath });
    }
    toString(skipEncoding = false) {
      return _asFormatted(this, skipEncoding);
    }
    toJSON() {
      return this;
    }
    static revive(data) {
      if (!data) {
        return data;
      } else if (data instanceof URI) {
        return data;
      } else {
        const result = new Uri(data);
        result._formatted = data.external;
        result._fsPath = data._sep === _pathSepMarker ? data.fsPath : null;
        return result;
      }
    }
  };
  var _pathSepMarker = isWindows ? 1 : void 0;
  var Uri = class extends URI {
    constructor() {
      super(...arguments);
      this._formatted = null;
      this._fsPath = null;
    }
    get fsPath() {
      if (!this._fsPath) {
        this._fsPath = uriToFsPath(this, false);
      }
      return this._fsPath;
    }
    toString(skipEncoding = false) {
      if (!skipEncoding) {
        if (!this._formatted) {
          this._formatted = _asFormatted(this, false);
        }
        return this._formatted;
      } else {
        return _asFormatted(this, true);
      }
    }
    toJSON() {
      const res = {
        $mid: 1
      };
      if (this._fsPath) {
        res.fsPath = this._fsPath;
        res._sep = _pathSepMarker;
      }
      if (this._formatted) {
        res.external = this._formatted;
      }
      if (this.path) {
        res.path = this.path;
      }
      if (this.scheme) {
        res.scheme = this.scheme;
      }
      if (this.authority) {
        res.authority = this.authority;
      }
      if (this.query) {
        res.query = this.query;
      }
      if (this.fragment) {
        res.fragment = this.fragment;
      }
      return res;
    }
  };
  var encodeTable = {
    [58]: "%3A",
    [47]: "%2F",
    [63]: "%3F",
    [35]: "%23",
    [91]: "%5B",
    [93]: "%5D",
    [64]: "%40",
    [33]: "%21",
    [36]: "%24",
    [38]: "%26",
    [39]: "%27",
    [40]: "%28",
    [41]: "%29",
    [42]: "%2A",
    [43]: "%2B",
    [44]: "%2C",
    [59]: "%3B",
    [61]: "%3D",
    [32]: "%20"
  };
  function encodeURIComponentFast(uriComponent, allowSlash) {
    let res = void 0;
    let nativeEncodePos = -1;
    for (let pos = 0; pos < uriComponent.length; pos++) {
      const code = uriComponent.charCodeAt(pos);
      if (code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 48 && code <= 57 || code === 45 || code === 46 || code === 95 || code === 126 || allowSlash && code === 47) {
        if (nativeEncodePos !== -1) {
          res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
          nativeEncodePos = -1;
        }
        if (res !== void 0) {
          res += uriComponent.charAt(pos);
        }
      } else {
        if (res === void 0) {
          res = uriComponent.substr(0, pos);
        }
        const escaped = encodeTable[code];
        if (escaped !== void 0) {
          if (nativeEncodePos !== -1) {
            res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
            nativeEncodePos = -1;
          }
          res += escaped;
        } else if (nativeEncodePos === -1) {
          nativeEncodePos = pos;
        }
      }
    }
    if (nativeEncodePos !== -1) {
      res += encodeURIComponent(uriComponent.substring(nativeEncodePos));
    }
    return res !== void 0 ? res : uriComponent;
  }
  function encodeURIComponentMinimal(path) {
    let res = void 0;
    for (let pos = 0; pos < path.length; pos++) {
      const code = path.charCodeAt(pos);
      if (code === 35 || code === 63) {
        if (res === void 0) {
          res = path.substr(0, pos);
        }
        res += encodeTable[code];
      } else {
        if (res !== void 0) {
          res += path[pos];
        }
      }
    }
    return res !== void 0 ? res : path;
  }
  function uriToFsPath(uri, keepDriveLetterCasing) {
    let value;
    if (uri.authority && uri.path.length > 1 && uri.scheme === "file") {
      value = `//${uri.authority}${uri.path}`;
    } else if (uri.path.charCodeAt(0) === 47 && (uri.path.charCodeAt(1) >= 65 && uri.path.charCodeAt(1) <= 90 || uri.path.charCodeAt(1) >= 97 && uri.path.charCodeAt(1) <= 122) && uri.path.charCodeAt(2) === 58) {
      if (!keepDriveLetterCasing) {
        value = uri.path[1].toLowerCase() + uri.path.substr(2);
      } else {
        value = uri.path.substr(1);
      }
    } else {
      value = uri.path;
    }
    if (isWindows) {
      value = value.replace(/\//g, "\\");
    }
    return value;
  }
  function _asFormatted(uri, skipEncoding) {
    const encoder = !skipEncoding ? encodeURIComponentFast : encodeURIComponentMinimal;
    let res = "";
    let { scheme, authority, path, query, fragment } = uri;
    if (scheme) {
      res += scheme;
      res += ":";
    }
    if (authority || scheme === "file") {
      res += _slash;
      res += _slash;
    }
    if (authority) {
      let idx = authority.indexOf("@");
      if (idx !== -1) {
        const userinfo = authority.substr(0, idx);
        authority = authority.substr(idx + 1);
        idx = userinfo.indexOf(":");
        if (idx === -1) {
          res += encoder(userinfo, false);
        } else {
          res += encoder(userinfo.substr(0, idx), false);
          res += ":";
          res += encoder(userinfo.substr(idx + 1), false);
        }
        res += "@";
      }
      authority = authority.toLowerCase();
      idx = authority.indexOf(":");
      if (idx === -1) {
        res += encoder(authority, false);
      } else {
        res += encoder(authority.substr(0, idx), false);
        res += authority.substr(idx);
      }
    }
    if (path) {
      if (path.length >= 3 && path.charCodeAt(0) === 47 && path.charCodeAt(2) === 58) {
        const code = path.charCodeAt(1);
        if (code >= 65 && code <= 90) {
          path = `/${String.fromCharCode(code + 32)}:${path.substr(3)}`;
        }
      } else if (path.length >= 2 && path.charCodeAt(1) === 58) {
        const code = path.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          path = `${String.fromCharCode(code + 32)}:${path.substr(2)}`;
        }
      }
      res += encoder(path, true);
    }
    if (query) {
      res += "?";
      res += encoder(query, false);
    }
    if (fragment) {
      res += "#";
      res += !skipEncoding ? encodeURIComponentFast(fragment, false) : fragment;
    }
    return res;
  }
  function decodeURIComponentGraceful(str) {
    try {
      return decodeURIComponent(str);
    } catch (_a2) {
      if (str.length > 3) {
        return str.substr(0, 3) + decodeURIComponentGraceful(str.substr(3));
      } else {
        return str;
      }
    }
  }
  var _rEncodedAsHex = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
  function percentDecode(str) {
    if (!str.match(_rEncodedAsHex)) {
      return str;
    }
    return str.replace(_rEncodedAsHex, (match) => decodeURIComponentGraceful(match));
  }

  // node_modules/monaco-editor/esm/vs/editor/common/core/position.js
  var Position = class {
    constructor(lineNumber, column) {
      this.lineNumber = lineNumber;
      this.column = column;
    }
    with(newLineNumber = this.lineNumber, newColumn = this.column) {
      if (newLineNumber === this.lineNumber && newColumn === this.column) {
        return this;
      } else {
        return new Position(newLineNumber, newColumn);
      }
    }
    delta(deltaLineNumber = 0, deltaColumn = 0) {
      return this.with(this.lineNumber + deltaLineNumber, this.column + deltaColumn);
    }
    equals(other) {
      return Position.equals(this, other);
    }
    static equals(a, b) {
      if (!a && !b) {
        return true;
      }
      return !!a && !!b && a.lineNumber === b.lineNumber && a.column === b.column;
    }
    isBefore(other) {
      return Position.isBefore(this, other);
    }
    static isBefore(a, b) {
      if (a.lineNumber < b.lineNumber) {
        return true;
      }
      if (b.lineNumber < a.lineNumber) {
        return false;
      }
      return a.column < b.column;
    }
    isBeforeOrEqual(other) {
      return Position.isBeforeOrEqual(this, other);
    }
    static isBeforeOrEqual(a, b) {
      if (a.lineNumber < b.lineNumber) {
        return true;
      }
      if (b.lineNumber < a.lineNumber) {
        return false;
      }
      return a.column <= b.column;
    }
    static compare(a, b) {
      let aLineNumber = a.lineNumber | 0;
      let bLineNumber = b.lineNumber | 0;
      if (aLineNumber === bLineNumber) {
        let aColumn = a.column | 0;
        let bColumn = b.column | 0;
        return aColumn - bColumn;
      }
      return aLineNumber - bLineNumber;
    }
    clone() {
      return new Position(this.lineNumber, this.column);
    }
    toString() {
      return "(" + this.lineNumber + "," + this.column + ")";
    }
    static lift(pos) {
      return new Position(pos.lineNumber, pos.column);
    }
    static isIPosition(obj) {
      return obj && typeof obj.lineNumber === "number" && typeof obj.column === "number";
    }
  };

  // node_modules/monaco-editor/esm/vs/editor/common/core/range.js
  var Range = class {
    constructor(startLineNumber, startColumn, endLineNumber, endColumn) {
      if (startLineNumber > endLineNumber || startLineNumber === endLineNumber && startColumn > endColumn) {
        this.startLineNumber = endLineNumber;
        this.startColumn = endColumn;
        this.endLineNumber = startLineNumber;
        this.endColumn = startColumn;
      } else {
        this.startLineNumber = startLineNumber;
        this.startColumn = startColumn;
        this.endLineNumber = endLineNumber;
        this.endColumn = endColumn;
      }
    }
    isEmpty() {
      return Range.isEmpty(this);
    }
    static isEmpty(range) {
      return range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn;
    }
    containsPosition(position) {
      return Range.containsPosition(this, position);
    }
    static containsPosition(range, position) {
      if (position.lineNumber < range.startLineNumber || position.lineNumber > range.endLineNumber) {
        return false;
      }
      if (position.lineNumber === range.startLineNumber && position.column < range.startColumn) {
        return false;
      }
      if (position.lineNumber === range.endLineNumber && position.column > range.endColumn) {
        return false;
      }
      return true;
    }
    containsRange(range) {
      return Range.containsRange(this, range);
    }
    static containsRange(range, otherRange) {
      if (otherRange.startLineNumber < range.startLineNumber || otherRange.endLineNumber < range.startLineNumber) {
        return false;
      }
      if (otherRange.startLineNumber > range.endLineNumber || otherRange.endLineNumber > range.endLineNumber) {
        return false;
      }
      if (otherRange.startLineNumber === range.startLineNumber && otherRange.startColumn < range.startColumn) {
        return false;
      }
      if (otherRange.endLineNumber === range.endLineNumber && otherRange.endColumn > range.endColumn) {
        return false;
      }
      return true;
    }
    strictContainsRange(range) {
      return Range.strictContainsRange(this, range);
    }
    static strictContainsRange(range, otherRange) {
      if (otherRange.startLineNumber < range.startLineNumber || otherRange.endLineNumber < range.startLineNumber) {
        return false;
      }
      if (otherRange.startLineNumber > range.endLineNumber || otherRange.endLineNumber > range.endLineNumber) {
        return false;
      }
      if (otherRange.startLineNumber === range.startLineNumber && otherRange.startColumn <= range.startColumn) {
        return false;
      }
      if (otherRange.endLineNumber === range.endLineNumber && otherRange.endColumn >= range.endColumn) {
        return false;
      }
      return true;
    }
    plusRange(range) {
      return Range.plusRange(this, range);
    }
    static plusRange(a, b) {
      let startLineNumber;
      let startColumn;
      let endLineNumber;
      let endColumn;
      if (b.startLineNumber < a.startLineNumber) {
        startLineNumber = b.startLineNumber;
        startColumn = b.startColumn;
      } else if (b.startLineNumber === a.startLineNumber) {
        startLineNumber = b.startLineNumber;
        startColumn = Math.min(b.startColumn, a.startColumn);
      } else {
        startLineNumber = a.startLineNumber;
        startColumn = a.startColumn;
      }
      if (b.endLineNumber > a.endLineNumber) {
        endLineNumber = b.endLineNumber;
        endColumn = b.endColumn;
      } else if (b.endLineNumber === a.endLineNumber) {
        endLineNumber = b.endLineNumber;
        endColumn = Math.max(b.endColumn, a.endColumn);
      } else {
        endLineNumber = a.endLineNumber;
        endColumn = a.endColumn;
      }
      return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
    }
    intersectRanges(range) {
      return Range.intersectRanges(this, range);
    }
    static intersectRanges(a, b) {
      let resultStartLineNumber = a.startLineNumber;
      let resultStartColumn = a.startColumn;
      let resultEndLineNumber = a.endLineNumber;
      let resultEndColumn = a.endColumn;
      let otherStartLineNumber = b.startLineNumber;
      let otherStartColumn = b.startColumn;
      let otherEndLineNumber = b.endLineNumber;
      let otherEndColumn = b.endColumn;
      if (resultStartLineNumber < otherStartLineNumber) {
        resultStartLineNumber = otherStartLineNumber;
        resultStartColumn = otherStartColumn;
      } else if (resultStartLineNumber === otherStartLineNumber) {
        resultStartColumn = Math.max(resultStartColumn, otherStartColumn);
      }
      if (resultEndLineNumber > otherEndLineNumber) {
        resultEndLineNumber = otherEndLineNumber;
        resultEndColumn = otherEndColumn;
      } else if (resultEndLineNumber === otherEndLineNumber) {
        resultEndColumn = Math.min(resultEndColumn, otherEndColumn);
      }
      if (resultStartLineNumber > resultEndLineNumber) {
        return null;
      }
      if (resultStartLineNumber === resultEndLineNumber && resultStartColumn > resultEndColumn) {
        return null;
      }
      return new Range(resultStartLineNumber, resultStartColumn, resultEndLineNumber, resultEndColumn);
    }
    equalsRange(other) {
      return Range.equalsRange(this, other);
    }
    static equalsRange(a, b) {
      return !!a && !!b && a.startLineNumber === b.startLineNumber && a.startColumn === b.startColumn && a.endLineNumber === b.endLineNumber && a.endColumn === b.endColumn;
    }
    getEndPosition() {
      return Range.getEndPosition(this);
    }
    static getEndPosition(range) {
      return new Position(range.endLineNumber, range.endColumn);
    }
    getStartPosition() {
      return Range.getStartPosition(this);
    }
    static getStartPosition(range) {
      return new Position(range.startLineNumber, range.startColumn);
    }
    toString() {
      return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn + "]";
    }
    setEndPosition(endLineNumber, endColumn) {
      return new Range(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
    }
    setStartPosition(startLineNumber, startColumn) {
      return new Range(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
    }
    collapseToStart() {
      return Range.collapseToStart(this);
    }
    static collapseToStart(range) {
      return new Range(range.startLineNumber, range.startColumn, range.startLineNumber, range.startColumn);
    }
    static fromPositions(start, end = start) {
      return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
    }
    static lift(range) {
      if (!range) {
        return null;
      }
      return new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
    }
    static isIRange(obj) {
      return obj && typeof obj.startLineNumber === "number" && typeof obj.startColumn === "number" && typeof obj.endLineNumber === "number" && typeof obj.endColumn === "number";
    }
    static areIntersectingOrTouching(a, b) {
      if (a.endLineNumber < b.startLineNumber || a.endLineNumber === b.startLineNumber && a.endColumn < b.startColumn) {
        return false;
      }
      if (b.endLineNumber < a.startLineNumber || b.endLineNumber === a.startLineNumber && b.endColumn < a.startColumn) {
        return false;
      }
      return true;
    }
    static areIntersecting(a, b) {
      if (a.endLineNumber < b.startLineNumber || a.endLineNumber === b.startLineNumber && a.endColumn <= b.startColumn) {
        return false;
      }
      if (b.endLineNumber < a.startLineNumber || b.endLineNumber === a.startLineNumber && b.endColumn <= a.startColumn) {
        return false;
      }
      return true;
    }
    static compareRangesUsingStarts(a, b) {
      if (a && b) {
        const aStartLineNumber = a.startLineNumber | 0;
        const bStartLineNumber = b.startLineNumber | 0;
        if (aStartLineNumber === bStartLineNumber) {
          const aStartColumn = a.startColumn | 0;
          const bStartColumn = b.startColumn | 0;
          if (aStartColumn === bStartColumn) {
            const aEndLineNumber = a.endLineNumber | 0;
            const bEndLineNumber = b.endLineNumber | 0;
            if (aEndLineNumber === bEndLineNumber) {
              const aEndColumn = a.endColumn | 0;
              const bEndColumn = b.endColumn | 0;
              return aEndColumn - bEndColumn;
            }
            return aEndLineNumber - bEndLineNumber;
          }
          return aStartColumn - bStartColumn;
        }
        return aStartLineNumber - bStartLineNumber;
      }
      const aExists = a ? 1 : 0;
      const bExists = b ? 1 : 0;
      return aExists - bExists;
    }
    static compareRangesUsingEnds(a, b) {
      if (a.endLineNumber === b.endLineNumber) {
        if (a.endColumn === b.endColumn) {
          if (a.startLineNumber === b.startLineNumber) {
            return a.startColumn - b.startColumn;
          }
          return a.startLineNumber - b.startLineNumber;
        }
        return a.endColumn - b.endColumn;
      }
      return a.endLineNumber - b.endLineNumber;
    }
    static spansMultipleLines(range) {
      return range.endLineNumber > range.startLineNumber;
    }
  };

  // node_modules/monaco-editor/esm/vs/editor/common/diff/diffComputer.js
  var MINIMUM_MATCHING_CHARACTER_LENGTH = 3;
  function computeDiff(originalSequence, modifiedSequence, continueProcessingPredicate, pretty) {
    const diffAlgo = new LcsDiff(originalSequence, modifiedSequence, continueProcessingPredicate);
    return diffAlgo.ComputeDiff(pretty);
  }
  var LineSequence = class {
    constructor(lines) {
      const startColumns = [];
      const endColumns = [];
      for (let i = 0, length = lines.length; i < length; i++) {
        startColumns[i] = getFirstNonBlankColumn(lines[i], 1);
        endColumns[i] = getLastNonBlankColumn(lines[i], 1);
      }
      this.lines = lines;
      this._startColumns = startColumns;
      this._endColumns = endColumns;
    }
    getElements() {
      const elements = [];
      for (let i = 0, len = this.lines.length; i < len; i++) {
        elements[i] = this.lines[i].substring(this._startColumns[i] - 1, this._endColumns[i] - 1);
      }
      return elements;
    }
    getStrictElement(index) {
      return this.lines[index];
    }
    getStartLineNumber(i) {
      return i + 1;
    }
    getEndLineNumber(i) {
      return i + 1;
    }
    createCharSequence(shouldIgnoreTrimWhitespace, startIndex, endIndex) {
      const charCodes = [];
      const lineNumbers = [];
      const columns = [];
      let len = 0;
      for (let index = startIndex; index <= endIndex; index++) {
        const lineContent = this.lines[index];
        const startColumn = shouldIgnoreTrimWhitespace ? this._startColumns[index] : 1;
        const endColumn = shouldIgnoreTrimWhitespace ? this._endColumns[index] : lineContent.length + 1;
        for (let col = startColumn; col < endColumn; col++) {
          charCodes[len] = lineContent.charCodeAt(col - 1);
          lineNumbers[len] = index + 1;
          columns[len] = col;
          len++;
        }
      }
      return new CharSequence(charCodes, lineNumbers, columns);
    }
  };
  var CharSequence = class {
    constructor(charCodes, lineNumbers, columns) {
      this._charCodes = charCodes;
      this._lineNumbers = lineNumbers;
      this._columns = columns;
    }
    getElements() {
      return this._charCodes;
    }
    getStartLineNumber(i) {
      return this._lineNumbers[i];
    }
    getStartColumn(i) {
      return this._columns[i];
    }
    getEndLineNumber(i) {
      return this._lineNumbers[i];
    }
    getEndColumn(i) {
      return this._columns[i] + 1;
    }
  };
  var CharChange = class {
    constructor(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn) {
      this.originalStartLineNumber = originalStartLineNumber;
      this.originalStartColumn = originalStartColumn;
      this.originalEndLineNumber = originalEndLineNumber;
      this.originalEndColumn = originalEndColumn;
      this.modifiedStartLineNumber = modifiedStartLineNumber;
      this.modifiedStartColumn = modifiedStartColumn;
      this.modifiedEndLineNumber = modifiedEndLineNumber;
      this.modifiedEndColumn = modifiedEndColumn;
    }
    static createFromDiffChange(diffChange, originalCharSequence, modifiedCharSequence) {
      let originalStartLineNumber;
      let originalStartColumn;
      let originalEndLineNumber;
      let originalEndColumn;
      let modifiedStartLineNumber;
      let modifiedStartColumn;
      let modifiedEndLineNumber;
      let modifiedEndColumn;
      if (diffChange.originalLength === 0) {
        originalStartLineNumber = 0;
        originalStartColumn = 0;
        originalEndLineNumber = 0;
        originalEndColumn = 0;
      } else {
        originalStartLineNumber = originalCharSequence.getStartLineNumber(diffChange.originalStart);
        originalStartColumn = originalCharSequence.getStartColumn(diffChange.originalStart);
        originalEndLineNumber = originalCharSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
        originalEndColumn = originalCharSequence.getEndColumn(diffChange.originalStart + diffChange.originalLength - 1);
      }
      if (diffChange.modifiedLength === 0) {
        modifiedStartLineNumber = 0;
        modifiedStartColumn = 0;
        modifiedEndLineNumber = 0;
        modifiedEndColumn = 0;
      } else {
        modifiedStartLineNumber = modifiedCharSequence.getStartLineNumber(diffChange.modifiedStart);
        modifiedStartColumn = modifiedCharSequence.getStartColumn(diffChange.modifiedStart);
        modifiedEndLineNumber = modifiedCharSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
        modifiedEndColumn = modifiedCharSequence.getEndColumn(diffChange.modifiedStart + diffChange.modifiedLength - 1);
      }
      return new CharChange(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn);
    }
  };
  function postProcessCharChanges(rawChanges) {
    if (rawChanges.length <= 1) {
      return rawChanges;
    }
    const result = [rawChanges[0]];
    let prevChange = result[0];
    for (let i = 1, len = rawChanges.length; i < len; i++) {
      const currChange = rawChanges[i];
      const originalMatchingLength = currChange.originalStart - (prevChange.originalStart + prevChange.originalLength);
      const modifiedMatchingLength = currChange.modifiedStart - (prevChange.modifiedStart + prevChange.modifiedLength);
      const matchingLength = Math.min(originalMatchingLength, modifiedMatchingLength);
      if (matchingLength < MINIMUM_MATCHING_CHARACTER_LENGTH) {
        prevChange.originalLength = currChange.originalStart + currChange.originalLength - prevChange.originalStart;
        prevChange.modifiedLength = currChange.modifiedStart + currChange.modifiedLength - prevChange.modifiedStart;
      } else {
        result.push(currChange);
        prevChange = currChange;
      }
    }
    return result;
  }
  var LineChange = class {
    constructor(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges) {
      this.originalStartLineNumber = originalStartLineNumber;
      this.originalEndLineNumber = originalEndLineNumber;
      this.modifiedStartLineNumber = modifiedStartLineNumber;
      this.modifiedEndLineNumber = modifiedEndLineNumber;
      this.charChanges = charChanges;
    }
    static createFromDiffResult(shouldIgnoreTrimWhitespace, diffChange, originalLineSequence, modifiedLineSequence, continueCharDiff, shouldComputeCharChanges, shouldPostProcessCharChanges) {
      let originalStartLineNumber;
      let originalEndLineNumber;
      let modifiedStartLineNumber;
      let modifiedEndLineNumber;
      let charChanges = void 0;
      if (diffChange.originalLength === 0) {
        originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart) - 1;
        originalEndLineNumber = 0;
      } else {
        originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart);
        originalEndLineNumber = originalLineSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
      }
      if (diffChange.modifiedLength === 0) {
        modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart) - 1;
        modifiedEndLineNumber = 0;
      } else {
        modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart);
        modifiedEndLineNumber = modifiedLineSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
      }
      if (shouldComputeCharChanges && diffChange.originalLength > 0 && diffChange.originalLength < 20 && diffChange.modifiedLength > 0 && diffChange.modifiedLength < 20 && continueCharDiff()) {
        const originalCharSequence = originalLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.originalStart, diffChange.originalStart + diffChange.originalLength - 1);
        const modifiedCharSequence = modifiedLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.modifiedStart, diffChange.modifiedStart + diffChange.modifiedLength - 1);
        let rawChanges = computeDiff(originalCharSequence, modifiedCharSequence, continueCharDiff, true).changes;
        if (shouldPostProcessCharChanges) {
          rawChanges = postProcessCharChanges(rawChanges);
        }
        charChanges = [];
        for (let i = 0, length = rawChanges.length; i < length; i++) {
          charChanges.push(CharChange.createFromDiffChange(rawChanges[i], originalCharSequence, modifiedCharSequence));
        }
      }
      return new LineChange(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges);
    }
  };
  var DiffComputer = class {
    constructor(originalLines, modifiedLines, opts) {
      this.shouldComputeCharChanges = opts.shouldComputeCharChanges;
      this.shouldPostProcessCharChanges = opts.shouldPostProcessCharChanges;
      this.shouldIgnoreTrimWhitespace = opts.shouldIgnoreTrimWhitespace;
      this.shouldMakePrettyDiff = opts.shouldMakePrettyDiff;
      this.originalLines = originalLines;
      this.modifiedLines = modifiedLines;
      this.original = new LineSequence(originalLines);
      this.modified = new LineSequence(modifiedLines);
      this.continueLineDiff = createContinueProcessingPredicate(opts.maxComputationTime);
      this.continueCharDiff = createContinueProcessingPredicate(opts.maxComputationTime === 0 ? 0 : Math.min(opts.maxComputationTime, 5e3));
    }
    computeDiff() {
      if (this.original.lines.length === 1 && this.original.lines[0].length === 0) {
        if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) {
          return {
            quitEarly: false,
            changes: []
          };
        }
        return {
          quitEarly: false,
          changes: [{
            originalStartLineNumber: 1,
            originalEndLineNumber: 1,
            modifiedStartLineNumber: 1,
            modifiedEndLineNumber: this.modified.lines.length,
            charChanges: [{
              modifiedEndColumn: 0,
              modifiedEndLineNumber: 0,
              modifiedStartColumn: 0,
              modifiedStartLineNumber: 0,
              originalEndColumn: 0,
              originalEndLineNumber: 0,
              originalStartColumn: 0,
              originalStartLineNumber: 0
            }]
          }]
        };
      }
      if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) {
        return {
          quitEarly: false,
          changes: [{
            originalStartLineNumber: 1,
            originalEndLineNumber: this.original.lines.length,
            modifiedStartLineNumber: 1,
            modifiedEndLineNumber: 1,
            charChanges: [{
              modifiedEndColumn: 0,
              modifiedEndLineNumber: 0,
              modifiedStartColumn: 0,
              modifiedStartLineNumber: 0,
              originalEndColumn: 0,
              originalEndLineNumber: 0,
              originalStartColumn: 0,
              originalStartLineNumber: 0
            }]
          }]
        };
      }
      const diffResult = computeDiff(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff);
      const rawChanges = diffResult.changes;
      const quitEarly = diffResult.quitEarly;
      if (this.shouldIgnoreTrimWhitespace) {
        const lineChanges = [];
        for (let i = 0, length = rawChanges.length; i < length; i++) {
          lineChanges.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, rawChanges[i], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
        }
        return {
          quitEarly,
          changes: lineChanges
        };
      }
      const result = [];
      let originalLineIndex = 0;
      let modifiedLineIndex = 0;
      for (let i = -1, len = rawChanges.length; i < len; i++) {
        const nextChange = i + 1 < len ? rawChanges[i + 1] : null;
        const originalStop = nextChange ? nextChange.originalStart : this.originalLines.length;
        const modifiedStop = nextChange ? nextChange.modifiedStart : this.modifiedLines.length;
        while (originalLineIndex < originalStop && modifiedLineIndex < modifiedStop) {
          const originalLine = this.originalLines[originalLineIndex];
          const modifiedLine = this.modifiedLines[modifiedLineIndex];
          if (originalLine !== modifiedLine) {
            {
              let originalStartColumn = getFirstNonBlankColumn(originalLine, 1);
              let modifiedStartColumn = getFirstNonBlankColumn(modifiedLine, 1);
              while (originalStartColumn > 1 && modifiedStartColumn > 1) {
                const originalChar = originalLine.charCodeAt(originalStartColumn - 2);
                const modifiedChar = modifiedLine.charCodeAt(modifiedStartColumn - 2);
                if (originalChar !== modifiedChar) {
                  break;
                }
                originalStartColumn--;
                modifiedStartColumn--;
              }
              if (originalStartColumn > 1 || modifiedStartColumn > 1) {
                this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, 1, originalStartColumn, modifiedLineIndex + 1, 1, modifiedStartColumn);
              }
            }
            {
              let originalEndColumn = getLastNonBlankColumn(originalLine, 1);
              let modifiedEndColumn = getLastNonBlankColumn(modifiedLine, 1);
              const originalMaxColumn = originalLine.length + 1;
              const modifiedMaxColumn = modifiedLine.length + 1;
              while (originalEndColumn < originalMaxColumn && modifiedEndColumn < modifiedMaxColumn) {
                const originalChar = originalLine.charCodeAt(originalEndColumn - 1);
                const modifiedChar = originalLine.charCodeAt(modifiedEndColumn - 1);
                if (originalChar !== modifiedChar) {
                  break;
                }
                originalEndColumn++;
                modifiedEndColumn++;
              }
              if (originalEndColumn < originalMaxColumn || modifiedEndColumn < modifiedMaxColumn) {
                this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, originalEndColumn, originalMaxColumn, modifiedLineIndex + 1, modifiedEndColumn, modifiedMaxColumn);
              }
            }
          }
          originalLineIndex++;
          modifiedLineIndex++;
        }
        if (nextChange) {
          result.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, nextChange, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
          originalLineIndex += nextChange.originalLength;
          modifiedLineIndex += nextChange.modifiedLength;
        }
      }
      return {
        quitEarly,
        changes: result
      };
    }
    _pushTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
      if (this._mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn)) {
        return;
      }
      let charChanges = void 0;
      if (this.shouldComputeCharChanges) {
        charChanges = [new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn)];
      }
      result.push(new LineChange(originalLineNumber, originalLineNumber, modifiedLineNumber, modifiedLineNumber, charChanges));
    }
    _mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
      const len = result.length;
      if (len === 0) {
        return false;
      }
      const prevChange = result[len - 1];
      if (prevChange.originalEndLineNumber === 0 || prevChange.modifiedEndLineNumber === 0) {
        return false;
      }
      if (prevChange.originalEndLineNumber + 1 === originalLineNumber && prevChange.modifiedEndLineNumber + 1 === modifiedLineNumber) {
        prevChange.originalEndLineNumber = originalLineNumber;
        prevChange.modifiedEndLineNumber = modifiedLineNumber;
        if (this.shouldComputeCharChanges && prevChange.charChanges) {
          prevChange.charChanges.push(new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn));
        }
        return true;
      }
      return false;
    }
  };
  function getFirstNonBlankColumn(txt, defaultValue) {
    const r = firstNonWhitespaceIndex(txt);
    if (r === -1) {
      return defaultValue;
    }
    return r + 1;
  }
  function getLastNonBlankColumn(txt, defaultValue) {
    const r = lastNonWhitespaceIndex(txt);
    if (r === -1) {
      return defaultValue;
    }
    return r + 2;
  }
  function createContinueProcessingPredicate(maximumRuntime) {
    if (maximumRuntime === 0) {
      return () => true;
    }
    const startTime = Date.now();
    return () => {
      return Date.now() - startTime < maximumRuntime;
    };
  }

  // node_modules/monaco-editor/esm/vs/base/common/uint.js
  function toUint8(v) {
    if (v < 0) {
      return 0;
    }
    if (v > 255) {
      return 255;
    }
    return v | 0;
  }
  function toUint32(v) {
    if (v < 0) {
      return 0;
    }
    if (v > 4294967295) {
      return 4294967295;
    }
    return v | 0;
  }

  // node_modules/monaco-editor/esm/vs/editor/common/viewModel/prefixSumComputer.js
  var PrefixSumIndexOfResult = class {
    constructor(index, remainder) {
      this._prefixSumIndexOfResultBrand = void 0;
      this.index = index;
      this.remainder = remainder;
    }
  };
  var PrefixSumComputer = class {
    constructor(values) {
      this.values = values;
      this.prefixSum = new Uint32Array(values.length);
      this.prefixSumValidIndex = new Int32Array(1);
      this.prefixSumValidIndex[0] = -1;
    }
    insertValues(insertIndex, insertValues) {
      insertIndex = toUint32(insertIndex);
      const oldValues = this.values;
      const oldPrefixSum = this.prefixSum;
      const insertValuesLen = insertValues.length;
      if (insertValuesLen === 0) {
        return false;
      }
      this.values = new Uint32Array(oldValues.length + insertValuesLen);
      this.values.set(oldValues.subarray(0, insertIndex), 0);
      this.values.set(oldValues.subarray(insertIndex), insertIndex + insertValuesLen);
      this.values.set(insertValues, insertIndex);
      if (insertIndex - 1 < this.prefixSumValidIndex[0]) {
        this.prefixSumValidIndex[0] = insertIndex - 1;
      }
      this.prefixSum = new Uint32Array(this.values.length);
      if (this.prefixSumValidIndex[0] >= 0) {
        this.prefixSum.set(oldPrefixSum.subarray(0, this.prefixSumValidIndex[0] + 1));
      }
      return true;
    }
    changeValue(index, value) {
      index = toUint32(index);
      value = toUint32(value);
      if (this.values[index] === value) {
        return false;
      }
      this.values[index] = value;
      if (index - 1 < this.prefixSumValidIndex[0]) {
        this.prefixSumValidIndex[0] = index - 1;
      }
      return true;
    }
    removeValues(startIndex, count) {
      startIndex = toUint32(startIndex);
      count = toUint32(count);
      const oldValues = this.values;
      const oldPrefixSum = this.prefixSum;
      if (startIndex >= oldValues.length) {
        return false;
      }
      let maxCount = oldValues.length - startIndex;
      if (count >= maxCount) {
        count = maxCount;
      }
      if (count === 0) {
        return false;
      }
      this.values = new Uint32Array(oldValues.length - count);
      this.values.set(oldValues.subarray(0, startIndex), 0);
      this.values.set(oldValues.subarray(startIndex + count), startIndex);
      this.prefixSum = new Uint32Array(this.values.length);
      if (startIndex - 1 < this.prefixSumValidIndex[0]) {
        this.prefixSumValidIndex[0] = startIndex - 1;
      }
      if (this.prefixSumValidIndex[0] >= 0) {
        this.prefixSum.set(oldPrefixSum.subarray(0, this.prefixSumValidIndex[0] + 1));
      }
      return true;
    }
    getTotalSum() {
      if (this.values.length === 0) {
        return 0;
      }
      return this._getPrefixSum(this.values.length - 1);
    }
    getPrefixSum(index) {
      if (index < 0) {
        return 0;
      }
      index = toUint32(index);
      return this._getPrefixSum(index);
    }
    _getPrefixSum(index) {
      if (index <= this.prefixSumValidIndex[0]) {
        return this.prefixSum[index];
      }
      let startIndex = this.prefixSumValidIndex[0] + 1;
      if (startIndex === 0) {
        this.prefixSum[0] = this.values[0];
        startIndex++;
      }
      if (index >= this.values.length) {
        index = this.values.length - 1;
      }
      for (let i = startIndex; i <= index; i++) {
        this.prefixSum[i] = this.prefixSum[i - 1] + this.values[i];
      }
      this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], index);
      return this.prefixSum[index];
    }
    getIndexOf(sum) {
      sum = Math.floor(sum);
      this.getTotalSum();
      let low = 0;
      let high = this.values.length - 1;
      let mid = 0;
      let midStop = 0;
      let midStart = 0;
      while (low <= high) {
        mid = low + (high - low) / 2 | 0;
        midStop = this.prefixSum[mid];
        midStart = midStop - this.values[mid];
        if (sum < midStart) {
          high = mid - 1;
        } else if (sum >= midStop) {
          low = mid + 1;
        } else {
          break;
        }
      }
      return new PrefixSumIndexOfResult(mid, sum - midStart);
    }
  };

  // node_modules/monaco-editor/esm/vs/editor/common/model/mirrorTextModel.js
  var MirrorTextModel = class {
    constructor(uri, lines, eol, versionId) {
      this._uri = uri;
      this._lines = lines;
      this._eol = eol;
      this._versionId = versionId;
      this._lineStarts = null;
      this._cachedTextValue = null;
    }
    dispose() {
      this._lines.length = 0;
    }
    get version() {
      return this._versionId;
    }
    getText() {
      if (this._cachedTextValue === null) {
        this._cachedTextValue = this._lines.join(this._eol);
      }
      return this._cachedTextValue;
    }
    onEvents(e) {
      if (e.eol && e.eol !== this._eol) {
        this._eol = e.eol;
        this._lineStarts = null;
      }
      const changes = e.changes;
      for (const change of changes) {
        this._acceptDeleteRange(change.range);
        this._acceptInsertText(new Position(change.range.startLineNumber, change.range.startColumn), change.text);
      }
      this._versionId = e.versionId;
      this._cachedTextValue = null;
    }
    _ensureLineStarts() {
      if (!this._lineStarts) {
        const eolLength = this._eol.length;
        const linesLength = this._lines.length;
        const lineStartValues = new Uint32Array(linesLength);
        for (let i = 0; i < linesLength; i++) {
          lineStartValues[i] = this._lines[i].length + eolLength;
        }
        this._lineStarts = new PrefixSumComputer(lineStartValues);
      }
    }
    _setLineText(lineIndex, newValue) {
      this._lines[lineIndex] = newValue;
      if (this._lineStarts) {
        this._lineStarts.changeValue(lineIndex, this._lines[lineIndex].length + this._eol.length);
      }
    }
    _acceptDeleteRange(range) {
      if (range.startLineNumber === range.endLineNumber) {
        if (range.startColumn === range.endColumn) {
          return;
        }
        this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1) + this._lines[range.startLineNumber - 1].substring(range.endColumn - 1));
        return;
      }
      this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1) + this._lines[range.endLineNumber - 1].substring(range.endColumn - 1));
      this._lines.splice(range.startLineNumber, range.endLineNumber - range.startLineNumber);
      if (this._lineStarts) {
        this._lineStarts.removeValues(range.startLineNumber, range.endLineNumber - range.startLineNumber);
      }
    }
    _acceptInsertText(position, insertText) {
      if (insertText.length === 0) {
        return;
      }
      let insertLines = splitLines(insertText);
      if (insertLines.length === 1) {
        this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0] + this._lines[position.lineNumber - 1].substring(position.column - 1));
        return;
      }
      insertLines[insertLines.length - 1] += this._lines[position.lineNumber - 1].substring(position.column - 1);
      this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0]);
      let newLengths = new Uint32Array(insertLines.length - 1);
      for (let i = 1; i < insertLines.length; i++) {
        this._lines.splice(position.lineNumber + i - 1, 0, insertLines[i]);
        newLengths[i - 1] = insertLines[i].length + this._eol.length;
      }
      if (this._lineStarts) {
        this._lineStarts.insertValues(position.lineNumber, newLengths);
      }
    }
  };

  // node_modules/monaco-editor/esm/vs/editor/common/model/wordHelper.js
  var USUAL_WORD_SEPARATORS = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
  function createWordRegExp(allowInWords = "") {
    let source = "(-?\\d*\\.\\d\\w*)|([^";
    for (const sep2 of USUAL_WORD_SEPARATORS) {
      if (allowInWords.indexOf(sep2) >= 0) {
        continue;
      }
      source += "\\" + sep2;
    }
    source += "\\s]+)";
    return new RegExp(source, "g");
  }
  var DEFAULT_WORD_REGEXP = createWordRegExp();
  function ensureValidWordDefinition(wordDefinition) {
    let result = DEFAULT_WORD_REGEXP;
    if (wordDefinition && wordDefinition instanceof RegExp) {
      if (!wordDefinition.global) {
        let flags = "g";
        if (wordDefinition.ignoreCase) {
          flags += "i";
        }
        if (wordDefinition.multiline) {
          flags += "m";
        }
        if (wordDefinition.unicode) {
          flags += "u";
        }
        result = new RegExp(wordDefinition.source, flags);
      } else {
        result = wordDefinition;
      }
    }
    result.lastIndex = 0;
    return result;
  }
  var _defaultConfig = {
    maxLen: 1e3,
    windowSize: 15,
    timeBudget: 150
  };
  function getWordAtText(column, wordDefinition, text, textOffset, config = _defaultConfig) {
    if (text.length > config.maxLen) {
      let start = column - config.maxLen / 2;
      if (start < 0) {
        start = 0;
      } else {
        textOffset += start;
      }
      text = text.substring(start, column + config.maxLen / 2);
      return getWordAtText(column, wordDefinition, text, textOffset, config);
    }
    const t1 = Date.now();
    const pos = column - 1 - textOffset;
    let prevRegexIndex = -1;
    let match = null;
    for (let i = 1; ; i++) {
      if (Date.now() - t1 >= config.timeBudget) {
        break;
      }
      const regexIndex = pos - config.windowSize * i;
      wordDefinition.lastIndex = Math.max(0, regexIndex);
      const thisMatch = _findRegexMatchEnclosingPosition(wordDefinition, text, pos, prevRegexIndex);
      if (!thisMatch && match) {
        break;
      }
      match = thisMatch;
      if (regexIndex <= 0) {
        break;
      }
      prevRegexIndex = regexIndex;
    }
    if (match) {
      let result = {
        word: match[0],
        startColumn: textOffset + 1 + match.index,
        endColumn: textOffset + 1 + match.index + match[0].length
      };
      wordDefinition.lastIndex = 0;
      return result;
    }
    return null;
  }
  function _findRegexMatchEnclosingPosition(wordDefinition, text, pos, stopPos) {
    let match;
    while (match = wordDefinition.exec(text)) {
      const matchIndex = match.index || 0;
      if (matchIndex <= pos && wordDefinition.lastIndex >= pos) {
        return match;
      } else if (stopPos > 0 && matchIndex > stopPos) {
        return null;
      }
    }
    return null;
  }

  // node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier.js
  var CharacterClassifier = class {
    constructor(_defaultValue) {
      let defaultValue = toUint8(_defaultValue);
      this._defaultValue = defaultValue;
      this._asciiMap = CharacterClassifier._createAsciiMap(defaultValue);
      this._map = new Map();
    }
    static _createAsciiMap(defaultValue) {
      let asciiMap = new Uint8Array(256);
      for (let i = 0; i < 256; i++) {
        asciiMap[i] = defaultValue;
      }
      return asciiMap;
    }
    set(charCode, _value) {
      let value = toUint8(_value);
      if (charCode >= 0 && charCode < 256) {
        this._asciiMap[charCode] = value;
      } else {
        this._map.set(charCode, value);
      }
    }
    get(charCode) {
      if (charCode >= 0 && charCode < 256) {
        return this._asciiMap[charCode];
      } else {
        return this._map.get(charCode) || this._defaultValue;
      }
    }
  };

  // node_modules/monaco-editor/esm/vs/editor/common/modes/linkComputer.js
  var Uint8Matrix = class {
    constructor(rows, cols, defaultValue) {
      const data = new Uint8Array(rows * cols);
      for (let i = 0, len = rows * cols; i < len; i++) {
        data[i] = defaultValue;
      }
      this._data = data;
      this.rows = rows;
      this.cols = cols;
    }
    get(row, col) {
      return this._data[row * this.cols + col];
    }
    set(row, col, value) {
      this._data[row * this.cols + col] = value;
    }
  };
  var StateMachine = class {
    constructor(edges) {
      let maxCharCode = 0;
      let maxState = 0;
      for (let i = 0, len = edges.length; i < len; i++) {
        let [from, chCode, to] = edges[i];
        if (chCode > maxCharCode) {
          maxCharCode = chCode;
        }
        if (from > maxState) {
          maxState = from;
        }
        if (to > maxState) {
          maxState = to;
        }
      }
      maxCharCode++;
      maxState++;
      let states = new Uint8Matrix(maxState, maxCharCode, 0);
      for (let i = 0, len = edges.length; i < len; i++) {
        let [from, chCode, to] = edges[i];
        states.set(from, chCode, to);
      }
      this._states = states;
      this._maxCharCode = maxCharCode;
    }
    nextState(currentState, chCode) {
      if (chCode < 0 || chCode >= this._maxCharCode) {
        return 0;
      }
      return this._states.get(currentState, chCode);
    }
  };
  var _stateMachine = null;
  function getStateMachine() {
    if (_stateMachine === null) {
      _stateMachine = new StateMachine([
        [1, 104, 2],
        [1, 72, 2],
        [1, 102, 6],
        [1, 70, 6],
        [2, 116, 3],
        [2, 84, 3],
        [3, 116, 4],
        [3, 84, 4],
        [4, 112, 5],
        [4, 80, 5],
        [5, 115, 9],
        [5, 83, 9],
        [5, 58, 10],
        [6, 105, 7],
        [6, 73, 7],
        [7, 108, 8],
        [7, 76, 8],
        [8, 101, 9],
        [8, 69, 9],
        [9, 58, 10],
        [10, 47, 11],
        [11, 47, 12]
      ]);
    }
    return _stateMachine;
  }
  var _classifier = null;
  function getClassifier() {
    if (_classifier === null) {
      _classifier = new CharacterClassifier(0);
      const FORCE_TERMINATION_CHARACTERS = ` 	<>'"\u3001\u3002\uFF61\uFF64\uFF0C\uFF0E\uFF1A\uFF1B\u2018\u3008\u300C\u300E\u3014\uFF08\uFF3B\uFF5B\uFF62\uFF63\uFF5D\uFF3D\uFF09\u3015\u300F\u300D\u3009\u2019\uFF40\uFF5E\u2026`;
      for (let i = 0; i < FORCE_TERMINATION_CHARACTERS.length; i++) {
        _classifier.set(FORCE_TERMINATION_CHARACTERS.charCodeAt(i), 1);
      }
      const CANNOT_END_WITH_CHARACTERS = ".,;";
      for (let i = 0; i < CANNOT_END_WITH_CHARACTERS.length; i++) {
        _classifier.set(CANNOT_END_WITH_CHARACTERS.charCodeAt(i), 2);
      }
    }
    return _classifier;
  }
  var LinkComputer = class {
    static _createLink(classifier, line, lineNumber, linkBeginIndex, linkEndIndex) {
      let lastIncludedCharIndex = linkEndIndex - 1;
      do {
        const chCode = line.charCodeAt(lastIncludedCharIndex);
        const chClass = classifier.get(chCode);
        if (chClass !== 2) {
          break;
        }
        lastIncludedCharIndex--;
      } while (lastIncludedCharIndex > linkBeginIndex);
      if (linkBeginIndex > 0) {
        const charCodeBeforeLink = line.charCodeAt(linkBeginIndex - 1);
        const lastCharCodeInLink = line.charCodeAt(lastIncludedCharIndex);
        if (charCodeBeforeLink === 40 && lastCharCodeInLink === 41 || charCodeBeforeLink === 91 && lastCharCodeInLink === 93 || charCodeBeforeLink === 123 && lastCharCodeInLink === 125) {
          lastIncludedCharIndex--;
        }
      }
      return {
        range: {
          startLineNumber: lineNumber,
          startColumn: linkBeginIndex + 1,
          endLineNumber: lineNumber,
          endColumn: lastIncludedCharIndex + 2
        },
        url: line.substring(linkBeginIndex, lastIncludedCharIndex + 1)
      };
    }
    static computeLinks(model, stateMachine = getStateMachine()) {
      const classifier = getClassifier();
      let result = [];
      for (let i = 1, lineCount = model.getLineCount(); i <= lineCount; i++) {
        const line = model.getLineContent(i);
        const len = line.length;
        let j = 0;
        let linkBeginIndex = 0;
        let linkBeginChCode = 0;
        let state = 1;
        let hasOpenParens = false;
        let hasOpenSquareBracket = false;
        let inSquareBrackets = false;
        let hasOpenCurlyBracket = false;
        while (j < len) {
          let resetStateMachine = false;
          const chCode = line.charCodeAt(j);
          if (state === 13) {
            let chClass;
            switch (chCode) {
              case 40:
                hasOpenParens = true;
                chClass = 0;
                break;
              case 41:
                chClass = hasOpenParens ? 0 : 1;
                break;
              case 91:
                inSquareBrackets = true;
                hasOpenSquareBracket = true;
                chClass = 0;
                break;
              case 93:
                inSquareBrackets = false;
                chClass = hasOpenSquareBracket ? 0 : 1;
                break;
              case 123:
                hasOpenCurlyBracket = true;
                chClass = 0;
                break;
              case 125:
                chClass = hasOpenCurlyBracket ? 0 : 1;
                break;
              case 39:
                chClass = linkBeginChCode === 34 || linkBeginChCode === 96 ? 0 : 1;
                break;
              case 34:
                chClass = linkBeginChCode === 39 || linkBeginChCode === 96 ? 0 : 1;
                break;
              case 96:
                chClass = linkBeginChCode === 39 || linkBeginChCode === 34 ? 0 : 1;
                break;
              case 42:
                chClass = linkBeginChCode === 42 ? 1 : 0;
                break;
              case 124:
                chClass = linkBeginChCode === 124 ? 1 : 0;
                break;
              case 32:
                chClass = inSquareBrackets ? 0 : 1;
                break;
              default:
                chClass = classifier.get(chCode);
            }
            if (chClass === 1) {
              result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, j));
              resetStateMachine = true;
            }
          } else if (state === 12) {
            let chClass;
            if (chCode === 91) {
              hasOpenSquareBracket = true;
              chClass = 0;
            } else {
              chClass = classifier.get(chCode);
            }
            if (chClass === 1) {
              resetStateMachine = true;
            } else {
              state = 13;
            }
          } else {
            state = stateMachine.nextState(state, chCode);
            if (state === 0) {
              resetStateMachine = true;
            }
          }
          if (resetStateMachine) {
            state = 1;
            hasOpenParens = false;
            hasOpenSquareBracket = false;
            hasOpenCurlyBracket = false;
            linkBeginIndex = j + 1;
            linkBeginChCode = chCode;
          }
          j++;
        }
        if (state === 13) {
          result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, len));
        }
      }
      return result;
    }
  };
  function computeLinks(model) {
    if (!model || typeof model.getLineCount !== "function" || typeof model.getLineContent !== "function") {
      return [];
    }
    return LinkComputer.computeLinks(model);
  }

  // node_modules/monaco-editor/esm/vs/editor/common/modes/supports/inplaceReplaceSupport.js
  var BasicInplaceReplace = class {
    constructor() {
      this._defaultValueSet = [
        ["true", "false"],
        ["True", "False"],
        ["Private", "Public", "Friend", "ReadOnly", "Partial", "Protected", "WriteOnly"],
        ["public", "protected", "private"]
      ];
    }
    navigateValueSet(range1, text1, range2, text2, up) {
      if (range1 && text1) {
        let result = this.doNavigateValueSet(text1, up);
        if (result) {
          return {
            range: range1,
            value: result
          };
        }
      }
      if (range2 && text2) {
        let result = this.doNavigateValueSet(text2, up);
        if (result) {
          return {
            range: range2,
            value: result
          };
        }
      }
      return null;
    }
    doNavigateValueSet(text, up) {
      let numberResult = this.numberReplace(text, up);
      if (numberResult !== null) {
        return numberResult;
      }
      return this.textReplace(text, up);
    }
    numberReplace(value, up) {
      let precision = Math.pow(10, value.length - (value.lastIndexOf(".") + 1));
      let n1 = Number(value);
      let n2 = parseFloat(value);
      if (!isNaN(n1) && !isNaN(n2) && n1 === n2) {
        if (n1 === 0 && !up) {
          return null;
        } else {
          n1 = Math.floor(n1 * precision);
          n1 += up ? precision : -precision;
          return String(n1 / precision);
        }
      }
      return null;
    }
    textReplace(value, up) {
      return this.valueSetsReplace(this._defaultValueSet, value, up);
    }
    valueSetsReplace(valueSets, value, up) {
      let result = null;
      for (let i = 0, len = valueSets.length; result === null && i < len; i++) {
        result = this.valueSetReplace(valueSets[i], value, up);
      }
      return result;
    }
    valueSetReplace(valueSet, value, up) {
      let idx = valueSet.indexOf(value);
      if (idx >= 0) {
        idx += up ? 1 : -1;
        if (idx < 0) {
          idx = valueSet.length - 1;
        } else {
          idx %= valueSet.length;
        }
        return valueSet[idx];
      }
      return null;
    }
  };
  BasicInplaceReplace.INSTANCE = new BasicInplaceReplace();

  // node_modules/monaco-editor/esm/vs/base/common/linkedList.js
  var Node = class {
    constructor(element) {
      this.element = element;
      this.next = Node.Undefined;
      this.prev = Node.Undefined;
    }
  };
  Node.Undefined = new Node(void 0);
  var LinkedList = class {
    constructor() {
      this._first = Node.Undefined;
      this._last = Node.Undefined;
      this._size = 0;
    }
    get size() {
      return this._size;
    }
    isEmpty() {
      return this._first === Node.Undefined;
    }
    clear() {
      let node = this._first;
      while (node !== Node.Undefined) {
        const next = node.next;
        node.prev = Node.Undefined;
        node.next = Node.Undefined;
        node = next;
      }
      this._first = Node.Undefined;
      this._last = Node.Undefined;
      this._size = 0;
    }
    unshift(element) {
      return this._insert(element, false);
    }
    push(element) {
      return this._insert(element, true);
    }
    _insert(element, atTheEnd) {
      const newNode = new Node(element);
      if (this._first === Node.Undefined) {
        this._first = newNode;
        this._last = newNode;
      } else if (atTheEnd) {
        const oldLast = this._last;
        this._last = newNode;
        newNode.prev = oldLast;
        oldLast.next = newNode;
      } else {
        const oldFirst = this._first;
        this._first = newNode;
        newNode.next = oldFirst;
        oldFirst.prev = newNode;
      }
      this._size += 1;
      let didRemove = false;
      return () => {
        if (!didRemove) {
          didRemove = true;
          this._remove(newNode);
        }
      };
    }
    shift() {
      if (this._first === Node.Undefined) {
        return void 0;
      } else {
        const res = this._first.element;
        this._remove(this._first);
        return res;
      }
    }
    pop() {
      if (this._last === Node.Undefined) {
        return void 0;
      } else {
        const res = this._last.element;
        this._remove(this._last);
        return res;
      }
    }
    _remove(node) {
      if (node.prev !== Node.Undefined && node.next !== Node.Undefined) {
        const anchor = node.prev;
        anchor.next = node.next;
        node.next.prev = anchor;
      } else if (node.prev === Node.Undefined && node.next === Node.Undefined) {
        this._first = Node.Undefined;
        this._last = Node.Undefined;
      } else if (node.next === Node.Undefined) {
        this._last = this._last.prev;
        this._last.next = Node.Undefined;
      } else if (node.prev === Node.Undefined) {
        this._first = this._first.next;
        this._first.prev = Node.Undefined;
      }
      this._size -= 1;
    }
    *[Symbol.iterator]() {
      let node = this._first;
      while (node !== Node.Undefined) {
        yield node.element;
        node = node.next;
      }
    }
  };

  // node_modules/monaco-editor/esm/vs/base/common/stopwatch.js
  var hasPerformanceNow = globals.performance && typeof globals.performance.now === "function";
  var StopWatch = class {
    constructor(highResolution) {
      this._highResolution = hasPerformanceNow && highResolution;
      this._startTime = this._now();
      this._stopTime = -1;
    }
    static create(highResolution = true) {
      return new StopWatch(highResolution);
    }
    stop() {
      this._stopTime = this._now();
    }
    elapsed() {
      if (this._stopTime !== -1) {
        return this._stopTime - this._startTime;
      }
      return this._now() - this._startTime;
    }
    _now() {
      return this._highResolution ? globals.performance.now() : Date.now();
    }
  };

  // node_modules/monaco-editor/esm/vs/base/common/event.js
  var Event;
  (function(Event2) {
    Event2.None = () => Disposable.None;
    function once2(event) {
      return (listener, thisArgs = null, disposables) => {
        let didFire = false;
        let result;
        result = event((e) => {
          if (didFire) {
            return;
          } else if (result) {
            result.dispose();
          } else {
            didFire = true;
          }
          return listener.call(thisArgs, e);
        }, null, disposables);
        if (didFire) {
          result.dispose();
        }
        return result;
      };
    }
    Event2.once = once2;
    function map(event, map2) {
      return snapshot((listener, thisArgs = null, disposables) => event((i) => listener.call(thisArgs, map2(i)), null, disposables));
    }
    Event2.map = map;
    function forEach(event, each) {
      return snapshot((listener, thisArgs = null, disposables) => event((i) => {
        each(i);
        listener.call(thisArgs, i);
      }, null, disposables));
    }
    Event2.forEach = forEach;
    function filter(event, filter2) {
      return snapshot((listener, thisArgs = null, disposables) => event((e) => filter2(e) && listener.call(thisArgs, e), null, disposables));
    }
    Event2.filter = filter;
    function signal(event) {
      return event;
    }
    Event2.signal = signal;
    function any(...events) {
      return (listener, thisArgs = null, disposables) => combinedDisposable(...events.map((event) => event((e) => listener.call(thisArgs, e), null, disposables)));
    }
    Event2.any = any;
    function reduce(event, merge, initial) {
      let output = initial;
      return map(event, (e) => {
        output = merge(output, e);
        return output;
      });
    }
    Event2.reduce = reduce;
    function snapshot(event) {
      let listener;
      const emitter = new Emitter({
        onFirstListenerAdd() {
          listener = event(emitter.fire, emitter);
        },
        onLastListenerRemove() {
          listener.dispose();
        }
      });
      return emitter.event;
    }
    function debounce(event, merge, delay = 100, leading = false, leakWarningThreshold) {
      let subscription;
      let output = void 0;
      let handle = void 0;
      let numDebouncedCalls = 0;
      const emitter = new Emitter({
        leakWarningThreshold,
        onFirstListenerAdd() {
          subscription = event((cur) => {
            numDebouncedCalls++;
            output = merge(output, cur);
            if (leading && !handle) {
              emitter.fire(output);
              output = void 0;
            }
            clearTimeout(handle);
            handle = setTimeout(() => {
              const _output = output;
              output = void 0;
              handle = void 0;
              if (!leading || numDebouncedCalls > 1) {
                emitter.fire(_output);
              }
              numDebouncedCalls = 0;
            }, delay);
          });
        },
        onLastListenerRemove() {
          subscription.dispose();
        }
      });
      return emitter.event;
    }
    Event2.debounce = debounce;
    function latch(event, equals = (a, b) => a === b) {
      let firstCall = true;
      let cache;
      return filter(event, (value) => {
        const shouldEmit = firstCall || !equals(value, cache);
        firstCall = false;
        cache = value;
        return shouldEmit;
      });
    }
    Event2.latch = latch;
    function split(event, isT) {
      return [
        Event2.filter(event, isT),
        Event2.filter(event, (e) => !isT(e))
      ];
    }
    Event2.split = split;
    function buffer(event, nextTick = false, _buffer = []) {
      let buffer2 = _buffer.slice();
      let listener = event((e) => {
        if (buffer2) {
          buffer2.push(e);
        } else {
          emitter.fire(e);
        }
      });
      const flush = () => {
        if (buffer2) {
          buffer2.forEach((e) => emitter.fire(e));
        }
        buffer2 = null;
      };
      const emitter = new Emitter({
        onFirstListenerAdd() {
          if (!listener) {
            listener = event((e) => emitter.fire(e));
          }
        },
        onFirstListenerDidAdd() {
          if (buffer2) {
            if (nextTick) {
              setTimeout(flush);
            } else {
              flush();
            }
          }
        },
        onLastListenerRemove() {
          if (listener) {
            listener.dispose();
          }
          listener = null;
        }
      });
      return emitter.event;
    }
    Event2.buffer = buffer;
    class ChainableEvent {
      constructor(event) {
        this.event = event;
      }
      map(fn) {
        return new ChainableEvent(map(this.event, fn));
      }
      forEach(fn) {
        return new ChainableEvent(forEach(this.event, fn));
      }
      filter(fn) {
        return new ChainableEvent(filter(this.event, fn));
      }
      reduce(merge, initial) {
        return new ChainableEvent(reduce(this.event, merge, initial));
      }
      latch() {
        return new ChainableEvent(latch(this.event));
      }
      debounce(merge, delay = 100, leading = false, leakWarningThreshold) {
        return new ChainableEvent(debounce(this.event, merge, delay, leading, leakWarningThreshold));
      }
      on(listener, thisArgs, disposables) {
        return this.event(listener, thisArgs, disposables);
      }
      once(listener, thisArgs, disposables) {
        return once2(this.event)(listener, thisArgs, disposables);
      }
    }
    function chain(event) {
      return new ChainableEvent(event);
    }
    Event2.chain = chain;
    function fromNodeEventEmitter(emitter, eventName, map2 = (id) => id) {
      const fn = (...args) => result.fire(map2(...args));
      const onFirstListenerAdd = () => emitter.on(eventName, fn);
      const onLastListenerRemove = () => emitter.removeListener(eventName, fn);
      const result = new Emitter({ onFirstListenerAdd, onLastListenerRemove });
      return result.event;
    }
    Event2.fromNodeEventEmitter = fromNodeEventEmitter;
    function fromDOMEventEmitter(emitter, eventName, map2 = (id) => id) {
      const fn = (...args) => result.fire(map2(...args));
      const onFirstListenerAdd = () => emitter.addEventListener(eventName, fn);
      const onLastListenerRemove = () => emitter.removeEventListener(eventName, fn);
      const result = new Emitter({ onFirstListenerAdd, onLastListenerRemove });
      return result.event;
    }
    Event2.fromDOMEventEmitter = fromDOMEventEmitter;
    function toPromise(event) {
      return new Promise((resolve2) => once2(event)(resolve2));
    }
    Event2.toPromise = toPromise;
  })(Event || (Event = {}));
  var EventProfiling = class {
    constructor(name) {
      this._listenerCount = 0;
      this._invocationCount = 0;
      this._elapsedOverall = 0;
      this._name = `${name}_${EventProfiling._idPool++}`;
    }
    start(listenerCount) {
      this._stopWatch = new StopWatch(true);
      this._listenerCount = listenerCount;
    }
    stop() {
      if (this._stopWatch) {
        const elapsed = this._stopWatch.elapsed();
        this._elapsedOverall += elapsed;
        this._invocationCount += 1;
        console.info(`did FIRE ${this._name}: elapsed_ms: ${elapsed.toFixed(5)}, listener: ${this._listenerCount} (elapsed_overall: ${this._elapsedOverall.toFixed(2)}, invocations: ${this._invocationCount})`);
        this._stopWatch = void 0;
      }
    }
  };
  EventProfiling._idPool = 0;
  var _globalLeakWarningThreshold = -1;
  var LeakageMonitor = class {
    constructor(customThreshold, name = Math.random().toString(18).slice(2, 5)) {
      this.customThreshold = customThreshold;
      this.name = name;
      this._warnCountdown = 0;
    }
    dispose() {
      if (this._stacks) {
        this._stacks.clear();
      }
    }
    check(listenerCount) {
      let threshold = _globalLeakWarningThreshold;
      if (typeof this.customThreshold === "number") {
        threshold = this.customThreshold;
      }
      if (threshold <= 0 || listenerCount < threshold) {
        return void 0;
      }
      if (!this._stacks) {
        this._stacks = new Map();
      }
      const stack = new Error().stack.split("\n").slice(3).join("\n");
      const count = this._stacks.get(stack) || 0;
      this._stacks.set(stack, count + 1);
      this._warnCountdown -= 1;
      if (this._warnCountdown <= 0) {
        this._warnCountdown = threshold * 0.5;
        let topStack;
        let topCount = 0;
        for (const [stack2, count2] of this._stacks) {
          if (!topStack || topCount < count2) {
            topStack = stack2;
            topCount = count2;
          }
        }
        console.warn(`[${this.name}] potential listener LEAK detected, having ${listenerCount} listeners already. MOST frequent listener (${topCount}):`);
        console.warn(topStack);
      }
      return () => {
        const count2 = this._stacks.get(stack) || 0;
        this._stacks.set(stack, count2 - 1);
      };
    }
  };
  var Emitter = class {
    constructor(options) {
      var _a2;
      this._disposed = false;
      this._options = options;
      this._leakageMon = _globalLeakWarningThreshold > 0 ? new LeakageMonitor(this._options && this._options.leakWarningThreshold) : void 0;
      this._perfMon = ((_a2 = this._options) === null || _a2 === void 0 ? void 0 : _a2._profName) ? new EventProfiling(this._options._profName) : void 0;
    }
    get event() {
      if (!this._event) {
        this._event = (listener, thisArgs, disposables) => {
          var _a2;
          if (!this._listeners) {
            this._listeners = new LinkedList();
          }
          const firstListener = this._listeners.isEmpty();
          if (firstListener && this._options && this._options.onFirstListenerAdd) {
            this._options.onFirstListenerAdd(this);
          }
          const remove = this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);
          if (firstListener && this._options && this._options.onFirstListenerDidAdd) {
            this._options.onFirstListenerDidAdd(this);
          }
          if (this._options && this._options.onListenerDidAdd) {
            this._options.onListenerDidAdd(this, listener, thisArgs);
          }
          const removeMonitor = (_a2 = this._leakageMon) === null || _a2 === void 0 ? void 0 : _a2.check(this._listeners.size);
          const result = toDisposable(() => {
            if (removeMonitor) {
              removeMonitor();
            }
            if (!this._disposed) {
              remove();
              if (this._options && this._options.onLastListenerRemove) {
                const hasListeners = this._listeners && !this._listeners.isEmpty();
                if (!hasListeners) {
                  this._options.onLastListenerRemove(this);
                }
              }
            }
          });
          if (disposables instanceof DisposableStore) {
            disposables.add(result);
          } else if (Array.isArray(disposables)) {
            disposables.push(result);
          }
          return result;
        };
      }
      return this._event;
    }
    fire(event) {
      var _a2, _b;
      if (this._listeners) {
        if (!this._deliveryQueue) {
          this._deliveryQueue = new LinkedList();
        }
        for (let listener of this._listeners) {
          this._deliveryQueue.push([listener, event]);
        }
        (_a2 = this._perfMon) === null || _a2 === void 0 ? void 0 : _a2.start(this._deliveryQueue.size);
        while (this._deliveryQueue.size > 0) {
          const [listener, event2] = this._deliveryQueue.shift();
          try {
            if (typeof listener === "function") {
              listener.call(void 0, event2);
            } else {
              listener[0].call(listener[1], event2);
            }
          } catch (e) {
            onUnexpectedError(e);
          }
        }
        (_b = this._perfMon) === null || _b === void 0 ? void 0 : _b.stop();
      }
    }
    dispose() {
      var _a2, _b, _c, _d, _e;
      if (!this._disposed) {
        this._disposed = true;
        (_a2 = this._listeners) === null || _a2 === void 0 ? void 0 : _a2.clear();
        (_b = this._deliveryQueue) === null || _b === void 0 ? void 0 : _b.clear();
        (_d = (_c = this._options) === null || _c === void 0 ? void 0 : _c.onLastListenerRemove) === null || _d === void 0 ? void 0 : _d.call(_c);
        (_e = this._leakageMon) === null || _e === void 0 ? void 0 : _e.dispose();
      }
    }
  };

  // node_modules/monaco-editor/esm/vs/base/common/cancellation.js
  var shortcutEvent = Object.freeze(function(callback, context) {
    const handle = setTimeout(callback.bind(context), 0);
    return { dispose() {
      clearTimeout(handle);
    } };
  });
  var CancellationToken;
  (function(CancellationToken2) {
    function isCancellationToken(thing) {
      if (thing === CancellationToken2.None || thing === CancellationToken2.Cancelled) {
        return true;
      }
      if (thing instanceof MutableToken) {
        return true;
      }
      if (!thing || typeof thing !== "object") {
        return false;
      }
      return typeof thing.isCancellationRequested === "boolean" && typeof thing.onCancellationRequested === "function";
    }
    CancellationToken2.isCancellationToken = isCancellationToken;
    CancellationToken2.None = Object.freeze({
      isCancellationRequested: false,
      onCancellationRequested: Event.None
    });
    CancellationToken2.Cancelled = Object.freeze({
      isCancellationRequested: true,
      onCancellationRequested: shortcutEvent
    });
  })(CancellationToken || (CancellationToken = {}));
  var MutableToken = class {
    constructor() {
      this._isCancelled = false;
      this._emitter = null;
    }
    cancel() {
      if (!this._isCancelled) {
        this._isCancelled = true;
        if (this._emitter) {
          this._emitter.fire(void 0);
          this.dispose();
        }
      }
    }
    get isCancellationRequested() {
      return this._isCancelled;
    }
    get onCancellationRequested() {
      if (this._isCancelled) {
        return shortcutEvent;
      }
      if (!this._emitter) {
        this._emitter = new Emitter();
      }
      return this._emitter.event;
    }
    dispose() {
      if (this._emitter) {
        this._emitter.dispose();
        this._emitter = null;
      }
    }
  };
  var CancellationTokenSource = class {
    constructor(parent) {
      this._token = void 0;
      this._parentListener = void 0;
      this._parentListener = parent && parent.onCancellationRequested(this.cancel, this);
    }
    get token() {
      if (!this._token) {
        this._token = new MutableToken();
      }
      return this._token;
    }
    cancel() {
      if (!this._token) {
        this._token = CancellationToken.Cancelled;
      } else if (this._token instanceof MutableToken) {
        this._token.cancel();
      }
    }
    dispose(cancel = false) {
      if (cancel) {
        this.cancel();
      }
      if (this._parentListener) {
        this._parentListener.dispose();
      }
      if (!this._token) {
        this._token = CancellationToken.None;
      } else if (this._token instanceof MutableToken) {
        this._token.dispose();
      }
    }
  };

  // node_modules/monaco-editor/esm/vs/base/common/keyCodes.js
  var KeyCodeStrMap = class {
    constructor() {
      this._keyCodeToStr = [];
      this._strToKeyCode = Object.create(null);
    }
    define(keyCode, str) {
      this._keyCodeToStr[keyCode] = str;
      this._strToKeyCode[str.toLowerCase()] = keyCode;
    }
    keyCodeToStr(keyCode) {
      return this._keyCodeToStr[keyCode];
    }
    strToKeyCode(str) {
      return this._strToKeyCode[str.toLowerCase()] || 0;
    }
  };
  var uiMap = new KeyCodeStrMap();
  var userSettingsUSMap = new KeyCodeStrMap();
  var userSettingsGeneralMap = new KeyCodeStrMap();
  (function() {
    function define(keyCode, uiLabel, usUserSettingsLabel = uiLabel, generalUserSettingsLabel = usUserSettingsLabel) {
      uiMap.define(keyCode, uiLabel);
      userSettingsUSMap.define(keyCode, usUserSettingsLabel);
      userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel);
    }
    define(0, "unknown");
    define(1, "Backspace");
    define(2, "Tab");
    define(3, "Enter");
    define(4, "Shift");
    define(5, "Ctrl");
    define(6, "Alt");
    define(7, "PauseBreak");
    define(8, "CapsLock");
    define(9, "Escape");
    define(10, "Space");
    define(11, "PageUp");
    define(12, "PageDown");
    define(13, "End");
    define(14, "Home");
    define(15, "LeftArrow", "Left");
    define(16, "UpArrow", "Up");
    define(17, "RightArrow", "Right");
    define(18, "DownArrow", "Down");
    define(19, "Insert");
    define(20, "Delete");
    define(21, "0");
    define(22, "1");
    define(23, "2");
    define(24, "3");
    define(25, "4");
    define(26, "5");
    define(27, "6");
    define(28, "7");
    define(29, "8");
    define(30, "9");
    define(31, "A");
    define(32, "B");
    define(33, "C");
    define(34, "D");
    define(35, "E");
    define(36, "F");
    define(37, "G");
    define(38, "H");
    define(39, "I");
    define(40, "J");
    define(41, "K");
    define(42, "L");
    define(43, "M");
    define(44, "N");
    define(45, "O");
    define(46, "P");
    define(47, "Q");
    define(48, "R");
    define(49, "S");
    define(50, "T");
    define(51, "U");
    define(52, "V");
    define(53, "W");
    define(54, "X");
    define(55, "Y");
    define(56, "Z");
    define(57, "Meta");
    define(58, "ContextMenu");
    define(59, "F1");
    define(60, "F2");
    define(61, "F3");
    define(62, "F4");
    define(63, "F5");
    define(64, "F6");
    define(65, "F7");
    define(66, "F8");
    define(67, "F9");
    define(68, "F10");
    define(69, "F11");
    define(70, "F12");
    define(71, "F13");
    define(72, "F14");
    define(73, "F15");
    define(74, "F16");
    define(75, "F17");
    define(76, "F18");
    define(77, "F19");
    define(78, "NumLock");
    define(79, "ScrollLock");
    define(80, ";", ";", "OEM_1");
    define(81, "=", "=", "OEM_PLUS");
    define(82, ",", ",", "OEM_COMMA");
    define(83, "-", "-", "OEM_MINUS");
    define(84, ".", ".", "OEM_PERIOD");
    define(85, "/", "/", "OEM_2");
    define(86, "`", "`", "OEM_3");
    define(110, "ABNT_C1");
    define(111, "ABNT_C2");
    define(87, "[", "[", "OEM_4");
    define(88, "\\", "\\", "OEM_5");
    define(89, "]", "]", "OEM_6");
    define(90, "'", "'", "OEM_7");
    define(91, "OEM_8");
    define(92, "OEM_102");
    define(93, "NumPad0");
    define(94, "NumPad1");
    define(95, "NumPad2");
    define(96, "NumPad3");
    define(97, "NumPad4");
    define(98, "NumPad5");
    define(99, "NumPad6");
    define(100, "NumPad7");
    define(101, "NumPad8");
    define(102, "NumPad9");
    define(103, "NumPad_Multiply");
    define(104, "NumPad_Add");
    define(105, "NumPad_Separator");
    define(106, "NumPad_Subtract");
    define(107, "NumPad_Decimal");
    define(108, "NumPad_Divide");
  })();
  var KeyCodeUtils;
  (function(KeyCodeUtils2) {
    function toString(keyCode) {
      return uiMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils2.toString = toString;
    function fromString(key) {
      return uiMap.strToKeyCode(key);
    }
    KeyCodeUtils2.fromString = fromString;
    function toUserSettingsUS(keyCode) {
      return userSettingsUSMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils2.toUserSettingsUS = toUserSettingsUS;
    function toUserSettingsGeneral(keyCode) {
      return userSettingsGeneralMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils2.toUserSettingsGeneral = toUserSettingsGeneral;
    function fromUserSettings(key) {
      return userSettingsUSMap.strToKeyCode(key) || userSettingsGeneralMap.strToKeyCode(key);
    }
    KeyCodeUtils2.fromUserSettings = fromUserSettings;
  })(KeyCodeUtils || (KeyCodeUtils = {}));
  function KeyChord(firstPart, secondPart) {
    const chordPart = (secondPart & 65535) << 16 >>> 0;
    return (firstPart | chordPart) >>> 0;
  }

  // node_modules/monaco-editor/esm/vs/editor/common/core/selection.js
  var Selection = class extends Range {
    constructor(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn) {
      super(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn);
      this.selectionStartLineNumber = selectionStartLineNumber;
      this.selectionStartColumn = selectionStartColumn;
      this.positionLineNumber = positionLineNumber;
      this.positionColumn = positionColumn;
    }
    toString() {
      return "[" + this.selectionStartLineNumber + "," + this.selectionStartColumn + " -> " + this.positionLineNumber + "," + this.positionColumn + "]";
    }
    equalsSelection(other) {
      return Selection.selectionsEqual(this, other);
    }
    static selectionsEqual(a, b) {
      return a.selectionStartLineNumber === b.selectionStartLineNumber && a.selectionStartColumn === b.selectionStartColumn && a.positionLineNumber === b.positionLineNumber && a.positionColumn === b.positionColumn;
    }
    getDirection() {
      if (this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn) {
        return 0;
      }
      return 1;
    }
    setEndPosition(endLineNumber, endColumn) {
      if (this.getDirection() === 0) {
        return new Selection(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
      }
      return new Selection(endLineNumber, endColumn, this.startLineNumber, this.startColumn);
    }
    getPosition() {
      return new Position(this.positionLineNumber, this.positionColumn);
    }
    setStartPosition(startLineNumber, startColumn) {
      if (this.getDirection() === 0) {
        return new Selection(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
      }
      return new Selection(this.endLineNumber, this.endColumn, startLineNumber, startColumn);
    }
    static fromPositions(start, end = start) {
      return new Selection(start.lineNumber, start.column, end.lineNumber, end.column);
    }
    static liftSelection(sel) {
      return new Selection(sel.selectionStartLineNumber, sel.selectionStartColumn, sel.positionLineNumber, sel.positionColumn);
    }
    static selectionsArrEqual(a, b) {
      if (a && !b || !a && b) {
        return false;
      }
      if (!a && !b) {
        return true;
      }
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0, len = a.length; i < len; i++) {
        if (!this.selectionsEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    static isISelection(obj) {
      return obj && typeof obj.selectionStartLineNumber === "number" && typeof obj.selectionStartColumn === "number" && typeof obj.positionLineNumber === "number" && typeof obj.positionColumn === "number";
    }
    static createWithDirection(startLineNumber, startColumn, endLineNumber, endColumn, direction) {
      if (direction === 0) {
        return new Selection(startLineNumber, startColumn, endLineNumber, endColumn);
      }
      return new Selection(endLineNumber, endColumn, startLineNumber, startColumn);
    }
  };

  // node_modules/monaco-editor/esm/vs/editor/common/core/token.js
  var Token = class {
    constructor(offset, type, language) {
      this._tokenBrand = void 0;
      this.offset = offset | 0;
      this.type = type;
      this.language = language;
    }
    toString() {
      return "(" + this.offset + ", " + this.type + ")";
    }
  };

  // node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums.js
  var AccessibilitySupport;
  (function(AccessibilitySupport2) {
    AccessibilitySupport2[AccessibilitySupport2["Unknown"] = 0] = "Unknown";
    AccessibilitySupport2[AccessibilitySupport2["Disabled"] = 1] = "Disabled";
    AccessibilitySupport2[AccessibilitySupport2["Enabled"] = 2] = "Enabled";
  })(AccessibilitySupport || (AccessibilitySupport = {}));
  var CompletionItemInsertTextRule;
  (function(CompletionItemInsertTextRule2) {
    CompletionItemInsertTextRule2[CompletionItemInsertTextRule2["KeepWhitespace"] = 1] = "KeepWhitespace";
    CompletionItemInsertTextRule2[CompletionItemInsertTextRule2["InsertAsSnippet"] = 4] = "InsertAsSnippet";
  })(CompletionItemInsertTextRule || (CompletionItemInsertTextRule = {}));
  var CompletionItemKind;
  (function(CompletionItemKind2) {
    CompletionItemKind2[CompletionItemKind2["Method"] = 0] = "Method";
    CompletionItemKind2[CompletionItemKind2["Function"] = 1] = "Function";
    CompletionItemKind2[CompletionItemKind2["Constructor"] = 2] = "Constructor";
    CompletionItemKind2[CompletionItemKind2["Field"] = 3] = "Field";
    CompletionItemKind2[CompletionItemKind2["Variable"] = 4] = "Variable";
    CompletionItemKind2[CompletionItemKind2["Class"] = 5] = "Class";
    CompletionItemKind2[CompletionItemKind2["Struct"] = 6] = "Struct";
    CompletionItemKind2[CompletionItemKind2["Interface"] = 7] = "Interface";
    CompletionItemKind2[CompletionItemKind2["Module"] = 8] = "Module";
    CompletionItemKind2[CompletionItemKind2["Property"] = 9] = "Property";
    CompletionItemKind2[CompletionItemKind2["Event"] = 10] = "Event";
    CompletionItemKind2[CompletionItemKind2["Operator"] = 11] = "Operator";
    CompletionItemKind2[CompletionItemKind2["Unit"] = 12] = "Unit";
    CompletionItemKind2[CompletionItemKind2["Value"] = 13] = "Value";
    CompletionItemKind2[CompletionItemKind2["Constant"] = 14] = "Constant";
    CompletionItemKind2[CompletionItemKind2["Enum"] = 15] = "Enum";
    CompletionItemKind2[CompletionItemKind2["EnumMember"] = 16] = "EnumMember";
    CompletionItemKind2[CompletionItemKind2["Keyword"] = 17] = "Keyword";
    CompletionItemKind2[CompletionItemKind2["Text"] = 18] = "Text";
    CompletionItemKind2[CompletionItemKind2["Color"] = 19] = "Color";
    CompletionItemKind2[CompletionItemKind2["File"] = 20] = "File";
    CompletionItemKind2[CompletionItemKind2["Reference"] = 21] = "Reference";
    CompletionItemKind2[CompletionItemKind2["Customcolor"] = 22] = "Customcolor";
    CompletionItemKind2[CompletionItemKind2["Folder"] = 23] = "Folder";
    CompletionItemKind2[CompletionItemKind2["TypeParameter"] = 24] = "TypeParameter";
    CompletionItemKind2[CompletionItemKind2["User"] = 25] = "User";
    CompletionItemKind2[CompletionItemKind2["Issue"] = 26] = "Issue";
    CompletionItemKind2[CompletionItemKind2["Snippet"] = 27] = "Snippet";
  })(CompletionItemKind || (CompletionItemKind = {}));
  var CompletionItemTag;
  (function(CompletionItemTag2) {
    CompletionItemTag2[CompletionItemTag2["Deprecated"] = 1] = "Deprecated";
  })(CompletionItemTag || (CompletionItemTag = {}));
  var CompletionTriggerKind;
  (function(CompletionTriggerKind2) {
    CompletionTriggerKind2[CompletionTriggerKind2["Invoke"] = 0] = "Invoke";
    CompletionTriggerKind2[CompletionTriggerKind2["TriggerCharacter"] = 1] = "TriggerCharacter";
    CompletionTriggerKind2[CompletionTriggerKind2["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
  })(CompletionTriggerKind || (CompletionTriggerKind = {}));
  var ContentWidgetPositionPreference;
  (function(ContentWidgetPositionPreference2) {
    ContentWidgetPositionPreference2[ContentWidgetPositionPreference2["EXACT"] = 0] = "EXACT";
    ContentWidgetPositionPreference2[ContentWidgetPositionPreference2["ABOVE"] = 1] = "ABOVE";
    ContentWidgetPositionPreference2[ContentWidgetPositionPreference2["BELOW"] = 2] = "BELOW";
  })(ContentWidgetPositionPreference || (ContentWidgetPositionPreference = {}));
  var CursorChangeReason;
  (function(CursorChangeReason2) {
    CursorChangeReason2[CursorChangeReason2["NotSet"] = 0] = "NotSet";
    CursorChangeReason2[CursorChangeReason2["ContentFlush"] = 1] = "ContentFlush";
    CursorChangeReason2[CursorChangeReason2["RecoverFromMarkers"] = 2] = "RecoverFromMarkers";
    CursorChangeReason2[CursorChangeReason2["Explicit"] = 3] = "Explicit";
    CursorChangeReason2[CursorChangeReason2["Paste"] = 4] = "Paste";
    CursorChangeReason2[CursorChangeReason2["Undo"] = 5] = "Undo";
    CursorChangeReason2[CursorChangeReason2["Redo"] = 6] = "Redo";
  })(CursorChangeReason || (CursorChangeReason = {}));
  var DefaultEndOfLine;
  (function(DefaultEndOfLine2) {
    DefaultEndOfLine2[DefaultEndOfLine2["LF"] = 1] = "LF";
    DefaultEndOfLine2[DefaultEndOfLine2["CRLF"] = 2] = "CRLF";
  })(DefaultEndOfLine || (DefaultEndOfLine = {}));
  var DocumentHighlightKind;
  (function(DocumentHighlightKind2) {
    DocumentHighlightKind2[DocumentHighlightKind2["Text"] = 0] = "Text";
    DocumentHighlightKind2[DocumentHighlightKind2["Read"] = 1] = "Read";
    DocumentHighlightKind2[DocumentHighlightKind2["Write"] = 2] = "Write";
  })(DocumentHighlightKind || (DocumentHighlightKind = {}));
  var EditorAutoIndentStrategy;
  (function(EditorAutoIndentStrategy2) {
    EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["None"] = 0] = "None";
    EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["Keep"] = 1] = "Keep";
    EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["Brackets"] = 2] = "Brackets";
    EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["Advanced"] = 3] = "Advanced";
    EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["Full"] = 4] = "Full";
  })(EditorAutoIndentStrategy || (EditorAutoIndentStrategy = {}));
  var EditorOption;
  (function(EditorOption2) {
    EditorOption2[EditorOption2["acceptSuggestionOnCommitCharacter"] = 0] = "acceptSuggestionOnCommitCharacter";
    EditorOption2[EditorOption2["acceptSuggestionOnEnter"] = 1] = "acceptSuggestionOnEnter";
    EditorOption2[EditorOption2["accessibilitySupport"] = 2] = "accessibilitySupport";
    EditorOption2[EditorOption2["accessibilityPageSize"] = 3] = "accessibilityPageSize";
    EditorOption2[EditorOption2["ariaLabel"] = 4] = "ariaLabel";
    EditorOption2[EditorOption2["autoClosingBrackets"] = 5] = "autoClosingBrackets";
    EditorOption2[EditorOption2["autoClosingDelete"] = 6] = "autoClosingDelete";
    EditorOption2[EditorOption2["autoClosingOvertype"] = 7] = "autoClosingOvertype";
    EditorOption2[EditorOption2["autoClosingQuotes"] = 8] = "autoClosingQuotes";
    EditorOption2[EditorOption2["autoIndent"] = 9] = "autoIndent";
    EditorOption2[EditorOption2["automaticLayout"] = 10] = "automaticLayout";
    EditorOption2[EditorOption2["autoSurround"] = 11] = "autoSurround";
    EditorOption2[EditorOption2["codeLens"] = 12] = "codeLens";
    EditorOption2[EditorOption2["codeLensFontFamily"] = 13] = "codeLensFontFamily";
    EditorOption2[EditorOption2["codeLensFontSize"] = 14] = "codeLensFontSize";
    EditorOption2[EditorOption2["colorDecorators"] = 15] = "colorDecorators";
    EditorOption2[EditorOption2["columnSelection"] = 16] = "columnSelection";
    EditorOption2[EditorOption2["comments"] = 17] = "comments";
    EditorOption2[EditorOption2["contextmenu"] = 18] = "contextmenu";
    EditorOption2[EditorOption2["copyWithSyntaxHighlighting"] = 19] = "copyWithSyntaxHighlighting";
    EditorOption2[EditorOption2["cursorBlinking"] = 20] = "cursorBlinking";
    EditorOption2[EditorOption2["cursorSmoothCaretAnimation"] = 21] = "cursorSmoothCaretAnimation";
    EditorOption2[EditorOption2["cursorStyle"] = 22] = "cursorStyle";
    EditorOption2[EditorOption2["cursorSurroundingLines"] = 23] = "cursorSurroundingLines";
    EditorOption2[EditorOption2["cursorSurroundingLinesStyle"] = 24] = "cursorSurroundingLinesStyle";
    EditorOption2[EditorOption2["cursorWidth"] = 25] = "cursorWidth";
    EditorOption2[EditorOption2["disableLayerHinting"] = 26] = "disableLayerHinting";
    EditorOption2[EditorOption2["disableMonospaceOptimizations"] = 27] = "disableMonospaceOptimizations";
    EditorOption2[EditorOption2["domReadOnly"] = 28] = "domReadOnly";
    EditorOption2[EditorOption2["dragAndDrop"] = 29] = "dragAndDrop";
    EditorOption2[EditorOption2["emptySelectionClipboard"] = 30] = "emptySelectionClipboard";
    EditorOption2[EditorOption2["extraEditorClassName"] = 31] = "extraEditorClassName";
    EditorOption2[EditorOption2["fastScrollSensitivity"] = 32] = "fastScrollSensitivity";
    EditorOption2[EditorOption2["find"] = 33] = "find";
    EditorOption2[EditorOption2["fixedOverflowWidgets"] = 34] = "fixedOverflowWidgets";
    EditorOption2[EditorOption2["folding"] = 35] = "folding";
    EditorOption2[EditorOption2["foldingStrategy"] = 36] = "foldingStrategy";
    EditorOption2[EditorOption2["foldingHighlight"] = 37] = "foldingHighlight";
    EditorOption2[EditorOption2["foldingImportsByDefault"] = 38] = "foldingImportsByDefault";
    EditorOption2[EditorOption2["unfoldOnClickAfterEndOfLine"] = 39] = "unfoldOnClickAfterEndOfLine";
    EditorOption2[EditorOption2["fontFamily"] = 40] = "fontFamily";
    EditorOption2[EditorOption2["fontInfo"] = 41] = "fontInfo";
    EditorOption2[EditorOption2["fontLigatures"] = 42] = "fontLigatures";
    EditorOption2[EditorOption2["fontSize"] = 43] = "fontSize";
    EditorOption2[EditorOption2["fontWeight"] = 44] = "fontWeight";
    EditorOption2[EditorOption2["formatOnPaste"] = 45] = "formatOnPaste";
    EditorOption2[EditorOption2["formatOnType"] = 46] = "formatOnType";
    EditorOption2[EditorOption2["glyphMargin"] = 47] = "glyphMargin";
    EditorOption2[EditorOption2["gotoLocation"] = 48] = "gotoLocation";
    EditorOption2[EditorOption2["hideCursorInOverviewRuler"] = 49] = "hideCursorInOverviewRuler";
    EditorOption2[EditorOption2["highlightActiveIndentGuide"] = 50] = "highlightActiveIndentGuide";
    EditorOption2[EditorOption2["hover"] = 51] = "hover";
    EditorOption2[EditorOption2["inDiffEditor"] = 52] = "inDiffEditor";
    EditorOption2[EditorOption2["inlineSuggest"] = 53] = "inlineSuggest";
    EditorOption2[EditorOption2["letterSpacing"] = 54] = "letterSpacing";
    EditorOption2[EditorOption2["lightbulb"] = 55] = "lightbulb";
    EditorOption2[EditorOption2["lineDecorationsWidth"] = 56] = "lineDecorationsWidth";
    EditorOption2[EditorOption2["lineHeight"] = 57] = "lineHeight";
    EditorOption2[EditorOption2["lineNumbers"] = 58] = "lineNumbers";
    EditorOption2[EditorOption2["lineNumbersMinChars"] = 59] = "lineNumbersMinChars";
    EditorOption2[EditorOption2["linkedEditing"] = 60] = "linkedEditing";
    EditorOption2[EditorOption2["links"] = 61] = "links";
    EditorOption2[EditorOption2["matchBrackets"] = 62] = "matchBrackets";
    EditorOption2[EditorOption2["minimap"] = 63] = "minimap";
    EditorOption2[EditorOption2["mouseStyle"] = 64] = "mouseStyle";
    EditorOption2[EditorOption2["mouseWheelScrollSensitivity"] = 65] = "mouseWheelScrollSensitivity";
    EditorOption2[EditorOption2["mouseWheelZoom"] = 66] = "mouseWheelZoom";
    EditorOption2[EditorOption2["multiCursorMergeOverlapping"] = 67] = "multiCursorMergeOverlapping";
    EditorOption2[EditorOption2["multiCursorModifier"] = 68] = "multiCursorModifier";
    EditorOption2[EditorOption2["multiCursorPaste"] = 69] = "multiCursorPaste";
    EditorOption2[EditorOption2["occurrencesHighlight"] = 70] = "occurrencesHighlight";
    EditorOption2[EditorOption2["overviewRulerBorder"] = 71] = "overviewRulerBorder";
    EditorOption2[EditorOption2["overviewRulerLanes"] = 72] = "overviewRulerLanes";
    EditorOption2[EditorOption2["padding"] = 73] = "padding";
    EditorOption2[EditorOption2["parameterHints"] = 74] = "parameterHints";
    EditorOption2[EditorOption2["peekWidgetDefaultFocus"] = 75] = "peekWidgetDefaultFocus";
    EditorOption2[EditorOption2["definitionLinkOpensInPeek"] = 76] = "definitionLinkOpensInPeek";
    EditorOption2[EditorOption2["quickSuggestions"] = 77] = "quickSuggestions";
    EditorOption2[EditorOption2["quickSuggestionsDelay"] = 78] = "quickSuggestionsDelay";
    EditorOption2[EditorOption2["readOnly"] = 79] = "readOnly";
    EditorOption2[EditorOption2["renameOnType"] = 80] = "renameOnType";
    EditorOption2[EditorOption2["renderControlCharacters"] = 81] = "renderControlCharacters";
    EditorOption2[EditorOption2["renderIndentGuides"] = 82] = "renderIndentGuides";
    EditorOption2[EditorOption2["renderFinalNewline"] = 83] = "renderFinalNewline";
    EditorOption2[EditorOption2["renderLineHighlight"] = 84] = "renderLineHighlight";
    EditorOption2[EditorOption2["renderLineHighlightOnlyWhenFocus"] = 85] = "renderLineHighlightOnlyWhenFocus";
    EditorOption2[EditorOption2["renderValidationDecorations"] = 86] = "renderValidationDecorations";
    EditorOption2[EditorOption2["renderWhitespace"] = 87] = "renderWhitespace";
    EditorOption2[EditorOption2["revealHorizontalRightPadding"] = 88] = "revealHorizontalRightPadding";
    EditorOption2[EditorOption2["roundedSelection"] = 89] = "roundedSelection";
    EditorOption2[EditorOption2["rulers"] = 90] = "rulers";
    EditorOption2[EditorOption2["scrollbar"] = 91] = "scrollbar";
    EditorOption2[EditorOption2["scrollBeyondLastColumn"] = 92] = "scrollBeyondLastColumn";
    EditorOption2[EditorOption2["scrollBeyondLastLine"] = 93] = "scrollBeyondLastLine";
    EditorOption2[EditorOption2["scrollPredominantAxis"] = 94] = "scrollPredominantAxis";
    EditorOption2[EditorOption2["selectionClipboard"] = 95] = "selectionClipboard";
    EditorOption2[EditorOption2["selectionHighlight"] = 96] = "selectionHighlight";
    EditorOption2[EditorOption2["selectOnLineNumbers"] = 97] = "selectOnLineNumbers";
    EditorOption2[EditorOption2["showFoldingControls"] = 98] = "showFoldingControls";
    EditorOption2[EditorOption2["showUnused"] = 99] = "showUnused";
    EditorOption2[EditorOption2["snippetSuggestions"] = 100] = "snippetSuggestions";
    EditorOption2[EditorOption2["smartSelect"] = 101] = "smartSelect";
    EditorOption2[EditorOption2["smoothScrolling"] = 102] = "smoothScrolling";
    EditorOption2[EditorOption2["stickyTabStops"] = 103] = "stickyTabStops";
    EditorOption2[EditorOption2["stopRenderingLineAfter"] = 104] = "stopRenderingLineAfter";
    EditorOption2[EditorOption2["suggest"] = 105] = "suggest";
    EditorOption2[EditorOption2["suggestFontSize"] = 106] = "suggestFontSize";
    EditorOption2[EditorOption2["suggestLineHeight"] = 107] = "suggestLineHeight";
    EditorOption2[EditorOption2["suggestOnTriggerCharacters"] = 108] = "suggestOnTriggerCharacters";
    EditorOption2[EditorOption2["suggestSelection"] = 109] = "suggestSelection";
    EditorOption2[EditorOption2["tabCompletion"] = 110] = "tabCompletion";
    EditorOption2[EditorOption2["tabIndex"] = 111] = "tabIndex";
    EditorOption2[EditorOption2["unusualLineTerminators"] = 112] = "unusualLineTerminators";
    EditorOption2[EditorOption2["useShadowDOM"] = 113] = "useShadowDOM";
    EditorOption2[EditorOption2["useTabStops"] = 114] = "useTabStops";
    EditorOption2[EditorOption2["wordSeparators"] = 115] = "wordSeparators";
    EditorOption2[EditorOption2["wordWrap"] = 116] = "wordWrap";
    EditorOption2[EditorOption2["wordWrapBreakAfterCharacters"] = 117] = "wordWrapBreakAfterCharacters";
    EditorOption2[EditorOption2["wordWrapBreakBeforeCharacters"] = 118] = "wordWrapBreakBeforeCharacters";
    EditorOption2[EditorOption2["wordWrapColumn"] = 119] = "wordWrapColumn";
    EditorOption2[EditorOption2["wordWrapOverride1"] = 120] = "wordWrapOverride1";
    EditorOption2[EditorOption2["wordWrapOverride2"] = 121] = "wordWrapOverride2";
    EditorOption2[EditorOption2["wrappingIndent"] = 122] = "wrappingIndent";
    EditorOption2[EditorOption2["wrappingStrategy"] = 123] = "wrappingStrategy";
    EditorOption2[EditorOption2["showDeprecated"] = 124] = "showDeprecated";
    EditorOption2[EditorOption2["inlayHints"] = 125] = "inlayHints";
    EditorOption2[EditorOption2["editorClassName"] = 126] = "editorClassName";
    EditorOption2[EditorOption2["pixelRatio"] = 127] = "pixelRatio";
    EditorOption2[EditorOption2["tabFocusMode"] = 128] = "tabFocusMode";
    EditorOption2[EditorOption2["layoutInfo"] = 129] = "layoutInfo";
    EditorOption2[EditorOption2["wrappingInfo"] = 130] = "wrappingInfo";
  })(EditorOption || (EditorOption = {}));
  var EndOfLinePreference;
  (function(EndOfLinePreference2) {
    EndOfLinePreference2[EndOfLinePreference2["TextDefined"] = 0] = "TextDefined";
    EndOfLinePreference2[EndOfLinePreference2["LF"] = 1] = "LF";
    EndOfLinePreference2[EndOfLinePreference2["CRLF"] = 2] = "CRLF";
  })(EndOfLinePreference || (EndOfLinePreference = {}));
  var EndOfLineSequence;
  (function(EndOfLineSequence2) {
    EndOfLineSequence2[EndOfLineSequence2["LF"] = 0] = "LF";
    EndOfLineSequence2[EndOfLineSequence2["CRLF"] = 1] = "CRLF";
  })(EndOfLineSequence || (EndOfLineSequence = {}));
  var IndentAction;
  (function(IndentAction2) {
    IndentAction2[IndentAction2["None"] = 0] = "None";
    IndentAction2[IndentAction2["Indent"] = 1] = "Indent";
    IndentAction2[IndentAction2["IndentOutdent"] = 2] = "IndentOutdent";
    IndentAction2[IndentAction2["Outdent"] = 3] = "Outdent";
  })(IndentAction || (IndentAction = {}));
  var InlayHintKind;
  (function(InlayHintKind2) {
    InlayHintKind2[InlayHintKind2["Other"] = 0] = "Other";
    InlayHintKind2[InlayHintKind2["Type"] = 1] = "Type";
    InlayHintKind2[InlayHintKind2["Parameter"] = 2] = "Parameter";
  })(InlayHintKind || (InlayHintKind = {}));
  var InlineCompletionTriggerKind;
  (function(InlineCompletionTriggerKind2) {
    InlineCompletionTriggerKind2[InlineCompletionTriggerKind2["Automatic"] = 0] = "Automatic";
    InlineCompletionTriggerKind2[InlineCompletionTriggerKind2["Explicit"] = 1] = "Explicit";
  })(InlineCompletionTriggerKind || (InlineCompletionTriggerKind = {}));
  var KeyCode;
  (function(KeyCode2) {
    KeyCode2[KeyCode2["DependsOnKbLayout"] = -1] = "DependsOnKbLayout";
    KeyCode2[KeyCode2["Unknown"] = 0] = "Unknown";
    KeyCode2[KeyCode2["Backspace"] = 1] = "Backspace";
    KeyCode2[KeyCode2["Tab"] = 2] = "Tab";
    KeyCode2[KeyCode2["Enter"] = 3] = "Enter";
    KeyCode2[KeyCode2["Shift"] = 4] = "Shift";
    KeyCode2[KeyCode2["Ctrl"] = 5] = "Ctrl";
    KeyCode2[KeyCode2["Alt"] = 6] = "Alt";
    KeyCode2[KeyCode2["PauseBreak"] = 7] = "PauseBreak";
    KeyCode2[KeyCode2["CapsLock"] = 8] = "CapsLock";
    KeyCode2[KeyCode2["Escape"] = 9] = "Escape";
    KeyCode2[KeyCode2["Space"] = 10] = "Space";
    KeyCode2[KeyCode2["PageUp"] = 11] = "PageUp";
    KeyCode2[KeyCode2["PageDown"] = 12] = "PageDown";
    KeyCode2[KeyCode2["End"] = 13] = "End";
    KeyCode2[KeyCode2["Home"] = 14] = "Home";
    KeyCode2[KeyCode2["LeftArrow"] = 15] = "LeftArrow";
    KeyCode2[KeyCode2["UpArrow"] = 16] = "UpArrow";
    KeyCode2[KeyCode2["RightArrow"] = 17] = "RightArrow";
    KeyCode2[KeyCode2["DownArrow"] = 18] = "DownArrow";
    KeyCode2[KeyCode2["Insert"] = 19] = "Insert";
    KeyCode2[KeyCode2["Delete"] = 20] = "Delete";
    KeyCode2[KeyCode2["KEY_0"] = 21] = "KEY_0";
    KeyCode2[KeyCode2["KEY_1"] = 22] = "KEY_1";
    KeyCode2[KeyCode2["KEY_2"] = 23] = "KEY_2";
    KeyCode2[KeyCode2["KEY_3"] = 24] = "KEY_3";
    KeyCode2[KeyCode2["KEY_4"] = 25] = "KEY_4";
    KeyCode2[KeyCode2["KEY_5"] = 26] = "KEY_5";
    KeyCode2[KeyCode2["KEY_6"] = 27] = "KEY_6";
    KeyCode2[KeyCode2["KEY_7"] = 28] = "KEY_7";
    KeyCode2[KeyCode2["KEY_8"] = 29] = "KEY_8";
    KeyCode2[KeyCode2["KEY_9"] = 30] = "KEY_9";
    KeyCode2[KeyCode2["KEY_A"] = 31] = "KEY_A";
    KeyCode2[KeyCode2["KEY_B"] = 32] = "KEY_B";
    KeyCode2[KeyCode2["KEY_C"] = 33] = "KEY_C";
    KeyCode2[KeyCode2["KEY_D"] = 34] = "KEY_D";
    KeyCode2[KeyCode2["KEY_E"] = 35] = "KEY_E";
    KeyCode2[KeyCode2["KEY_F"] = 36] = "KEY_F";
    KeyCode2[KeyCode2["KEY_G"] = 37] = "KEY_G";
    KeyCode2[KeyCode2["KEY_H"] = 38] = "KEY_H";
    KeyCode2[KeyCode2["KEY_I"] = 39] = "KEY_I";
    KeyCode2[KeyCode2["KEY_J"] = 40] = "KEY_J";
    KeyCode2[KeyCode2["KEY_K"] = 41] = "KEY_K";
    KeyCode2[KeyCode2["KEY_L"] = 42] = "KEY_L";
    KeyCode2[KeyCode2["KEY_M"] = 43] = "KEY_M";
    KeyCode2[KeyCode2["KEY_N"] = 44] = "KEY_N";
    KeyCode2[KeyCode2["KEY_O"] = 45] = "KEY_O";
    KeyCode2[KeyCode2["KEY_P"] = 46] = "KEY_P";
    KeyCode2[KeyCode2["KEY_Q"] = 47] = "KEY_Q";
    KeyCode2[KeyCode2["KEY_R"] = 48] = "KEY_R";
    KeyCode2[KeyCode2["KEY_S"] = 49] = "KEY_S";
    KeyCode2[KeyCode2["KEY_T"] = 50] = "KEY_T";
    KeyCode2[KeyCode2["KEY_U"] = 51] = "KEY_U";
    KeyCode2[KeyCode2["KEY_V"] = 52] = "KEY_V";
    KeyCode2[KeyCode2["KEY_W"] = 53] = "KEY_W";
    KeyCode2[KeyCode2["KEY_X"] = 54] = "KEY_X";
    KeyCode2[KeyCode2["KEY_Y"] = 55] = "KEY_Y";
    KeyCode2[KeyCode2["KEY_Z"] = 56] = "KEY_Z";
    KeyCode2[KeyCode2["Meta"] = 57] = "Meta";
    KeyCode2[KeyCode2["ContextMenu"] = 58] = "ContextMenu";
    KeyCode2[KeyCode2["F1"] = 59] = "F1";
    KeyCode2[KeyCode2["F2"] = 60] = "F2";
    KeyCode2[KeyCode2["F3"] = 61] = "F3";
    KeyCode2[KeyCode2["F4"] = 62] = "F4";
    KeyCode2[KeyCode2["F5"] = 63] = "F5";
    KeyCode2[KeyCode2["F6"] = 64] = "F6";
    KeyCode2[KeyCode2["F7"] = 65] = "F7";
    KeyCode2[KeyCode2["F8"] = 66] = "F8";
    KeyCode2[KeyCode2["F9"] = 67] = "F9";
    KeyCode2[KeyCode2["F10"] = 68] = "F10";
    KeyCode2[KeyCode2["F11"] = 69] = "F11";
    KeyCode2[KeyCode2["F12"] = 70] = "F12";
    KeyCode2[KeyCode2["F13"] = 71] = "F13";
    KeyCode2[KeyCode2["F14"] = 72] = "F14";
    KeyCode2[KeyCode2["F15"] = 73] = "F15";
    KeyCode2[KeyCode2["F16"] = 74] = "F16";
    KeyCode2[KeyCode2["F17"] = 75] = "F17";
    KeyCode2[KeyCode2["F18"] = 76] = "F18";
    KeyCode2[KeyCode2["F19"] = 77] = "F19";
    KeyCode2[KeyCode2["NumLock"] = 78] = "NumLock";
    KeyCode2[KeyCode2["ScrollLock"] = 79] = "ScrollLock";
    KeyCode2[KeyCode2["US_SEMICOLON"] = 80] = "US_SEMICOLON";
    KeyCode2[KeyCode2["US_EQUAL"] = 81] = "US_EQUAL";
    KeyCode2[KeyCode2["US_COMMA"] = 82] = "US_COMMA";
    KeyCode2[KeyCode2["US_MINUS"] = 83] = "US_MINUS";
    KeyCode2[KeyCode2["US_DOT"] = 84] = "US_DOT";
    KeyCode2[KeyCode2["US_SLASH"] = 85] = "US_SLASH";
    KeyCode2[KeyCode2["US_BACKTICK"] = 86] = "US_BACKTICK";
    KeyCode2[KeyCode2["US_OPEN_SQUARE_BRACKET"] = 87] = "US_OPEN_SQUARE_BRACKET";
    KeyCode2[KeyCode2["US_BACKSLASH"] = 88] = "US_BACKSLASH";
    KeyCode2[KeyCode2["US_CLOSE_SQUARE_BRACKET"] = 89] = "US_CLOSE_SQUARE_BRACKET";
    KeyCode2[KeyCode2["US_QUOTE"] = 90] = "US_QUOTE";
    KeyCode2[KeyCode2["OEM_8"] = 91] = "OEM_8";
    KeyCode2[KeyCode2["OEM_102"] = 92] = "OEM_102";
    KeyCode2[KeyCode2["NUMPAD_0"] = 93] = "NUMPAD_0";
    KeyCode2[KeyCode2["NUMPAD_1"] = 94] = "NUMPAD_1";
    KeyCode2[KeyCode2["NUMPAD_2"] = 95] = "NUMPAD_2";
    KeyCode2[KeyCode2["NUMPAD_3"] = 96] = "NUMPAD_3";
    KeyCode2[KeyCode2["NUMPAD_4"] = 97] = "NUMPAD_4";
    KeyCode2[KeyCode2["NUMPAD_5"] = 98] = "NUMPAD_5";
    KeyCode2[KeyCode2["NUMPAD_6"] = 99] = "NUMPAD_6";
    KeyCode2[KeyCode2["NUMPAD_7"] = 100] = "NUMPAD_7";
    KeyCode2[KeyCode2["NUMPAD_8"] = 101] = "NUMPAD_8";
    KeyCode2[KeyCode2["NUMPAD_9"] = 102] = "NUMPAD_9";
    KeyCode2[KeyCode2["NUMPAD_MULTIPLY"] = 103] = "NUMPAD_MULTIPLY";
    KeyCode2[KeyCode2["NUMPAD_ADD"] = 104] = "NUMPAD_ADD";
    KeyCode2[KeyCode2["NUMPAD_SEPARATOR"] = 105] = "NUMPAD_SEPARATOR";
    KeyCode2[KeyCode2["NUMPAD_SUBTRACT"] = 106] = "NUMPAD_SUBTRACT";
    KeyCode2[KeyCode2["NUMPAD_DECIMAL"] = 107] = "NUMPAD_DECIMAL";
    KeyCode2[KeyCode2["NUMPAD_DIVIDE"] = 108] = "NUMPAD_DIVIDE";
    KeyCode2[KeyCode2["KEY_IN_COMPOSITION"] = 109] = "KEY_IN_COMPOSITION";
    KeyCode2[KeyCode2["ABNT_C1"] = 110] = "ABNT_C1";
    KeyCode2[KeyCode2["ABNT_C2"] = 111] = "ABNT_C2";
    KeyCode2[KeyCode2["MAX_VALUE"] = 112] = "MAX_VALUE";
  })(KeyCode || (KeyCode = {}));
  var MarkerSeverity;
  (function(MarkerSeverity2) {
    MarkerSeverity2[MarkerSeverity2["Hint"] = 1] = "Hint";
    MarkerSeverity2[MarkerSeverity2["Info"] = 2] = "Info";
    MarkerSeverity2[MarkerSeverity2["Warning"] = 4] = "Warning";
    MarkerSeverity2[MarkerSeverity2["Error"] = 8] = "Error";
  })(MarkerSeverity || (MarkerSeverity = {}));
  var MarkerTag;
  (function(MarkerTag2) {
    MarkerTag2[MarkerTag2["Unnecessary"] = 1] = "Unnecessary";
    MarkerTag2[MarkerTag2["Deprecated"] = 2] = "Deprecated";
  })(MarkerTag || (MarkerTag = {}));
  var MinimapPosition;
  (function(MinimapPosition2) {
    MinimapPosition2[MinimapPosition2["Inline"] = 1] = "Inline";
    MinimapPosition2[MinimapPosition2["Gutter"] = 2] = "Gutter";
  })(MinimapPosition || (MinimapPosition = {}));
  var MouseTargetType;
  (function(MouseTargetType2) {
    MouseTargetType2[MouseTargetType2["UNKNOWN"] = 0] = "UNKNOWN";
    MouseTargetType2[MouseTargetType2["TEXTAREA"] = 1] = "TEXTAREA";
    MouseTargetType2[MouseTargetType2["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
    MouseTargetType2[MouseTargetType2["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
    MouseTargetType2[MouseTargetType2["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
    MouseTargetType2[MouseTargetType2["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
    MouseTargetType2[MouseTargetType2["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
    MouseTargetType2[MouseTargetType2["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
    MouseTargetType2[MouseTargetType2["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
    MouseTargetType2[MouseTargetType2["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
    MouseTargetType2[MouseTargetType2["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
    MouseTargetType2[MouseTargetType2["SCROLLBAR"] = 11] = "SCROLLBAR";
    MouseTargetType2[MouseTargetType2["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
    MouseTargetType2[MouseTargetType2["OUTSIDE_EDITOR"] = 13] = "OUTSIDE_EDITOR";
  })(MouseTargetType || (MouseTargetType = {}));
  var OverlayWidgetPositionPreference;
  (function(OverlayWidgetPositionPreference2) {
    OverlayWidgetPositionPreference2[OverlayWidgetPositionPreference2["TOP_RIGHT_CORNER"] = 0] = "TOP_RIGHT_CORNER";
    OverlayWidgetPositionPreference2[OverlayWidgetPositionPreference2["BOTTOM_RIGHT_CORNER"] = 1] = "BOTTOM_RIGHT_CORNER";
    OverlayWidgetPositionPreference2[OverlayWidgetPositionPreference2["TOP_CENTER"] = 2] = "TOP_CENTER";
  })(OverlayWidgetPositionPreference || (OverlayWidgetPositionPreference = {}));
  var OverviewRulerLane;
  (function(OverviewRulerLane2) {
    OverviewRulerLane2[OverviewRulerLane2["Left"] = 1] = "Left";
    OverviewRulerLane2[OverviewRulerLane2["Center"] = 2] = "Center";
    OverviewRulerLane2[OverviewRulerLane2["Right"] = 4] = "Right";
    OverviewRulerLane2[OverviewRulerLane2["Full"] = 7] = "Full";
  })(OverviewRulerLane || (OverviewRulerLane = {}));
  var RenderLineNumbersType;
  (function(RenderLineNumbersType2) {
    RenderLineNumbersType2[RenderLineNumbersType2["Off"] = 0] = "Off";
    RenderLineNumbersType2[RenderLineNumbersType2["On"] = 1] = "On";
    RenderLineNumbersType2[RenderLineNumbersType2["Relative"] = 2] = "Relative";
    RenderLineNumbersType2[RenderLineNumbersType2["Interval"] = 3] = "Interval";
    RenderLineNumbersType2[RenderLineNumbersType2["Custom"] = 4] = "Custom";
  })(RenderLineNumbersType || (RenderLineNumbersType = {}));
  var RenderMinimap;
  (function(RenderMinimap2) {
    RenderMinimap2[RenderMinimap2["None"] = 0] = "None";
    RenderMinimap2[RenderMinimap2["Text"] = 1] = "Text";
    RenderMinimap2[RenderMinimap2["Blocks"] = 2] = "Blocks";
  })(RenderMinimap || (RenderMinimap = {}));
  var ScrollType;
  (function(ScrollType2) {
    ScrollType2[ScrollType2["Smooth"] = 0] = "Smooth";
    ScrollType2[ScrollType2["Immediate"] = 1] = "Immediate";
  })(ScrollType || (ScrollType = {}));
  var ScrollbarVisibility;
  (function(ScrollbarVisibility2) {
    ScrollbarVisibility2[ScrollbarVisibility2["Auto"] = 1] = "Auto";
    ScrollbarVisibility2[ScrollbarVisibility2["Hidden"] = 2] = "Hidden";
    ScrollbarVisibility2[ScrollbarVisibility2["Visible"] = 3] = "Visible";
  })(ScrollbarVisibility || (ScrollbarVisibility = {}));
  var SelectionDirection;
  (function(SelectionDirection2) {
    SelectionDirection2[SelectionDirection2["LTR"] = 0] = "LTR";
    SelectionDirection2[SelectionDirection2["RTL"] = 1] = "RTL";
  })(SelectionDirection || (SelectionDirection = {}));
  var SignatureHelpTriggerKind;
  (function(SignatureHelpTriggerKind2) {
    SignatureHelpTriggerKind2[SignatureHelpTriggerKind2["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerKind2[SignatureHelpTriggerKind2["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerKind2[SignatureHelpTriggerKind2["ContentChange"] = 3] = "ContentChange";
  })(SignatureHelpTriggerKind || (SignatureHelpTriggerKind = {}));
  var SymbolKind;
  (function(SymbolKind2) {
    SymbolKind2[SymbolKind2["File"] = 0] = "File";
    SymbolKind2[SymbolKind2["Module"] = 1] = "Module";
    SymbolKind2[SymbolKind2["Namespace"] = 2] = "Namespace";
    SymbolKind2[SymbolKind2["Package"] = 3] = "Package";
    SymbolKind2[SymbolKind2["Class"] = 4] = "Class";
    SymbolKind2[SymbolKind2["Method"] = 5] = "Method";
    SymbolKind2[SymbolKind2["Property"] = 6] = "Property";
    SymbolKind2[SymbolKind2["Field"] = 7] = "Field";
    SymbolKind2[SymbolKind2["Constructor"] = 8] = "Constructor";
    SymbolKind2[SymbolKind2["Enum"] = 9] = "Enum";
    SymbolKind2[SymbolKind2["Interface"] = 10] = "Interface";
    SymbolKind2[SymbolKind2["Function"] = 11] = "Function";
    SymbolKind2[SymbolKind2["Variable"] = 12] = "Variable";
    SymbolKind2[SymbolKind2["Constant"] = 13] = "Constant";
    SymbolKind2[SymbolKind2["String"] = 14] = "String";
    SymbolKind2[SymbolKind2["Number"] = 15] = "Number";
    SymbolKind2[SymbolKind2["Boolean"] = 16] = "Boolean";
    SymbolKind2[SymbolKind2["Array"] = 17] = "Array";
    SymbolKind2[SymbolKind2["Object"] = 18] = "Object";
    SymbolKind2[SymbolKind2["Key"] = 19] = "Key";
    SymbolKind2[SymbolKind2["Null"] = 20] = "Null";
    SymbolKind2[SymbolKind2["EnumMember"] = 21] = "EnumMember";
    SymbolKind2[SymbolKind2["Struct"] = 22] = "Struct";
    SymbolKind2[SymbolKind2["Event"] = 23] = "Event";
    SymbolKind2[SymbolKind2["Operator"] = 24] = "Operator";
    SymbolKind2[SymbolKind2["TypeParameter"] = 25] = "TypeParameter";
  })(SymbolKind || (SymbolKind = {}));
  var SymbolTag;
  (function(SymbolTag2) {
    SymbolTag2[SymbolTag2["Deprecated"] = 1] = "Deprecated";
  })(SymbolTag || (SymbolTag = {}));
  var TextEditorCursorBlinkingStyle;
  (function(TextEditorCursorBlinkingStyle2) {
    TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Hidden"] = 0] = "Hidden";
    TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Blink"] = 1] = "Blink";
    TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Smooth"] = 2] = "Smooth";
    TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Phase"] = 3] = "Phase";
    TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Expand"] = 4] = "Expand";
    TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Solid"] = 5] = "Solid";
  })(TextEditorCursorBlinkingStyle || (TextEditorCursorBlinkingStyle = {}));
  var TextEditorCursorStyle;
  (function(TextEditorCursorStyle2) {
    TextEditorCursorStyle2[TextEditorCursorStyle2["Line"] = 1] = "Line";
    TextEditorCursorStyle2[TextEditorCursorStyle2["Block"] = 2] = "Block";
    TextEditorCursorStyle2[TextEditorCursorStyle2["Underline"] = 3] = "Underline";
    TextEditorCursorStyle2[TextEditorCursorStyle2["LineThin"] = 4] = "LineThin";
    TextEditorCursorStyle2[TextEditorCursorStyle2["BlockOutline"] = 5] = "BlockOutline";
    TextEditorCursorStyle2[TextEditorCursorStyle2["UnderlineThin"] = 6] = "UnderlineThin";
  })(TextEditorCursorStyle || (TextEditorCursorStyle = {}));
  var TrackedRangeStickiness;
  (function(TrackedRangeStickiness2) {
    TrackedRangeStickiness2[TrackedRangeStickiness2["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
    TrackedRangeStickiness2[TrackedRangeStickiness2["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
    TrackedRangeStickiness2[TrackedRangeStickiness2["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
    TrackedRangeStickiness2[TrackedRangeStickiness2["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
  })(TrackedRangeStickiness || (TrackedRangeStickiness = {}));
  var WrappingIndent;
  (function(WrappingIndent2) {
    WrappingIndent2[WrappingIndent2["None"] = 0] = "None";
    WrappingIndent2[WrappingIndent2["Same"] = 1] = "Same";
    WrappingIndent2[WrappingIndent2["Indent"] = 2] = "Indent";
    WrappingIndent2[WrappingIndent2["DeepIndent"] = 3] = "DeepIndent";
  })(WrappingIndent || (WrappingIndent = {}));

  // node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneBase.js
  var KeyMod = class {
    static chord(firstPart, secondPart) {
      return KeyChord(firstPart, secondPart);
    }
  };
  KeyMod.CtrlCmd = 2048;
  KeyMod.Shift = 1024;
  KeyMod.Alt = 512;
  KeyMod.WinCtrl = 256;
  function createMonacoBaseAPI() {
    return {
      editor: void 0,
      languages: void 0,
      CancellationTokenSource,
      Emitter,
      KeyCode,
      KeyMod,
      Position,
      Range,
      Selection,
      SelectionDirection,
      MarkerSeverity,
      MarkerTag,
      Uri: URI,
      Token
    };
  }

  // node_modules/monaco-editor/esm/vs/editor/common/services/editorSimpleWorker.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var MirrorModel = class extends MirrorTextModel {
    get uri() {
      return this._uri;
    }
    get eol() {
      return this._eol;
    }
    getValue() {
      return this.getText();
    }
    getLinesContent() {
      return this._lines.slice(0);
    }
    getLineCount() {
      return this._lines.length;
    }
    getLineContent(lineNumber) {
      return this._lines[lineNumber - 1];
    }
    getWordAtPosition(position, wordDefinition) {
      let wordAtText = getWordAtText(position.column, ensureValidWordDefinition(wordDefinition), this._lines[position.lineNumber - 1], 0);
      if (wordAtText) {
        return new Range(position.lineNumber, wordAtText.startColumn, position.lineNumber, wordAtText.endColumn);
      }
      return null;
    }
    words(wordDefinition) {
      const lines = this._lines;
      const wordenize = this._wordenize.bind(this);
      let lineNumber = 0;
      let lineText = "";
      let wordRangesIdx = 0;
      let wordRanges = [];
      return {
        *[Symbol.iterator]() {
          while (true) {
            if (wordRangesIdx < wordRanges.length) {
              const value = lineText.substring(wordRanges[wordRangesIdx].start, wordRanges[wordRangesIdx].end);
              wordRangesIdx += 1;
              yield value;
            } else {
              if (lineNumber < lines.length) {
                lineText = lines[lineNumber];
                wordRanges = wordenize(lineText, wordDefinition);
                wordRangesIdx = 0;
                lineNumber += 1;
              } else {
                break;
              }
            }
          }
        }
      };
    }
    getLineWords(lineNumber, wordDefinition) {
      let content = this._lines[lineNumber - 1];
      let ranges = this._wordenize(content, wordDefinition);
      let words = [];
      for (const range of ranges) {
        words.push({
          word: content.substring(range.start, range.end),
          startColumn: range.start + 1,
          endColumn: range.end + 1
        });
      }
      return words;
    }
    _wordenize(content, wordDefinition) {
      const result = [];
      let match;
      wordDefinition.lastIndex = 0;
      while (match = wordDefinition.exec(content)) {
        if (match[0].length === 0) {
          break;
        }
        result.push({ start: match.index, end: match.index + match[0].length });
      }
      return result;
    }
    getValueInRange(range) {
      range = this._validateRange(range);
      if (range.startLineNumber === range.endLineNumber) {
        return this._lines[range.startLineNumber - 1].substring(range.startColumn - 1, range.endColumn - 1);
      }
      let lineEnding = this._eol;
      let startLineIndex = range.startLineNumber - 1;
      let endLineIndex = range.endLineNumber - 1;
      let resultLines = [];
      resultLines.push(this._lines[startLineIndex].substring(range.startColumn - 1));
      for (let i = startLineIndex + 1; i < endLineIndex; i++) {
        resultLines.push(this._lines[i]);
      }
      resultLines.push(this._lines[endLineIndex].substring(0, range.endColumn - 1));
      return resultLines.join(lineEnding);
    }
    offsetAt(position) {
      position = this._validatePosition(position);
      this._ensureLineStarts();
      return this._lineStarts.getPrefixSum(position.lineNumber - 2) + (position.column - 1);
    }
    positionAt(offset) {
      offset = Math.floor(offset);
      offset = Math.max(0, offset);
      this._ensureLineStarts();
      let out = this._lineStarts.getIndexOf(offset);
      let lineLength = this._lines[out.index].length;
      return {
        lineNumber: 1 + out.index,
        column: 1 + Math.min(out.remainder, lineLength)
      };
    }
    _validateRange(range) {
      const start = this._validatePosition({ lineNumber: range.startLineNumber, column: range.startColumn });
      const end = this._validatePosition({ lineNumber: range.endLineNumber, column: range.endColumn });
      if (start.lineNumber !== range.startLineNumber || start.column !== range.startColumn || end.lineNumber !== range.endLineNumber || end.column !== range.endColumn) {
        return {
          startLineNumber: start.lineNumber,
          startColumn: start.column,
          endLineNumber: end.lineNumber,
          endColumn: end.column
        };
      }
      return range;
    }
    _validatePosition(position) {
      if (!Position.isIPosition(position)) {
        throw new Error("bad position");
      }
      let { lineNumber, column } = position;
      let hasChanged = false;
      if (lineNumber < 1) {
        lineNumber = 1;
        column = 1;
        hasChanged = true;
      } else if (lineNumber > this._lines.length) {
        lineNumber = this._lines.length;
        column = this._lines[lineNumber - 1].length + 1;
        hasChanged = true;
      } else {
        let maxCharacter = this._lines[lineNumber - 1].length + 1;
        if (column < 1) {
          column = 1;
          hasChanged = true;
        } else if (column > maxCharacter) {
          column = maxCharacter;
          hasChanged = true;
        }
      }
      if (!hasChanged) {
        return position;
      } else {
        return { lineNumber, column };
      }
    }
  };
  var EditorSimpleWorker = class {
    constructor(host, foreignModuleFactory) {
      this._host = host;
      this._models = Object.create(null);
      this._foreignModuleFactory = foreignModuleFactory;
      this._foreignModule = null;
    }
    dispose() {
      this._models = Object.create(null);
    }
    _getModel(uri) {
      return this._models[uri];
    }
    _getModels() {
      let all = [];
      Object.keys(this._models).forEach((key) => all.push(this._models[key]));
      return all;
    }
    acceptNewModel(data) {
      this._models[data.url] = new MirrorModel(URI.parse(data.url), data.lines, data.EOL, data.versionId);
    }
    acceptModelChanged(strURL, e) {
      if (!this._models[strURL]) {
        return;
      }
      let model = this._models[strURL];
      model.onEvents(e);
    }
    acceptRemovedModel(strURL) {
      if (!this._models[strURL]) {
        return;
      }
      delete this._models[strURL];
    }
    computeDiff(originalUrl, modifiedUrl, ignoreTrimWhitespace, maxComputationTime) {
      return __awaiter(this, void 0, void 0, function* () {
        const original = this._getModel(originalUrl);
        const modified = this._getModel(modifiedUrl);
        if (!original || !modified) {
          return null;
        }
        const originalLines = original.getLinesContent();
        const modifiedLines = modified.getLinesContent();
        const diffComputer = new DiffComputer(originalLines, modifiedLines, {
          shouldComputeCharChanges: true,
          shouldPostProcessCharChanges: true,
          shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
          shouldMakePrettyDiff: true,
          maxComputationTime
        });
        const diffResult = diffComputer.computeDiff();
        const identical = diffResult.changes.length > 0 ? false : this._modelsAreIdentical(original, modified);
        return {
          quitEarly: diffResult.quitEarly,
          identical,
          changes: diffResult.changes
        };
      });
    }
    _modelsAreIdentical(original, modified) {
      const originalLineCount = original.getLineCount();
      const modifiedLineCount = modified.getLineCount();
      if (originalLineCount !== modifiedLineCount) {
        return false;
      }
      for (let line = 1; line <= originalLineCount; line++) {
        const originalLine = original.getLineContent(line);
        const modifiedLine = modified.getLineContent(line);
        if (originalLine !== modifiedLine) {
          return false;
        }
      }
      return true;
    }
    computeMoreMinimalEdits(modelUrl, edits) {
      return __awaiter(this, void 0, void 0, function* () {
        const model = this._getModel(modelUrl);
        if (!model) {
          return edits;
        }
        const result = [];
        let lastEol = void 0;
        edits = edits.slice(0).sort((a, b) => {
          if (a.range && b.range) {
            return Range.compareRangesUsingStarts(a.range, b.range);
          }
          let aRng = a.range ? 0 : 1;
          let bRng = b.range ? 0 : 1;
          return aRng - bRng;
        });
        for (let { range, text, eol } of edits) {
          if (typeof eol === "number") {
            lastEol = eol;
          }
          if (Range.isEmpty(range) && !text) {
            continue;
          }
          const original = model.getValueInRange(range);
          text = text.replace(/\r\n|\n|\r/g, model.eol);
          if (original === text) {
            continue;
          }
          if (Math.max(text.length, original.length) > EditorSimpleWorker._diffLimit) {
            result.push({ range, text });
            continue;
          }
          const changes = stringDiff(original, text, false);
          const editOffset = model.offsetAt(Range.lift(range).getStartPosition());
          for (const change of changes) {
            const start = model.positionAt(editOffset + change.originalStart);
            const end = model.positionAt(editOffset + change.originalStart + change.originalLength);
            const newEdit = {
              text: text.substr(change.modifiedStart, change.modifiedLength),
              range: { startLineNumber: start.lineNumber, startColumn: start.column, endLineNumber: end.lineNumber, endColumn: end.column }
            };
            if (model.getValueInRange(newEdit.range) !== newEdit.text) {
              result.push(newEdit);
            }
          }
        }
        if (typeof lastEol === "number") {
          result.push({ eol: lastEol, text: "", range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } });
        }
        return result;
      });
    }
    computeLinks(modelUrl) {
      return __awaiter(this, void 0, void 0, function* () {
        let model = this._getModel(modelUrl);
        if (!model) {
          return null;
        }
        return computeLinks(model);
      });
    }
    textualSuggest(modelUrls, leadingWord, wordDef, wordDefFlags) {
      return __awaiter(this, void 0, void 0, function* () {
        const sw = new StopWatch(true);
        const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
        const seen = new Set();
        outer:
          for (let url of modelUrls) {
            const model = this._getModel(url);
            if (!model) {
              continue;
            }
            for (let word of model.words(wordDefRegExp)) {
              if (word === leadingWord || !isNaN(Number(word))) {
                continue;
              }
              seen.add(word);
              if (seen.size > EditorSimpleWorker._suggestionsLimit) {
                break outer;
              }
            }
          }
        return { words: Array.from(seen), duration: sw.elapsed() };
      });
    }
    computeWordRanges(modelUrl, range, wordDef, wordDefFlags) {
      return __awaiter(this, void 0, void 0, function* () {
        let model = this._getModel(modelUrl);
        if (!model) {
          return Object.create(null);
        }
        const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
        const result = Object.create(null);
        for (let line = range.startLineNumber; line < range.endLineNumber; line++) {
          let words = model.getLineWords(line, wordDefRegExp);
          for (const word of words) {
            if (!isNaN(Number(word.word))) {
              continue;
            }
            let array = result[word.word];
            if (!array) {
              array = [];
              result[word.word] = array;
            }
            array.push({
              startLineNumber: line,
              startColumn: word.startColumn,
              endLineNumber: line,
              endColumn: word.endColumn
            });
          }
        }
        return result;
      });
    }
    navigateValueSet(modelUrl, range, up, wordDef, wordDefFlags) {
      return __awaiter(this, void 0, void 0, function* () {
        let model = this._getModel(modelUrl);
        if (!model) {
          return null;
        }
        let wordDefRegExp = new RegExp(wordDef, wordDefFlags);
        if (range.startColumn === range.endColumn) {
          range = {
            startLineNumber: range.startLineNumber,
            startColumn: range.startColumn,
            endLineNumber: range.endLineNumber,
            endColumn: range.endColumn + 1
          };
        }
        let selectionText = model.getValueInRange(range);
        let wordRange = model.getWordAtPosition({ lineNumber: range.startLineNumber, column: range.startColumn }, wordDefRegExp);
        if (!wordRange) {
          return null;
        }
        let word = model.getValueInRange(wordRange);
        let result = BasicInplaceReplace.INSTANCE.navigateValueSet(range, selectionText, wordRange, word, up);
        return result;
      });
    }
    loadForeignModule(moduleId, createData, foreignHostMethods) {
      const proxyMethodRequest = (method, args) => {
        return this._host.fhr(method, args);
      };
      const foreignHost = createProxyObject(foreignHostMethods, proxyMethodRequest);
      let ctx = {
        host: foreignHost,
        getMirrorModels: () => {
          return this._getModels();
        }
      };
      if (this._foreignModuleFactory) {
        this._foreignModule = this._foreignModuleFactory(ctx, createData);
        return Promise.resolve(getAllMethodNames(this._foreignModule));
      }
      return Promise.reject(new Error(`Unexpected usage`));
    }
    fmr(method, args) {
      if (!this._foreignModule || typeof this._foreignModule[method] !== "function") {
        return Promise.reject(new Error("Missing requestHandler or method: " + method));
      }
      try {
        return Promise.resolve(this._foreignModule[method].apply(this._foreignModule, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
  EditorSimpleWorker._diffLimit = 1e5;
  EditorSimpleWorker._suggestionsLimit = 1e4;
  if (typeof importScripts === "function") {
    globals.monaco = createMonacoBaseAPI();
  }

  // node_modules/monaco-editor/esm/vs/editor/editor.worker.js
  var initialized = false;
  function initialize(foreignModule) {
    if (initialized) {
      return;
    }
    initialized = true;
    const simpleWorker = new SimpleWorkerServer((msg) => {
      self.postMessage(msg);
    }, (host) => new EditorSimpleWorker(host, foreignModule));
    self.onmessage = (e) => {
      simpleWorker.onmessage(e.data);
    };
  }
  self.onmessage = (e) => {
    if (!initialized) {
      initialize(null);
    }
  };
})();
