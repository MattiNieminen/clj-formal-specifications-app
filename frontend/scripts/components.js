var SpecificationBox = React.createClass({
  render: function() {
    return (
      <div id="specificationBox">
        This is the specificationBox!
        <Navigation />
        <Editor />
        <ExecutionBox />
      </div>
    );
  }
});

var Navigation = React.createClass({
  render: function() {
    return (
      <div id="navigation">
        This is the navigation!
      </div>
    );
  }
});

var Editor = React.createClass({
  render: function() {
    return (
      <div id="editor">
        This is the editor!
      </div>
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
