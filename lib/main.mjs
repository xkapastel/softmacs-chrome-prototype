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
import * as v0 from "./v0";
import * as readline from "readline";

function main() {
  let ctx = v0.init();
  let uid = 0;
  let shell = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "user@softmacs\n> ",
  });
  shell.prompt();
  shell.on("line", (line) => {
    let values = ctx.read(line);
    for (let value of values) {
      const name = "$" + uid;
      const show = ctx.show(value);
      console.log(`${name} = ${show}`);
      uid++;
    }
    shell.prompt();
  });
  shell.on("close", () => {
    process.exit(0);
  });
}

main();
