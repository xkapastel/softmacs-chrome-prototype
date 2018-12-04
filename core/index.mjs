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

export class Lisp {
  constructor() {
    //
  }

  get version()          { stub() }

  get unit()             { stub() }
  symbol(value)          { stub() }
  pair(fst, snd)         { stub() }
  fst(value)             { stub() }
  snd(value)             { stub() }
  init()                 { stub() }
  eval(value, scope)     { stub() }
  child(scope)           { stub() }
  set(scope, key, value) { stub() }
  primitive(body)        { stub() }
  wrap(value)            { stub() }
  unwrap(value)          { stub() }
  vau(h, t, s, d)        { stub() }
  isUnit(value)          { stub() }
  isBoolean(value)       { stub() }
  isSymbol(value)        { stub() }
  isNumber(value)        { stub() }
  isString(value)        { stub() }
  isPair(value)          { stub() }
  isScope(value)         { stub() }
  isProcedure(value)     { stub() }
  isPrimitive(value)     { stub() }
  isApplicative(value)   { stub() }
  isOperative(value)     { stub() }
  read(src)              { stub() }
  show(value)            { stub() }
}


class Value {
  constructor() {
    //
  }
}

class Unit extends Value {
  constructor() {
    super();
  }

  toString() { return "#" }
}

class Symbol extends Value {
  constructor(value) {
    super();
    this.value = value;
  }

  toString() { return this.value }
}

class Pair extends Value {
  constructor(fst, snd, isList) {
    super();
    this.fst = fst;
    this.snd = snd;
    this.isList = isList;
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
  constructor() {
    super();
  }

  toString() { return "<procedure>" }
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

function isUnit(value) {
  return value instanceof Unit;
}

function isBoolean(value) {
  return typeof(value) == "boolean";
}

function isNumber(value) {
  return typeof(value) == "number";
}

function isString(value) {
  return typeof(value) == "string";
}

function isSymbol(value) {
  return value instanceof Symbol;
}

function isPair(value) {
  return value instanceof Pair;
}

function isScope(value) {
  return value instanceof Scope;
}

function isFunction(value) {
  return typeof(value) == "function";
}

function isPrimitive(value) {
  return value instanceof Primitive;
}

function isApplicative(value) {
  return value instanceof Applicative;
}

function isOperative(value) {
  return value instanceof Operative;
}

function isProcedure(value) {
  return value instanceof Procedure;
}

class V0 extends Lisp {
  constructor() {
    super();
    this.kUnit  = new Unit();
  }

  get version() { return "0.0.0 stealth mode" }
  get unit() { return this.kUnit }
  symbol(value) { return new Symbol(value) }

  pair(fst, snd) {
    let isList = false;
    if (isUnit(snd)) {
      isList = true;
    } else if (isPair(snd)) {
      isList = snd.isList;
    } else {
      isList = false;
    }
    return new Pair(fst, snd, isList);
  }

  fst(value) {
    guard(isPair, value);
    return value.fst;
  }

  snd(value) {
    guard(isPair, value);
    return value.snd;
  }

  primitive(func) {
    guard(isFunction, func);
    return new Primitive(func);
  }

  wrap(proc) {
    guard(isProcedure, proc);
    return new Applicative(proc);
  }

  unwrap(proc) {
    guard(isApplicative, proc);
    return proc.body;
  }

  vau(head, tail, lexical, dynamic) {
    return new Operative(head, tail, lexical, dynamic);
  }

  eval(value, scope) {
    return this._eval(value, scope, (x) => x);
  }

  init() {
    let scope = new Scope();
    scope.set("pair", this._app2(this.pair.bind(this)));
    scope.set("fst", this._app1(this.fst.bind(this)));
    scope.set("snd", this._app1(this.snd.bind(this)));
    scope.set("wrap", this._app1(this.wrap.bind(this)));
    scope.set("unwrap", this._app1(this.unwrap.bind(this)));
    scope.set("eval", this._app2(this.eval.bind(this)));
    scope.set("show", this._app1(this.show.bind(this)));
    scope.set("vau", this.primitive((args, scope, rest) => {
      guard(isPair, args);
      guard(isPair, args.snd);
      let proc = this.vau(args.fst, args.snd.snd, scope, args.snd.fst);
      return rest(proc);
    }));
    return scope;
  }

  child(parent) { return new Scope(parent) }

  set(scope, key, value) {
    return scope.set(key, value);
  }

  read(src) {
    return _parse(_tokenize(src), this);
  }

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

  isUnit(value)        { return isUnit(value)        }
  isBoolean(value)     { return isBoolean(value)     }
  isSymbol(value)      { return isSymbol(value)      }
  isNumber(value)      { return isNumber(value)      }
  isString(value)      { return isString(value)      }
  isPair(value)        { return isPair(value)        }
  isScope(value)       { return isScope(value)       }
  isProcedure(value)   { return isProcedure(value)   }
  isPrimitive(value)   { return isPrimitive(value)   }
  isApplicative(value) { return isApplicative(value) }
  isOperative(value)   { return isOperative(value)   }

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
    } else if (isPair(value)) {
      return this._eval(value.fst, scope, (fst) => {
        return this._exec(value.snd, scope, (snd) => {
          if (!isUnit(snd)) {
            return rest(snd);
          }
          return rest(fst);
        });
      });
    } else {
      throw "exec";
    }
  }

  _evlis(value, scope, rest) {
    if (isUnit(value)) {
      return rest(value);
    } else if (isPair(value)) {
      return this._eval(value.fst, scope, (fst) => {
        return this._evlis(value.snd, scope, (snd) => {
          return rest(this.pair(fst, snd));
        });
      });
    } else {
      throw "evlis";
    }
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

function isLparen(rune) {
  return rune == "(";
}

function isRparen(rune) {
  return rune == ")";
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
  return isLparen(rune) || isRparen(rune) || isSpace(rune);
}

function isDot(rune) {
  return rune == ".";
}

function _tokenize(runes) {
  let index = 0;
  let tokens = [];
  while (index < runes.length) {
    const rune = runes[index];
    if (isLparen(rune)) {
      tokens.push({ type: "lparen" });
      index++;
    } else if (isRparen(rune)) {
      tokens.push({ type: "rparen" });
      index++;
    } else if (isDot(rune)) {
      tokens.push({ type: "dot" });
      index++;
    } else if (isSpace(rune)) {
      const start = index;
      index++;
      while (index < runes.length) {
        const rune = runes[index];
        if (!isSpace(rune)) {
          break;
        }
        index++;
      }
      const value = runes.substring(start, index);
      tokens.push({ type: "space", value: value });
    } else {
      const start = index;
      index++;
      while (index < runes.length) {
        const rune = runes[index];
        if (isSeparator(rune)) {
          break;
        }
        index++;
      }
      const value = runes.substring(start, index);
      if (value.startsWith("#")) {
        tokens.push({ type: "sharp", value: value });
      } else {
        tokens.push({ type: "symbol", value: value });
      }
    }
  }
  return tokens;
}

class Dot {
  constructor() {

  }
}

function isPsuedo(object) {
  return object instanceof Dot;
}

function _parse(tokens, api) {
  let index = 0;
  let stack = [];
  let objects = [];
  while (index < tokens.length) {
    const token = tokens[index];
    switch (token.type) {
    case "lparen":
      stack.push(objects);
      objects = [];
      index++;
      break;
    case "rparen":
      guard((x) => x.length > 0, stack);
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
    case "dot":
      let psuedo = new Dot();
      objects.push(psuedo);
      index++;
      break;
    case "space":
      index++;
      break;
    case "sharp":
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

export function init() {
  return new V0();
}
