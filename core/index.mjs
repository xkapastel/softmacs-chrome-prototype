// This file is a part of Softmacs.
// Copyright (C) 2018 Matthew Blount

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public
// License along with this program.  If not, see
// <https://www.gnu.org/licenses/.
export function stub() {
  debugger;
  throw "stub";
}
export function guard(predicate, value) {
  if (!predicate(value)) {
    debugger;
    throw "guard";
  }
}
// The Lisp API.
//
// Softmacs Lisp has lexically scoped fexprs, delimited continuations,
// and syntax for keywords, vectors and maps in the style of Clojure.
//
// As far as data structures are concerned:
// - Booleans, numbers and strings are just JavaScript natives.
// - Vectors are random access lists as in Okasaki's thesis.
// - Maps are treaps.
export class Lisp {
  constructor() {}
  // Some string associated with the version of the Lisp
  // interpreter. You should generally use a content-address
  // instead if you actually want some guarantees on what
  // code is running.
  get version() { stub() }
  // Unit is the identity for products. It's a singleton type used in
  // various ways, such as to signal the end of a union typed list, to
  // avoid binding a value in a parameter list, as a return from an
  // effectful function etc.
  get unit() { stub() }
  // Symbols
  symbol(value) { stub() }
  // Keywords
  keyword(value) { stub() }
  // A pair is just two values stuck together.
  pair(fst, snd) { stub() }
  fst(value)     { stub() }
  snd(value)     { stub() }
  // A scope maps symbols to values. Softmacs Lisp
  // is lexically scoped, so a vau expression will
  // capture the scope at its definition site as well
  // as binding the scope at its call site.
  init()                 { stub() }
  eval(value, scope)     { stub() }
  child(scope)           { stub() }
  set(scope, key, value) { stub() }
  // Procedures
  primitive(body)        { stub() }
  wrap(value)            { stub() }
  unwrap(value)          { stub() }
  vau(h, t, s, d)        { stub() }
  // Softmacs Lisp uses type predicates and assertions
  // as in Clojure's spec.
  isUnit(value)          { stub() }
  isBoolean(value)       { stub() }
  isNumber(value)        { stub() }
  isKeyword(value)       { stub() }
  isString(value)        { stub() }
  isSymbol(value)        { stub() }
  isPair(value)          { stub() }
  isScope(value)         { stub() }
  isProcedure(value)     { stub() }
  isPrimitive(value)     { stub() }
  isApplicative(value)   { stub() }
  isOperative(value)     { stub() }
  // Read
  read(src)              { stub() }
  show(value)            { stub() }
}
class Value {
  constructor() {}
  toString()    { stub() }
}
class Unit extends Value {
  constructor() { super() }
  toString()    { return "#" }
}
class Symbol extends Value {
  constructor(value) {
    super();
    this.value = value;
  }
  toString() { return this.value }
}
class Keyword extends Value {
  constructor(value) {
    super();
    this.value = value;
  }
  toString() { return `:${this.value}` }
}
class Pair extends Value {
  constructor(fst, snd, isList) {
    super();
    this.fst = fst;
    this.snd = snd;
    if (isUnit(snd)) {
      this.isList = true;
    } else if (isPair(snd)) {
      this.isList = snd.isList;
    } else {
      this.isList = false;
    }
  }
  toString() {
    if (this.isList) {
      let buf = [];
      let value = this;
      while (!isUnit(value)) {
        guard(isPair, value);
        const fst = value.fst.toString();
        buf.push(fst);
        value = value.snd;
      }
      const body = buf.join(" ");
      return `(${body})`;
    } else {
      const fst = this.fst.toString();
      const snd = this.snd.toString();
      return `(${fst}} . ${snd})`;
    }
  }
}
class Scope extends Value {
  constructor(parent) {
    super();
    this.frame = new Map();
    this.parent = parent;
  }
  get(key) {
    if (isSymbol(key)) {
      key = key.value;
    }
    guard(isString, key);
    if (this.frame.has(key)) {
      return this.frame.get(key);
    }
    if (this.parent != null) {
      return this.parent.get(key);
    }
    throw `${key} is undefined`;
  }
  set(key, value) {
    if (isUnit(key)) {
      return;
    }
    if (isSymbol(key)) {
      key = key.value;
    }
    guard(isString, key);
    this.frame.set(key, value);
  }
  bind(fst, snd) {
    if (isUnit(fst)) {
      return;
    }
    if (isSymbol(fst)) {
      return this.set(fst, snd);
    }
    if (isPair(fst)) {
      guard(isPair, snd);
      this.bind(fst.fst, snd.fst);
      this.bind(fst.snd, snd.snd);
    }
  }
  toString() { return "<scope>" }
}
class Procedure extends Value {
  constructor() { super() }
  toString()    { return "<procedure>" }
}
class Primitive extends Procedure {
  constructor(body) {
    super();
    this.body = body;
  }
}
class Applicative extends Procedure {
  constructor(body) {
    super();
    this.body = body;
  }
}
class Operative extends Procedure {
  constructor(head, tail, lexical, dynamic) {
    super();
    this.head = head;
    this.tail = tail;
    this.lexical = lexical;
    this.dynamic = dynamic;
  }
}
function isUnit(value)        { return value instanceof Unit        }
function isBoolean(value)     { return typeof(value) == "boolean"   }
function isNumber(value)      { return typeof(value) == "number"    }
function isString(value)      { return typeof(value) == "string"    }
function isSymbol(value)      { return value instanceof Symbol      }
function isKeyword(value)     { return value instanceof Keyword     }
function isPair(value)        { return value instanceof Pair        }
function isScope(value)       { return value instanceof Scope       }
function isFunction(value)    { return typeof(value) == "function"  }
function isPrimitive(value)   { return value instanceof Primitive   }
function isApplicative(value) { return value instanceof Applicative }
function isOperative(value)   { return value instanceof Operative   }
function isProcedure(value)   { return value instanceof Procedure   }
class V0 extends Lisp {
  constructor() {
    super();
    this.kUnit = new Unit();
  }
  get version()  { return "0.0.0 stealth mode"         }
  get unit()     { return this.kUnit                   }
  symbol(value)  { return new Symbol(value)            }
  keyword(value) { return new Keyword(value)           }

