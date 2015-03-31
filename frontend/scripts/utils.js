var utils = utils || {};

// Function for turning a command object into a Clojure form starting with
// execute or execute-init. Uses placeholders in case the object is not
//complete.
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

// Function for creating an argumentlist from command object. Uses placeholders
// with argument name if argument is not given in the command object.
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

// Returns a human friendly error message from a failed execution of action.
utils.formatError = function(errorMsg) {
  if(errorMsg.indexOf("action is not available for execution") !== -1) {
    return "Action is not available for execution.";
  }

  return errorMsg.split(", compiling")[0] + ".";
}

// Function for comparing two objects by their name attribute.
utils.sortByName = function(x, y) {
  return x.name.localeCompare(y.name);
}

// A string of Clojure used for example when reseting the specification editor.
// Contains a basic ns form with :require for the formal specification library.
utils.specificationTemplate =
    "; Feel free to rename this namespace.\n" +
    "(ns specification.core\n" +
    "  (:require [clj-formal-specifications.core :refer :all]))\n\n" +
    "; Your functions and actions go here.\n";
