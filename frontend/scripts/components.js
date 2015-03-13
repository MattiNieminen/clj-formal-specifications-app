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

    $.post("api/compose", {specification: spec}, function(ns) {
      this.updateState(ns);
    }.bind(this));
  },
  resetClicked: function() {
    this.refs.editor.setValue("");
    this.refs.editor.focus();
    this.replaceState({});
    this.refs.executionBox.reset();
  },
  exampleClicked: function(contents) {
    this.refs.editor.setValue(contents);
    this.refs.editor.clearSelection();
  },
  updateState: function(ns, latestResult) {
    $.get("api/namespace/" + ns, function(spec) {
      spec.latestResult = latestResult;
      this.setState(spec);
    }.bind(this));
  },
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div id="specificationBox">
        <Toolbar
            onComposeClicked={this.composeClicked}
            onResetClicked={this.resetClicked}
            onExportClicked={this.exportClicked}
            onExampleClicked={this.exampleClicked} />
        <ExecutionBox
            spec={this.state}
            onActionExecuted={this.updateState}
            ref="executionBox" />
        <Editor ref="editor"/>
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
  reset: function() {
    this.refs.executionBox.reset();
  },
  render: function() {
    return (
      <div id="executionBox">
        <ActionBox
            onActionExecuted={this.actionExecuted}
            namespace={this.props.spec.namespace}
            ref="executionBox" />
        <LatestResultBox data={this.props.spec.latestResult} />
        <DataBox data={this.props.spec.data} />
      </div>
    );
  }
});

var ActionBox = React.createClass({
  executeAction: function() {
    var requestObject = {
      ns: this.props.namespace,
      command: this.editor.getValue()
    };

    $.post("api/execute", requestObject, function(data) {
      this.props.onActionExecuted(requestObject.ns, data);
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
  reset: function() {
    this.setValue("");
    this.replaceState(this.getInitialState());
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
  },
  render: function() {
    return (
      <div id="actionBox">
        <h2>Execute actions</h2>
        <div id="executionEditor" />
      </div>
    );
  }
});

var LatestResultBox = React.createClass({
  render: function() {
    return (
      <div id="latestResultBox">
        <h2>Latest result</h2>
        <p className="latestData">{this.props.data}</p>
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
      <li>
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

React.render(
  <SpecificationBox />,
  document.getElementById('content')
);
