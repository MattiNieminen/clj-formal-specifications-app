(ns clj-formal-specifications-app.core
  (:require [clj-formal-specifications-app.routes :as routes]
            [org.httpkit.server :as httpkit]))

(defn -main
  []
  (httpkit/run-server routes/app {:port 5000}))
