(ns clj-formal-specifications-app.server
  (:gen-class)
  (:require [clj-formal-specifications-app.routes :as routes]
            [clojure.tools.logging :as log]
            [org.httpkit.server :as httpkit]))

(defn -main
  []
  (let [port 5000]
    (httpkit/run-server routes/app {:port port})
    (log/info (str "Application started at http://localhost:" port))))
