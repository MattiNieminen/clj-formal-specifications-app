var utils = utils || {};

utils.toExecutionCommand = function(commandObj) {
  var executionCommand = "";
  var actionName = commandObj.action.name || "<<action-name>>";
  var refName = commandObj.refName || "<<ref-name>>";
  var validator = commandObj.validator || null;
  var argsAsString = utils.getArgsAsString(commandObj);

  if(commandObj.operation === "execute") {
    executionCommand = "(execute (" + actionName + argsAsString + "))";
  }
  else if(commandObj.operation === "execute-init") {
    executionCommand = "(execute-init " + refName +
      " (" + actionName + argsAsString + ")";

    if(validator !== null) {
      executionCommand += " " + commandObj.validator + ")";
    }
    else {
      executionCommand += ")";
    }
  }

  return executionCommand;
}

utils.getArgsAsString = function(commandObj) {
  var argsAsString = "";

  for(var j = 0; j < commandObj.action.arglist.length; j++) {
    var arg = commandObj.args[commandObj.action.arglist[j]]
        || "<<" + commandObj.action.arglist[j] + ">>";

    if(j < commandObj.action.arglist.length-1) {
      arg += " "
    }

    if(argsAsString === "") {
      argsAsString = " ";
    }

    argsAsString += arg;
  }

  return argsAsString;
}

utils.formatError = function(errorMsg) {
  return errorMsg.substring(errorMsg.indexOf(": ") + 2)
      .split(", compiling")[0] + ".";
}

utils.sortByName = function(x, y) {
  return x.name.localeCompare(y.name);
}

utils.specificationTemplate =
    "; Feel free to rename this namespace.\n" +
    "(ns specification.core\n" +
    "  (:require [clj-formal-specifications.core :refer :all]))\n\n" +
    "; Your functions and actions go here.\n";
