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
      this.getNsFromServer(ns);
    }.bind(this));
  },
  resetClicked: function() {
    this.refs.editor.setValue("");
    this.refs.editor.focus();
  },
  exampleClicked: function(contents) {
    this.refs.editor.setValue(contents);
    this.refs.editor.clearSelection();
  },
  getNsFromServer: function(ns) {
    $.get("api/namespace/" + ns, function(spec) {
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
            onActionExecuted={this.getNsFromServer} />
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
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/clojure");
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
  actionExecuted: function(ns) {
    this.props.onActionExecuted(ns);
  },
  render: function() {
    return (
      <div id="executionBox">
        <ActionBox
            namespace={this.props.spec.namespace}
            onActionExecuted={this.actionExecuted} />
        <DataBox data={this.props.spec.data} />
      </div>
    );
  }
});

var ActionBox = React.createClass({
  actionExecuted: function(ns) {
    this.props.onActionExecuted(ns);
  },
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    var editor = ace.edit("executionEditor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/clojure");

    editor.commands.addCommand({
      name: 'executeCommand',
      bindKey: 'enter',
      exec: function(editor) {
        var requestObject = {
          ns: this.props.namespace,
          command: editor.getValue()
        };

        $.post("api/execute", requestObject, function(data) {
          this.setState({latestResult: data});
          this.actionExecuted(requestObject.ns);
        }.bind(this));
      }.bind(this),
      readOnly: false
    });
  },
  render: function() {
    return (
      <div id="actionBox">
        <h2>Execute actions</h2>
        <div id="executionEditor" />
        <h2>Latest result</h2>
        <p>{this.state.latestResult}</p>
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
        <a href="#" onClick={this.toggleContent}>
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
