var SpecificationBox = React.createClass({
  resetClicked: function() {
    this.refs.editor.setValue("");
    this.refs.editor.focus();
  },
  render: function() {
    return (
      <div id="specificationBox">
        <Header onResetClicked={this.resetClicked} />
        <ExecutionBox />
        <Editor ref="editor"/>
      </div>
    );
  }
});

var Header = React.createClass({
  handleResetClicked: function() {
    this.props.onResetClicked();
  },
  render: function() {
    return (
      <div id="header">
        <ul>
          <li><a href="#compose">Compose</a></li>
          <li><a href="#export">Export</a></li>
          <li>
            <a href="#reset" onClick={this.handleResetClicked}>Reset editor</a>
          </li>
          <li><a href="#examples">Examples</a></li>
        </ul>
      </div>
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
