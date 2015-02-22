(ns clj-formal-specifications-app.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer :all]
            [ring.middleware.json :refer :all]
            [ring.util.response :as resp]
            [org.httpkit.server :refer [run-server]]
            [clojure.string :as str]))

(def example-dir "resources/public/examples")

(defn filename-as-text
  [filename]
  (str/capitalize
   (str/replace (str/replace filename #"_" " ") #".clj" "")))

(defn example
  [path]
  (let [filename (peek (str/split path #"/"))]
  {:title (filename-as-text filename)
   :filename filename}))

(defn files-as-strings
  [dir]
  (rest (map str (file-seq (clojure.java.io/file dir)))))

(defn example-listing
  []
  {:body (map example (files-as-strings example-dir))})

(defn example-file
  [filename]
  {:body {:contents (slurp (str example-dir "/" filename))}})

(defn get-ns-name
  [s]
  (re-find #"(?<=\(ns\s)[a-zA-Z0-9\.-]+(?=[\s\(\)])" s))

(defn action-entry?
  [map-entry]
  (:action (meta (val map-entry))))

(defn spec-ref-entry?
  [map-entry]
  (:spec-ref (meta (var-get (val map-entry)))))

(defn assoc-action-to-specification
  [specification action-entry]
  (assoc-in specification [:actions (key action-entry)] {}))

(defn assoc-spec-ref-to-specification
  [specification spec-ref-entry]
  (assoc-in specification [:spec-refs (key spec-ref-entry)] {}))

(defn assoc-to-specification
 [specification map-entry]
  (cond
   (action-entry? map-entry)
   (assoc-action-to-specification specification map-entry)

   (spec-ref-entry? map-entry)
   (assoc-spec-ref-to-specification specification map-entry)

   :else specification))

(defn ns-specification
  [ns]
  (reduce assoc-to-specification {} (ns-publics (symbol ns))))

(defn compose
  [specification]
  (let [ns-name (get-ns-name specification)]
  {:body (do
           (load-string specification)
           (ns-specification ns-name))}))

(defroutes api-routes
  (GET "/api/examples" [] (example-listing))
  (GET "/api/examples/:filename" [filename] (example-file filename))
  (POST "/api/compose" [specification] (compose specification)))

(defn index
  [req]
  (resp/content-type
    (resp/resource-response "index.html" {:root "public"})
    "text/html"))

(defroutes site-routes
  (GET "/" [] index)
  (route/resources "/")
  (route/not-found "Not found!"))

(def site (wrap-defaults site-routes site-defaults))

(def api
  (-> api-routes
      (wrap-json-response)
      (wrap-defaults api-defaults)))

(def app (routes api site))

(defn -main
  []
  (run-server app {:port 5000}))
