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

// import * as core from "../core/index.mjs";
import * as v0 from "../core/v0.mjs";
import * as readline from "readline";

function main() {
  let ctx = v0.init();
  let env = ctx.init();
  let uid = 0;
  let shell = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "user@softmacs\n> ",
  });
  shell.prompt();
  shell.on("line", (line) => {
    let values = ctx.read(line);
    for (let lhs of values) {
      const rhs = ctx.eval(lhs, env);
      const name = "$" + uid;
      const show = ctx.show(rhs);
      console.log(`${name} = ${show}`);
      ctx.set(env, name, rhs);
      uid++;
    }
    shell.prompt();
  });
  shell.on("close", () => {
    process.exit(0);
  });
}

main();
