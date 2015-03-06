(ns clj-formal-specifications-app.api
  (:require [clj-formal-specifications-app.examples :as examples]
            [clj-formal-specifications-app.spec :as spec]))

(defn example-listing
  []
  {:body (map examples/example
              (examples/files-in-classpath examples/example-dir))})

(defn example-file
  [filename]
  {:body {:contents (slurp (examples/example-file filename))}})

(defn compose
  [spec]
  (let [ns (spec/get-ns-name spec)]
    {:body (do (remove-ns (symbol ns)) (load-string spec) ns)}))

(defn execute-with-ns
  [ns command]
  {:body (str (binding [*ns* (find-ns (symbol ns))] (load-string command)))})

(defn ns-data
  [ns]
  {:body (spec/ns-spec ns)})
