(ns clj-formal-specifications-app.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer :all]
            [ring.util.response :as resp]
            [org.httpkit.server :refer [run-server]]))

(defn index
  [req]
  (resp/content-type
    (resp/resource-response "index.html" {:root "public"})
    "text/html"))

(defroutes site-routes
  (GET "/" [] index)
  (route/resources "/")
  (route/not-found "Not found!"))

(defn -main []
  (run-server (wrap-defaults site-routes site-defaults) {:port 5000}))
