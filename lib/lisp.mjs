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
  throw "stub";
}

export function guard(predicate, value) {
  if (!predicate(value)) {
    throw "guard";
  }
}

export class Lisp {
  constructor() {
    //
  }

  get version()      { stub() }
  get unit()         { stub() }
  get t()            { stub() }
  get f()            { stub() }
  symbol(value)      { stub() }
  pair(fst, snd)     { stub() }
  fst(value)         { stub() }
  snd(value)         { stub() }
  eval(value, scope) { stub() }
  init()             { stub() }
  set(env, value)    { stub() }
  isUnit(value)      { stub() }
  isBoolean(value)   { stub() }
  isSymbol(value)    { stub() }
  isPair(value)      { stub() }
  read(src)          { stub() }
  show(value)        { stub() }
}
