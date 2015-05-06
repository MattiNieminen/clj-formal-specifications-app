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

To start the development, you need to run two commands in *separate* terminals:

```bash
# Starts the backend with ring-reload
lein run hot-deploy

# Or, in case you don't care about hot-deploying code but performance
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

Download the jar from
[the releases page]
(https://github.com/MattiNieminen/clj-formal-specifications-app/releases/latest)
and execute it with command:

```bash
java -jar /path/to/clj-formal-specifications-app.jar
```

## I want to run this as a service for everyone!

Dont do it!

The contents of the editor, which contains the formal specification, will be
evaluated in the backend when the specification is composed. By running this
application as a service over the network, you allow everyone who is able
to access the editor (or the API behind it) to execute any Clojure code at the
server where this app is running. The attacker can do all sort of bad stuff
without even trying!

It is possible to run this application inside a safe container (Docker
container for example). This of course does not solve the problem, but it may
provide some safety for the host machine behind the container.

To solve this problem properly, Clojail could be used to provide a safe
sandbox for the evaluation. If you interested in developing this feature,
contact me!

## License

Copyright © 2015 Matti Nieminen

Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
