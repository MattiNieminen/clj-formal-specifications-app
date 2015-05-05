(ns clj-formal-specifications-app.api
  (:require [clj-formal-specifications-app.examples :as examples]
            [clj-formal-specifications-app.spec :as spec]
            [clojure.string :as str]))

(defn example-listing
  "Returns names of all possible examples."
  []
  {:body (map examples/example
              (examples/files-in-classpath examples/example-dir))})

(defn example-file
  "Returns the contents of an example specification by filename."
  [filename]
  {:body {:contents (slurp (examples/example-file filename))}})

(defn bad-request
  [e]
  {:body (.getMessage e) :status 400})

(defn compose
  "Expects spec to be a formal specification with ns form in the beginning.
  If the namespace exists, erases it. Then evaluates the spec and returns
  the namespace used in the specification."
  [spec]
  (let [ns (spec/get-ns-name spec)]
    (try
      {:body (do (remove-ns (symbol ns)) (load-string spec) ns)}
      (catch Exception e (bad-request e)))))

(defn export
  "Expects spec to be a formal specification with ns form in the beginning.
  Returns a map of the formal specification where filename is parsed from
  the ns form in spec."
  [spec]
  {:body {:filename (if-let [ns (spec/get-ns-name spec)]
                      (str (peek (str/split ns #"\.")) ".clj")
                      "untitled.clj")
          :contents spec}})

(defn execute-with-ns
  "Evaluates command in namespace ns. Command should be a valid Clojure form
  with execute or execute-init. Returns the result of the evaluation as
  string."
  [ns command]
  (try
    {:body (str (binding [*ns* (find-ns (symbol ns))] (load-string command)))}
    (catch Exception e (bad-request e))))

(defn ns-data
  [ns]
  {:body (spec/ns-spec ns)})
