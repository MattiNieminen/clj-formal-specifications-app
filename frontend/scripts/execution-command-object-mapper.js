var executionCommandObjectMapper = executionCommandObjectMapper = {};

executionCommandObjectMapper.toExecutionCommand = function(commandObj) {
  var executionCommand = "";
  var actionName = commandObj.action.name || "<<action-name>>";
  var refName = commandObj.refName || "<<ref-name>>";
  var validator = commandObj.validator || null;
  var argsAsString = executionCommandObjectMapper.getArgsAsString(commandObj);

  if(commandObj.operation === "execute") {
    executionCommand = "(fspec/execute (" + actionName + argsAsString + "))";
  }
  else if(commandObj.operation === "execute-init") {
    executionCommand = "(fspec/execute-init " + refName +
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

executionCommandObjectMapper.getArgsAsString = function(commandObj) {
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