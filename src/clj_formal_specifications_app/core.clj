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

(defn compose
  [specification]
  {:body (do
           (load-string specification)
           (get-ns-name specification))})

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
