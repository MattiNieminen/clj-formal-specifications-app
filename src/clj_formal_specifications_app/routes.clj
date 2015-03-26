(ns clj-formal-specifications-app.routes
  (:require [clj-formal-specifications-app.api :as api]
            [clj-formal-specifications-app.site :as site]
            [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer :all]
            [ring.middleware.json :refer :all]))

(defroutes api-routes
  (GET "/api/examples" [] (api/example-listing))
  (GET "/api/examples/:filename" [filename] (api/example-file filename))
  (POST "/api/compose" [specification] (api/compose specification))
  (POST "/api/export" [specification] (api/export specification))
  (POST "/api/execute" [ns command] (api/execute-with-ns ns command))
  (GET "/api/namespace/:ns" [ns] (api/ns-data ns)))

(defroutes site-routes
  (GET "/" [] site/index)
  (route/resources "/")
  (route/not-found "Not found!"))

(def site (wrap-defaults site-routes site-defaults))

(def api
  (-> api-routes
      (wrap-json-response)
      (wrap-defaults api-defaults)))

(def app (routes api site))
