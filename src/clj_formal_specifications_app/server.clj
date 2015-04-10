(ns clj-formal-specifications-app.server
  (:gen-class)
  (:require [clj-formal-specifications-app.routes :as routes]
            [clojure.tools.logging :as log]
            [ring.middleware.reload :as reload]
            [org.httpkit.server :as httpkit]))

(defn -main
  [& args]
  (let [port 5000]
    (if (= "hot-deploy" (first args))
      (httpkit/run-server (reload/wrap-reload routes/app) {:port port})
      (httpkit/run-server routes/app {:port port}))
    (log/info (str "Application started at http://localhost:" port))))
