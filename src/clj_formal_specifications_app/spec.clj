(ns clj-formal-specifications-app.spec)

(defn get-ns-name
  "If the given string starts with the ns macro call, returns the first
  parameter given to it which should be the name of the namespace."
  [s]
  (re-find #"(?<=\(ns\s)[a-zA-Z0-9\.-]+(?=[\s\(\)])" s))

(defn action-entry?
  [map-entry]
  (contains? (meta (val map-entry)) :action))

(defn spec-ref-entry?
  [map-entry]
  (contains? (meta (val map-entry)) :spec-ref))

(defn conj-actions
  [actions action-entry]
  (conj actions {:name (key action-entry)
                 :arglist (first (:arglists (meta (val action-entry))))}))

(defn conj-spec-refs
  [spec-refs spec-ref-entry]
  (conj spec-refs {:name (key spec-ref-entry)
                   :contents (str @(var-get (val spec-ref-entry)))}))

(defn assoc-to-spec
  "Associates a map-entry to spec if map-entry is action or specification
  related ref."
 [spec map-entry]
  (cond
   (action-entry? map-entry)
   (assoc spec :actions (conj-actions (:actions spec) map-entry))

   (spec-ref-entry? map-entry)
   (assoc spec :data (conj-spec-refs (:data spec) map-entry))

   :else spec))

(defn ns-spec
  "Gets all public vars from ns, then uses them to build a specification map."
  [ns]
  (reduce assoc-to-spec
          {:namespace ns :actions #{} :data #{}}
          (ns-publics (symbol ns))))
