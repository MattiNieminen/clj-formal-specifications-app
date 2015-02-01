var SpecificationBox = React.createClass({
  render: function() {
    return (
      <div id="specificationBox">
        <Header />
        <ExecutionBox />
        <Editor />
      </div>
    );
  }
});

var Header = React.createClass({
  render: function() {
    return (
      <div id="header">
        <ul>
          <li><a href="#compose">Compose</a></li>
          <li><a href="#export">Export</a></li>
          <li><a href="#reset">Reset editor</a></li>
          <li><a href="#examples">Examples</a></li>
        </ul>
      </div>
    );
  }
});

var Editor = React.createClass({
  componentDidMount: function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/clojure");
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
