# clj-formal-specifications-app

A browser-based application for clj-formal-specifications.

This is a graphical, browser-based user interface to [clj-formal-specifications]
(https://github.com/MattiNieminen/clj-formal-specifications), a library that I
wrote for creating executable formal specification with Clojure. Before
continuing further, read the documentation of the library itself.

This tool includes an editor with syntax-highlighting to write formal
specifications and try out the examples from the library. In addition,
executing the specification is possible with a small helper, although
writing your own execution commands is possible as well.

## Setting up the development environment

* Clone this repository
* Install the latest Java Development Kit
* Install [Leiningen](http://leiningen.org/#install)
* Install Node.js

Then go to the directory that was cloned and:

```bash
npm install -g gulp bower
npm install
bower install
```

To start the development, run these two commands in *separate* terminals:

```bash
# Starts the backend
lein run
```

```bash
# Builds the frontend and keeps watching for changes
gulp watch
```

The frontend is written in JavaScript using React. Edit files under
frontend directory and use gulp to build them under resources directory.
From there, the Clojure backend will serve them. The backend is a simple
Clojure + Ring + Compojure -project.

## I just want to run this thing

TODO find a location for hosting the uberjar.

## I want to run this as a service for everyone!

Dont do it!

TODO: longer explanation

## License

Copyright © 2015 Matti Nieminen

Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
