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
  resetClicked: function() {
    this.refs.editor.setValue("");
    this.refs.editor.focus();
  },
  render: function() {
    return (
      <div id="specificationBox">
        <Toolbar
            onResetClicked={this.resetClicked}
            onExportClicked={this.exportClicked} />
        <ExecutionBox />
        <Editor ref="editor"/>
      </div>
    );
  }
});

var Toolbar = React.createClass({
  handleExportClicked: function() {
    this.props.onExportClicked();
  },
  handleResetClicked: function() {
    this.props.onResetClicked();
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
        <ToolbarItem key={example.filename} url="#">
          {example.title}
        </ToolbarItem>
      );
    });
    return (
      <div id="toolbar">
        <ul>
          <ToolbarItem key={"compose"} url={"#compose"}>
            Compose
          </ToolbarItem>

          <ToolbarItem key={"export"} url={"#export"}
              onItemClicked={this.handleExportClicked}>
            Export
          </ToolbarItem>

          <ToolbarItem key={"reset"} url={"#reset"}
              onItemClicked={this.handleResetClicked}>
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
  render: function() {
    return (
      <li>
        <a href="#">{this.props.title}</a>
        <ul>
          {this.props.children}
        </ul>
      </li>

    );
  }
});

var ToolbarItem = React.createClass({
  handleItemClicked: function() {
    if(typeof(this.props.onItemClicked) === typeof(Function)) {
      this.props.onItemClicked();
    }
  },
  render: function() {
    return (
      <li>
        <a href={this.props.url} onClick={this.handleItemClicked}>
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
  render: function() {
    return (
      <div id="executionBox">
        This is the executionBox!
      </div>
    );
  }
});

React.render(
  <SpecificationBox />,
  document.getElementById('content')
);