  isUnit(value)        { return isUnit(value)        }
  isBoolean(value)     { return isBoolean(value)     }
  isSymbol(value)      { return isSymbol(value)      }
  isKeyword(value)     { return isKeyword(value)     }
  isNumber(value)      { return isNumber(value)      }
  isString(value)      { return isString(value)      }
  isPair(value)        { return isPair(value)        }
  isScope(value)       { return isScope(value)       }
  isProcedure(value)   { return isProcedure(value)   }
  isPrimitive(value)   { return isPrimitive(value)   }
  isApplicative(value) { return isApplicative(value) }
  isOperative(value)   { return isOperative(value)   }

  pair(fst, snd) { return new Pair(fst, snd)          }
  fst(x)         { guard(isPair, x);     return x.fst }
  snd(x)         { guard(isPair, x);     return x.snd }

  primitive(x)        { guard(isFunction, x);       return new Primitive(x)   }
  wrap(x)             { guard(isProcedure, x);      return new Applicative(x) }
  unwrap(proc)        { guard(isApplicative, proc); return proc.body          }
  vau(hd, tl, st, dy) { return new Operative(hd, tl, st, dy)                  }

  eval(value, scope)     { return this._eval(value, scope, (x) => x) }
  child(parent)          { return new Scope(parent)                  }
  set(scope, key, value) { return scope.set(key, value)              }
  init() {
    let scope = new Scope();
    scope.set("pair"   , this._app2(this.pair.bind(this)));
    scope.set("fst"    , this._app1(this.fst.bind(this)));
    scope.set("snd"    , this._app1(this.snd.bind(this)));
    scope.set("wrap"   , this._app1(this.wrap.bind(this)));
    scope.set("unwrap" , this._app1(this.unwrap.bind(this)));
    scope.set("eval"   , this._app2(this.eval.bind(this)));
    scope.set("show"   , this._app1(this.show.bind(this)));
    scope.set("vau"    , this.primitive((args, scope, rest) => {
      guard(isPair, args);
      guard(isPair, args.snd);
      let proc = this.vau(args.fst, args.snd.snd, scope, args.snd.fst);
      return rest(proc);
    }));
    return scope;
  }
  read(src) { return _parse(_tokenize(src), this) }
  show(value) {
    if (isBoolean(value)) {
      if (value) {
        return "#t";
      } else {
        return "#f";
      }
    } else if (isString(value)) {
      return `"$value"`;
    } else {
      return value.toString();
    }
  }
  _eval(value, scope, rest) {
    if (isSymbol(value)) {
      return rest(scope.get(value));
    } else if (isPair(value)) {
      return this._eval(value.fst, scope, (proc) => {
        return this._apply(proc, value.snd, scope, rest);
      });
    } else {
      return rest(value);
    }
  }
  _apply(proc, value, scope, rest) {
    guard(isProcedure, proc);
    if (isPrimitive(proc)) {
      return proc.body(value, scope, rest);
    } else if (isApplicative(proc)) {
      return this._evlis(value, scope, (value) => {
        return this._apply(proc.body, value, scope, rest);
      });
    } else if (isOperative(proc)) {
      let local = this.child(proc.lexical);
      local.bind(proc.head, value);
      local.set(proc.dynamic, scope);
      return this._exec(proc.tail, local, rest);
    }
  }
  _exec(value, scope, rest) {
    if (isUnit(value)) {
      return rest(value);
    }
    guard(isPair, value);
    return this._eval(value.fst, scope, (fst) => {
      return this._exec(value.snd, scope, (snd) => {
        if (!isUnit(snd)) {
          return rest(snd);
        }
        return rest(fst);
      });
    });
  }
  _evlis(value, scope, rest) {
    if (isUnit(value)) {
      return rest(value);
    }
    guard(isPair, value);
    return this._eval(value.fst, scope, (fst) => {
      return this._evlis(value.snd, scope, (snd) => {
        return rest(this.pair(fst, snd));
      });
    });
  }
  _app1(body) {
    return this.wrap(this.primitive((args, scope, rest) => {
      guard(isPair, args);
      guard(isUnit, args.snd);
      return rest(body(args.fst));
    }));
  }
  _app2(body) {
    return this.wrap(this.primitive((args, scope, rest) => {
      guard(isPair, args);
      guard(isPair, args.snd);
      guard(isUnit, args.snd.snd);
      return rest(body(args.fst, args.snd.fst));
    }));
  }
  _appN(body) {
    return this.wrap(this.primitive((args, scope, rest) => {
      let values = arrayFromList(args);
      return rest(body.apply(null, values));
    }));
  }
}
function isLparen(rune)   { return rune == "(" }
function isRparen(rune)   { return rune == ")" }
function isLbracket(rune) { return rune == "[" }
function isRbracket(rune) { return rune == "]" }
function isLbrace(rune)   { return rune == "{" }
function isRbrace(rune)   { return rune == "}" }
function isDot(rune)      { return rune == "." }
function isColon(rune)    { return rune == ":" }
function isDelimiter(rune) {
  return (isLparen(rune) ||
          isRparen(rune) ||
          isLbracket(rune) ||
          isRbracket(rune) ||
          isLbrace(rune) ||
          isRbrace(rune));
}
function isSpace(rune) {
  switch (rune) {
  case " ":
  case "\t":
  case "\r":
  case "\n":
    return true;
  default:
    return false;
  }
}
function isSeparator(rune) {
  return isDelimiter(rune) || isSpace(rune);
}
function slice(runes, index, predicate) {
  const start = index;
  index++;
  while (index < runes.length) {
    if (predicate(runes[index])) {
      break;
    }
    index++;
  }
  const value = runes.substring(start, index);
  return { value: value, index: index };
}
function _tokenize(runes) {
  let index = 0;
  let tokens = [];
  while (index < runes.length) {
    const rune = runes[index];
    if (isDelimiter(rune)) {
      tokens.push({ type: rune });
      index++;
    } else if (isSpace(rune)) {
      let result = slice(runes, index, (x) => !isSpace(x));
      index = result.index;
      tokens.push({ type: "space", value: result.value });
    } else {
      let result = slice(runes, index, isSeparator);
      index = result.index;
      if (result.value.startsWith("#")) {
        let value = result.value == "#"? "#" : result.value.slice(1);
        tokens.push({ type: "constant", value: value });
      } else {
        tokens.push({ type: "symbol", value: result.value });
      }
    }
  }
  return tokens;
}
class Dot {
  constructor() {}
}
function isPsuedo(object) { return object instanceof Dot }
function nonempty(x) { return x.length > 0 }
function _parse(tokens, api) {
  let index = 0;
  let stack = [];
  let objects = [];
  while (index < tokens.length) {
    const token = tokens[index];
    switch (token.type) {
    case "(":
      stack.push(objects);
      objects = [];
      index++;
      break;
    case ")":
      guard(nonempty, stack);
      if (objects.length > 2) {
        const last = objects.length - 1;
        if (isPsuedo(objects[last-1])) {
          objects.splice(last-1, 1);
        } else {
          objects.push(api.unit);
        }
      } else {
        objects.push(api.unit);
      }
      let xs;
      while (objects.length > 0) {
        let object = objects.pop();
        guard((x) => !isPsuedo(x), object);
        if (xs === undefined) {
          xs = object;
        } else {
          xs = api.pair(object, xs);
        }
      }
      objects = stack.pop();
      objects.push(xs);
      index++;
      break;
    case ".":
      let psuedo = new Dot();
      objects.push(psuedo);
      index++;
      break;
    case ":":
      index++;
      let value = tokens[index];
      guard((x) => x.type == "symbol", value);
      objects.push(api.keyword(value.value));
      index++;
      break;
    case "space":
      index++;
      break;
    case "constant":
      let object;
      switch (token.value) {
      case "#":
        object = api.unit;
        break;
      case "#t":
        object = true;
        break;
      case "#f":
        object = false;
        break;
      default:
        debugger;
        throw "read";
      }
      objects.push(object);
      index++;
      break;
    case "symbol":
      const symbol = api.symbol(token.value);
      objects.push(symbol);
      index++;
      break;
    default:
      debugger;
      throw "read";
      break;
    }
  }
  return objects;
}
function arrayFromList(xs) {
  let buf = [];
  while (!isUnit(xs)) {
    guard(isPair, xs);
    buf.push(xs.fst);
    xs = xs.snd;
  }
  return buf;
}
export function init() { return new V0() }
