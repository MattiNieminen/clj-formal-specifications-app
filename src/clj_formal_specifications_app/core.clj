(ns clj-formal-specifications-app.core
  (:require [clj-formal-specifications-app.api :as api]
            [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer :all]
            [ring.middleware.json :refer :all]
            [ring.util.response :as resp]
            [org.httpkit.server :refer [run-server]]))

(defroutes api-routes
  (GET "/api/examples" [] (api/example-listing))
  (GET "/api/examples/:filename" [filename] (api/example-file filename))
  (POST "/api/compose" [specification] (api/compose specification))
  (POST "/api/execute" [ns command] (api/execute-with-ns ns command))
  (GET "/api/namespace/:ns" [ns] (api/ns-data ns)))

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
