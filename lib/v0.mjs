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

import * as lisp from "./lisp";

class Value {
  constructor() {
    //
  }
}

class Unit extends Value {
  constructor() {
    super();
  }
}

class Symbol extends Value {
  constructor(value) {
    super();
    this.value = value;
  }
}

class Pair extends Value {
  constructor(fst, snd, isList) {
    super();
    this.fst = fst;
    this.snd = snd;
    this.isList = isList;
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
    lisp.guard(isString, key);
    if (this.frame.has(key)) {
      return this.frame.get(key);
    }
    if (this.parent != null) {
      return this.parent.get(key);
    }
    throw `${key} is undefined`;
  }

  set(key, value) {
    if (isSymbol(key)) {
      key = key.value;
    }
    lisp.guard(isString, key);
    this.frame.set(key, value);
  }
}

function isUnit(value) {
  return value instanceof Unit;
}

function isBoolean(value) {
  return typeof(value) == "boolean";
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

class V0 extends lisp.Lisp {
  constructor() {
    super();
    this.kUnit = new Unit();
  }

  get version() { return "0.0.0 stealth mode" }
  
  get unit() { return this.kUnit }
  
  get t() { return true }
  get f() { return false }

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
    lisp.guard(value, isPair);
    return value.fst;
  }

  snd(value) {
    lisp.guard(value, isPair);
    return value.snd;
  }

  eval(value, scope) {
    return this._eval(value, scope, (x) => x);
  }

  init() {
    let scope = new Scope();
    return scope;
  }

  read(src) {
    return _parse(_tokenize(src), this);
  }

  show(value) {
    if (isUnit(value)) {
      return "#";
    } else if (isBoolean(value)) {
      if (value) {
        return "#t";
      } else {
        return "#f";
      }
    } else if (isSymbol(value)) {
      return value.value;
    } else if (isPair(value)) {
      if (value.isList) {
        let buf = [];
        while (!isUnit(value)) {
          lisp.guard(isPair, value);
          const fst = this.show(value.fst);
          buf.push(fst);
          value = value.snd;
        }
        return `(${buf.join(" ")})`;
      } else {
        const fst = this.show(value.fst);
        const snd = this.show(value.snd);
        return `(${fst} . ${snd})`;
      }
    } else {
      throw "strange thing to show";
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
    lisp.stub();
  }

  _exec(value, scope, rest) {
    lisp.stub();
  }

  _evlis(value, scope, rest) {
    lisp.stub();
  }
}

export function init() {
  return new V0();
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
      tokens.push({ type: "symbol", value: value });
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
      lisp.guard((x) => x.length > 0, stack);
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
        lisp.guard((x) => !isPsuedo(x), object);
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
