var SpecificationBox = React.createClass({
  exportClicked: function() {
    // This is so dirty, but what else can we do?
    var contents = this.refs.editor.getValue();
    var a = document.body.appendChild(document.createElement("a"));
    a.download = "specification.clj";
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(contents);
    a.innerHTML = "[Export content]";
    a.click();
    a.parentNode.removeChild(a);
  },
  composeClicked: function() {
    var spec = this.refs.editor.getValue();

    var jqxhr = $.post("api/compose", {specification: spec})
    .done(function(ns) {
      this.updateState(ns, {});
    }.bind(this))
    .fail(function(obj) {
      this.replaceState({composeError: utils.formatError(obj.responseText)});
    }.bind(this));
  },
  resetClicked: function() {
    this.refs.editor.setValue("");
    this.refs.editor.focus();
    this.replaceState(this.getInitialState());
  },
  exampleClicked: function(contents) {
    this.refs.editor.setValue(contents);
    this.refs.editor.clearSelection();
  },
  updateState: function(ns, latestResult) {
    $.get("api/namespace/" + ns, function(spec) {
      spec.latestResult = latestResult;
      this.replaceState(spec);
    }.bind(this));
  },
  renderSidebar: function() {
    if(typeof this.state.namespace !== "undefined") {
      return (
        <ExecutionBox
            spec={this.state}
            onActionExecuted={this.updateState} />
      );
    }
    else {
      return (
        <GuideBox error={this.state.composeError} />
      );
    }
  },
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div id="content">
        <Toolbar
            onComposeClicked={this.composeClicked}
            onResetClicked={this.resetClicked}
            onExportClicked={this.exportClicked}
            onExampleClicked={this.exampleClicked} />
          <div id="specificationBox">
            {this.renderSidebar()}
            <Editor ref="editor"/>
          </div>
      </div>
    );
  }
});

var Toolbar = React.createClass({
  composeClicked: function() {
    this.props.onComposeClicked();
  },
  exportClicked: function() {
    this.props.onExportClicked();
  },
  resetClicked: function() {
    this.props.onResetClicked();
  },
  exampleClicked: function(filename) {
    $.get("api/examples/" + filename, function(data) {
      this.props.onExampleClicked(data.contents);
    }.bind(this));
  },
  getInitialState: function() {
    return {examples: []};
  },
  componentDidMount: function() {
    $.get("api/examples", function(data) {
      this.setState({examples: data});
    }.bind(this));
  },
  render: function() {
    var exampleItems = this.state.examples.map(function(example) {
      return (
        <ToolbarItem key={example.filename} url="#"
            onItemClicked={this.exampleClicked.bind(this, example.filename)}>
          {example.title}
        </ToolbarItem>
      );
    }, this);
    return (
      <div id="toolbar">
        <ul>
          <ToolbarItem key={"compose"} url={"#compose"}
              onItemClicked={this.composeClicked}>
            Compose
          </ToolbarItem>

          <ToolbarItem key={"export"} url={"#export"}
              onItemClicked={this.exportClicked}>
            Export
          </ToolbarItem>

          <ToolbarItem key={"reset"} url={"#reset"}
              onItemClicked={this.resetClicked}>
            Reset
          </ToolbarItem>

          <Dropdown title={"Examples"}>
            {exampleItems}
          </Dropdown>
        </ul>
      </div>
    );
  }
});

var Dropdown = React.createClass({
  toggleMenu: function() {
    $(this.getDOMNode()).children("ul").slideToggle(100);
  },
  renderChildren: function() {
    return React.Children.map(this.props.children, function(child) {
      return React.addons.cloneWithProps(child, {toggleMenu: this.toggleMenu});
    }.bind(this));
  },
  render: function() {
    return (
      <li>
        <a href="#" onClick={this.toggleMenu}>{this.props.title}</a>
        <ul>
          {this.renderChildren()}
        </ul>
      </li>
    );
  }
});

var ToolbarItem = React.createClass({
  itemClicked: function() {
    if(typeof(this.props.onItemClicked) === typeof(Function)) {
      this.props.onItemClicked();
    }

    if(typeof(this.props.toggleMenu) === typeof(Function)) {
      this.props.toggleMenu();
    }
  },
  render: function() {
    return (
      <li>
        <a href={this.props.url} onClick={this.itemClicked}>
          {this.props.children}
        </a>
      </li>
    );
  }
});

