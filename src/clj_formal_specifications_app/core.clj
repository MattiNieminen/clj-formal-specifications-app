(ns clj-formal-specifications-app.core
  (:require [compojure.core :refer :all]
            [ring.middleware.defaults :refer :all]
            [org.httpkit.server :refer [run-server]]))

(defroutes all-routes
  (GET "/" [] "Hello World"))

(defn -main []
  (run-server (wrap-defaults all-routes site-defaults) {:port 5000}))
