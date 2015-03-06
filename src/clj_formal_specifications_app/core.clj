(ns clj-formal-specifications-app.core
  (:require [clj-formal-specifications-app.routes :as routes]
            [org.httpkit.server :refer [run-server]]))

(defn -main
  []
  (run-server routes/app {:port 5000}))