var Editor = React.createClass({
  getValue: function() {
    return this.editor.getValue();
  },
  setValue: function(value) {
    this.editor.setValue(value);
  },
  focus: function() {
    this.editor.focus();
  },
  clearSelection: function() {
    this.editor.clearSelection();
  },
  componentDidMount: function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/clj-formal-specifications-app");
    editor.getSession().setMode("ace/mode/clojure");
    editor.setShowPrintMargin(false);
    editor.focus();
    this.editor = editor;
  },
  render: function() {
    return (
      <div id="editor"></div>
    );
  }
});

var ExecutionBox = React.createClass({
  actionExecuted: function(namespace, data) {
    this.props.onActionExecuted(namespace, data);
  },
  setValue: function(value) {
    this.refs.executionBox.setValue(value);
  },
  render: function() {
    return (
      <div id="sidebar">
        <ActionBox
            onActionExecuted={this.actionExecuted}
            spec={this.props.spec}
            ref="executionBox" />
        <LatestResultBox
            data={this.props.spec.latestResult.data}
            success={this.props.spec.latestResult.success} />
        <DataBox data={this.props.spec.data} />
      </div>
    );
  }
});

var ActionBox = React.createClass({
  executeAction: function() {
    var requestObject = {
      ns: this.props.spec.namespace,
      command: this.editor.getValue()
    };

    var jqxhr = $.post("api/execute", requestObject)
    .done(function(data) {
      this.props.onActionExecuted(requestObject.ns,
          {success: true, data: data});
    }.bind(this))
    .fail(function(obj) {
      this.props.onActionExecuted(requestObject.ns,
          {success: false, data: utils.formatError(obj.responseText)});
    }.bind(this))
    .always(function() {
      var history = this.state.history;
      history.push(requestObject.command);
      this.setState({history: history, historyIndex: null});
      this.setValue("");
    }.bind(this));
  },
  setValue: function(value) {
    this.editor.setValue(value);
  },
  getPrevFromHistory: function() {
    var index = this.state.historyIndex;

    if(index === null) {
      index = this.state.history.length-1;
    }
    else if(index !== 0) {
      index--;
    }

    this.setState({historyIndex: index});
    this.updateEditorFromHistory();
  },
  getNextFromHistory: function() {
    var index = this.state.historyIndex;

    if(index !== null && index < this.state.history.length-1) {
      index++;
    }
    else {
      index = null;
    }

    this.setState({historyIndex: index});
    this.updateEditorFromHistory();
  },
  updateEditorFromHistory: function() {
    if(this.state.historyIndex !== null) {
      this.setValue(this.state.history[this.state.historyIndex]);
    }
    else {
      this.setValue("");
    }
  },
  openActionHelperBox: function() {
    $(this.getDOMNode()).children("#actionHelperForm")
        .slideToggle(100);
  },
  updateEditorFromObject: function(commandObj) {
    this.setValue(utils.toExecutionCommand(commandObj));
  },
  getInitialState: function() {
    return {history: [], historyIndex: null};
  },
  componentDidMount: function() {
    var editor = ace.edit("executionEditor");
    editor.setTheme("ace/theme/clj-formal-specifications-app");
    editor.getSession().setMode("ace/mode/clojure");

    editor.commands.addCommand({
      name: 'executeCommand',
      bindKey: 'enter',
      exec: function(editor) {
        this.executeAction();
      }.bind(this),
      readOnly: false
    });

    editor.commands.addCommand({
      name: 'prevCommand',
      bindKey: 'up',
      exec: function(editor) {
        this.getPrevFromHistory();
      }.bind(this),
      readOnly: false
    });

    editor.commands.addCommand({
      name: 'nextCommand',
      bindKey: 'down',
      exec: function(editor) {
        this.getNextFromHistory();
      }.bind(this),
      readOnly: false
    });

    this.editor = editor;
    this.updateEditorFromObject(this.refs.actionHelperBox.state);
  },
  render: function() {
    return (
      <div id="actionBox">
        <h2>Execute actions</h2>
        <div id="executionEditor" />
        <a href="#" id="actionHelperLink" onClick={this.openActionHelperBox}>
          I need help executing actions!
        </a>
        <ActionHelperBox
            onChange={this.updateEditorFromObject}
            spec={this.props.spec}
            ref="actionHelperBox" />
      </div>
    );
  }
});

