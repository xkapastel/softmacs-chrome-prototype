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

function isUnit(value) {
  return value instanceof Unit;
}

function isBoolean(value) {
  return typeof(value) == "boolean";
}

function isSymbol(value) {
  return value instanceof Symbol;
}

function isPair(value) {
  return value instanceof Pair;
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
    lisp.stub();
  }

  read(src) {
    lisp.stub();
  }

  show(value) {
    lisp.stub();
  }

  _eval(value, scope, rest) {
    if (isSymbol(value)) {
      lisp.stub();
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
