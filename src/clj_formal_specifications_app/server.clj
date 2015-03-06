(ns clj-formal-specifications-app.server
  (:gen-class)
  (:require [clj-formal-specifications-app.routes :as routes]
            [org.httpkit.server :as httpkit]))

(defn -main
  []
  (httpkit/run-server routes/app {:port 5000}))
