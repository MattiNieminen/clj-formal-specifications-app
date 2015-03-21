(ns clj-formal-specifications-app.examples
  (:require [clojure.string :as str]
            [clojure.java.io :as io]))

(def example-dir "public/examples/")

(defn url-protocol
  [uri]
  (.getProtocol (io/resource uri)))

(defn example-entry?
  [entry]
  (boolean (re-matches (re-pattern (str example-dir ".*.clj"))
                       (.getName entry))))

; Getting a list of files named public/examples/something.clj is quite a task.

(defn examples-in-jar
  "Opens a jar file at uri and returns a list of example specification
  files inside of it."
  [uri]
  (with-open [jar (java.util.jar.JarFile. uri)]
    (doall (filter example-entry? (enumeration-seq (.entries jar))))))

(defn get-jar-path
  "If uri points inside to a jar file, returns uri to the jar file itself."
  [uri]
  (re-find #"(?<=jar:file:).+(?=[!])" uri))

(defmulti files-in-classpath url-protocol)

(defmethod files-in-classpath "jar" [uri]
  (examples-in-jar (get-jar-path (str (io/resource uri)))))

(defmethod files-in-classpath "file" [uri]
  (rest (file-seq (io/file (io/resource uri)))))

(defn filename-as-text
  "Turns 'some_file.clj' into 'Some file'."
  [filename]
  (str/capitalize
   (str/replace (str/replace filename #"_" " ") #".clj" "")))

(defn example
  [file]
  (let [filename (peek (str/split (str file) #"/"))]
    {:title (filename-as-text filename)
     :filename filename}))

(defn example-file
  [filename]
  (io/resource (str example-dir filename)))
