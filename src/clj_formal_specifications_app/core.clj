(ns clj-formal-specifications-app.core
  (:require [compojure.core :refer :all]
            [org.httpkit.server :refer [run-server]]))

(defroutes all-routes
  (GET "/" [] "Hello World"))

(defn -main []
  (run-server all-routes {:port 5000}))
