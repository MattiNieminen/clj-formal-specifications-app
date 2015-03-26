(ns clj-formal-specifications-app.api
  (:require [clj-formal-specifications-app.examples :as examples]
            [clj-formal-specifications-app.spec :as spec]
            [clojure.string :as str]))

(defn example-listing
  []
  {:body (map examples/example
              (examples/files-in-classpath examples/example-dir))})

(defn example-file
  [filename]
  {:body {:contents (slurp (examples/example-file filename))}})

(defn bad-request
  [e]
  {:body (.getMessage e) :status 400})

(defn compose
  [spec]
  (let [ns (spec/get-ns-name spec)]
    (try
      {:body (do (remove-ns (symbol ns)) (load-string spec) ns)}
      (catch Exception e (bad-request e)))))

(defn export
  [spec]
    {:body {:filename (if-let [ns (spec/get-ns-name spec)]
                        (str (peek (str/split ns #"\.")) ".clj")
                        "untitled.clj")
            :contents spec}})

(defn execute-with-ns
  [ns command]
  (try
    {:body (str (binding [*ns* (find-ns (symbol ns))] (load-string command)))}
    (catch Exception e (bad-request e))))

(defn ns-data
  [ns]
  {:body (spec/ns-spec ns)})