var ActionHelperBox = React.createClass({
  changeOperation: function(operation) {
    this.setState({operation: operation}, function() {
      this.props.onChange(this.state);
    });
  },
  changeAction: function(action) {
    this.setState({action: action}, function() {
      this.props.onChange(this.state);
    });
  },
  changeArgs: function(key, value) {
    var args = this.state.args;
    args[key] = value;
    this.setState({args: args}, function() {
      this.props.onChange(this.state);
    });
  },
  changeRefName: function(refName) {
    this.setState({refName: refName}, function() {
      this.props.onChange(this.state);
    });
  },
  changeValidator: function(validator) {
    this.setState({validator: validator}, function() {
      this.props.onChange(this.state);
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getInitialState(), function() {
      this.props.onChange(this.state);
    });
  },
  getInitialState: function() {
    return {operation: "execute", action: {name: "", arglist: []}, args: [],
        refName: null, validator: null};
  },
  render: function() {
    return (
      <div id="actionHelperForm">
        <OperationSelector
            operation={this.state.operation}
            onOperationChange={this.changeOperation} />
        <ActionSelector
            selectedAction={this.state.action.name}
            actions={this.props.spec.actions}
            onActionChange={this.changeAction} />
        <ArgumentList
            arglist={this.state.action.arglist}
            data={this.props.spec.data}
            onArgChange={this.changeArgs} />
        <RefOptions
            operation={this.state.operation}
            refName={this.state.refName}
            validator={this.state.validator}
            onRefNameChange={this.changeRefName}
            onValidatorChange={this.changeValidator} />
      </div>
    );
  }
});

var OperationSelector = React.createClass({
  operationChange: function(event) {
    this.props.onOperationChange(event.target.value);
  },
  render: function() {
    return (
      <div className="actionHelperFormBlock">
        <label>Operation</label>
        <div className="actionHelperFormInput">
          <input type="radio"
              name="operation"
              value="execute"
              onChange={this.operationChange}
              checked={this.props.operation === "execute" ? true : null} />
          execute
          <br />
          <input type="radio"
              name="operation"
              value="execute-init"
              onChange={this.operationChange}
              checked={this.props.operation === "execute-init" ? true : null} />
          execute-init
        </div>
      </div>
    );
  }
});

var ActionSelector = React.createClass({
  actionChange: function(event) {
    var selectedAction = {name: "", arglist: []};

    for(var i = 0; i < this.props.actions.length; i++) {
      var action = this.props.actions[i];

      if(event.target.value === action.name) {
        selectedAction = action;
        break;
      }
    }

    this.props.onActionChange(selectedAction);
  },
  render: function() {
    var actionOptions = [];

    if(typeof this.props.actions !== 'undefined') {
      actionOptions = this.props.actions.map(function(action) {
        return (
          <option key={action.name} value={action.name}>{action.name}</option>
        );
      });
    }

    return (
      <div className="actionHelperFormBlock">
        <label>Action</label>
        <div className="actionHelperFormInput">
          <select value={this.props.selectedAction}
              onChange={this.actionChange}>
            <option value={""}>Select action...</option>
            {actionOptions}
          </select>
        </div>
      </div>
    );
  }
});

var ArgumentList = React.createClass({
  argChange: function(key, value) {
    this.props.onArgChange(key, value);
  },
  render: function() {
    var args = [];

    if(typeof this.props.arglist !== "undefined") {
      args = this.props.arglist.map(function(arg) {
        var options = this.props.data.map(function(dataItem) {
          return [
            <option value={dataItem.name} />,
            <option value={"@" + dataItem.name} />,
            <option value={dataItem.contents} />
          ];
        });

        return (
          <div key={arg + "_div"}>
            <label>{arg}</label>
            <div className="actionHelperFormInput">
              <input
                  list="dataItems"
                  name="dataItems"
                  onChange={function(event) {this.argChange(arg,
                        event.target.value);}.bind(this)} />
              <datalist id="dataItems">
                {options}
              </datalist>
            </div>
          </div>
        );
      }.bind(this));
    }

    return (
      <div id="arglist" className="actionHelperFormBlock">
        {args}
      </div>
    );
  }
});

var RefOptions = React.createClass({
  refNameChange: function(event) {
    this.props.onRefNameChange(event.target.value);
  },
  validatorChange: function(event) {
    this.props.onValidatorChange(event.target.value);
  },
  render: function() {
    if(this.props.operation === "execute-init") {
      return (
        <div id="refOptions" className="actionHelperFormBlock">
          <label>Ref name</label>
          <div className="actionHelperFormInput">
            <input
                type="text"
                name="refName"
                onChange={this.refNameChange}
                value={this.props.refName} />
          </div>

          <label>Validator function</label>
          <div className="actionHelperFormInput">
            <input
                type="text"
                name="validator"
                onChange={this.validatorChange}
                value={this.props.validator} />
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
});

var LatestResultBox = React.createClass({
  render: function() {
    var latestData;

    if(this.props.success === true) {
      latestData = <p className="latestDataSuccess">{this.props.data}</p>;
    }
    else if(this.props.success === false) {
      latestData = <p className="latestDataFailure">{this.props.data}</p>;
    }
    return (
      <div id="latestResultBox">
        <h2>Latest result</h2>
        {latestData}
      </div>
    );
  }
});

var DataBox = React.createClass({
  render: function() {
    var dataItems = [];

    if(typeof this.props.data !== 'undefined') {
      dataItems = this.props.data.map(function(dataItem) {
        return (
          <DataItem key={dataItem.name} data={dataItem} />
        );
      });
    }

    return (
      <div id="dataBox">
        <h2>Data</h2>
        <ul>
          {dataItems}
        </ul>
      </div>
    );
  }
});

var DataItem = React.createClass({
  toggleContent: function() {
    $(this.getDOMNode()).children(".dataItemContent").slideToggle(100);
  },
  render: function() {
    return (
      <li className="dataItemContainer">
        <a href="#" onClick={this.toggleContent} className="dataItemButton">
          {this.props.data.name}
        </a>
        <div className="dataItemContent">
          <p>{this.props.data.contents}</p>
        </div>
      </li>
    );
  }
});

var GuideBox = React.createClass({
  render: function() {
    var errorMsg;

    if(typeof this.props.error !== "undefined") {
      errorMsg =
          <div>
            <p className="latestDataFailure">
              {this.props.error}
            </p>
          </div>
    }

    return (
      <div id="sidebar">
        <h1>Welcome</h1>
        <p>This is a proof-of-concept tool for writing and executing <mark>
        formal specifications with Clojure</mark>.</p>

        <h2>Formal specifications?</h2>

        <p>If you are a novice in formal specifications, read <a
        href="http://en.wikipedia.org/wiki/Formal_specification">the
        Wikipedia page about formal specifications</a>.</p>

        <h2>Documentation</h2>

        <p>The formal language used with this tool is Clojure. In addition,
        this tool leverages a formal specifications library written for the
        purpose. Refer to the <a
        href="https://github.com/MattiNieminen/clj-formal-specifications">
        GitHub page</a> of the library for documentation.</p>

        <p>Looking for the source code of this application? See <a
        href="https://github.com/MattiNieminen/clj-formal-specifications-app">
        this GitHub page</a>.</p>

        <h2>How to use this tool?</h2>

        <p>Start by writing your specifications using the <mark>editor</mark> on
        the right, or open one of the examples. These specifications consists
        mainly of <mark>atomic actions</mark> declared with <mark>defaction
        macro</mark>, but feel free to define <mark>normal pure functions
        </mark> for better separation of concerns (and custom validators for
        refs). Remember, all of Clojure is at your disposal!</p>

        <p>After that, click <mark>Compose</mark> to evaluate your
        specification. If the evaluation succeeds, simulate the specification
        by executing actions using the view that appears here. You can
        write <mark>execution commands</mark> yourself, or use a simple user
        interface to build your commands. After every step, the state of the
        simulation is available for inspection.</p>

        <p><mark>Bash-style history</mark> of all the executed commands can be
        browsed by using up and down keys while the focus is in the execution
        form editor.</p>

        <p>If your specification can not be composed, you will see an error
        message below.</p>

        {errorMsg}
      </div>
    );
  }
});

React.render(
  <SpecificationBox />,
  document.getElementById('reactContainer')
);
