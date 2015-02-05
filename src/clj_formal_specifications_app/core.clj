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

(defroutes api-routes)

(defroutes site-routes
  (GET "/" [] index)
  (route/resources "/")
  (route/not-found "Not found!"))


(def app-routes (routes (wrap-defaults api-routes api-defaults)
                        (wrap-defaults site-routes site-defaults)))

(defn -main
  []
  (run-server app-routes {:port 5000}))
