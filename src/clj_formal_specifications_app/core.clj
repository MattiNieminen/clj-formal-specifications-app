(ns clj-formal-specifications-app.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer :all]
            [ring.middleware.json :refer :all]
            [ring.util.response :as resp]
            [org.httpkit.server :refer [run-server]]
            [clojure.string :as str]))

(defn filename-as-text
  [filename]
  (str/capitalize
   (str/replace
    (str/replace (peek (str/split filename #"/")) #".clj" "")
    #"_" " ")))

(defn files-as-list
  [dir]
  (rest (map str (file-seq (clojure.java.io/file dir)))))

(defn example-listing
  []
  (let [filelist (files-as-list "resources/public/examples/")]
    {:body (zipmap (map filename-as-text filelist) filelist)}))

(defroutes api-routes
  (GET "/api/examples" [] (example-listing)))

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
